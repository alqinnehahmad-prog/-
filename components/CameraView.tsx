
import React, { useRef, useEffect, useState } from 'react';
import Loader from './Loader';

interface CameraViewProps {
  onCapture: (image: { data: string; mimeType: string }) => void;
  onClose: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("ميزة الكاميرا غير مدعومة في هذا المتصفح.");
        setIsLoading(false);
        return;
      }

      let mediaStream: MediaStream;
      try {
        // First, try to get the environment-facing camera
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
      } catch (err) {
        console.warn("Could not get rear camera, trying fallback:", err);
        try {
          // If that fails, try to get any available video camera
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        } catch (fallbackErr) {
          console.error("Error accessing any camera:", fallbackErr);
          let message = "تعذر الوصول إلى الكاميرا. يرجى التحقق من الأذونات.";
          if (fallbackErr instanceof DOMException) {
            if (fallbackErr.name === "NotAllowedError" || fallbackErr.name === "PermissionDeniedError") {
              message = "تم رفض إذن الوصول إلى الكاميرا. يرجى تمكينه في إعدادات متصفحك.";
            } else if (fallbackErr.name === "NotFoundError" || fallbackErr.name === "DevicesNotFoundError") {
              message = "لم يتم العثور على كاميرا متوافقة على جهازك.";
            }
          }
          setError(message);
          setIsLoading(false);
          return;
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      // The onCanPlay event on the video element will set isLoading to false
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64String = dataUrl.split(',')[1];
        onCapture({ data: base64String, mimeType: 'image/jpeg' });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4 animate-fade-in">
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-gray-800/50 p-2 rounded-full hover:bg-gray-700 transition-colors z-10"
            aria-label="إغلاق الكاميرا"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      
      {isLoading && <Loader />}

      {error && !isLoading && (
        <div className="text-white text-center p-4 bg-red-900/50 border border-red-500 rounded-lg">
          <p className="text-xl mb-4">{error}</p>
          <button onClick={onClose} className="bg-cyan-600 text-white font-bold py-2 px-6 rounded-full hover:bg-cyan-500 transition-colors">حسنًا</button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="w-full max-w-3xl flex flex-col items-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            onCanPlay={() => setIsLoading(false)}
            className="w-full h-auto rounded-lg mb-6 border-2 border-gray-700"
          ></video>
          <div className="flex items-center justify-center">
            <button
              onClick={handleCapture}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full border-4 border-cyan-500 p-1 flex items-center justify-center group transition-transform transform hover:scale-105"
              aria-label="التقاط صورة"
            >
              <div className="w-full h-full bg-white rounded-full group-hover:bg-gray-200 transition-colors"></div>
            </button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};

export default CameraView;
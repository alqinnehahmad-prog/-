
import React, { useEffect, useRef } from 'react';

declare const $3Dmol: any;

interface MoleculeViewerProps {
  xyzData: string;
}

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ xyzData }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const glviewer = useRef<any>(null);

  useEffect(() => {
    if (viewerRef.current && typeof $3Dmol !== 'undefined') {
      const config = { backgroundColor: '#111827' };
      glviewer.current = $3Dmol.createViewer(viewerRef.current, config);

      if (glviewer.current && xyzData) {
        glviewer.current.addModel(xyzData, 'xyz');
        glviewer.current.setStyle({}, {
            stick: { radius: 0.1 },
            sphere: { scale: 0.25 }
        });
        glviewer.current.zoomTo();
        glviewer.current.render();
        glviewer.current.zoom(0.8, 1000); 
      }
    }
    
    return () => {
      if (glviewer.current) {
        glviewer.current.clear();
      }
    };
  }, [xyzData]);

  return (
    <div
      ref={viewerRef}
      className="relative w-full h-64 sm:h-80 md:h-96 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden"
      aria-label="3D molecule viewer"
    >
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 -z-10">
            <p>Loading 3D model...</p>
        </div>
    </div>
  );
};

export default MoleculeViewer;
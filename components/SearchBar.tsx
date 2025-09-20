import React, { useRef } from 'react';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  image: { data: string; mimeType: string } | null;
  setImage: (image: { data: string; mimeType: string } | null) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onSearch, isLoading, image, setImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          setImage({ data: base64String, mimeType: file.type });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  const imagePreviewUrl = image ? `data:${image.mimeType};base64,${image.data}` : null;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex items-center bg-gray-800 border-2 border-gray-600 rounded-full shadow-lg overflow-hidden">
        {imagePreviewUrl && (
          <div className="relative pl-2 py-2">
            <img src={imagePreviewUrl} alt="Preview" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-1 right-[-4px] bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold hover:bg-red-500 transition-colors"
              aria-label="إزالة الصورة"
            >
              &times;
            </button>
          </div>
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="أدخل اسم عنصر، أو حمّل صورة..."
          className="w-full px-4 sm:px-6 py-4 bg-gray-800 text-base sm:text-lg text-white focus:outline-none placeholder-gray-500"
          disabled={isLoading}
        />
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
        />
        <button 
            type="button"
            onClick={triggerFileSelect}
            disabled={isLoading}
            className="p-3 sm:p-4 text-gray-400 hover:text-cyan-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
            aria-label="تحميل صورة"
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </button>
        <button
          type="submit"
          disabled={isLoading || (!query.trim() && !image)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-5 sm:px-8 py-4 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? '...' : 'تحليل'}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
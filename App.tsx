import React, { useState, useCallback, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import ResultCard from './components/ResultCard';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import InstallPWAButton from './components/InstallPWAButton';
import PeriodicTable from './components/PeriodicTable';
import { fetchChemicalData } from './services/geminiService';
import type { ChemicalInfo } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [image, setImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [chemicalInfo, setChemicalInfo] = useState<ChemicalInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPeriodicTable, setShowPeriodicTable] = useState<boolean>(false);

  const performSearch = useCallback(async (searchTerm: string, searchImage: { data: string; mimeType: string } | null) => {
    if (!searchTerm.trim() && !searchImage) return;

    if (!navigator.onLine) {
        setError('أنت غير متصل بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setChemicalInfo(null);
    setShowPeriodicTable(false);

    try {
      const data = await fetchChemicalData(searchTerm, searchImage);
      setChemicalInfo(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback(() => {
    performSearch(query, image);
  }, [query, image, performSearch]);

  const handleElementSelect = useCallback(async (elementName: string) => {
    setShowPeriodicTable(false);
    setQuery(elementName);
    setImage(null);
    await performSearch(elementName, null);
  }, [performSearch]);

  const togglePeriodicTable = () => {
    setShowPeriodicTable(prev => !prev);
    if (!showPeriodicTable) {
      setChemicalInfo(null);
      setError(null);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 bg-gradient-to-br from-gray-900 to-slate-800 text-white p-4 sm:p-8 flex flex-col items-center">
      <header className="text-center my-6 sm:my-10 animate-fade-in-down w-full max-w-2xl">
         <div className="inline-block bg-cyan-500/10 p-3 sm:p-4 rounded-full border-2 border-cyan-700 mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          المحلل الكيميائي
        </h1>
        <p className="mt-3 text-lg text-gray-300 font-bold">
          بواسطة م. احمد القنه
        </p>
        <p className="mt-3 text-base sm:text-lg max-w-2xl mx-auto text-gray-400">
          احصل على معلومات فورية ودقيقة عن العناصر والمركبات الكيميائية باستخدام الذكاء الاصطناعي.
        </p>
        <div className="mt-6 flex justify-center items-center gap-4 flex-wrap">
            <InstallPWAButton />
             <button
                onClick={togglePeriodicTable}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-full inline-flex items-center transition-transform transform hover:scale-105 duration-300 shadow-lg"
                aria-label={showPeriodicTable ? 'إخفاء الجدول الدوري' : 'عرض الجدول الدوري'}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{showPeriodicTable ? 'إخفاء الجدول' : 'عرض الجدول الدوري'}</span>
            </button>
        </div>
      </header>

      <main className="w-full flex flex-col items-center flex-grow px-2 sm:px-4">
        <SearchBar 
          query={query} 
          setQuery={setQuery} 
          onSearch={handleSearch} 
          isLoading={isLoading}
          image={image}
          setImage={setImage}
        />
        
        <div className="mt-8 w-full max-w-7xl">
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {showPeriodicTable && <PeriodicTable onElementClick={handleElementSelect} />}
          {chemicalInfo && !showPeriodicTable && <ResultCard data={chemicalInfo} />}
          {!isLoading && !error && !chemicalInfo && !showPeriodicTable && (
              <div className="text-center text-gray-500 mt-16 px-4">
                  <p>ابدأ بكتابة اسم عنصر أو مركب، أو حمّل صورة لمنتج، أو استكشف الجدول الدوري.</p>
              </div>
          )}
        </div>
      </main>

       <footer className="text-center py-6 mt-12 text-gray-500 text-sm">
            <p>مصمم لتحليل كيميائي سريع ودقيق.</p>
        </footer>
    </div>
  );
};

export default App;
import React, { useState } from 'react';
import { elements } from '../data/elements';

interface PeriodicTableProps {
  onElementClick: (elementName: string) => void;
}

const categoryColors: Record<string, string> = {
  'فلز قلوي': 'bg-red-600 hover:bg-red-500',
  'فلز قلوي ترابي': 'bg-orange-500 hover:bg-orange-400',
  'لانثانيد': 'bg-teal-700 hover:bg-teal-600',
  'أكتينيد': 'bg-indigo-700 hover:bg-indigo-600',
  'فلز انتقالي': 'bg-yellow-600 hover:bg-yellow-500',
  'فلز بعد انتقالي': 'bg-green-600 hover:bg-green-500',
  'شبه فلز': 'bg-cyan-600 hover:bg-cyan-500',
  'لا فلز': 'bg-sky-600 hover:bg-sky-500',
  'غاز نبيل': 'bg-purple-600 hover:bg-purple-500',
  'خصائص غير معروفة': 'bg-gray-600 hover:bg-gray-500',
};

const PeriodicTable: React.FC<PeriodicTableProps> = ({ onElementClick }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.15, 2)); // Max zoom 200%
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.15, 0.5)); // Min zoom 50%
  };

  return (
    <div className="w-full mx-auto my-8 p-2 sm:p-4 bg-gray-900/50 rounded-lg border border-gray-700 animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-cyan-400 mb-6">الجدول الدوري للعناصر</h2>
        
        {/* Explanatory Key */}
        <div className="flex justify-center items-center my-4 md:my-8 px-2 sm:px-4">
            <div className="relative w-full max-w-[320px] h-[240px] sm:h-[220px] flex justify-center items-center">

                {/* Example Element Tile */}
                <div className="relative p-2.5 rounded text-white bg-sky-600 w-40 h-40 flex flex-col justify-between shadow-lg border-2 border-cyan-400">
                    <div className="flex justify-between items-start text-[10px] w-full font-medium">
                        <div className="text-left leading-tight"><span>14.007</span><span className="block opacity-70">1402.3</span></div>
                        <span className="font-bold text-base -mt-1">7</span>
                        <span className="leading-tight">3.04</span>
                    </div>
                    <div className="flex-grow flex items-center justify-center -mt-3">
                        <div className="text-center">
                            <div className="text-3xl font-mono font-bold">N</div>
                            <div className="text-sm -mt-1 leading-tight">نيتروجين</div>
                        </div>
                    </div>
                    <div className="text-center text-[9px] font-mono w-full leading-none"><span>[He] 2s² 2p³</span></div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-1.5 text-[9px] flex flex-col leading-tight text-right font-medium">
                        <span>+5</span><span>+4</span><span>+3</span><span>+2</span><span>+1</span><span>...</span>
                    </div>
                </div>

                {/* Annotations */}
                <span className="absolute top-[25px] right-0 text-[10px] sm:text-xs text-gray-300 transform translate-x-1/2 text-center" style={{writingMode: 'vertical-rl'}}>العدد الذري</span>
                <span className="absolute top-[25px] left-0 text-[10px] sm:text-xs text-gray-300 transform -translate-x-1/2 text-center" style={{writingMode: 'vertical-rl'}}>الكتلة الذرية</span>

                <span className="absolute top-[50px] left-[5px] text-[10px] sm:text-xs text-gray-300 text-center">طاقة التأين</span>
                <span className="absolute top-[50px] right-[5px] text-[10px] sm:text-xs text-gray-300 text-center">الكهروسلبية</span>
                
                <span className="absolute top-1/2 -translate-y-1/2 left-0 text-[10px] sm:text-xs text-gray-300 transform -translate-x-full text-center">رمز العنصر</span>
                 <span className="absolute top-1/2 -translate-y-1/2 right-0 text-[10px] sm:text-xs text-gray-300 transform translate-x-full text-center" style={{writingMode: 'vertical-rl'}}>حالات الأكسدة</span>

                <span className="absolute bottom-[65px] left-1/2 -translate-x-1/2 text-[10px] sm:text-xs text-gray-300 text-center">اسم العنصر</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs text-gray-300 text-center">التوزيع الإلكتروني</span>
            </div>
        </div>

        <div className="overflow-auto py-4">
            <div 
                className="grid gap-1 min-w-[1200px] transition-transform duration-300 ease-in-out mx-auto"
                style={{
                    gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
                    gridTemplateRows: 'repeat(9, minmax(0, 1fr))',
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center',
                }}
            >
                {elements.map((el) => (
                    <button
                        key={el.atomicNumber}
                        onClick={() => onElementClick(el.name)}
                        className={`relative p-1 rounded text-white transition-all duration-200 transform hover:scale-110 hover:z-10 flex flex-col aspect-square ${categoryColors[el.category] || 'bg-gray-700'}`}
                        style={{ gridColumnStart: el.col, gridRowStart: el.row }}
                        aria-label={`Select element ${el.name}`}
                    >
                        {/* Top row */}
                        <div className="flex justify-between items-start text-[8px] sm:text-[9px] w-full font-medium">
                            <div className="text-left leading-tight">
                                <span>{el.atomicMass}</span>
                                {el.ionizationEnergy && <span className="block opacity-70">{el.ionizationEnergy}</span>}
                            </div>
                            <span className="font-bold text-xs sm:text-sm -mt-1">{el.atomicNumber}</span>
                            <span className="leading-tight">{el.electronegativity}</span>
                        </div>

                        {/* Middle content */}
                        <div className="flex-grow flex items-center justify-center -mt-2 sm:-mt-3">
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-mono font-bold">{el.symbol}</div>
                                <div className="text-[10px] sm:text-xs -mt-1 leading-tight">{el.name}</div>
                            </div>
                        </div>
                        
                        {/* Bottom row */}
                        <div className="text-center text-[7px] sm:text-[8px] font-mono w-full leading-none">
                            <span>{el.electronConfiguration}</span>
                        </div>

                        {/* Oxidation states */}
                        {el.oxidationStates && (
                            <div className="absolute top-1/2 -translate-y-1/2 right-1.5 text-[8px] sm:text-[9px] flex flex-col leading-tight text-right font-medium">
                                {el.oxidationStates.split(',').map((state) => (
                                    <span key={state}>{state.trim()}</span>
                                ))}
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-8">
            {Object.entries(categoryColors).map(([category, className]) => (
                <div key={category} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-sm ${className.split(' ')[0]}`}></div>
                    <span className="text-sm text-gray-300">{category}</span>
                </div>
            ))}
        </div>
        <div className="flex justify-center items-center gap-4 mt-6">
            <button
                onClick={zoomOut}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold w-12 h-12 rounded-full flex items-center justify-center text-3xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="تصغير الجدول"
                disabled={zoomLevel <= 0.5}
            >
                -
            </button>
            <button
                onClick={zoomIn}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold w-12 h-12 rounded-full flex items-center justify-center text-3xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="تكبير الجدول"
                disabled={zoomLevel >= 2}
            >
                +
            </button>
        </div>
    </div>
  );
};

export default PeriodicTable;
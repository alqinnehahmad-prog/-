import React, { useState, useMemo } from 'react';
import type { ChemicalInfo, PhysicalProperties, ChemicalProperties } from '../types';
import MoleculeViewer from './MoleculeViewer';

interface ResultCardProps {
  data: ChemicalInfo;
}

const InfoItem: React.FC<{ label: string; value: string | number | null }> = ({ label, value }) => {
    if (value === null || value === undefined) return null;
    return (
      <div className="flex justify-between items-center py-3 border-b border-gray-700 last:border-b-0">
        <dt className="text-gray-400 font-medium">{label}</dt>
        <dd className="text-cyan-300 font-semibold text-right">{value}</dd>
      </div>
    );
};

const PropertiesSection: React.FC<{ title: string; properties: PhysicalProperties | ChemicalProperties | null }> = ({ title, properties }) => {
    if (!properties || Object.values(properties).every(v => !v)) {
        return null;
    }

    const propertyLabels: Record<string, string> = {
        meltingPoint: 'نقطة الانصهار',
        boilingPoint: 'نقطة الغليان',
        density: 'الكثافة',
        reactivity: 'النشاطية الكيميائية',
        flammability: 'قابلية الاشتعال',
        acidity: 'الحامضية / القاعدية',
        solubilityInWater: 'الذوبانية في الماء'
    };

    return (
        <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{title}</h3>
            <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-gray-700 h-full">
                <dl>
                    {Object.entries(properties).map(([key, value]) => {
                         if (!value) return null;
                         const label = propertyLabels[key] || key;
                         return <InfoItem key={key} label={label} value={value} />;
                    })}
                </dl>
            </div>
        </div>
    );
};


const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
    const [mass, setMass] = useState<string>('');
    
    const moles = useMemo(() => {
        const numericMass = parseFloat(mass);
        if(!isNaN(numericMass) && numericMass > 0 && data.molarMass > 0) {
            return (numericMass / data.molarMass).toFixed(4);
        }
        return null;
    }, [mass, data.molarMass]);

    const massLabel = data.atomicNumber != null 
        ? "الوزن الذري / الكتلة المولية (g/mol)" 
        : "الوزن الجزيئي / الكتلة المولية (g/mol)";

    const hasAdditionalInfo = data.appearance || data.abundance || data.nameOrigin || data.commonIsotopes;

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 mt-8 overflow-hidden animate-fade-in">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">{data.name}</h2>
            <span className="text-3xl sm:text-4xl font-mono text-cyan-400">{data.symbol}</span>
            <span className="text-sm font-medium bg-cyan-900/50 text-cyan-300 px-3 py-1 rounded-full self-start">{data.classification}</span>
        </div>

        {data.tradeName && (
            <p className="text-lg sm:text-xl text-gray-400 mb-6">
                (الاسم التجاري: <span className="font-semibold text-cyan-300">{data.tradeName}</span>)
            </p>
        )}
        
        <p className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed">{data.description}</p>
        
        {hasAdditionalInfo && (
            <div className="my-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">معلومات إضافية</h3>
                <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-gray-700">
                    <dl>
                        <InfoItem label="المظهر" value={data.appearance} />
                        <InfoItem label="الوفرة" value={data.abundance} />
                        <InfoItem label="أصل التسمية" value={data.nameOrigin} />
                        {data.atomicNumber != null && (
                           <InfoItem label="النظائر الشائعة" value={data.commonIsotopes} />
                        )}
                    </dl>
                </div>
            </div>
        )}

        {data.discoveredBy && (
             <div className="my-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">الاكتشاف</h3>
                <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-gray-700">
                    <dl>
                        <InfoItem label="المكتشف" value={data.discoveredBy} />
                        <InfoItem label="سنة الاكتشاف" value={data.discoveryYear} />
                    </dl>
                    {data.discovererBio && (
                        <div className="mt-6 pt-6 border-t border-gray-600">
                            <h4 className="text-lg sm:text-xl font-bold text-cyan-300 mb-2">عن {data.discoveredBy}</h4>
                            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">{data.discovererBio}</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {data.formationEquation && (
          <div className="my-6 text-center">
              <h3 className="text-base sm:text-lg font-semibold text-gray-400 mb-2">معادلة التكوين</h3>
              <p dir="ltr" className="text-xl sm:text-2xl font-mono text-cyan-300 bg-gray-900/50 py-3 px-4 rounded-lg inline-block border border-gray-700">
                  {data.formationEquation}
              </p>
          </div>
        )}

        {data.safetyAndHazards && (
            <div className="my-8 p-4 sm:p-6 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                <h3 className="text-xl sm:text-2xl font-bold text-yellow-300 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    السلامة والمخاطر
                </h3>
                <p className="text-yellow-200 text-base sm:text-lg leading-relaxed">{data.safetyAndHazards}</p>
            </div>
        )}

        <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <PropertiesSection title="الخصائص الفيزيائية" properties={data.physicalProperties} />
            <PropertiesSection title="الخصائص الكيميائية" properties={data.chemicalProperties} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-8">
            <dl>
                <InfoItem label="الرقم الذري" value={data.atomicNumber} />
                <InfoItem label={massLabel} value={data.molarMass.toFixed(2)} />
                <InfoItem label="الحالة في الظروف القياسية" value={data.stateAtSTP} />
                <InfoItem label="الكهروسلبية (مقياس باولنغ)" value={data.electronegativity} />
                <InfoItem label="طاقة التأين (kJ/mol)" value={data.ionizationEnergy} />
                {data.oxidationStates && data.oxidationStates.length > 0 && (
                    <InfoItem 
                        label="حالات الأكسدة" 
                        value={data.oxidationStates.map(s => (s > 0 ? `+${s}` : s)).join(', ')} 
                    />
                )}
            </dl>
             <div className="bg-gray-900/70 p-4 sm:p-6 rounded-lg border border-gray-600">
                 <h4 className="font-bold text-lg sm:text-xl mb-3 text-white">حساب عدد المولات</h4>
                 <div className="flex flex-col gap-3">
                     <label htmlFor="mass-input" className="text-sm text-gray-400">أدخل الكتلة (بالجرام):</label>
                     <input 
                         id="mass-input"
                         type="number"
                         value={mass}
                         onChange={(e) => setMass(e.target.value)}
                         placeholder="e.g., 18.02"
                         className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                     />
                 </div>
                 {moles && (
                    <div className="mt-4 text-center bg-cyan-900/50 p-3 rounded-md">
                        <span className="text-gray-300">عدد المولات: </span>
                        <span className="font-bold text-xl sm:text-2xl text-cyan-300">{moles}</span>
                        <span className="text-gray-400"> مول</span>
                    </div>
                 )}
            </div>
        </div>
        
        {data.molecularStructure && (
            <div className="my-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">البنية الجزيئية / البلورية</h3>
                <p className="text-gray-300 text-base sm:text-lg bg-gray-900 p-4 rounded-lg border border-gray-700 leading-relaxed">{data.molecularStructure}</p>
            </div>
        )}

        {data.molecular3DStructure && (
            <div className="my-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">النموذج ثلاثي الأبعاد</h3>
                <MoleculeViewer xyzData={data.molecular3DStructure} />
            </div>
        )}

        {data.electronConfiguration && (
            <div className="my-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">التوزيع الإلكتروني</h3>
                <p dir="ltr" className="font-mono text-left text-base sm:text-lg text-gray-300 bg-gray-900 p-4 rounded-lg border border-gray-700 break-words">{data.electronConfiguration}</p>
            </div>
        )}

        <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">التطبيقات والاستخدامات</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
                {data.uses.map((use, index) => (
                    <li key={index} className="flex items-start text-base sm:text-lg">
                         <svg className="w-5 h-5 mr-2 text-cyan-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                         <span>{use}</span>
                    </li>
                ))}
            </ul>
        </div>

        {data.components && data.components.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-600">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">المكونات الأساسية</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {data.components.map((element) => (
                    <div key={element.symbol} className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-gray-700 flex flex-col">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4">
                        <h4 className="text-xl sm:text-2xl font-bold text-cyan-300">{element.name}</h4>
                        <span className="text-xl sm:text-2xl font-mono text-gray-400">{element.symbol}</span>
                    </div>
                    <dl className="flex-grow">
                        <InfoItem label="الرقم الذري" value={element.atomicNumber} />
                        <InfoItem label="الوزن الذري / الكتلة المولية (g/mol)" value={element.molarMass.toFixed(3)} />
                        <InfoItem label="الكهروسلبية" value={element.electronegativity} />
                        {element.oxidationStates && element.oxidationStates.length > 0 && (
                        <InfoItem 
                            label="حالات الأكسدة" 
                            value={element.oxidationStates.map(s => (s > 0 ? `+${s}` : s)).join(', ')} 
                        />
                        )}
                        {element.electronConfiguration && (
                            <div className="flex justify-between items-start py-3 border-b border-gray-700">
                                <dt className="text-gray-400 font-medium whitespace-nowrap mr-2">التوزيع الإلكتروني</dt>
                                <dd dir="ltr" className="text-cyan-300 font-mono text-xs text-right break-all">{element.electronConfiguration}</dd>
                            </div>
                        )}
                    </dl>
                    </div>
                ))}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ResultCard;
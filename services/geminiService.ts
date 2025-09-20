import { GoogleGenAI, Type } from "@google/genai";
import type { ChemicalInfo } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const elementProperties = {
  isValid: { type: Type.BOOLEAN, description: 'يجب أن تكون القيمة true دائمًا للعناصر المكونة.' },
  name: { type: Type.STRING, description: 'الاسم الشائع للعنصر باللغة العربية.' },
  symbol: { type: Type.STRING, description: 'الرمز الكيميائي للعنصر.' },
  atomicNumber: { type: Type.INTEGER, description: 'العدد الذري للعنصر.' },
  molarMass: { type: Type.NUMBER, description: 'الكتلة المولية للعنصر بوحدة g/mol.' },
  description: { type: Type.STRING, description: 'وصف موجز للعنصر باللغة العربية.' },
  stateAtSTP: { type: Type.STRING, description: 'الحالة الفيزيائية للعنصر في الظروف القياسية.' },
  uses: {
    type: Type.ARRAY,
    items: { type: Type.STRING },
    description: 'قائمة بالاستخدامات الشائعة للعنصر.'
  },
  electronegativity: { type: Type.NUMBER, description: 'الكهروسلبية للعنصر على مقياس باولنغ.' },
  ionizationEnergy: { type: Type.NUMBER, description: 'طاقة التأين الأولى للعنصر بوحدة kJ/mol.' },
  electronConfiguration: { type: Type.STRING, description: 'التوزيع الإلكتروني للعنصر.' },
  classification: { type: Type.STRING, description: 'تصنيف العنصر.' },
  oxidationStates: {
    type: Type.ARRAY,
    items: { type: Type.INTEGER },
    description: 'قائمة بحالات الأكسدة الشائعة للعنصر.'
  }
};

const schema = {
  type: Type.OBJECT,
  properties: {
    ...elementProperties,
    atomicNumber: { 
      type: Type.INTEGER, 
      description: 'العدد الذري (للعناصر فقط). إذا كان مركبًا، يجب أن تكون القيمة null.' 
    },
     electronegativity: {
      type: Type.NUMBER,
      description: 'الكهروسلبية على مقياس باولنغ (للعناصر فقط). إذا كان مركبًا، يجب أن تكون القيمة null.'
    },
    ionizationEnergy: {
        type: Type.NUMBER,
        description: 'طاقة التأين الأولى للعنصر بوحدة kJ/mol (للعناصر فقط). إذا كان مركبًا، يجب أن تكون القيمة null.'
    },
    electronConfiguration: {
      type: Type.STRING,
      description: 'التوزيع الإلكتروني للعنصر (للعناصر فقط). إذا كان مركبًا، يجب أن تكون القيمة null.'
    },
    oxidationStates: {
        type: Type.ARRAY,
        items: { type: Type.INTEGER },
        description: 'قائمة بحالات الأكسدة الشائعة للعنصر (للعناصر فقط). إذا كان مركبًا، يجب أن تكون القيمة null.'
    },
    tradeName: {
        type: Type.STRING,
        description: 'الاسم التجاري أو الشائع للمادة الكيميائية، إذا كان هو ما تم البحث عنه. إذا تم البحث بالاسم النظامي، تكون القيمة null.'
    },
    formationEquation: {
        type: Type.STRING,
        description: 'المعادلة الكيميائية الموزونة لتكوين المركب. إذا كان المدخل عنصرًا، يجب أن تكون القيمة null.'
    },
    physicalProperties: {
        type: Type.OBJECT,
        description: 'الخصائص الفيزيائية الرئيسية. إذا لم تكن متوفرة، تكون القيمة null.',
        properties: {
            meltingPoint: { type: Type.STRING, description: 'نقطة الانصهار مع الوحدة (مثال: 0 °C).' },
            boilingPoint: { type: Type.STRING, description: 'نقطة الغليان مع الوحدة (مثال: 100 °C).' },
            density: { type: Type.STRING, description: 'الكثافة مع الوحدة (مثال: 1 g/cm³).' }
        }
    },
    chemicalProperties: {
        type: Type.OBJECT,
        description: 'الخصائص الكيميائية الرئيسية. إذا لم تكن متوفرة، تكون القيمة null.',
        properties: {
            reactivity: { type: Type.STRING, description: 'وصف موجز للنشاطية الكيميائية.' },
            flammability: { type: Type.STRING, description: 'وصف موجز لقابلية الاشتعال.' },
            acidity: { type: Type.STRING, description: 'وصف للحامضية أو القاعدية (مثل: متعادل، pH=7).' },
            solubilityInWater: { type: Type.STRING, description: 'وصف للذوبانية في الماء (للمركبات). مثال: "قابل للذوبان بدرجة عالية".' }
        }
    },
    safetyAndHazards: {
        type: Type.STRING,
        description: 'وصف لمخاطر السلامة الرئيسية المرتبطة بالمادة وإجراءات التعامل الآمن. إذا لم تكن هناك مخاطر كبيرة، يجب أن تكون القيمة null.'
    },
    molecularStructure: {
        type: Type.STRING,
        description: 'وصف للبنية الجزيئية للمركب (مثل الشكل الهندسي، أنواع الروابط). إذا كان المدخل عنصرًا، فصف بنيته البلورية الشائعة أو اجعل القيمة null.'
    },
    molecular3DStructure: {
        type: Type.STRING,
        description: 'محتوى ملف بصيغة XYZ للبنية ثلاثية الأبعاد للجزيء أو الوحدة البلورية. يجب أن تكون القيمة null إذا لم يكن بالإمكان إنشاؤه.'
    },
    appearance: {
        type: Type.STRING,
        description: 'وصف موجز لمظهر المادة في حالتها القياسية (مثل "معدن أبيض فضي" أو "غاز عديم اللون").'
    },
    abundance: {
        type: Type.STRING,
        description: 'معلومات عن وفرة المادة، سواء في القشرة الأرضية، أو الكون، أو مصادرها الطبيعية.'
    },
    discoveredBy: {
        type: Type.STRING,
        description: 'اسم الشخص أو المجموعة التي اكتشفت العنصر. يجب أن تكون القيمة null للمركبات أو العناصر المعروفة منذ العصور القديمة.'
    },
    discoveryYear: {
        type: Type.STRING,
        description: 'سنة اكتشاف العنصر. يمكن أن تكون "العصور القديمة". يجب أن تكون القيمة null للمركبات.'
    },
    discovererBio: {
        type: Type.STRING,
        description: 'نبذة مختصرة عن حياة مكتشف العنصر. يجب أن تكون القيمة null للمركبات أو العناصر المعروفة منذ العصور القديمة.'
    },
    nameOrigin: {
        type: Type.STRING,
        description: 'أصل اسم العنصر أو المادة. يجب أن تكون القيمة null إذا لم يكن الأصل معروفًا.'
    },
    commonIsotopes: {
        type: Type.STRING,
        description: 'قائمة بأهم النظائر الشائعة للعنصر. يجب أن تكون القيمة null للمركبات.'
    },
    components: {
      type: Type.ARRAY,
      description: 'قائمة بالعناصر المكونة للمركب. إذا كان المدخل عنصرًا، يجب أن تكون القيمة null.',
      items: {
        type: Type.OBJECT,
        properties: elementProperties
      }
    }
  },
  required: ['isValid', 'name', 'symbol', 'molarMass', 'description', 'stateAtSTP', 'uses', 'classification']
};

export const fetchChemicalData = async (chemicalName: string, image: { data: string; mimeType: string } | null): Promise<ChemicalInfo> => {
  try {
    const textPrompt = `قدم معلومات كيميائية شاملة وموسوعية.
- إذا تم تقديم صورة، قم أولاً بتحديد المنتج أو المادة في الصورة. ثم، قم بتوفير التحليل الكيميائي للمكون الرئيسي النشط. إذا تم تقديم نص مع الصورة، فاستخدمه كتلميح إضافي.
- إذا تم تقديم نص فقط، فقم بتحليل المادة الكيميائية المذكورة "${chemicalName}".

يجب أن تتضمن المعلومات:
- معلومات أساسية: الاسم، الرمز، التصنيف، الوصف.
- خصائص فيزيائية: نقطة الانصهار، الغليان، الكثافة، والمظهر.
- خصائص كيميائية: النشاطية، قابلية الاشتعال، الحامضية، والذوبانية في الماء (للمركبات).
- معلومات السلامة والمخاطر.
- البنية الجزيئية (للمركبات) أو البلورية (للعناصر).
- **مهم**: قم بإنشاء محتوى ملف بصيغة XYZ للبنية ثلاثية الأبعاد للجزيء (للمركبات) أو للوحدة البلورية (للعناصر). يجب أن يكون هذا في حقل "molecular3DStructure".
- التطبيقات والاستخدامات.
- معلومات إضافية: الوفرة الطبيعية، وأصل التسمية.
- للعناصر فقط: العدد الذري، الوزن الذري، الكهروسلبية، طاقة التأين، التوزيع الإلكتروني، حالات الأكسدة، تفاصيل الاكتشاف (المكتشف وسنة الاكتشاف ونبذة عن حياته)، والنظائر الشائعة.
- للمركبات فقط: معادلة التكوين، العناصر المكونة، والاسم التجاري (إن وجد).

إذا كان المدخل اسمًا تجاريًا أو شائعًا (مثل "أسبرين" أو "ملح الطعام")، فحدد المركب الكيميائي الصحيح وقدم معلوماته التفصيلية، وأرجع الاسم التجاري الأصلي في حقل "tradeName".
إذا لم تكن بعض المعلومات متوفرة، اجعل الحقول المقابلة بالقيمة null.
إذا لم يكن المدخل (سواء من النص أو الصورة) عنصرًا أو مركبًا كيميائيًا صالحًا يمكن تحليله، فأرجع "isValid: false".
يجب أن تكون الاستجابة باللغة العربية.`;

    const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [];
    
    if (image) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data,
        },
      });
    }
    parts.push({ text: textPrompt });

    const contents = { parts };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    const data: ChemicalInfo = JSON.parse(jsonText);

    if (!data.isValid) {
       const inputName = chemicalName || "الصورة المقدمة";
       throw new Error(`تعذر تحديد مادة كيميائية معروفة من "${inputName}". يرجى المحاولة مرة أخرى بمدخل أوضح.`);
    }

    return data;

  } catch (error) {
    console.error("Error fetching chemical data:", error);
    if (error instanceof Error) {
        if (error.message.includes('JSON')) {
             throw new Error("فشل في تحليل الاستجابة من الخادم. حاول مرة أخرى.");
        }
        throw new Error(error.message);
    }
    throw new Error("حدث خطأ غير متوقع أثناء جلب البيانات.");
  }
};
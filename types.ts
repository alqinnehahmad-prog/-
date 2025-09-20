export interface PhysicalProperties {
  meltingPoint?: string;
  boilingPoint?: string;
  density?: string;
}

export interface ChemicalProperties {
  reactivity?: string;
  flammability?: string;
  acidity?: string;
  solubilityInWater?: string;
}

export interface ChemicalInfo {
  isValid: boolean;
  name: string;
  symbol: string;
  atomicNumber: number | null;
  molarMass: number;
  description: string;
  stateAtSTP: string;
  uses: string[];
  electronegativity: number | null;
  ionizationEnergy: number | null;
  electronConfiguration: string | null;
  classification: string;
  oxidationStates: number[] | null;
  tradeName: string | null;
  components: ChemicalInfo[] | null;
  formationEquation: string | null;
  physicalProperties: PhysicalProperties | null;
  chemicalProperties: ChemicalProperties | null;
  safetyAndHazards: string | null;
  molecularStructure: string | null;
  molecular3DStructure: string | null;
  appearance: string | null;
  abundance: string | null;
  discoveredBy: string | null;
  discoveryYear: number | string | null;
  discovererBio: string | null;
  nameOrigin: string | null;
  commonIsotopes: string | null;
}
export interface Animal {
  animal_cn: string;
  animal_en: string;
  scientific_name: string;
  category: string;
  is_endemic: boolean;
  is_national_animal: boolean;
  significance: string;
  conservation_status: string;
  image_url: string;
  image_keywords: string;
  fun_fact: string;
}

export interface Country {
  country: string;
  country_en: string;
  region: string;
  coordinates: [number, number]; // [lat, lng]
  animals: Animal[];
}

export interface AnimalMarker {
  id: string;
  animal: Animal;
  country: Country;
  position: [number, number, number]; // 3D position on globe
  lat: number;
  lng: number;
}

export interface GlobeState {
  selectedAnimal: AnimalMarker | null;
  hoveredAnimal: AnimalMarker | null;
  isAutoRotating: boolean;
  isPanelOpen: boolean;
  animalMarkers: AnimalMarker[];
  setAnimalMarkers: (markers: AnimalMarker[]) => void;
  selectAnimal: (animal: AnimalMarker | null) => void;
  hoverAnimal: (animal: AnimalMarker | null) => void;
  toggleAutoRotate: () => void;
  openPanel: () => void;
  closePanel: () => void;
}

import { create } from 'zustand';
import type { GlobeState, AnimalMarker } from '../types';

export const useStore = create<GlobeState>((set) => ({
  selectedAnimal: null,
  hoveredAnimal: null,
  isAutoRotating: true,
  isPanelOpen: false,
  animalMarkers: [],
  
  setAnimalMarkers: (markers: AnimalMarker[]) => set({ animalMarkers: markers }),
  
  selectAnimal: (animal: AnimalMarker | null) => set({ 
    selectedAnimal: animal,
    isPanelOpen: animal !== null,
    isAutoRotating: animal === null
  }),
  
  hoverAnimal: (animal: AnimalMarker | null) => set({ hoveredAnimal: animal }),
  
  toggleAutoRotate: () => set((state) => ({ isAutoRotating: !state.isAutoRotating })),
  
  openPanel: () => set({ isPanelOpen: true }),
  
  closePanel: () => set({ 
    isPanelOpen: false, 
    selectedAnimal: null,
    isAutoRotating: true 
  }),
}));

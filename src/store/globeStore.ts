import { create } from 'zustand';
import { Animal } from '../types/data';

// 交互状态
export type InteractionState = 'idle' | 'hovering' | 'selected';

// 详情面板状态
interface DetailPanel {
  isOpen: boolean;
  animal: Animal | null;
  country: string;
  countryEn: string;
  allAnimals: Animal[];
  currentIndex: number;
}

// Store 状态
interface GlobeState {
  // 交互状态
  hoveredMarkerId: string | null;
  selectedMarkerId: string | null;
  hoveredAnimalIndex: number;
  
  // 详情面板
  detailPanel: DetailPanel;
  
  // 地球状态
  isGlobeRotating: boolean;
  isUserInteracting: boolean;
  
  // 加载状态
  isLoading: boolean;
  loadingProgress: number;
  
  // Actions
  setHoveredMarker: (id: string | null) => void;
  setSelectedMarker: (id: string | null) => void;
  setHoveredAnimalIndex: (index: number) => void;
  
  openDetailPanel: (animal: Animal, country: string, countryEn: string, allAnimals: Animal[], index: number) => void;
  closeDetailPanel: () => void;
  navigateAnimal: (direction: 'prev' | 'next') => void;
  
  setGlobeRotating: (rotating: boolean) => void;
  setUserInteracting: (interacting: boolean) => void;
  
  setLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
}

export const useGlobeStore = create<GlobeState>((set, get) => ({
  // 初始状态
  hoveredMarkerId: null,
  selectedMarkerId: null,
  hoveredAnimalIndex: 0,
  
  detailPanel: {
    isOpen: false,
    animal: null,
    country: '',
    countryEn: '',
    allAnimals: [],
    currentIndex: 0,
  },
  
  isGlobeRotating: true,
  isUserInteracting: false,
  
  isLoading: true,
  loadingProgress: 0,
  
  // Actions
  setHoveredMarker: (id) => set({ hoveredMarkerId: id }),
  
  setSelectedMarker: (id) => {
    set({ selectedMarkerId: id });
    if (id === null) {
      set({ 
        detailPanel: { ...get().detailPanel, isOpen: false }
      });
    }
  },
  
  setHoveredAnimalIndex: (index) => set({ hoveredAnimalIndex: index }),
  
  openDetailPanel: (animal, country, countryEn, allAnimals, index) => {
    set({
      detailPanel: {
        isOpen: true,
        animal,
        country,
        countryEn,
        allAnimals,
        currentIndex: index,
      },
      isGlobeRotating: false,
    });
  },
  
  closeDetailPanel: () => {
    set({
      detailPanel: {
        isOpen: false,
        animal: null,
        country: '',
        countryEn: '',
        allAnimals: [],
        currentIndex: 0,
      },
      isGlobeRotating: true,
      selectedMarkerId: null,
    });
  },
  
  navigateAnimal: (direction) => {
    const { detailPanel } = get();
    if (!detailPanel.allAnimals.length) return;
    
    let newIndex = detailPanel.currentIndex;
    if (direction === 'next') {
      newIndex = (newIndex + 1) % detailPanel.allAnimals.length;
    } else {
      newIndex = (newIndex - 1 + detailPanel.allAnimals.length) % detailPanel.allAnimals.length;
    }
    
    set({
      detailPanel: {
        ...detailPanel,
        animal: detailPanel.allAnimals[newIndex],
        currentIndex: newIndex,
      },
    });
  },
  
  setGlobeRotating: (rotating) => set({ isGlobeRotating: rotating }),
  setUserInteracting: (interacting) => set({ isUserInteracting: interacting }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
}));

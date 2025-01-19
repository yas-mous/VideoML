import { create } from 'zustand';

export interface AudioStore {
  audioFiles: File[];           
  selectedAudio: File | null;    
  isAudioModalOpen: boolean;   
  dragOverAudio: boolean;      
  addAudio: (file: File) => void;
  removeAudio: (fileName: string) => void;
  setSelectedAudio: (file: File | null) => void; 
  toggleAudioModal: () => void;  
  setDragOverAudio: (isOver: boolean) => void; 
}

export const useAudioStore = create<AudioStore>((set) => ({
  audioFiles: [],
  selectedAudio: null,
  isAudioModalOpen: false,
  dragOverAudio: false,

  addAudio: (file) =>
    set((state) => ({
      audioFiles: [...state.audioFiles, file],
    })),

  removeAudio: (fileName) =>
    set((state) => ({
      audioFiles: state.audioFiles.filter((file) => file.name !== fileName),
    })),

  setSelectedAudio: (file) => set({ selectedAudio: file }),

  toggleAudioModal: () => set((state) => ({ isAudioModalOpen: !state.isAudioModalOpen })),

  setDragOverAudio: (isOver) => set({ dragOverAudio: isOver }),
}));

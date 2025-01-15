import { create } from 'zustand';

export interface VideoStore {
  videoFiles: File[];         
  selectedVideo: File | null;  
  isVideoModalOpen: boolean;    
  dragOverVideo: boolean;        
  addVideo: (file: File) => void; 
  removeVideo: (fileName: string) => void; 
  setSelectedVideo: (file: File | null) => void; 
  toggleVideoModal: () => void;  
  setDragOverVideo: (isOver: boolean) => void; 
}

export const useVideoStore = create<VideoStore>((set) => ({
  videoFiles: [],
  selectedVideo: null,
  isVideoModalOpen: false,
  dragOverVideo: false,

  addVideo: (file) =>
    set((state) => ({
      videoFiles: [...state.videoFiles, file],
    })),

  removeVideo: (fileName) =>
    set((state) => ({
      videoFiles: state.videoFiles.filter((file) => file.name !== fileName),
    })),

  setSelectedVideo: (file) => set({ selectedVideo: file }),

  toggleVideoModal: () => set((state) => ({ isVideoModalOpen: !state.isVideoModalOpen })),

  setDragOverVideo: (isOver) => set({ dragOverVideo: isOver }),
}));

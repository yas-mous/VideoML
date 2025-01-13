import {create} from 'zustand'

export interface ProgramStore {
    code: string;
    isSaved: boolean; 
    setCode: (code: string) => void;
    markAsSaved: () => void;
    resetCode: () => void;
}

export const useProgramStore = create<ProgramStore>((set) => ({
            code: '',
            isSaved: true,
            setCode: (code) =>
                set(() => ({
                    code,
                    isSaved: false,
                })),
            markAsSaved: () =>
                set(() => ({
                    isSaved: true,
                })),
            resetCode: () =>
                set(() => ({
                    code: '',
                    isSaved: true,
                })),
        }
    )
)
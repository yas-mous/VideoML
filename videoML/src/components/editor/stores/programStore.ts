import {create} from 'zustand'

export interface ProgramStore {
    code: string;
    pythonCode: string;
    ast: any | null;
    isSaved: boolean; 
    isValid: boolean;

    setCode: (code: string) => void;
    markAsSaved: () => void;
    resetCode: () => void;
    setAst: (ast: any) => void;
    setPythonCode: (pythonCodeG: string) => void;
    setIsVideoMLValid: (isValid: boolean) => void;
}

export const useProgramStore = create<ProgramStore>((set) => ({
            code: '',
            pythonCode: '',
            ast: null,
            isSaved: true,
            isValid: true,

            setCode: (code) =>
                set(() => ({
                    code,
                    isSaved: false,
                })),

                setPythonCode: (pythonCodeG) => {
                    console.log("setttttttttttttttttttttttttttttt")
                    console.log("Pjjjjjjjjjjjjjjjjjj:", pythonCodeG); 
                    set(() => ({
                        pythonCode:pythonCodeG,
                        isSaved: false,
                    }));
                },
                
                
            markAsSaved: () =>
                set(() => ({
                    isSaved: true,
                })),

            setIsVideoMLValid: (isValid) =>
                set({isValid}),

            resetCode: () =>
                set(() => ({
                    code: '',
                    isSaved: true,
                })),
                
            setAst: (ast) => set({ ast }),


        }
    )
)
import { useEffect, useRef } from "react";
import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import { setupConfigClassic } from "videoML/src/setupClassic.js";   
import { configureMonacoWorkers } from "videoML/src/setupCommon.js";
import { useProgramStore } from "../stores/programStore.js";

export const useMonacoEditor = (setCode: (code: string) => void) => {
    const refHtml = useRef<HTMLDivElement>(null!);
    const initialized = useRef(false);
    const wrapper = useRef(new MonacoEditorLanguageClientWrapper());
    const userConfig = setupConfigClassic();
    const setAst = useProgramStore((state) => state.setAst);
    const setPythonCode = useProgramStore((state) => state.setPythonCode);
    const setIsVideoMLValid = useProgramStore((state) => state.setIsVideoMLValid);


    useEffect(() => {
        configureMonacoWorkers();

        if (!initialized.current) {
            wrapper.current.initAndStart(userConfig, refHtml.current).then(() => {
                const languageClient = wrapper.current.getLanguageClient();

                if (languageClient) {
                    let running = false; 
                    let timeout: number | null = null; 

                    languageClient.onNotification('browser/DocumentChange', (change) => {
                        console.log("Document change notification received:", change);
                        if (running) {
                            return;
                        }

                        if (timeout) {
                            clearTimeout(timeout);
                        }

                        timeout = window.setTimeout(async () => {
                            running = true;

                            const jsonRes = JSON.parse(change.content);
                            setAst(jsonRes);
                            console.log("Document URI:", change.uri);
                            console.log("Serialized AST:", jsonRes);
                            console.log("Diagnostics:", change.diagnostics);
                            const code = jsonRes.$pythonCode;
                            console.log(jsonRes)
                            try {
                                if (jsonRes.$isValid) {
                                    setPythonCode(code);
                                }
                                setIsVideoMLValid(!!jsonRes.$isValid);
                                running = false;
                            } catch (e) {
                                console.error(e);
                                running = false;
                            }

        
                        }, 200);

                    });
                }
            });

            initialized.current = true;
        }

        return () => {
            wrapper.current.dispose();
        };
    }, [setCode]);

    return refHtml;
};



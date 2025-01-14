import { useEffect, useRef } from "react";
import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import { setupConfigExtended } from "../../../setupExtended.ts";
import { configureMonacoWorkers } from "../../../setupCommon.ts";
import { useProgramStore } from "../stores/programStore.ts";

export const useMonacoEditor = (setCode: (code: string) => void) => {
    const refHtml = useRef<HTMLDivElement>(null!);
    const initialized = useRef(false);
    const wrapper = useRef(new MonacoEditorLanguageClientWrapper());
    const userConfig = setupConfigExtended();
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
                            console.log("Python code:", code);
                            handleResponse(jsonRes, code, setPythonCode, setIsVideoMLValid);
        
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


function handleResponse(jsonRes: any, code: string, setPythonCode: (code: string) => void, setIsVideoMLValid: (isValid: boolean) => void) {
    let running = true;

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

    return running; 
}

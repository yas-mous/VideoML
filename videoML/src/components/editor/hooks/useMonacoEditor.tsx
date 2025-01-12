import { useEffect, useRef } from "react";
import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import { setupConfigClassic } from "../../../setupClassic.ts";
import { configureMonacoWorkers } from "../../../setupCommon.ts";

export const useMonacoEditor = (setCode: (code: string) => void) => {
    const refHtml = useRef<HTMLDivElement>(null!);
    const initialized = useRef(false);
    const wrapper = useRef(new MonacoEditorLanguageClientWrapper());
    const userConfig = setupConfigClassic();

    useEffect(() => {
        configureMonacoWorkers();

        if (!initialized.current) {
            wrapper.current.initAndStart(userConfig, refHtml.current).then(() => {
                const editor = wrapper.current.getEditor();
                editor?.onDidChangeModelContent(() => {
                    const newCode = editor.getValue() || "";
                    setCode(newCode); 
                });
            });

            initialized.current = true;
        }

        return () => {
            wrapper.current.dispose(); 
        };
    }, [setCode]);

    return refHtml;
};

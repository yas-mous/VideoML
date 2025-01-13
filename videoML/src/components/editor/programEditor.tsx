import React from "react";
import { useProgramStore } from "./stores/programStore.ts";
import { useMonacoEditor } from "./hooks/useMonacoEditor.tsx";

export const ProgramEditor = () => {
    const setCode = useProgramStore((state) => state.setCode);
    const refHtml = useMonacoEditor(setCode);

    return <div ref={refHtml} style={{ width: "100%", height: "100%" }} />;
};

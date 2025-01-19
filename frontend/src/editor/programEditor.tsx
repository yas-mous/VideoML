import { useProgramStore } from "./stores/programStore.js";
import { useMonacoEditor } from "./hooks/useMonacoEditor.js";

export const ProgramEditor = () => {
    const setCode = useProgramStore((state) => state.setCode);
    const refHtml = useMonacoEditor(setCode);

    return <div ref={refHtml} style={{ width: "100%", height: "100%" }} />;
};

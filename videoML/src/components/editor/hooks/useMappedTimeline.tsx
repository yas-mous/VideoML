import { AST, CustomClip, LayerElement, AudioClip, SubtitleClip, VideoClip } from "../../../cli/models/models.ts";
import { Layer } from "../../../language/generated/ast.ts";
import { useProgramStore } from "../stores/programStore.ts";


export const useMappedTimeline = () => {
  const ast = useProgramStore((state) => state.ast);


  if (!ast || !ast.layers) {
    return [];
  }

  const mapTimeline = (ast: any): AST => {
    const layers: Layer[] = ast.layers.map((layer: any) => ({
      $type: 'Layer',
      layerName: layer.layerName,
      elements: layer.elements.map((element: any) => {
        if (element.$type === 'VideoClip') {
          // Si c'est un VideoClip, on le mappe en tant que VideoClip
          return {
            $type: 'VideoClip',
            clipName: element.clipName,
            sourceFile: element.sourceFile,
            effects: element.effects.map((effect: any) => ({
              $type: effect.$type,
              ...effect, // On garde les autres propriétés de l'effet
            })),
            properties: element.properties,
          } as VideoClip; // Type explicite pour VideoClip
        } else if (element.$type === 'AudioClip') {
          // Si c'est un AudioClip, on le mappe en tant que AudioClip
          return {
            $type: 'AudioClip',
            clipName: element.clipName,
            sourceFile: element.sourceFile,
            properties: element.properties,
          } as AudioClip; // Type explicite pour AudioClip
        } else if (element.$type === 'SubtitleClip') {
          // Si c'est un SubtitleClip, on le mappe en tant que SubtitleClip
          return {
            $type: 'SubtitleClip',
            clipName: element.clipName,
            text: element.text,
            start: element.start,
            duration: element.duration,
            position: element.position,
            bg_color: element.bg_color,
            color: element.color,
          } as SubtitleClip; // Type explicite pour SubtitleClip
        } else if (element.$type === 'CustomClip') {
          // Si c'est un CustomClip, on le mappe en tant que CustomClip
          return {
            $type: 'CustomClip',
            clipName: element.clipName,
            text: element.text,
            duration: element.duration,
            fontSize: element.fontSize,
            position: element.position,
            bg_color: element.bg_color,
            color: element.color,
          } as CustomClip; // Type explicite pour CustomClip
        }
        // Retourner null si l'élément n'est pas reconnu
        return null;
      }).filter((element: LayerElement | null) => element !== null),
    }));
  
    return {
      $type: 'TimeLine',
      name: ast.name,
      layers,
    };
  };
  
  

  return mapTimeline(ast);
};

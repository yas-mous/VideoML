import { AST, CustomClip, LayerElement, AudioClip, SubtitleClip, VideoClip } from "videoML/src/cli/models/models.js";
import { Layer } from "videoML/src/language/generated/ast.js";
import { useProgramStore } from "../stores/programStore.js";


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
          return {
            $type: 'VideoClip',
            clipName: element.clipName,
            sourceFile: element.sourceFile,
            effects: element.effects.map((effect: any) => ({
              $type: effect.$type,
              ...effect, 
            })),
            properties: element.properties,
          } as VideoClip; 
        } else if (element.$type === 'AudioClip') {
          return {
            $type: 'AudioClip',
            clipName: element.clipName,
            sourceFile: element.sourceFile,
            properties: element.properties,
          } as AudioClip; 
        } else if (element.$type === 'SubtitleClip') {
          return {
            $type: 'SubtitleClip',
            clipName: element.clipName,
            text: element.text,
            start: element.start,
            duration: element.duration,
            position: element.position,
            bg_color: element.bg_color,
            color: element.color,
          } as SubtitleClip; 
        } else if (element.$type === 'CustomClip') {

          return {
            $type: 'CustomClip',
            clipName: element.clipName,
            text: element.text,
            duration: element.duration,
            fontSize: element.fontSize,
            position: element.position,
            bg_color: element.bg_color,
            color: element.color,
          } as CustomClip; 
        }
        
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

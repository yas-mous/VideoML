
//   export type LayerElement = VideoClip | AudioClip; 



// export interface Effect {
//     $type: string;
//     [key: string]: any;  // Les effets peuvent avoir diverses propriétés, on peut les typer plus précisément
//   }
  
//   export interface VideoClip {
//     $type: "VideoClip";
//     clipName: string;
//     sourceFile: string;
//     effects: Effect[];
//   }
  

  
//  export interface AST {
//     $type: "TimeLine";
//     name: string;
//     layers: Layer[];
//     $sourceText: string;
//   }


// export interface Layer {
//   $type: "Layer";
//   layerName: string;
//   elements: LayerElement[]; // Utiliser LayerElement pour inclure VideoClip et AudioClip
// }

// export interface AudioClip {
//   $type: "AudioClip"; // Exemple de type pour un AudioClip
//   clipName: string;
//   sourceFile: string;
//   properties: any[];
// }



export interface AST  {
    $type: "TimeLine";
    layers: Array<Layer>;
    name: string;
    outputPath?: string;
}

export interface Layer{
    $type: 'Layer';
   elements: Array<LayerElement>;
   layerName: string;
}

export type LayerElement = VideoClip | AudioClip | SubtitleClip | CustomClip;

export interface VideoClip {
    $type: 'VideoClip';
   clipName: string;
   properties: Array<ClipProperty>;
   sourceFile: string;
}

export interface AudioClip   {
     $type: 'AudioClip';
    clipName: string;
    properties: Array<ClipProperty>;
    sourceFile: string;
}

export interface SubtitleClip{
    $type: 'SubtitleClip';
   bg_color?: string;
   clipName: string;
   color?: string;
   duration: number;
   position?: string;
   start: number;
   text: string;
}

export interface CustomClip
 {  $type: 'CustomClip';
    bg_color?: string;
    clipName: string;
    color?: string;
    duration: number;
    fontSize?: number;
    position?: string;
    text: string;
}

export interface ClipProperty  {
    $type: 'ClipProperty';
   after?: number;
   begin?: number;
   end?: number;
   height?: number;
   position?: string;
   positionInTimeline?: number;
   width?: number;
}


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

export type LayerElement = VideoClip | AudioClip | SubtitleClip;
export type VideoClip =  PathVideo | TextVideo;
export type Effect = CropEffect | FadeInEffect | FadeOutEffect | FreezingEffect | GrayscaleEffect;


export interface PathVideo {
    $type: 'PathVideo';
   clipName: string;
   properties: Array<ClipProperty>;
   sourceFile: string;
   effects: Array<Effect>;
}

export interface AudioClip   {
     $type: 'AudioClip';
    clipName: string;
    properties: Array<ClipProperty>;
    sourceFile: string;
    effects: Array<Effect>;
    
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
   effects: Array<Effect>;
}

export interface TextVideo
 {  $type: 'TextVideo';
    bg_color?: string;
    clipName: string;
    color?: string;
    duration: number;
    fontSize?: number;
    position?: string;
    text: string;
    effects: Array<Effect>;

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

export interface CropEffect {
    $type:'CropEffect';
}

export interface FadeInEffect {
    $type:'FadeInEffect';
}


export interface FadeOutEffect {
    $type:'FadeOutEffect';
}

export interface FreezingEffect {
    $type:'FreezingEffect';
}

export interface GrayscaleEffect {
    $type:'GrayscaleEffect';
}
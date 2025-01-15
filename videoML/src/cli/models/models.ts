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


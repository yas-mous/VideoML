import path from "path";
import { LayerElement,TimeLine,isVideoClip, isAudioClip, isTextVideo, isPathVideo } from "../language/generated/ast.js";

export function hasClipProperties(clip: LayerElement): boolean {
    //return clip..length > 0;
    if (((isVideoClip(clip) && (isPathVideo(clip)||isTextVideo(clip))) || isAudioClip(clip))) {
        return clip.properties.length > 0;
    }
    
    return false;
}
/*
export function hasFrom(clip: LayerElement): boolean {
    if (!isVideoClip(clip)) {
        return false;
    }else{
        return clip.properties.some(prop => prop.begin !== undefined);
    }
}

export function hasEnd(clip: LayerElement): boolean {
    if (!isVideoClip(clip)) {
        return false;
    }else{
        return clip.properties.some(prop => prop.end !== undefined);
    }
}*/

export function generateOutputFilePath(timeline: TimeLine): string {
    const extension = timeline.extension || 'mp4';  
    const outputPath = timeline.outputPath || './';  
    let outputFilePath = path.join(outputPath, `${timeline.name}.${extension}`);

    outputFilePath = outputFilePath.replace(/\\/g, '/');

    return outputFilePath;
}

export function convertToSeconds(time: string): number {
    const timeArray = time.split(':');
    return parseInt(timeArray[0]) * 60 * 60 + parseInt(timeArray[1])* 60 + parseInt(timeArray[2]);
}

export function isClipType(clip: LayerElement): boolean {
    return ((isVideoClip(clip) && (isPathVideo(clip)||isTextVideo(clip))) || isAudioClip(clip));
}
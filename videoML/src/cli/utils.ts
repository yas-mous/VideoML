import path from "path";
import { LayerElement,TimeLine,isVideoClip } from "../language/generated/ast.js";

export function hasClipProperties(clip: LayerElement): boolean {
    if (!isVideoClip(clip)) {
        return false;
    }else{
        return clip.properties.length > 0;
    }
    
}

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
}

export function generateOutputFilePath(timeline: TimeLine): string {
    const extension = timeline.extension || 'mp4';  
    const outputPath = timeline.outputPath || './';  
    let outputFilePath = path.join(outputPath, `${timeline.name}.${extension}`);

    outputFilePath = outputFilePath.replace(/\\/g, '/');

    return outputFilePath;
}

import {LayerElement, TimeLine, isVideoClip, isAudioClip} from "../language/generated/ast.js";

export function hasClipProperties(clip: LayerElement): boolean {
    if (!(isVideoClip(clip)||isAudioClip(clip))) {
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
    const normalizedOutputPath = outputPath.endsWith('/') ? outputPath : `${outputPath}/`;
    
    let outputFilePath = `${normalizedOutputPath}${timeline.name}.${extension}`;

    outputFilePath = outputFilePath.replace(/\\/g, '/');

    return outputFilePath;
}


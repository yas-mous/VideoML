import { LayerElement,isVideoClip } from "../language/generated/ast.js";

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

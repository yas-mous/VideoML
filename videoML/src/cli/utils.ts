import { LayerElement,isVideoClip } from "../language/generated/ast.js";

export function hasClipProperties(clip: LayerElement): boolean {
    if (!isVideoClip(clip)) {
        return false;
    }else{
        return clip.properties.length > 0;
    }
    
}

import { Clip } from "../language/generated/ast.js";

export function hasClipProperties(clip: Clip): boolean {
    return clip.properties.length > 0;
}

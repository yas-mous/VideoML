import { CompositeGeneratorNode, toString } from 'langium/generate';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';
import { TimeLine, Clip, Layer, isVideoClip, Effect, isAdjustmentEffect, VideoClip, CropEffect, FreezingEffect, ZoomEffect, AdjustmentEffect, isCropEffect, isFreezingEffect, isZoomEffect } from '../language/generated/ast.js';
import { hasClipProperties } from './utils.js';

export function generatepython(timeline: TimeLine, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.py`;

    const fileNode = new CompositeGeneratorNode();
    compileTimeline(timeline, fileNode);

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(fileNode));
    return generatedFilePath;
}

function compileTimeline(timeline: TimeLine, fileNode: CompositeGeneratorNode): void {
    fileNode.append("from moviepy import *");
    fileNode.appendNewLine();
    fileNode.append("from moviepy.video.fx import *");
    fileNode.appendNewLine();
    fileNode.appendNewLine();

    const layers: string[] = [];
    timeline.layers.forEach((layer, layerIndex) => {
        const layerVar = compileLayer(layer, layerIndex, fileNode);
        layers.push(layerVar);
    });

    fileNode.appendNewLine();
    fileNode.append("final_video = concatenate_videoclips([");
    fileNode.appendNewLine();
    layers.forEach((layer) => {
        fileNode.append(`    ${layer},`);
        fileNode.appendNewLine();
    });
    fileNode.append("])");
    fileNode.appendNewLine();
    fileNode.append(`final_video.write_videofile("${timeline.name}.mp4", fps=24)`);
    fileNode.appendNewLine();
}

function compileLayer(layer: Layer, layerIndex: number, fileNode: CompositeGeneratorNode): string {
    const clips: string[] = [];
    layer.clips.forEach((clip, clipIndex) => {
        const clipVar = `clip_${layerIndex}_${clipIndex}`;
        const clipCode = compileClip(clip);
        fileNode.append(`${clipVar} = ${clipCode}`); 
        fileNode.appendNewLine();
        clips.push(clipVar); 
    });

    if (clips.length === 1) {
        return compileSingleClip(clips[0], fileNode);
    } else {
        return compileMultipleClip(clips, layerIndex, fileNode);
    }
}

function compileSingleClip(clipCode: string, fileNode: CompositeGeneratorNode): string {
    return clipCode; 
}

function compileMultipleClip(clips: string[], layerIndex: number, fileNode: CompositeGeneratorNode): string {
    const layerVar = `layer_${layerIndex}`;
    fileNode.append(`${layerVar} = CompositeVideoClip([`);
    fileNode.appendNewLine();
    clips.forEach((clip) => {
        fileNode.append(`    ${clip},`);
        fileNode.appendNewLine();
    });
    fileNode.append("])");
    fileNode.appendNewLine();
    return layerVar;
}

function compileClip(clip: Clip): string {
    //TOADD : different types of clips (video, audio ...)
    if (isVideoClip(clip)) {
        let clipCode = compileVideoClip(clip);
        clipCode = cutClip(clip, clipCode);
        clip.effects.forEach(effect => clipCode+=compileEffect(effect));
        return clipCode;
    }
    else{
        //a ajouter audioClip ....
        return "TODO ! "
    }
}

function compileVideoClip(clip: VideoClip): string {
    const source = clip.sourceFile;
    return `VideoFileClip("${source}")`;
}

// FUNCTIONS TO IMPLEMENT (commented because of compilation errors : empty functions)

/*
function compileAudioClip(){
    //TODO
}

function compileText(){
    //TODO
}

function compileTransition(){
    //TODO
}
*/
function compileEffect(effect:Effect):string{
    if(isAdjustmentEffect(effect)){
        return compileAdjustmentEffect(effect)
    }
    else if(isCropEffect(effect)){
        return compileCropEffect(effect)
    }
    else if(isFreezingEffect(effect)){
        return compileFreezingEffect(effect)
    }
    else if(isZoomEffect(effect)){
        return compileZoomEffect(effect)
    }
    else{
        throw new Error("Unknown effect type"); 
    }
}

function compileCropEffect(effect:CropEffect):string{
    //TODO
    return "TODOCrop"
}

function compileFreezingEffect(effect:FreezingEffect){
    //TODO
    return "TODOFreez"
}

function compileZoomEffect(effect:ZoomEffect){
    //TODO
    return "TODOZoom"

}

function compileAdjustmentEffect(effect:AdjustmentEffect){
    //TODO
    return "TODOAdjust"

}

function cutClip(clip : Clip,clipCode:string) : string {
    if (hasClipProperties(clip)) {
        const begin = clip.properties.find(prop => prop.begin !== undefined)?.begin || 0;
        const end = clip.properties.find(prop => prop.end !== undefined)?.end || 0;

        if (begin !== null && end !== null) {
            clipCode += `.subclipped(${begin}, ${end})`;
        } else if (begin !== null) {
            clipCode += `.subclipped(${begin})`;
        } else if (end !== null) {
            clipCode += `.subclipped(0, ${end})`;
        }
    }

    return clipCode;
}
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
      

    const layers: string[] = [];

    timeline.layers.forEach((layer, layerIndex) => {
        const layerVar = compileLayer(layer, layerIndex, fileNode);
        layers.push(layerVar);
    });

    fileNode.appendNewLine();

    if (layers.length === 1) {
        fileNode.append(`final_video = ${layers[0]}`);
        fileNode.appendNewLine();
    } else {
        compileMultipleLayer(layers, fileNode);
    }

    fileNode.append(`final_video.write_videofile("${timeline.name}.mp4", fps=24)`);
    fileNode.appendNewLine();
}

function compileMultipleLayer(layers: string[], fileNode: CompositeGeneratorNode): void {
    fileNode.append("final_video = CompositeVideoClip([");
    fileNode.appendNewLine();
    layers.forEach((layer) => {
        fileNode.append(`    ${layer},`);
        fileNode.appendNewLine();
    });
    fileNode.append("])");
    fileNode.appendNewLine();
}

function compileLayer(layer: Layer, layerIndex: number, fileNode: CompositeGeneratorNode): string {
    const clips: string[] = [];
    layer.clips.forEach((clip, clipIndex) => {
        const clipVar = `clip_${layerIndex}_${clipIndex}`;
        generateProgramBody(clipVar,clip,fileNode)
        
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
    fileNode.append(`${layerVar} = concatenate_videoclips([`);
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


function compileEffect(effect:Effect,clipVar:string,fileNode: CompositeGeneratorNode):void{
    if(isAdjustmentEffect(effect)){
        compileAdjustmentEffect(effect,clipVar,fileNode)
    }
    else if(isCropEffect(effect)){
        compileCropEffect(effect,clipVar,fileNode)
    }
    else if(isFreezingEffect(effect)){
        compileFreezingEffect(effect,clipVar,fileNode)
    }
    else if(isZoomEffect(effect)){
        compileZoomEffect(effect,clipVar,fileNode)
    }
    else{
        throw new Error("Unknown effect type"); 
    }
}

function compileCropEffect(effect:CropEffect, clipVar:string,fileNode: CompositeGeneratorNode):void{
    //TODO
    /**
     * cropeffect = Crop(x1=15,y1=10,width=10,height=10)
     * cropeffect.apply(clip_2_0.subclipped())
     */
    fileNode.append(`crop_effect = Crop(x1=${effect.x}, y1=${effect.y}, width=${effect.width}, height=${effect.height})`)
    fileNode.appendNewLine()
    fileNode.append(`crop_effect.apply(${clipVar})`)
    fileNode.appendNewLine()

   
}

function compileFreezingEffect(effect:FreezingEffect,clipVar:string,fileNode: CompositeGeneratorNode):void{
    
    fileNode.append(`freeze_effect = Freeze(t=${effect.begin}, freeze_duration=${effect.frameSeconds})`)
    fileNode.appendNewLine()
    fileNode.append(`${clipVar} = freeze_effect.apply(${clipVar})`)
    fileNode.appendNewLine()

}

function compileZoomEffect(effect:ZoomEffect,clipVar:string,fileNode: CompositeGeneratorNode):void{
    //TODO

}

function compileAdjustmentEffect(effect:AdjustmentEffect,clipVar:string,fileNode: CompositeGeneratorNode):void{
    //TODO

}

function cutClip(clip : Clip,clipCode:string) : string {
    if (hasClipProperties(clip)) {
        const begin = clip.properties.find(prop => prop.begin !== undefined)?.begin || 0;
        const end = clip.properties.find(prop => prop.end !== undefined)?.end || 0;

        if (begin !== null && end !== null) {
            clipCode += `.subclipped(${begin}, ${end})`;
        } else if (begin !== null) {
            //bug a corriger : si pas de end ca le met automatiquement a 0
            clipCode += `.subclipped(${begin})`;
        } else if (end !== null) {
            clipCode += `.subclipped(0, ${end})`;
        }
    }

    return clipCode;
}

function generateProgramBody(clipVar: string,clip:Clip, fileNode:CompositeGeneratorNode):void {
    const clipCode = compileClip(clip);
    fileNode.append(`${clipVar} = ${clipCode}`); 
    fileNode.appendNewLine();
    clip.effects.forEach(effect => {
        compileEffect(effect,clipVar,fileNode);
    });
}

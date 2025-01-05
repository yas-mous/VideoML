import { CompositeGeneratorNode, toString } from 'langium/generate';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';
import {
    TimeLine,
    Clip,
    Layer,
    isVideoClip,
    Effect,
    isAdjustmentEffect,
    VideoClip,
    CropEffect,
    FreezingEffect,
    ZoomEffect,
    AdjustmentEffect,
    isCropEffect,
    isFreezingEffect,
    isZoomEffect,
    isAudioClip, AudioClip, VolumeEffect, isVolumeEffect, isLoopEffect, LoopEffect
} from '../language/generated/ast.js';
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
    const videoClips: string[] = [];

    let videoVar = "";
    layer.clips.forEach((clip, clipIndex) => {
        const clipVar = `clip_${layerIndex}_${clipIndex}`;
         if(isVideoClip(clip)){
            videoVar = clipVar;
             videoClips.push(clipVar);

         }
        generateProgramBody(clipVar,clip,fileNode,videoVar)
         //attach audio to the last video clip
        if(isAudioClip(clip)){
            attachAudioToVideo(clipVar, videoVar,fileNode)
        }

    });


    if (videoClips.length === 1) {
        return compileSingleClip(videoClips[0], fileNode);
    } else {
        return compileMultipleClip(videoClips, layerIndex, fileNode);
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
        return clipCode;
    }
    else{
        if(isAudioClip(clip)){
            let clipCode = compileAudioClip(clip);
            clipCode = cutClip(clip, clipCode);
            return clipCode;
        }
        return "Invalid clip type";
    }
}

function compileVideoClip(clip: VideoClip): string {
    const source = clip.sourceFile;
    return `VideoFileClip("${source}")`;
}
    function compileAudioClip(clip: AudioClip): string {
        const source = clip.sourceFile;
        return `AudioFileClip("${source}")`;
    }
// FUNCTIONS TO IMPLEMENT (commented because of compilation errors : empty functions)

/*


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
    else if(isVolumeEffect(effect)){
        compileVolumeEffect(effect,clipVar,fileNode,"v")
    }
    else{
        throw new Error("Unknown effect type"); 
    }
}

function  compileVolumeEffect(effect:VolumeEffect,clipVar:string,fileNode: CompositeGeneratorNode, volumeEffectName:string):void{
    const begin = effect.properties.find(prop => prop.begin !== undefined)?.begin || 0;
    const end = effect.properties.find(prop => prop.end !== undefined)?.end || 0;
    if(begin !== undefined && end !== undefined){
        fileNode.append(`${volumeEffectName} = afx.MultiplyVolume(${effect.volume}, start_time=${begin}, end_time=${end})`)

    }
else{
    if(begin !== undefined){
        fileNode.append(`${volumeEffectName} = afx.MultiplyVolume(${effect.volume}, start_time=${begin})`)
    }
    if(end !== undefined){
        fileNode.append(`${volumeEffectName} = afx.MultiplyVolume(${effect.volume}, end_time=${end})`)
    }
    else{
        fileNode.append(`${volumeEffectName} = afx.MultiplyVolume(${effect.volume})`)

    }
    }
    fileNode.appendNewLine()

}


function compileCropEffect(effect:CropEffect, clipVar:string,fileNode: CompositeGeneratorNode):string{
    //TODO
    return "TODOCrop"
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

function compileAudioEffects(effects: Array<Effect>, clipVar: string, fileNode: CompositeGeneratorNode,videoClipVar?:string):void{
    const effectsVar:string[] = [];
effects.forEach(effect => {
    if(isVolumeEffect(effect)){
    compileVolumeEffect(effect,clipVar,fileNode,"volume_effect");
    effectsVar.push("volume_effect");
}
    else if(isLoopEffect(effect)){
        compileLoopEffect(effect,clipVar,fileNode,"loop_effect",videoClipVar);
        effectsVar.push("loop_effect");

    }
});
fileNode.append(`${clipVar} = ${clipVar}.with_effects([${effectsVar.join(",")}])`);
fileNode.appendNewLine()

}

function generateProgramBody(clipVar: string,clip:Clip, fileNode:CompositeGeneratorNode,videoClipVar?:string):void {
    const clipCode = compileClip(clip);
    fileNode.append(`${clipVar} = ${clipCode}`); 
    fileNode.appendNewLine();
   if(isVideoClip(clip)) clip.effects.forEach(effect => {
        compileEffect(effect,clipVar,fileNode);
    });
   else if(isAudioClip(clip)) compileAudioEffects(clip.effects,clipVar,fileNode,videoClipVar);
}
function attachAudioToVideo(clipVar:string, videoVar:string,fileNode:CompositeGeneratorNode):void{
    fileNode.append(`${videoVar} = ${videoVar}.with_audio(${clipVar})`);
    fileNode.appendNewLine();

}

function compileLoopEffect(effect:LoopEffect,clipVar:string,fileNode: CompositeGeneratorNode, loopEffectName:string,videoClipVar?:string):void{
    if(effect.duration === undefined && effect.n_times === undefined){
        fileNode.append(`${loopEffectName} = afx.AudioLoop(duration=${videoClipVar}.duration)`)
    }
    else {

    if(effect.n_times !== undefined){
        fileNode.append(`${loopEffectName} = afx.AudioLoop(n_loops=${effect.n_times})`)
    }
    if(effect.duration !== undefined){
            fileNode.append(`${loopEffectName} = afx.AudioLoop(duration=${effect.duration})`)

        }
    }
    fileNode.appendNewLine()

}

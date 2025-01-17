import { CompositeGeneratorNode, toString } from 'langium/generate';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';
import { TimeLine, Layer, isVideoClip, PathVideo,FadeOutEffect ,FadeInEffect , isFadeOutEffect , isFadeInEffect, isGrayscaleEffect, 
         GrayscaleEffect,isAudioClip, AudioClip,isSubtitleClip,SubtitleClip, LayerElement, TextVideo, isPathVideo , 
         isTextVideo, VideoEffect, isIntervalDuration, isIntervalFrom} from '../language/generated/ast.js';
import { generateOutputFilePath, hasClipProperties, convertToSeconds} from './utils.js';

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

    if (layers.length === 1) {
        fileNode.append(`final_video = ${layers[0]}`);
        fileNode.appendNewLine();
    } else {
        compileMultipleLayers(layers, fileNode);
    }

    const outputFilePath = generateOutputFilePath(timeline);


    fileNode.append(`final_video.write_videofile("${outputFilePath}", fps=24)`);
    fileNode.appendNewLine();
}

function compileMultipleLayers(layerClips: string[], fileNode: CompositeGeneratorNode): void {
    fileNode.append("final_video = CompositeVideoClip([");
    fileNode.appendNewLine();
    layerClips.forEach((layer) => {
        fileNode.append(`    ${layer},`);
        fileNode.appendNewLine();
    });
    fileNode.append("])");
    fileNode.appendNewLine();
}

function compileLayer(layer: Layer, layerIndex: number, fileNode: CompositeGeneratorNode): string {
    const videoClips: string[] = [];

    let videoVar = "";
    layer.elements.forEach((clip) => {
        let clipVar: string;
        if(isAudioClip(clip)){
            clipVar = clip.clipName;
            //compileAudiosCLip(clip,clipVar,fileNode)
            //attachAudioToVideo(clipVar, videoVar,fileNode)
        }
        else{
            clipVar = clip.clipName;
            generateProgramBody(clipVar,clip,fileNode,videoVar)
            if ( isVideoClip(clip)) {
                if (layerIndex > 0 ) {
                    let position = clip.position;
                    const size = clip.size|| 100;    
                    const after = clip.properties.find(prop => prop.positionInTimeline !== undefined)?.positionInTimeline;

                    if (position == "bottom-left" || position == "left-bottom") {
                        position = "'left', 'bottom'";
                    }else if (position == "bottom-right" || position == "right-bottom") {
                        position = "'right', 'bottom'";
                    }else if (position == "top-left" || position == "left-top") {
                        position = "'left', 'top'";
                    }else if (position == "top-right" || position == "right-top") {
                        position = "'right', 'top'";
                    }else if (position == "center") {
                        position = "'center', 'center'";
                    }
                    
                    if (after !== undefined) {
                        fileNode.append(`${clipVar} = ${clipVar}.with_start(${convertToSeconds(after)})`);
                        fileNode.appendNewLine();
                    }
                    
                    if (position !== undefined) {
                        fileNode.append(`${clipVar} = ${clipVar}.with_position((${position}))`);
                        fileNode.appendNewLine();
                    }
                    
                    if (size !== undefined) {
                        fileNode.append(`${clipVar} = ${clipVar}.resized(${size/100})`);
                        fileNode.appendNewLine();
                    }
                }
            }
            /*if(isAudioClip(clip)){
                attachAudioToVideo(clipVar, videoVar,fileNode)
            }*/
            videoClips.push(clipVar);
        }
    });

    if (videoClips.length === 1) {
        return compileSingleClip(videoClips[0], fileNode);
    } else {
        return compileMultipleClip(videoClips,layer, layerIndex, fileNode);
    }
}

/*function compileAudiosCLip(clip:AudiosClip,clipVar:string,fileNode: CompositeGeneratorNode):void{
    const  audioClipsVar:string[]=[];
    clip.audios.forEach(((audioClip,index) => {
        let audioClipVar = `${clipVar}_${index}`;
        audioClipsVar.push(audioClipVar);
        let clipCode = compileAudioClip(audioClip);
        clipCode = cutClip(audioClip, clipCode);
        fileNode.append(`${audioClipVar} = ${clipCode}`);
        fileNode.appendNewLine();

    }));
    fileNode.append(`${clipVar} = concatenate_audioclips([${audioClipsVar.join(",")}])`);
    fileNode.appendNewLine();


}*/

function compileSingleClip(clipCode: string, fileNode: CompositeGeneratorNode): string {
    return clipCode; 
}

function compileMultipleClip(clips: string[], layer: Layer , layerIndex: number, fileNode: CompositeGeneratorNode): string {
    const layerVar = `layer_${layerIndex}`;

    fileNode.append(`${layerVar} = concatenate_videoclips([`);
    fileNode.appendNewLine();

    clips.forEach((clip) => {
        fileNode.append(`    ${clip},`);
        fileNode.appendNewLine();
    });

    fileNode.append(`], method="compose")`);
    if(layer.elements.length > 0 && isSubtitleClip(layer.elements[0])){
        fileNode.append(`.with_position( 'bottom')`);
    }
    fileNode.appendNewLine();

    fileNode.appendNewLine();
    return layerVar;
}

function compileClip(clip: LayerElement): string {
    //TOADD : different types of clips (video, audio ...)
    if (isPathVideo(clip)) {
        let clipCode = compileVideoClip(clip);
        clipCode = cutClip(clip, clipCode);
        return clipCode;
    }else if(isSubtitleClip(clip)){
        return addSubtitleToClip(clip);
    }
    else{
        if(isAudioClip(clip)){
            let clipCode = compileAudioClip(clip);
            clipCode = cutClip(clip, clipCode);
            return clipCode;
        }
        if (isTextVideo(clip)) {
            let clipCode = createCustomClip(clip);
            return clipCode;
        }
        return "clip format not supported"
        
    }
}

function compileVideoClip(clip: PathVideo): string {
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


function compileEffect(effect:VideoEffect,clipVar:string,fileNode: CompositeGeneratorNode):void{
    if(isGrayscaleEffect(effect)){
        compileGrayscaleEffect(effect,clipVar,fileNode)
    }
    /*else if(isCropEffect(effect)){
        compileCropEffect(effect,clipVar,fileNode)
    }*/
    /*else if(isFreezingEffect(effect)){
        compileFreezingEffect(effect,clipVar,fileNode)
    }*/
    else if (isFadeOutEffect(effect)) {
        compileFadeOutEffect(effect, clipVar, fileNode);
    } else if (isFadeInEffect(effect)) {
        compileFadeInEffect(effect, clipVar, fileNode);
    }
    else{
        throw new Error("Unknown effect type");
    }
}

/*function compileCropEffect(effect: CropEffect, clipVar: string, fileNode: CompositeGeneratorNode): void {
    const from = effect.intervall?.find(prop => prop.begin !== undefined)?.begin || null;
    const to = effect.intervall?.find(prop => prop.end !== undefined)?.end || null;

    if (from !== null && to !== null) {
        fileNode.appendNewLine();
        fileNode.append(`${clipVar}_before = ${clipVar}.subclipped(0, ${from})`);
        fileNode.appendNewLine();
        fileNode.append(`crop_effect = Crop(x1=${effect.x}, y1=${effect.y}, width=${effect.width}, height=${effect.height})`);
        fileNode.appendNewLine();
        fileNode.append(`${clipVar}_cropped = crop_effect.apply(${clipVar}.subclipped(${from}, ${to}))`);
        fileNode.appendNewLine();
        fileNode.append(`${clipVar}_after = ${clipVar}.subclipped(${to})`);
        fileNode.appendNewLine();


        fileNode.append(`${clipVar} = concatenate_videoclips([${clipVar}_before, ${clipVar}_cropped, ${clipVar}_after], method="compose")`);
        fileNode.appendNewLine();
    } else {

        fileNode.append(`crop_effect = Crop(x1=${effect.x}, y1=${effect.y}, width=${effect.width}, height=${effect.height})`);
        fileNode.appendNewLine();
        fileNode.append(`${clipVar} = crop_effect.apply(${clipVar})`);
        fileNode.appendNewLine();
    }
}*/

/*function  compileVolumeEffect(effect:VolumeEffect,clipVar:string,fileNode: CompositeGeneratorNode, volumeEffectName:string):void{
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

}*/


/*function compileFreezingEffect(effect:FreezingEffect,clipVar:string,fileNode: CompositeGeneratorNode):void{
    
    fileNode.append(`freeze_effect = Freeze(t=${effect.begin}, freeze_duration=${effect.frameSeconds})`)
    fileNode.appendNewLine()
    fileNode.append(`${clipVar} = freeze_effect.apply(${clipVar})`)
    fileNode.appendNewLine()

}*/


function compileGrayscaleEffect(effect:GrayscaleEffect,clipVar:string,fileNode: CompositeGeneratorNode):void{
    const intervall = effect.intervall;
    if (intervall !== undefined && isIntervalFrom(intervall)) {
        const from = intervall.begin;
        const to = intervall.end || null;

        if (from !== null && to !== null) {
            fileNode.appendNewLine();
            fileNode.append(`${clipVar}_before = ${clipVar}.subclipped(0, ${from})`);
            fileNode.appendNewLine();
            fileNode.append(`${clipVar}_gray = BlackAndWhite(RGB='CRT_phosphor', preserve_luminosity=True).apply(${clipVar}.subclipped(${from}, ${to}))`);
            fileNode.appendNewLine();
            fileNode.append(`${clipVar}_after = ${clipVar}.subclipped(${to})`);
            fileNode.appendNewLine();
    
    
            fileNode.append(`${clipVar} = concatenate_videoclips([${clipVar}_before, ${clipVar}_gray, ${clipVar}_after], method="compose")`);
            fileNode.appendNewLine();
        } else {
    
            fileNode.append(`${clipVar} = BlackAndWhite(RGB='CRT_phosphor', preserve_luminosity=True).apply(${clipVar})`);
            fileNode.appendNewLine();
        }
    }else if (intervall !== undefined && isIntervalDuration(intervall)) {
        // to implement
    }

    /*const from = effect.intervall?.find(prop => prop.begin !== undefined)?.begin || null;
    const to = effect.intervall?.find(prop => prop.end !== undefined)?.end || null;*/

    

}

function cutClip(clip : LayerElement,clipCode:string) : string {
    if (hasClipProperties(clip)&&( isSubtitleClip(clip) || isPathVideo(clip) || isTextVideo(clip))) { 
        /*const begin = clip.properties.find(prop => prop.begin !== undefined)?.begin || 0;
        const end = clip.properties.find(prop => prop.end !== undefined)?.end || null;*/
        const begin = clip.properties.find(prop => prop.interval.begin !== undefined)?.interval.begin || '00:00:00';
        const end = clip.properties.find(prop => prop.interval.end !== undefined)?.interval.end || null;
        const convertedsBegin = convertToSeconds(begin);
        
        if (begin !== null && end !== null) {
            const convertedsEnd = convertToSeconds(end);
            clipCode += `.subclipped(${convertedsBegin}, ${convertedsEnd})`;
        } else if (begin !== null && end == null) {
            clipCode += `.subclipped(${convertedsBegin})`;
        } else if (end !== null) {
            const convertedsEnd = convertToSeconds(end);
            clipCode += `.subclipped(0, ${convertedsEnd})`;
        }
    }

    return clipCode;
}

/*function compileAudioEffects(effects: Array<Effect>, clipVar: string, fileNode: CompositeGeneratorNode,videoClipVar?:string):void{
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

}*/

function addSubtitleToClip(clip: SubtitleClip): string {
    const text = clip.TextProperties.find(prop => prop.text !== undefined)?.text || "Subtitle";
    const duration = clip.TextProperties.find(prop => prop.duration !== undefined)?.duration || '00:00:00';
    const start = clip.properties.find(prop => prop.interval.begin !== undefined)?.interval.begin || '00:00:00';
    const color = clip.TextProperties.find(prop => prop.color !== undefined)?.color || "black";
    const bg_color = clip.TextProperties.find(prop => prop.bg_color !== undefined)?.bg_color || null;
    const position = clip.TextProperties.find(prop => prop.position !== undefined)?.position || "bottom";
    
    const startimeinsecond = convertToSeconds(start);
    const durationinsecond = convertToSeconds(duration);
    if (bg_color === null) {
        return `TextClip(
            text="${text}",
            font="font/font.ttf",
            font_size=24,
            color='${color}'
        ).with_start(${startimeinsecond}).with_duration(${durationinsecond}).with_position('${position}')`;
    }
    return `TextClip(
        text="${text}",
        font="font/font.ttf",
        font_size=24,
        color='${color}',
        bg_color='${bg_color}'
    ).with_start(${startimeinsecond}).with_duration(${durationinsecond}).with_position('${position}')`;
}

function generateProgramBody(clipVar: string,clip:LayerElement, fileNode:CompositeGeneratorNode,videoClipVar?:string):void {
    const clipCode = compileClip(clip);
    fileNode.append(`${clipVar} = ${clipCode}`); 
    fileNode.appendNewLine();
   if(isVideoClip(clip)) clip.effects.forEach(effect => {
        compileEffect(effect,clipVar,fileNode);
    });
   //else if(isAudioClip(clip)) compileAudioEffects(clip.effects,clipVar,fileNode,videoClipVar);
}

/*function attachAudioToVideo(clipVar:string, videoVar:string,fileNode:CompositeGeneratorNode):void{
    fileNode.append(`${videoVar} = ${videoVar}.with_audio(${clipVar})`);
    fileNode.appendNewLine();

}*/

/*function compileLoopEffect(effect:LoopEffect,clipVar:string,fileNode: CompositeGeneratorNode, loopEffectName:string,videoClipVar?:string):void{
    if(( isLoopDurationEffects(effect) && effect.duration === undefined) || ( isLoopNumberEffects(effect) && effect.x_times === undefined)){
        fileNode.append(`${loopEffectName} = afx.AudioLoop(duration=${videoClipVar}.duration)`)
    }
    else {

    if(( isLoopNumberEffects(effect) && effect.x_times === undefined)){
        fileNode.append(`${loopEffectName} = afx.AudioLoop(n_loops=${effect.n_times})`)
    }
    if(( isLoopDurationEffects(effect) && effect.duration === undefined)){
            fileNode.append(`${loopEffectName} = afx.AudioLoop(duration=${effect.duration})`)

        }
    }
    fileNode.appendNewLine()
    // ne pas ajouter un audio  a une seconde d'un video si la seconde n'este pas ne pas ajouter une audio a un noomde variable qui n'existe pas
}*/

function compileFadeOutEffect(effect: FadeOutEffect, clipVar: string, fileNode: CompositeGeneratorNode): void {
    fileNode.append(`${clipVar} = ${clipVar}.with_effects([vfx.CrossFadeOut(${convertToSeconds(effect.duration)})])`);
    fileNode.appendNewLine();
}

function compileFadeInEffect(effect: FadeInEffect, clipVar: string, fileNode: CompositeGeneratorNode): void {
    fileNode.append(`${clipVar} = ${clipVar}.with_effects([vfx.CrossFadeIn(${convertToSeconds(effect.duration)})])`);
    fileNode.appendNewLine();
}

function createCustomClip( customClip: TextVideo): string {
    /*const text = customClip.text || "Intro Title";
    const duration = customClip.duration || 10;  
    const color = customClip.color || "white";
    const bgColor = customClip.bg_color || "black";
    const position = customClip.position || "center";
    const fontSize = customClip.fontSize || 48;
    const font = "Arial"*/

    const text = customClip.TextProperties.find(prop => prop.text !== undefined)?.text || "Intro Title";
    const duration = customClip.TextProperties.find(prop => prop.duration !== undefined)?.duration || '00:00:10';
    const color = customClip.TextProperties.find(prop => prop.color !== undefined)?.color || "white";
    const bgColor = customClip.TextProperties.find(prop => prop.bg_color !== undefined)?.bg_color || "black";
    const position = customClip.TextProperties.find(prop => prop.position !== undefined)?.position || "center";
    const fontSize = customClip.TextProperties.find(prop => prop.fontSize !== undefined)?.fontSize || 48;

    // Créer un TextClip avec un fond noir
    const introTitleClip = `TextClip(
            font="font/font.ttf",
            text="${text}",
            font_size=${fontSize},
            color='${color}',
            bg_color='${bgColor}'
        ) .with_duration(${duration}).with_position('${position}')`;

    // Ajouter ce clip d'introduction avant le clip existant
    return `${introTitleClip}`;
}
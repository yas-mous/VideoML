import { CompositeGeneratorNode, toString } from 'langium/generate';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';
import { TimeLine, Clip, Layer, isVideoClip, Effect, VideoClip, CropEffect, FreezingEffect, ZoomEffect, isCropEffect, isFreezingEffect, isZoomEffect,FadeOutEffect ,FadeInEffect , isFadeOutEffect , isFadeInEffect, isGrayscaleEffect, GrayscaleEffect, isSubtitleClip,SubtitleClip } from '../language/generated/ast.js';
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

    if (layers.length === 1) {
        fileNode.append(`final_video = ${layers[0]}`);
        fileNode.appendNewLine();
    } else {
        compileMultipleLayers(layers, fileNode);
    }

    fileNode.append(`final_video.write_videofile("${timeline.name}.mp4", fps=24)`);
    fileNode.appendNewLine();
}

function compileLayer(layer: Layer, layerIndex: number, fileNode: CompositeGeneratorNode): string {
    const clips: string[] = [];
    layer.clips.forEach((clip, clipIndex) => {
        const clipVar = clip.clipName;
        generateProgramBody(clipVar,clip,fileNode)
        
        if ( isVideoClip(clip) && clip.effects.length > 0) {
            if (layerIndex > 0 && hasClipProperties(clip)) {
                const after = clip.properties.find(prop => prop.after !== undefined)?.after;
                let position = clip.properties.find(prop => prop.position !== undefined)?.position;
                const width = clip.properties.find(prop => prop.width !== undefined)?.width;
                const height = clip.properties.find(prop => prop.height !== undefined)?.height;

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
                    fileNode.append(`${clipVar} = ${clipVar}.with_start(${after})`);
                    fileNode.appendNewLine();
                }
                
                if (position !== undefined) {
                    fileNode.append(`${clipVar} = ${clipVar}.with_position((${position}))`);
                    fileNode.appendNewLine();
                }

                if (width !== undefined) {
                    fileNode.append(`${clipVar} = ${clipVar}.resized(width=${width})`);
                    fileNode.appendNewLine();
                }

                if (height !== undefined) {
                    fileNode.append(`${clipVar} = ${clipVar}.resized(height=${height})`);
                    fileNode.appendNewLine();
                }
            }
        }

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

    fileNode.append(`], method="compose")`);
    fileNode.appendNewLine();
    
    fileNode.appendNewLine();
    return layerVar;
}

function compileClip(clip: Clip): string {
    //TOADD : different types of clips (video, audio ...)
    if (isVideoClip(clip)) {
        let clipCode = compileVideoClip(clip);
        clipCode = cutClip(clip, clipCode);
        return clipCode;
    }else if(isSubtitleClip(clip)){
        return addSubtitleToClip(clip);
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
    if(isGrayscaleEffect(effect)){
        compileGrayscaleEffect(effect,clipVar,fileNode)
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
    else if (isFadeOutEffect(effect)) {
        compileFadeOutEffect(effect, clipVar, fileNode);
    } else if (isFadeInEffect(effect)) {
        compileFadeInEffect(effect, clipVar, fileNode);
    }else{
        throw new Error("Unknown effect type"); 
    }
}

function compileCropEffect(effect: CropEffect, clipVar: string, fileNode: CompositeGeneratorNode): void {
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

function compileGrayscaleEffect(effect:GrayscaleEffect,clipVar:string,fileNode: CompositeGeneratorNode):void{
    const from = effect.intervall?.find(prop => prop.begin !== undefined)?.begin || null;
    const to = effect.intervall?.find(prop => prop.end !== undefined)?.end || null;

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

}

function cutClip(clip : Clip,clipCode:string) : string {
    if (hasClipProperties(clip) && isVideoClip(clip)) {
        const begin = clip.properties.find(prop => prop.begin !== undefined)?.begin || 0;
        const end = clip.properties.find(prop => prop.end !== undefined)?.end || null;


        if (begin !== null && end !== null) {
            clipCode += `.subclipped(${begin}, ${end})`;
        } else if (begin !== null && end == null) {
            clipCode += `.subclipped(${begin})`;
        } else if (end !== null) {
            clipCode += `.subclipped(0, ${end})`;
        }
    }

    return clipCode;
}



function addSubtitleToClip(clip: SubtitleClip): string {
    const text = clip.text;
    const start = clip.start;
    const duration = clip.duration;
    const color = clip.color || "none";
    const bg_color = clip.bg_color || "black";
    const position = clip.position || "bottom";


    return `TextClip(
        text="${text}",
        font="font/font.ttf",
        font_size=24,
        color='${color}',
        bg_color='${bg_color}'
    ).with_start(${start}).with_duration(${duration}).with_position('${position}')`;
}

function generateProgramBody(clipVar: string,clip:Clip, fileNode:CompositeGeneratorNode):void {
    const clipCode = compileClip(clip);
    fileNode.append(`${clipVar} = ${clipCode}`); 
    fileNode.appendNewLine();
    if (isVideoClip(clip)){
        clip.effects.forEach(effect => {
            compileEffect(effect,clipVar,fileNode);
        });
    }
    
}


function compileFadeOutEffect(effect: FadeOutEffect, clipVar: string, fileNode: CompositeGeneratorNode): void {
    fileNode.append(`${clipVar} = ${clipVar}.with_effects([vfx.CrossFadeOut(${effect.duration})])`);
    fileNode.appendNewLine();
}

function compileFadeInEffect(effect: FadeInEffect, clipVar: string, fileNode: CompositeGeneratorNode): void {
    fileNode.append(`${clipVar} = ${clipVar}.with_effects([vfx.CrossFadeIn(${effect.duration})])`);
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
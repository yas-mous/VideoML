import { CompositeGeneratorNode, toString } from 'langium/generate';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';
import { TimeLine, Clip, Subtitle } from '../language/generated/ast.js';

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
    fileNode.append("from moviepy.editor import *");
    fileNode.appendNewLine();


    const clips: string[] = [];
    timeline.layers.forEach((layer) => {
        layer.clips.forEach((clip) => {
            const clipCode = compileClip(clip);
            clips.push(clipCode);
        });
    });

    fileNode.appendNewLine();
    fileNode.append("final_video = concatenate_videoclips([");
    fileNode.appendNewLine();
    clips.forEach((clip) => {
        fileNode.append(`    ${clip},`);
        fileNode.appendNewLine();
    });
    fileNode.append("])");
    fileNode.appendNewLine();
    fileNode.append('final_video.write_videofile("output.mp4", fps=24)');
    fileNode.appendNewLine();
    /*timeline.layers.forEach((layer, layerIndex) => {
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
    fileNode.append('final_video.write_videofile("output.mp4", fps=24)');
    fileNode.appendNewLine();*/
}

/*function compileLayer(layer: Layer, layerIndex: number, fileNode: CompositeGeneratorNode): string {
    const clips: string[] = [];
    layer.clips.forEach((clip) => {
        const clipCode = compileClip(clip);
        clips.push(clipCode);
    });

    if (clips.length === 1) {
        return compileSingleClip(clips[0], fileNode);
    } else {
        return compileMultipleClip(clips, layerIndex, fileNode);
    }
}*/

function compileClip(clip: Clip): string {
    const source = clip.sourceFile;
    let begin = undefined;
    let end = undefined;
    let subtitleCode = undefined;

    clip.properties.forEach(prop => {
        if (prop.$type === 'ClipProperty') {
            if (prop.begin !== undefined) {
                begin = prop.begin;
            }
            if (prop.end !== undefined) {
                end = prop.end;
            }
            if (prop.subtitle !== undefined) {
                subtitleCode = compileSubtitle(prop.subtitle);
            }
        }
    });

    const clipCode = createClipCode(source, begin, end);
    if (subtitleCode) {
        return `CompositeVideoClip([${clipCode}, ${subtitleCode}])`;
    }
    return clipCode;

    /*if (begin && end) {
        return `VideoFileClip("${source}").subclip(${begin}, ${end})`;
    } else if (begin) {
        return `VideoFileClip("${source}").subclip(${begin})`;
    } else if (end) {
        return `VideoFileClip("${source}").subclip(0, ${end})`;
    } else {
        return `VideoFileClip("${source}")`;
    }*/
}

/*function compileSingleClip(clipCode: string, fileNode: CompositeGeneratorNode): string {
    fileNode.append(clipCode);
    fileNode.appendNewLine();
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
}*/

function compileSubtitle(subtitle: Subtitle): string {
    const text = subtitle.text;
    const start = subtitle.start;
    const duration = subtitle.duration;
    const color = subtitle.color || 'white';
    const position = subtitle.position || 'bottom';

    return `TextClip("${text}", fontsize=24, color='${color}')
        .set_position("${position}")
        .set_duration(${duration})
        .set_start(${start})`;
}

function createClipCode(source: string, begin: number | undefined, end: number | undefined): string {
    if (begin && end) {
        return `VideoFileClip("${source}").subclip(${begin}, ${end})`;
    } else if (begin) {
        return `VideoFileClip("${source}").subclip(${begin})`;
    } else if (end) {
        return `VideoFileClip("${source}").subclip(0, ${end})`;
    } else {
        return `VideoFileClip("${source}")`;
    }
}




//MINIMAL FUNCTIONS TO IMPLEMENT (commented because of compilation errors : empty functions)
/*
function compileVideoClip(){
    //TODO
}

function compileAudioClip(){
    //TODO
}

function compileText(){
    //TODO
}

function compileTransition(){
    //TODO
}

function compileEffect(){
    //TODO
}

function compileCropEffect(){
    //TODO
}

function compileFreezingEffect(){
    //TODO
}

function compileZoomEffect(){
    //TODO
}

function compileAdjustmentEffect(){
    //TODO
}*/
import { CompositeGeneratorNode, toString } from 'langium/generate';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';
import { TimeLine, Clip, Layer } from '../language/generated/ast.js';

export function generateJavaScript(timeline: TimeLine, filePath: string, destination: string | undefined): string {
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
    fileNode.append('final_video.write_videofile("output.mp4", fps=24)');
    fileNode.appendNewLine();
}

function compileLayer(layer: Layer, layerIndex: number, fileNode: CompositeGeneratorNode): string {
    const clips: string[] = [];
    layer.clips.forEach((clip) => {
        const clipCode = compileClip(clip);
        clips.push(clipCode);
    });

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
    const source = clip.sourceFile;
    return `VideoFileClip("${source}")`;
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
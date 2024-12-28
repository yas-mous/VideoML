import { CompositeGeneratorNode, toString } from 'langium/generate';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';
import { TimeLine } from '../language/generated/ast.js';

export function generateJavaScript(timeline: TimeLine, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.py`;

    const fileNode = new CompositeGeneratorNode();
    compileTimeline(timeline,fileNode)

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(fileNode));
    return generatedFilePath;
}

function compileTimeline(timeline: TimeLine, fileNode: CompositeGeneratorNode) {
    fileNode.append("from moviepy import *");
    fileNode.appendNewLine();
    fileNode.appendNewLine();


    const layers: string[] = [];

    timeline.layers.forEach((layer, layerIndex) => {
        const clips: string[] = [];

        layer.clips.forEach((clip) => {
            const source = clip.sourceFile;
            let clipCode = `VideoFileClip("${source}")`;
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



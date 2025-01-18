import { LayerElement,TimeLine,isVideoClip, isAudioClip, isTextVideo, isPathVideo } from "../language/generated/ast.js";
//const fs = require('fs');

export function hasClipProperties(clip: LayerElement): boolean {
    //return clip..length > 0;
    if ((isVideoClip(clip) && (isPathVideo(clip)) || isAudioClip(clip))) {
        return clip.properties.length > 0;
    }

    return false;
}

export function hasFrom(clip: LayerElement): boolean {
    if (isPathVideo(clip) || isAudioClip(clip)) {
        return clip.properties.some(prop => prop.interval.begin !== undefined);
    }
    return false;
}

export function hasEnd(clip: LayerElement): boolean {
    if(isPathVideo(clip) || isAudioClip(clip)) {
        return clip.properties.some(prop => prop.interval.begin !== undefined);
    }
    return false;
}

export function generateOutputFilePath(timeline: TimeLine): string {
    const extension = timeline.extension || 'mp4';  
    const outputPath = timeline.outputPath || './';  
    console.log(timeline);
    console.log(outputPath);
    const normalizedOutputPath = outputPath.endsWith('/') ? outputPath : `${outputPath}/`;
    console.log(normalizedOutputPath);
    let outputFilePath = `${normalizedOutputPath}${timeline.name}.${extension}`;
    console.log(outputFilePath);

    outputFilePath = outputFilePath.replace(/\\/g, '/');

    return outputFilePath;
}

export function convertToSeconds(time: string): number {
    const timeArray = time.split(':');
    return parseInt(timeArray[0]) * 60 * 60 + parseInt(timeArray[1])* 60 + parseInt(timeArray[2]);
}

export function isClipType(clip: LayerElement): boolean {
    return ((isVideoClip(clip) && (isPathVideo(clip)||isTextVideo(clip))) || isAudioClip(clip));
}

export function colorConvert(color: string): string {
    const hex = color.replace("#", "");

    const fullHex = hex.length === 3
        ? hex.split("").map(char => char + char).join("")
        : hex;

    const r = parseInt(fullHex.substring(0, 2), 16);
    const g = parseInt(fullHex.substring(2, 4), 16);
    const b = parseInt(fullHex.substring(4, 6), 16);

    return `(${r}, ${g}, ${b})`;
}

// export function getMediaDuration(filePath: string): Promise<number> {
//     return new Promise((resolve, reject) => {
//         let path = "../../../demo/generated/"+filePath;


//         // Encapsuler le chemin avec des guillemets pour gérer les espaces dans les chemins
//         const command = `ffmpeg -i "${path}" 2>&1`;

//         exec(command, (error, stdout, stderr) => {
//             if (error) {
//                 reject(`Error getting media duration for file: ${path}. ${stderr}, ${error}, ${stdout}`);
//                 return;
//             }

//             // Chercher la durée dans la sortie de ffmpeg
//             const regex = /Duration: (\d+):(\d+):(\d+\.\d+)/;
//             const match = stdout.match(regex);

//             if (match) {
//                 const hours = parseInt(match[1], 10);
//                 const minutes = parseInt(match[2], 10);
//                 const seconds = parseFloat(match[3]);
//                 const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
//                 resolve(totalSeconds);
//             } else {
//                 reject(`Unable to extract duration from the file: ${path}`);
//             }
//         });
//     });
// }
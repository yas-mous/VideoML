import type { TimeLine } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { VideoMLLanguageMetaData } from '../language/generated/module.js';
import { createVideoMlServices } from '../language/video-ml-module.js';
import { extractAstNode } from './cli-util.js';
import { generatepython } from './generator.js';
import { NodeFileSystem } from 'langium/node';
import * as url from 'node:url';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const packagePath = path.resolve(__dirname, '..', '..', 'package.json');
const packageContent = await fs.readFile(packagePath, 'utf-8');

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createVideoMlServices(NodeFileSystem).VideoMl;
    const model = await extractAstNode<TimeLine>(fileName, services);
    const generatedFilePath = generatepython(model, fileName, opts.destination);
    console.log(chalk.green(`Python code generated successfully: ${generatedFilePath}`));
};

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program.version(JSON.parse(packageContent).version);

    const fileExtensions = VideoMLLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates Python code for creating, editing videos with a dsl')
        .action(generateAction);

    program.parse(process.argv);
}

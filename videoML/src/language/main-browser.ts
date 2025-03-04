import { DocumentState, EmptyFileSystem } from 'langium';
import { startLanguageServer } from 'langium/lsp';
import { BrowserMessageReader, BrowserMessageWriter, createConnection, Diagnostic, NotificationType } from 'vscode-languageserver/browser.js';
import { createVideoMlServices } from './video-ml-module.js';
import { generatePythonProgram } from '../cli/generator.js';
import { TimeLine } from './generated/ast.js';

declare const self: DedicatedWorkerGlobalScope;

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

const { shared,VideoMl } = createVideoMlServices({ connection, ...EmptyFileSystem });

startLanguageServer(shared);

type DocumentChange = { uri: string, content: string, diagnostics: Diagnostic[] };
const documentChangeNotification = new NotificationType<DocumentChange>('browser/DocumentChange');

const jsonSerializer = VideoMl.serializer.JsonSerializer;
shared.workspace.DocumentBuilder.onBuildPhase(DocumentState.Validated, documents => {

    for (const document of documents) {
        const timeline = document.parseResult.value as TimeLine;
       
        let pythonCode: string = "";
       
        if(document.diagnostics === undefined  || document.diagnostics.filter((i) => i.severity === 1).length === 0) {
            pythonCode = generatePythonProgram(timeline);
            (timeline as unknown as {$isValid: boolean}).$isValid = true;
        } else {

            (timeline as unknown as {$isValid: boolean}).$isValid = false;
        }

        (timeline as unknown as {$pythonCode: string}).$pythonCode = pythonCode;
        
        
        connection.sendNotification(documentChangeNotification, {
            uri: document.uri.toString(),
            content: jsonSerializer.serialize(timeline, { sourceText: true, textRegions: true }),
            diagnostics: document.diagnostics ?? [],
        });
    }
});
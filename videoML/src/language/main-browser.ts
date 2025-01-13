import { DocumentState, EmptyFileSystem } from 'langium';
import { startLanguageServer } from 'langium/lsp';
import { BrowserMessageReader, BrowserMessageWriter, createConnection, Diagnostic, NotificationType } from 'vscode-languageserver/browser.js';
import { createVideoMlServices } from './video-ml-module.js';

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
        const model = document.parseResult.value as TimeLine;
        const serializedAst = jsonSerializer.serialize(model, {
            sourceText: true, 
            textRegions: true, 
        });
       

        connection.sendNotification(documentChangeNotification, {
            uri: document.uri.toString(),
            content: serializedAst,
            diagnostics: document.diagnostics ?? []
        });
    }
});
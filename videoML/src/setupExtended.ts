import { MonacoEditorLanguageClientWrapper, UserConfig } from 'monaco-editor-wrapper';
import { configureWorker, defineUserServices } from './setupCommon.js';

export const setupConfigExtended = (): UserConfig => {
    const extensionFilesOrContents = new Map();
    extensionFilesOrContents.set('/language-configuration.json', new URL('../language-configuration.json', import.meta.url));
    extensionFilesOrContents.set('/video-ml-grammar.json', new URL('../syntaxes/video-ml.tmLanguage.json', import.meta.url));

    return {
        wrapperConfig: {
            serviceConfig: defineUserServices(),
            editorAppConfig: {
                $type: 'extended',
                languageId: 'video-ml',
                code: 
`timeline myVideo {
    ---@Layer1
    |Video @V1 'video2.mp4' 
        ~freeze 2+3
    |Audio @Audio1 'video1.mp4' 
}`,
                useDiffEditor: false,
                extensions: [{
                    config: {
                        name: 'video-ml-web',
                        publisher: 'generator-langium',
                        version: '1.0.0',
                        engines: {
                            vscode: '*'
                        },
                        contributes: {
                            languages: [{
                                id: 'video-ml',
                                extensions: [
                                    '.video-ml'
                                ],
                                configuration: './language-configuration.json'
                            }],
                            grammars: [{
                                language: 'video-ml',
                                scopeName: 'source.video-ml',
                                path: './video-ml-grammar.json'
                            }]
                        }
                    },
                    filesOrContents: extensionFilesOrContents,
                }],                
                userConfiguration: {
                    json: JSON.stringify({
                        'workbench.colorTheme': 'Default Dark Modern',
                        'editor.semanticHighlighting.enabled': true
                    })
                }
            }
        },
        languageClientConfig: configureWorker()
    };
};

export const executeExtended = async (htmlElement: HTMLElement) => {
    const userConfig = setupConfigExtended();
    const wrapper = new MonacoEditorLanguageClientWrapper();
    await wrapper.initAndStart(userConfig, htmlElement);
};

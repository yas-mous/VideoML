import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type {VideoMlAstType, TimeLine, LayerElement} from './generated/ast.js';
import {isAudioClip, isPathVideo ,isSubtitleClip, isIntervalFrom, isIntervalDuration, VideoClip,isVideoEffect, Intervall,SubtitleClip , Layer,ClipProperty, isTextVideo
        ,isVideoClip
} from './generated/ast.js';
//import type {VideoMlAstType, TimeLine,LayerElement, VideoClip,SubtitleClip, ClipProperty, Layer} from './generated/ast.js';
//import {isAudioClip, isVideoClip, isVideoEffect, isSubtitleClip } from './generated/ast.js';
import type { VideoMlServices } from './video-ml-module.js';
import { convertToSeconds,hasEnd, hasFrom } from '../cli/utils.js';



/**
 * Register custom validation checks.
 */

export function registerValidationChecks(services: VideoMlServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.VideoMlValidator;
    const checks: ValidationChecks<VideoMlAstType> = {
        TimeLine: [
            validator.checkRequiredArgument,
            validator.checkValidVideoExtension,
            validator.checkUniqueNames,
            validator.validateSubtitleTiming,
            validator.validateStackingVideos
        ],
        LayerElement:validator.checkClipProperties,
        VideoClip: validator.checkVideoClipEffects,
        SubtitleClip: validator.validateSubtitleClip,
        ClipProperty: validator.validateClipProperty,
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class VideoMlValidator {
    
    private supportedExtensions: string[] = ['mp4', 'avi', 'mkv', 'mov', 'flv', 'webm'];
    private timepattern = new RegExp('([0-9]{2}):([0-9]{2}):([0-9]{2})');


    checkRequiredArgument(timeline: TimeLine, accept: ValidationAcceptor): void {
        
        if(!timeline.name) {
            accept('error', 'Video name is missing.', { node: timeline, property: 'name' });
        }
    
    }

    checkValidVideoExtension(timeline: TimeLine, accept: ValidationAcceptor): void {
        const extension = timeline.extension || 'mp4';  // Utilise 'mp4' par défaut si pas spécifié

        if (!this.supportedExtensions.includes(extension)) {
            const validExtensionsList = this.supportedExtensions.map(ext => `- ${ext}`).join('\n');
    
            accept('error', `Invalid video extension: ${extension}.\nSupported extensions are:\n${validExtensionsList}`, { node: timeline, property: 'extension' });
        }
    }

    checkUniqueNames(timeline: TimeLine, accept: ValidationAcceptor): void {
        const globalNameSet = new Set<string>();
        timeline.layers.forEach(layer =>{
            if (globalNameSet.has(layer.layerName)) {
                accept('error', `Duplicate layer name: ${layer.layerName}`, { node: layer, property: 'layerName' });
            }
            globalNameSet.add(layer.layerName);
            layer.elements.forEach(element =>{
                if(globalNameSet.has(element.clipName)){
                    accept('error', `Duplicate element name: ${element.clipName}`, { node: element, property: 'clipName' });
                }
                globalNameSet.add(element.clipName);
            }) 
        })
    }

    async checkClipProperties(clip: LayerElement, accept: ValidationAcceptor): Promise<void> {
        if ((isPathVideo(clip)||isAudioClip(clip) || isSubtitleClip(clip) ) && clip.properties && Array.isArray(clip.properties)) {
            let beginValue: string | undefined = undefined;
            let endValue: string | undefined = undefined;
            let positionValue: string | undefined = undefined;
            let duration: string | undefined = undefined;
            
            if (isIntervalFrom(clip.properties)) {
    
                clip.properties.forEach(prop => {
                    if (prop.interval.begin !== undefined) {
                        beginValue = prop.interval.begin;  
                    }
                    if (prop.interval.end !== undefined) {
                        endValue = prop.interval.end; 
                    }
                    if (prop.positionInTimeline !== undefined) {
                        positionValue = prop.positionInTimeline;
                    }
                });
            }else if (isIntervalDuration(clip.properties)) {
                if (clip.properties.begin !== undefined) {
                    beginValue = clip.properties.begin;
                }

                if (clip.properties.duration !== undefined) {
                    duration = clip.properties.duration;
                }
            }

            if (positionValue !== undefined) {
                if (!this.timepattern.test(positionValue)) {
                    accept('error', `Clip property 'positionInTimeline':${positionValue} must be in the format HH:MM:SS.`, { node: clip, property: 'properties' });
                }
            }
    
            if (beginValue !== undefined && endValue !== undefined) {
                if (convertToSeconds(beginValue) >= convertToSeconds(endValue)) {
                    accept('error', `Clip property 'from':${beginValue} must be less than 'to':${endValue}.`, { node: clip, property: 'properties' });
                }
                
                /*if (convertToSeconds(beginValue) < 0 || ( (isAudioClip(clip)||isPathVideo(clip) )  && (await getMediaDuration((clip.sourceFile))) < convertToSeconds(endValue))) {
                    accept('error', `Clip property 'from' and 'to' must be non-negative integers.`, { node: clip, property: 'properties' });
                }*/
                if (!this.timepattern.test(beginValue) || !this.timepattern.test(endValue)) {
                    accept('error', `Clip property 'from' and 'to' must be in the format HH:MM:SS.`, { node: clip, property: 'properties' });
                }
            }

            if (duration !== undefined) {
                if (!this.timepattern.test(duration)) {
                    accept('error', `Clip property 'duration':${duration} must be in the format HH:MM:SS.`, { node: clip, property: 'properties' });
                }
            }
            

        }
    }

    checkVideoClipEffects(clip: VideoClip, accept: ValidationAcceptor): void {
        if ( (isPathVideo(clip)) && clip.effects && Array.isArray(clip.effects)) {
            const endProperty = clip.properties.find(prop => prop.interval.end !== undefined);
            const beginProperty = clip.properties.find(prop => prop.interval.begin !== undefined);
            if (hasFrom(clip) && hasEnd(clip)) {
                const videoDuration = this.getVideoDuration(beginProperty, endProperty);

                clip.effects.forEach(effect => {
                    if (isVideoEffect(effect) && videoDuration !== undefined) {
                        if ('intervall' in effect && Array.isArray(effect.intervall)) {
                            effect.intervall.forEach(interval => {
                                const { begin, end } = this.extractIntervalValues(interval);

                                if (begin !== undefined && (begin < 0 || begin > videoDuration)) {
                                    accept('error', `Effect 'from':${begin} is out of bounds (0 to ${videoDuration}).`, { node: effect, property: 'intervall' });
                                }

                                if (end !== undefined && (end < 0 || end > videoDuration)) {
                                    accept('error', `Effect 'to':${end} is out of bounds (0 to ${videoDuration}).`, { node: effect, property: 'intervall' });
                                }

                                if (begin !== undefined && end !== undefined && begin >= end) {
                                    accept('error', `Effect interval 'from':${begin} must be less than 'to':${end}.`, { node: effect, property: 'intervall' });
                                }
                            });
                        }
                    }
                });
            }

            else if (hasEnd(clip) && !hasFrom(clip)) {
                console.log('hasEnd && !hasFrom');
                const videoDuration = endProperty?.interval.end !== undefined && beginProperty?.interval.begin !== undefined ? convertToSeconds(endProperty.interval.end) - convertToSeconds(beginProperty.interval.begin) : undefined;

                clip.effects.forEach(effect => {
                    if (isVideoEffect(effect) ) {
                        console.log('videoDuration',videoDuration);
                        if ('intervall' in effect && Array.isArray(effect.intervall)) {
                            effect.intervall.forEach(interval => {
                                const { begin, end } = this.extractIntervalValues(interval);
                                console.log('begin',begin);
                                console.log('end',end);
                                if (begin === undefined && end !== undefined) {
                                    if (end < 0 || (endProperty?.interval.end !== undefined && end > convertToSeconds(endProperty.interval.end))) {
                                        if (endProperty?.interval.end !== undefined) {
                                            accept('error', `Effect 'to':${end} is out of bounds (0 to ${endProperty.interval.end}).`, { node: effect, property: 'intervall' });
                                        }
                                    }
                                }

                                else if (end !== undefined && endProperty?.interval.end !== undefined && (end < 0 || end > convertToSeconds(endProperty.interval.end))) {
                                    accept('error', `Effect 'to':${end} is out of bounds (0 to ${ endProperty.interval.end}).`, { node: effect, property: 'intervall' });
                                }

                                else if (begin !== undefined && end !== undefined && begin >= end) {
                                    accept('error', `Effect interval 'from':${begin} must be less than 'to':${end}.`, { node: effect, property: 'intervall' });
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    getVideoDuration(beginProperty: any, endProperty: any): number | undefined {
        return endProperty?.end !== undefined && beginProperty?.begin !== undefined
            ? endProperty.end - beginProperty.begin
            : undefined;
    }

    extractIntervalValues(interval: Intervall): { begin: number | undefined, end: number | undefined } {
        let begin: number | undefined = undefined;
        let end: number | undefined = undefined;

        if (interval.begin !== undefined) {
            begin = convertToSeconds(interval.begin);
        }
        if ( isIntervalFrom(interval) && interval.end !== undefined) {
            end = convertToSeconds(interval.end);
        }else if (isIntervalDuration(interval) && interval.duration !== undefined) {
            end = begin !== undefined ? begin + convertToSeconds(interval.duration) : undefined;
        }

        return { begin, end };
    }


    validateSubtitleClip(subtitle: SubtitleClip, accept: ValidationAcceptor): void {
        const TextPositions: string[] = ['top-left','top-right','bottom-left','bottom-right', 'center', 'top', 'bottom', 'left', 'right']
        const text = subtitle.TextProperties.find(prop => prop.text !== undefined)?.text;
        const start = subtitle.properties.find(prop => prop.interval.begin !== undefined)?.interval.begin;
        const duration = subtitle.TextProperties.find(prop => prop.duration !== undefined)?.duration;
        const position = subtitle.TextProperties.find(prop => prop.position !== undefined)?.position;

        if (!text || text.trim() === '') {
            accept('error', 'Subtitle text is missing.', { node: subtitle});
        }
        if (start === undefined || convertToSeconds(start) < 0) {
            accept('error', 'Subtitle start time must be a non-negative integer.', { node: subtitle });
        }
        if ( duration === undefined || convertToSeconds(duration) <= 0) {
            accept('error', 'Subtitle duration must be a positive integer.', { node: subtitle });
        }
        if (position && !TextPositions.includes(position)) {
            accept('error', `Invalid subtitle position: ${position}.`, { node: subtitle });
        }
        
    }


    validateIntervalProperty(interval: Intervall, accept: ValidationAcceptor): void {
        if (isIntervalDuration(interval)) {
        
            if (interval.duration !== undefined && convertToSeconds(interval.duration) <= 0) {
                accept('error', 'Interval property "duration" must be a positive integer.', { node: interval, property: 'duration' });
            }
            if (interval.duration !== undefined && !this.timepattern.test(interval.duration)) {
                accept('error', 'Interval property "duration" must be in the format HH:MM:SS.', { node: interval, property: 'duration' });
            }
            if  (interval.begin !== undefined && convertToSeconds(interval.begin) >= 0) {
                accept('error', 'Interval property "from" must be a negative integer.', { node: interval, property: 'begin' });
            }
            if (interval.begin !== undefined && !this.timepattern.test(interval.begin)) {
                accept('error', 'Interval property "from" must be in the format HH:MM:SS.', { node: interval, property: 'begin' });
            }
        }

        if (isIntervalFrom(interval)) {
            if (interval.begin !== undefined && convertToSeconds(interval.begin) < 0) {
                accept('error', 'Interval property "from" must be a non-negative integer.', { node: interval, property: 'begin' });
            }
            if (interval.end !== undefined && convertToSeconds(interval.end) < 0) {
                accept('error', 'Interval property "to" must be a non-negative integer.', { node: interval, property: 'end' });
            }
            if (interval.begin !== undefined && !this.timepattern.test(interval.begin)) {
                accept('error', 'Interval property "from" must be in the format HH:MM:SS.', { node: interval, property: 'begin' });
            }
            if (interval.end !== undefined && !this.timepattern.test(interval.end)) {
                accept('error', 'Interval property "to" must be in the format HH:MM:SS.', { node: interval, property: 'end' });
            }
        }
    }
        


    validateClipProperty(property: ClipProperty, accept: ValidationAcceptor): void {
        if (property.positionInTimeline !== undefined && (!Number.isInteger(property.positionInTimeline) || convertToSeconds(property.positionInTimeline )< 0)) {
            accept('error', 'Clip property "start" must be a non-negative integer.', { node: property, property: 'positionInTimeline' });
        }
    }


    validateSubtitleTiming(timeline: TimeLine, accept: ValidationAcceptor): void {
        const allLayers: Layer[] = timeline.layers;
        allLayers.forEach(layer => {
            if (!layer.layerName.startsWith('subtitles')) {
                return;
            }
            // Récupérer tous les clips sous-titres dans ce layer
            const subtitleClips = layer.elements.filter(isSubtitleClip);
            // Récupérer les layers contenant des vidéos
            const videoLayers = allLayers.filter(l => l.layerName.startsWith('layer') && l !== layer);
            if (videoLayers.length === 0) {
                subtitleClips.forEach(subtitle => {
                    accept(
                        'error',
                        `Subtitle layer "${layer.layerName}" has no corresponding video layers to overlay.`,
                        { node: subtitle }
                    );
                });
                return;
            }
            // Calculer les plages horaires cumulées des vidéos dans chaque layer vidéo
            const videoDurations = videoLayers.map(videoLayer => {
                return videoLayer.elements
                    .filter(isPathVideo || isTextVideo)
                    .reduce((totalDuration, video) => {
                        if (!video.properties) return totalDuration;
                        let start = 0;
                        let end = 0;
                        video.properties.forEach(prop => {
                            if (prop.interval.begin !== undefined) start += convertToSeconds(prop.interval.begin) || 0;
                            if (prop.interval.end !== undefined) end += convertToSeconds(prop.interval.end) || 0;
                        });
                        return totalDuration + Math.max(0, end - start);
                    }, 0);
            });
            // Valider chaque sous-titre
            subtitleClips.forEach(subtitle => {
                const subtitleStart = subtitle.properties.find(prop => prop.interval.begin !== undefined)?.interval.begin;
                const subtileDuration = subtitle.TextProperties.find(prop => prop.duration !== undefined)?.duration;
                if (subtitleStart === undefined || subtileDuration === undefined) {
                    accept('error', 'Subtitle timing is missing.', { node: subtitle });
                    return;
                }
                const subtitleEnd = convertToSeconds(subtitleStart) + convertToSeconds(subtileDuration);
                const isWithinAnyVideoLayer = videoDurations.some(videoDuration => {
                    return convertToSeconds(subtitleStart) >= 0 && subtitleEnd <= videoDuration;
                });
                if (!isWithinAnyVideoLayer) {
                    accept(
                        'error',
                        `Subtitle timing (${convertToSeconds(subtitleStart)}-${subtitleEnd}) does not match the duration of any video layer.`,
                        { node: subtitle }
                    );
                }
            });
        });
    }
    /*validateStackingVideos(timeline: TimeLine, accept: ValidationAcceptor): void {
        const layers = timeline.layers;
        layers.forEach((layer, index) => {
            layer.elements.forEach((element) => {
                if (isPathVideo(element)) {
                    if (element.properties) {
                        const baseLayer = layers.find((l, i) => i !== index && l.elements.some(e => isPathVideo(e) && !e.position));

                        if (baseLayer) {
                            const baseVideo = baseLayer.elements.find(e => isPathVideo(e));
                            if (baseVideo) {
                                const 
                                const baseVideoBegin = baseVideo.properties.find(p => p.interval.begin) || 0;
                                if ()
                                const baseVideoEnd = baseVideo.properties.find(p => p.interval.end);
                                let baseVideoDuration;
                                if (baseVideoEnd !== undefined) {
                                    baseVideoDuration = baseVideoEnd - baseVideoBegin;
                                }else{
                                    baseVideoDuration = Infinity;
                                }

                                const afterTime = element.properties.find(e => e.after)?.after || 0;
                                const elementEnd = element.properties.find(e => e.end)?.end || Infinity;
                                const ElementStart = element.properties.find(e => e.begin)?.begin || 0;
                                const elementDuration = elementEnd - ElementStart;

                                if ( baseVideoDuration!=Infinity && baseVideoDuration!=Infinity   && baseVideoDuration <= elementDuration + afterTime) {
                                    accept('error', `Base layer duration is too short ${baseVideoDuration} to accommodate the video with position starting after ${afterTime} with duration ${elementDuration}.`, {
                                        node: element
                                    });
                                }
                            }
                        } else {
                            accept('error', 'No base video layer found for a video with position.', {
                                node: element
                            });
                        }
                    }
                }
            });
        });
    }*/
}
import type { ValidationAcceptor, ValidationChecks } from 'langium';
//import Clip
import type {VideoMlAstType, TimeLine,LayerElement, VideoClip,SubtitleClip, ClipProperty, Layer   } from './generated/ast.js';
import {isAudioClip, isVideoClip, isVideoEffect, isSubtitleClip } from './generated/ast.js';
import type { VideoMlServices } from './video-ml-module.js';
import { hasEnd, hasFrom } from '../cli/utils.js';


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
            })
        })
    }

    checkClipProperties(clip: LayerElement, accept: ValidationAcceptor): void {
        if ((isVideoClip(clip)||isAudioClip(clip)) && clip.properties && Array.isArray(clip.properties)) {
            let beginValue: number | undefined = undefined;
            let endValue: number | undefined = undefined;
    
            clip.properties.forEach(prop => {
                if (prop.begin !== undefined) {
                    beginValue = prop.begin;  
                }
                if (prop.end !== undefined) {
                    endValue = prop.end; 
                }
            });
    
            if (beginValue !== undefined && endValue !== undefined) {
                if (beginValue >= endValue) {
                    accept('error', `Clip property 'from':${beginValue} must be less than 'to':${endValue}.`, { node: clip, property: 'properties' });
                }
            } 
        } 
    }

    checkVideoClipEffects(clip: VideoClip, accept: ValidationAcceptor): void {
        if (isVideoClip(clip) && clip.effects && Array.isArray(clip.effects)) {
            const endProperty = clip.properties.find(prop => prop.end !== undefined);
            const beginProperty = clip.properties.find(prop => prop.begin !== undefined);

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
                const videoDuration = endProperty?.end !== undefined && beginProperty?.begin !== undefined ? endProperty.end - beginProperty.begin : undefined;

                clip.effects.forEach(effect => {
                    if (isVideoEffect(effect) ) {
                        console.log('videoDuration',videoDuration);
                        if ('intervall' in effect && Array.isArray(effect.intervall)) {
                            effect.intervall.forEach(interval => {
                                const { begin, end } = this.extractIntervalValues(interval);
                                console.log('begin',begin);
                                console.log('end',end);
                                if (begin === undefined && end !== undefined) {
                                    if (end < 0 || (endProperty?.end !== undefined && end > endProperty.end)) {
                                        if (endProperty?.end !== undefined) {
                                            accept('error', `Effect 'to':${end} is out of bounds (0 to ${endProperty.end}).`, { node: effect, property: 'intervall' });
                                        }
                                    }
                                }

                                else if (end !== undefined && endProperty?.end !== undefined && (end < 0 || end > endProperty.end)) {
                                    accept('error', `Effect 'to':${end} is out of bounds (0 to ${ endProperty.end}).`, { node: effect, property: 'intervall' });
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

    extractIntervalValues(interval: any): { begin: number | undefined, end: number | undefined } {
        let begin: number | undefined = undefined;
        let end: number | undefined = undefined;

        if (interval.begin !== undefined) {
            begin = interval.begin;
        }
        if (interval.end !== undefined) {
            end = interval.end;
        }

        return { begin, end };
    }


    validateSubtitleClip(subtitle: SubtitleClip, accept: ValidationAcceptor): void {
        if (!subtitle.text || subtitle.text.trim() === '') {
            accept('error', 'Subtitle text is missing.', { node: subtitle, property: 'text' });
        }
        if (subtitle.start === undefined || subtitle.start < 0) {
            accept('error', 'Subtitle start time must be a non-negative integer.', { node: subtitle, property: 'start' });
        }
        if (subtitle.duration === undefined || subtitle.duration <= 0) {
            accept('error', 'Subtitle duration must be a positive integer.', { node: subtitle, property: 'duration' });
        }
    }


    validateClipProperty(property: ClipProperty, accept: ValidationAcceptor): void {
        if (property.begin !== undefined && (!Number.isInteger(property.begin) || property.begin < 0)) {
            accept('error', 'Clip property "from" must be a non-negative integer.', { node: property, property: 'begin' });
        }
        if (property.end !== undefined && (!Number.isInteger(property.end) || property.end < 0)) {
            accept('error', 'Clip property "to" must be a non-negative integer.', { node: property, property: 'end' });
        }
        if (property.positionInTimeline !== undefined && (!Number.isInteger(property.positionInTimeline) || property.positionInTimeline < 0)) {
            accept('error', 'Clip property "start" must be a non-negative integer.', { node: property, property: 'positionInTimeline' });
        }
        if (property.after !== undefined && (!Number.isInteger(property.after) || property.after < 0)) {
            accept('error', 'Clip property "after" must be a non-negative integer.', { node: property, property: 'after' });
        }
        if (property.position && property.position.trim() === '') {
            accept('error', 'Clip property "position" must be a non-empty string.', { node: property, property: 'position' });
        }
        if (property.width !== undefined && (!Number.isInteger(property.width) || property.width <= 0)) {
            accept('error', 'Clip property "width" must be a positive integer.', { node: property, property: 'width' });
        }
        if (property.height !== undefined && (!Number.isInteger(property.height) || property.height <= 0)) {
            accept('error', 'Clip property "height" must be a positive integer.', { node: property, property: 'height' });
        }
    }
    validateSubtitleTiming(timeline: TimeLine, accept: ValidationAcceptor): void {
        const allLayers: Layer[] = timeline.layers;
        allLayers.forEach(layer => {
            if (!layer.layerName.startsWith('subtitles')) {
                return; // Ne valide que les layers de sous-titres
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
                        { node: subtitle, property: 'start' }
                    );
                });
                return;
            }
            // Calculer les plages horaires cumulées des vidéos dans chaque layer vidéo
            const videoDurations = videoLayers.map(videoLayer => {
                return videoLayer.elements
                    .filter(isVideoClip)
                    .reduce((totalDuration, video) => {
                        if (!video.properties) return totalDuration;
                        let start = 0;
                        let end = 0;
                        video.properties.forEach(prop => {
                            if (prop.begin !== undefined) start += prop.begin;
                            if (prop.end !== undefined) end += prop.end;
                        });
                        return totalDuration + Math.max(0, end - start);
                    }, 0);
            });
            // Valider chaque sous-titre
            subtitleClips.forEach(subtitle => {
                const subtitleEnd = subtitle.start + subtitle.duration;
                // Vérifier si le sous-titre peut être aligné avec au moins un layer vidéo
                const isWithinAnyVideoLayer = videoDurations.some(videoDuration => {
                    return subtitle.start >= 0 && subtitleEnd <= videoDuration;
                });
                if (!isWithinAnyVideoLayer) {
                    accept(
                        'error',
                        `Subtitle timing (${subtitle.start}-${subtitleEnd}) does not match the duration of any video layer.`,
                        { node: subtitle, property: 'start' }
                    );
                }
            });
        });
    }
    validateStackingVideos(timeline: TimeLine, accept: ValidationAcceptor): void {
        const layers = timeline.layers;
        layers.forEach((layer, index) => {
            layer.elements.forEach((element) => {
                if (isVideoClip(element)) {
                    if (element.properties.some(p => p.position)) {
                        const baseLayer = layers.find((l, i) => i !== index && l.elements.some(e => isVideoClip(e) && !e.properties.some(p => p.position)));

                        if (baseLayer) {
                            const baseVideo = baseLayer.elements.find(e => isVideoClip(e) && !e.properties.some(p => p.position));
                            if (isVideoClip(baseVideo)) {
                                const baseVideoBegin = baseVideo.properties.find(p => p.begin)?.begin || 0;
                                const baseVideoEnd = baseVideo.properties.find(p => p.end)?.end;
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

                                if ( baseVideoDuration <= elementDuration + afterTime) {
                                    accept('error', `Base layer duration is too short to accommodate the video with position starting after ${afterTime}.`, {
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
    }
}
import type { ValidationAcceptor, ValidationChecks } from 'langium';
//import Clip
import type {VideoMlAstType, TimeLine,LayerElement,SubtitleClip, ClipProperty, Layer } from './generated/ast.js';
import {isVideoClip, isSubtitleClip } from './generated/ast.js';
import type { VideoMlServices } from './video-ml-module.js';



/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: VideoMlServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.VideoMlValidator;
    const checks: ValidationChecks<VideoMlAstType> = {
        TimeLine: [validator.checkRequiredArgument, validator.validateSubtitleTiming, validator.validateStackingVideos],
        LayerElement:validator.checkClipProperties,
        SubtitleClip: validator.validateSubtitleClip,
        ClipProperty: validator.validateClipProperty,
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class VideoMlValidator {

    checkRequiredArgument(timeline: TimeLine, accept: ValidationAcceptor): void {
        
        if(!timeline.name) {
            accept('error', 'Video name is missing.', { node: timeline, property: 'name' });
        }
    }

    checkClipProperties(clip: LayerElement, accept: ValidationAcceptor): void {

        //console.log('Processing Clip:', clip);
        //console.log('Clip properties:', clip.properties);

        if ( isVideoClip(clip) && clip.properties && Array.isArray(clip.properties)) {
            clip.properties.forEach(prop => {
                //console.log("Checking ClipProperty:", prop.begin, prop.end);
    
                if (prop.begin !== undefined) {
                    if (!Number.isInteger(prop.begin)) {
                        console.log('Invalid begin value:', prop.begin);
                        accept('error', 'Clip property "from" must be an integer.', { node: prop, property: 'begin' });
                    }
                }
    
                if (prop.end !== undefined) {
                    if (!Number.isInteger(prop.end)) {
                        console.log('Invalid end value:', prop.end);    
                        accept('error', 'Clip property "to" must be an integer.', { node: prop, property: 'end' });
                    }
                }
            });
        } else {
            console.log('No ClipProperties found in the clip.');
        }
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

        /*if (subtitle.color && !/^#[0-9A-Fa-f]{6}$/.test(subtitle.color)) {
            accept('error', 'Subtitle color must be a valid hex color code (e.g., #FFFFFF).', { node: subtitle, property: 'color' });
        }

        if (subtitle.bg_color && !/^#[0-9A-Fa-f]{6}$/.test(subtitle.bg_color)) {
            accept('error', 'Subtitle background color must be a valid hex color code (e.g., #FFFFFF).', { node: subtitle, property: 'bg_color' });
        }*/
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
        // Extraire les layers depuis le TimeLine
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
                        // Trouver la vidéo sans position dans les autres éléments de la timeline
                        const baseLayer = layers.find((l, i) => i !== index && l.elements.some(e => isVideoClip(e) && !e.properties.some(p => p.position)));
                        
                        if (baseLayer) {
                            // Calculer la durée de la vidéo de base (sans position)
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
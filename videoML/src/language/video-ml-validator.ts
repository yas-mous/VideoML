import type { ValidationAcceptor, ValidationChecks } from 'langium';
//import Clip
import type {VideoMlAstType, TimeLine,LayerElement, VideoClip } from './generated/ast.js';
import {isAudioClip, isVideoClip, isVideoEffect } from './generated/ast.js';
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
            //validator.checkRequiredArgument,
            validator.checkUniqueNames,
        ],
        LayerElement:validator.checkClipProperties,
        VideoClip: validator.checkVideoClipEffects,
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class VideoMlValidator {

    checkRequiredArgument(timeline: TimeLine, accept: ValidationAcceptor): void {
        
        if(!timeline.outputPath) {
            accept('error', 'Video outputPath is missing.', { node: timeline, property: 'outputPath' });
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
        
        
}

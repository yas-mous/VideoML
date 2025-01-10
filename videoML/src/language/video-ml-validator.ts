import type { ValidationAcceptor, ValidationChecks } from 'langium';
//import Clip
import type {VideoMlAstType, TimeLine,LayerElement, ClipProperty, Intervall } from './generated/ast.js';
import {isAudioClip, isVideoClip } from './generated/ast.js';
import type { VideoMlServices } from './video-ml-module.js';


/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: VideoMlServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.VideoMlValidator;
    const checks: ValidationChecks<VideoMlAstType> = {
        TimeLine: [
            validator.checkRequiredArgument,
            validator.checkUniqueNames,
        ],
        LayerElement:validator.checkClipProperties,
        ClipProperty:validator.checkFromTo,
        Intervall:validator.checkInterval
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


    checkFromTo(clipProp:ClipProperty, accept: ValidationAcceptor): void {
        console.log('Checking ClipProperty:', clipProp.begin, clipProp.end);
        if(clipProp.begin !== undefined && clipProp.end !== undefined && clipProp.begin >= clipProp.end){
            console.log('Error: Clip property from:', clipProp.begin, 'must be less than to:', clipProp.end);
            accept('error', `Clip property from : ${clipProp.begin} must be less than to ${clipProp.end}.`, { node: clipProp, property: 'begin' });
        }
    }

    checkInterval(interval:Intervall, accept: ValidationAcceptor): void {
        console.log('Checking Interval:', interval.begin, interval.end);
        if(interval.begin !== undefined && interval.end !== undefined && interval.begin >= interval.end){
            console.log('Error: Interval from:', interval.begin, 'must be less than to:', interval.end);
            accept('error', `Interval from : ${interval.begin} must be less than to ${interval.end}.`, { node: interval, property: 'begin' });
        }
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
        
}

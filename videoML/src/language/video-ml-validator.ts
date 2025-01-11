import type { ValidationAcceptor, ValidationChecks } from 'langium';
//import Clip
import type {VideoMlAstType, TimeLine,LayerElement } from './generated/ast.js';
import {isVideoClip } from './generated/ast.js';
import type { VideoMlServices } from './video-ml-module.js';


/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: VideoMlServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.VideoMlValidator;
    const checks: ValidationChecks<VideoMlAstType> = {
        TimeLine: validator.checkRequiredArgument,
        LayerElement:validator.checkClipProperties,
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
    
    
    
        
}

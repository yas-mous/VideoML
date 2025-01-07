import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { VideoMlAstType, TimeLine } from './generated/ast.js';
import type { VideoMlServices } from './video-ml-module.js';


/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: VideoMlServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.VideoMlValidator;
    const checks: ValidationChecks<VideoMlAstType> = {
        TimeLine: validator.checkRequiredArgument,
        //Subtitle: validator.checkSubtitle,
        //Clip:validator.checkClipProperties,
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



    /*checkSubtitle(subtitle: Subtitle, accept: ValidationAcceptor): void {
        // Check that text is a string and not empty
        if (typeof subtitle.text !== 'string' || subtitle.text.trim() === "") {
            accept('error', 'Subtitle text must be a non-empty string.', { node: subtitle, property: 'text' });
        }

        // Check that start and duration are positive integers
        if (!Number.isInteger(subtitle.start) || subtitle.start < 0) {
            accept('error', 'Subtitle start time must be a non-negative integer.', { node: subtitle, property: 'start' });
        }

        if (!Number.isInteger(subtitle.duration) || subtitle.duration <= 0) {
            accept('error', 'Subtitle duration must be a positive integer.', { node: subtitle, property: 'duration' });
        }

        // Check for optional properties like color, bg_color, and position
        if (subtitle.color && typeof subtitle.color !== 'string') {
            accept('warning', 'Subtitle color must be a string.', { node: subtitle, property: 'color' });
        }

        if (subtitle.bg_color && typeof subtitle.bg_color !== 'string') {
            accept('warning', 'Subtitle background color must be a string.', { node: subtitle, property: 'bg_color' });
        }

        if (subtitle.position && !['top', 'center', 'bottom'].includes(subtitle.position)) {
            accept('warning', 'Subtitle position must be one of "top", "center", or "bottom".', { node: subtitle, property: 'position' });
        }
    }*/


    /*checkClipProperties(clip: VideoClip, accept: ValidationAcceptor): void {
        //console.log('Processing Clip:', clip);  
        //console.log('Clip properties:', clip.properties);

        if (clip.properties && Array.isArray(clip.properties)) {
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
    }*/
    
    
    
        
}

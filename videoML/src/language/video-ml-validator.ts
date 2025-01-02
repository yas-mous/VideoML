import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { VideoMlAstType, Subtitle } from './generated/ast.js';
import type { VideoMlServices } from './video-ml-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: VideoMlServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.VideoMlValidator;
    const checks: ValidationChecks<VideoMlAstType> = {
        //Person: validator.checkPersonStartsWithCapital
        'Subtitle': validator.checkSubtitle
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class VideoMlValidator {

    /*checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }*/



        checkSubtitle(subtitle: Subtitle, accept: ValidationAcceptor): void {
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
        }
}

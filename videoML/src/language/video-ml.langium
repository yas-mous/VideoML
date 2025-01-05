grammar VideoML

entry TimeLine:
    'timeline' name=ID '{' NL
        layers+=Layer*
    '}';

Layer:
    '---'NL
    clips+=Clip*;

Clip:
    VideoClip | AudioClip;

ClipProperty:
    'from'begin=INT |
    'to'end=INT ;

VideoClip:
    '|Video' sourceFile=STRING (',' properties+=ClipProperty)* ('~' effects+=Effect)* NL;

AudioClip:
    '|Audio' sourceFile=STRING (',' properties+=ClipProperty)* ('~' effects+=Effect)* NL;

Effect:
    AudioEffect | VideoEffect;

VideoEffect:
    CropEffect | FreezingEffect | ZoomEffect | AdjustmentEffect;
AudioEffect:
    VolumeEffect | LoopEffect;

CropEffect:
    'crop'  x=INT ',' y=INT ',' width=INT ',' height=INT ;

FreezingEffect:
    'freeze' begin=INT '->' frameSeconds=INT;

ZoomEffect:
    'zoom'  x=INT ',' y=INT ',' width=INT ',' height=INT ;

AdjustmentEffect:
    'adjust' ('brightness:' brightness=FLOAT)? (',' 'saturation:' saturation=FLOAT)? ;
VolumeEffect:
    'volume' '(' 'x' volume=INT (properties+=ClipProperty)* ')';
LoopEffect:
    'loop' ( 'x'n_times=INT | duration=INT 's' )?;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal NL: /\r?\n/;
terminal DOUBLE returns number: INT '.' INT;
terminal FLOAT returns number: /[0-9]+(\.[0-9]+)?/;
terminal STRING: /'(\\.|[^'\\])*'|'(\\.|[^'\\])*'/;
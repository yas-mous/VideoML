grammar VideoML

entry TimeLine:
    'timeline' name=ID ('&' extension=ID)? ('output' outputPath=STRING)? '{' NL
        layers+=Layer+
    '}';
    
Layer:
    '---''@' layerName=ID NL
    elements+=LayerElement+  ;

LayerElement:
    VideoClip | AudioClip | SubtitleClip;

ClipProperty:
    ( 'start:' positionInTimeline= PositionInTimeline )?
    (interval = IntervalFrom)?;

PositionInTimeline:
    time=STRING
        (',' ('after:' after='@' clipName=ID | 'before:' before='@' clipName=ID ) )?;

SubtitleClip:
    '|Subtitle' '@' clipName=ID '{' NL
     (TextProperties+=TextProperties)
    '}' ( properties+=ClipProperty)? NL;

VideoClip:
    PathVideo | TextVideo;


TextVideo:
    '|TextVideo' '@' clipName=ID '{' NL
     (TextProperties+=TextProperties)
        '}' ( 'size:' size=INT ',' 'position:' position=STRING)? (',' properties+=ClipProperty)? (('~' effects+=VideoEffect)*)? NL;

PathVideo:
    '|Video' '@' clipName=ID sourceFile=STRING
        (',' 'size:' size=INT ','
        'position:' position=STRING)?
        (properties+=ClipProperty)?
    ( ('~' effects+=VideoEffect)*)? NL;

TextProperties:
    'text:' text=STRING ','
    'duration:' duration= STRING
    (',' 'color:' color=COLOR)?
    (',' 'bg_color:' bg_color=COLOR)?
    (',' 'position:' position=STRING)?
    (',' 'font_size:' fontSize=INT)? NL;


AudioClip:
    '|Audio' '@' clipName=ID sourceFile=STRING (properties+=ClipProperty)? (('~' effects+=AudioEffect)?)* NL;


VideoEffect:
    FreezingEffect  | GrayscaleEffect | FadeInEffect | FadeOutEffect ;

AudioEffect:
    VolumeEffect | LoopEffect;

FreezingEffect:
    'freeze' (intervall=Intervall);

GrayscaleEffect:
    'grayscale' ( intervall=Intervall);

FadeInEffect:
    'fadein' ('duration:' duration=STRING);

FadeOutEffect:
    'fadeout' ('duration:' duration=STRING);

Intervall:
    IntervalFrom |  IntervalDuration;


IntervalFrom:
    (',' 'from:' begin=STRING)? (',' 'to:' end=STRING)?;

IntervalDuration:
    ',' 'from:'begin=STRING
    ',' 'duration:'duration=STRING;

VolumeEffect:
    'volume' '(' 'x' volume=INT (intervall=Intervall)? ')';

LoopEffect:
    LoopDurationEffects | LoopNumberEffects ;

LoopDurationEffects:
    'loop' duration= STRING;

LoopNumberEffects:
    'loop' x_times=INT;


hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal NL: /\r?\n/;
//terminal DOUBLE returns number: INT '.' INT;
//terminal FLOAT returns number: /[0-9]+(\.[0-9]+)?/;
//terminal EXTENSION: 'mp4' | 'avi' | 'mkv' | 'mov' | 'flv' | 'webm';
terminal STRING: /'(\\.|[^'\\])*'|'(\\.|[^'\\])*'/;
terminal COLOR: /#[0-9a-fA-F]{6}/;
terminal Time : /[0-9]{2}:[0-9]{2}:[0-9]{2}/;
//terminal PATH: /([a-zA-Z]:[\\/]|[\\/])?[a-zA-Z0-9\-_\\\/. ]+/;
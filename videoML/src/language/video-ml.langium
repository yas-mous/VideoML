grammar VideoML

entry TimeLine:
    'timeline' name=ID ('&' extension=ID)? ('output' outputPath=STRING)? '{' NL
        layers+=Layer*
    '}';
    
Layer:
    '---''@' layerName=ID NL
    elements+=LayerElement*;

LayerElement:
    VideoClip | AudiosClip| AudioClip | SubtitleClip | CustomClip;

ClipProperty:
    'from'begin=INT |
    'to'end=INT |
    'start' positionInTimeline=INT |
    'after' after=INT |
    'position:' position=Position |
    'width:' width=INT |
    'height:' height=INT;

SubtitleClip:
    '|Subtitle' '@' clipName=ID '{' NL
        'text:' text=STRING ',' NL
        'start:' start=INT ','
        'duration:' duration=INT
        (',' 'color:' color= Color)?
        (',' 'position:' position= PositionText)?
        (',' 'bg_color:' bg_color= Color)? NL
    '}'NL;

VideoClip:
    '|Video' '@' clipName=ID sourceFile=STRING (',' properties+=ClipProperty)* ('~' effects+=Effect)* NL;

AudiosClip:
     '@' clipName=ID ( audios+=AudioClip)* NL;

    
AudioClip:
    '|Audios' '@' clipName=ID sourceFile=STRING (',' properties+=ClipProperty)* ('~' effects+=Effect)*;

CustomClip:
    '|CustomClip' '@' clipName=ID '{' NL
        'text:' text=STRING ',' 
        'duration:' duration=INT
        (',' 'color:' color=STRING)?
        (',' 'bg_color:' bg_color=STRING)?
        (',' 'position:' position=STRING)?
        (',' 'font_size:' fontSize=INT)?
    '}'NL;

Effect:
    AudioEffect | VideoEffect;

VideoEffect:
    CropEffect | FreezingEffect | ZoomEffect | GrayscaleEffect | FadeInEffect | FadeOutEffect ;

AudioEffect:
    VolumeEffect | LoopEffect;

CropEffect:
    'crop'  ('x' x=INT ',' 'y' y=INT ',' | 'x_center' x_center=INT ',' 'y_center' y_center=INT ) 'width' width=INT ',' 'height' height=INT (',' intervall+=Intervall)*;

FreezingEffect:
    'freeze' begin=INT '+' frameSeconds=INT;

ZoomEffect:
    'zoom'  resizeFactor=STRING (',' intervall+=Intervall)*;

GrayscaleEffect:
    'grayscale' (',' intervall+=Intervall)*;

FadeInEffect:
    'fadein' ('duration:' duration= Time);

FadeOutEffect:
    'fadeout' ('duration:' duration=INT);

Intervall:
    'from'begin=INT |
    'to'end=INT ;

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
terminal EXTENSION: 'mp4' | 'avi' | 'mkv' | 'mov' | 'flv' | 'webm';
terminal STRING: /'(\\.|[^'\\])*'|'(\\.|[^'\\])*'/;
terminal Position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
terminal Color: /#[0-9a-fA-F]{6}/;
terminal PositionText : 'top' | 'bottom' | 'center';
terminal Time: (INT 'h')* (INT 'm')* (INT 's') ; 
//terminal PATH: /([a-zA-Z]:[\\/]|[\\/])?[a-zA-Z0-9\-_\\\/. ]+/;

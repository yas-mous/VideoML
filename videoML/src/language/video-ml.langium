grammar VideoML

entry TimeLine:
    'timeline' name=ID ('&' extension=ID)? ('output' outputPath=STRING)? '{' NL
        layers+=Layer*
    '}';
    
Layer:
    '---''@' layerName=ID NL
    elements+=LayerElement*;

LayerElement:
    VideoClip | AudioClip | SubtitleClip | CustomClip;

ClipProperty:
    'from'begin=INT |
    'to'end=INT |
    'start' positionInTimeline=INT |
    'after' after=INT |
    'position:' position=STRING |
    'width:' width=INT |
    'height:' height=INT;

SubtitleClip:
    '|Subtitle' '@' clipName=ID '{' NL
        'text:' text=STRING ',' NL
        'start:' start=INT ','
        'duration:' duration=INT
        (',' 'color:' color=STRING)?
        (',' 'position:' position=STRING)?
        (',' 'bg_color:' bg_color=STRING)? NL
    '}'NL;

VideoClip:
    '|Video' '@' clipName=ID sourceFile=STRING (',' properties+=ClipProperty)* ('~' effects+=Effect)* NL;

AudioClip:
    '|Audio' '@' clipName=ID sourceFile=STRING (',' properties+=ClipProperty)* ('~' effects+=Effect)* NL;

AddAudioToVideo:
    '@' videoName=ID 'with_audio' '@' audioName=ID;

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
    'fadein' ('duration:' duration=INT);

FadeOutEffect:
    'fadeout' ('duration:' duration=INT);

Intervall:
    'from'begin=INT |
    'to'end=INT ;

VolumeEffect:
    'volume' '(' 'x' volume=INT (properties+=Intervall)* ')';

LoopEffect:
    'loop' ( 'x'n_times=INT | duration=INT 's' )?;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal NL: /\r?\n/;
terminal DOUBLE returns number: INT '.' INT;
terminal FLOAT returns number: /[0-9]+(\.[0-9]+)?/;
//terminal EXTENSION: 'mp4' | 'avi' | 'mkv' | 'mov' | 'flv' | 'webm';
terminal STRING: /'(\\.|[^'\\])*'|'(\\.|[^'\\])*'/;
//terminal PATH: /([a-zA-Z]:[\\/]|[\\/])?[a-zA-Z0-9\-_\\\/. ]+/;

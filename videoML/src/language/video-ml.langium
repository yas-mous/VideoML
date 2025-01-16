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
    'start' positionInTimeline= Time ','
    interval = IntervalFrom;
    


SubtitleClip:
    '|Subtitle' '@' clipName=ID '{' NL
        TextProperties+=TextProperties 
        (',' properties+=ClipProperty)*
    '}'NL;

VideoClip:
    PathVideo | TextVideo;
     

TextVideo:
    '|TextVideo' '@' clipName=ID '{' NL
        'size:' size=INT ',' 'position:' position=STRING 
        TextProperties+=TextProperties 
        (',' properties+=ClipProperty)* NL
        '}' ('~' effects+=VideoEffect)*NL;

PathVideo:
    '|Video' '@' clipName=ID sourceFile=STRING
        ('size' size=INT ','
        'position' position=STRING)
        ((',' properties+=ClipProperty)*)?
    ( ('~' effects+=VideoEffect)*)?;

TextProperties:
    'text:' text=STRING ',' 
    'duration:' duration= Time
    (',' 'color:' color=STRING)?
    (',' 'bg_color:' bg_color=STRING)?
    (',' 'position:' position=STRING)?
    (',' 'font_size:' fontSize=INT)? NL;

/*AudiosClip:
     '@' clipName=ID ( audios+=AudioClip)* NL;*/


AudioClip:
    '|Audios' '@' clipName=ID sourceFile=STRING (',' properties+=ClipProperty)* ('~' effects+=AudioEffect)*;

CustomClip:
    '|CustomClip' '@' clipName=ID '{' NL
        'text:' text=STRING ',' 
        'duration:' duration=Time
        (',' 'color:' color=STRING)?
        (',' 'bg_color:' bg_color=STRING)?
        (',' 'position:' position=STRING)?
        (',' 'font_size:' fontSize=INT)?
    '}'NL;

/*Effect:
    AudioEffect | VideoEffect;*/

VideoEffect:
    FreezingEffect  | GrayscaleEffect | FadeInEffect | FadeOutEffect ;

AudioEffect:
    VolumeEffect | LoopEffect;

/*CropEffect:
    'crop'  ('x' x=INT ',' 'y' y=INT ',' | 'x_center' x_center=INT ',' 'y_center' y_center=INT ) 'width' width=INT ',' 'height' height=INT (',' intervall+=Intervall)*;*/

/*CropEffect:
    CropProperties;

CropProperties:
    UniqueProperties | DoubleProperties | QuadrupleProperties;

UniqueProperties:
    'crop'  ('x' x=INT ',' 'y' y=INT ',' | 'x_center' x_center=INT ',' 'y_center' y_center=INT ) 'width' width=INT ',' 'height' height=INT (',' intervall+=Intervall)*;*/

FreezingEffect:
    'freeze' (',' intervall+=Intervall)*;

GrayscaleEffect:
    'grayscale' (',' intervall+=Intervall)*;

FadeInEffect:
    'fadein' ('duration:' duration=Time);

FadeOutEffect:
    'fadeout' ('duration:' duration=Time);

Intervall:
    IntervalFrom |  IntervalDuration;
    /*'from'begin=INT |
    'to'end=INT ;*/

IntervalFrom:
    'from'begin=Time| 
    'to'end=Time;

IntervalDuration:
    'from'begin=Time |
    'duration'duration=Time;

VolumeEffect:
    'volume' '(' 'x' volume=INT')';

LoopEffect:
    LoopDurationEffects | LoopNumberEffects ;

LoopDurationEffects:
    'loop' duration= Time;

LoopNumberEffects:
    'loop' x_times=INT;

/*LoopEffect:
    'loop' ( 'x'n_times=INT | duration=INT 's' )?;*/

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal NL: /\r?\n/;
terminal DOUBLE returns number: INT '.' INT;
terminal FLOAT returns number: /[0-9]+(\.[0-9]+)?/;
//terminal EXTENSION: 'mp4' | 'avi' | 'mkv' | 'mov' | 'flv' | 'webm';
terminal STRING: /'(\\.|[^'\\])*'|'(\\.|[^'\\])*'/;
terminal COLOR: /#[0-9a-fA-F]{6}/;
terminal Time : /[0-9]{2}:[0-9]{2}:[0-9]{2}/;
//terminal PATH: /([a-zA-Z]:[\\/]|[\\/])?[a-zA-Z0-9\-_\\\/. ]+/;

grammar VideoML

entry TimeLine:
    'timeline' name=ID '{' NL
        layers+=Layer*
    '}';

Layer:
    '---'NL 
    clips+=Clip*;

Clip:
    VideoClip ;

ClipProperty:
    'from'begin=INT |
    'to'end=INT |
    'subtitle:' subtitle=Subtitle;


Subtitle:
    '{'
        'text:' text=STRING ',' 
        'start:' start=INT ',' 
        'duration:' duration=INT 
        (',' 'color:' color=STRING)? 
        (',' 'position:' position=STRING)?
        (',' 'bg_color:' bg_color=STRING)?
    '}';

VideoClip:
    '|Video' sourceFile=STRING (',' properties+=ClipProperty)* ('~' effects+=Effect)* NL;

Effect:
    CropEffect | FreezingEffect | ZoomEffect | AdjustmentEffect;

CropEffect:
    'crop'  x=INT ',' y=INT ',' width=INT ',' height=INT ;

FreezingEffect:
    'freeze' begin=INT '->' frameSeconds=INT;

ZoomEffect:
    'zoom'  x=INT ',' y=INT ',' width=INT ',' height=INT ;

AdjustmentEffect:
    'adjust' ('brightness:' brightness=FLOAT)? (',' 'saturation:' saturation=FLOAT)? ;


hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal NL: /\r?\n/;
terminal FLOAT returns number: /[0-9]+(\.[0-9]+)?/;
terminal STRING: /'(\\.|[^'\\])*'|'(\\.|[^'\\])*'/;
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
    'to'end=INT ;

VideoClip:
    '|Video' sourceFile=STRING (',' properties+=ClipProperty)* ('~' effects+=Effect)* NL;

Effect:
    CropEffect | FreezingEffect | ZoomEffect | AdjustmentEffect;

CropEffect:
    'crop'  ('x' x=INT ',' 'y' y=INT ',' | 'x_center' x_center=INT ',' 'y_center' y_center=INT ) 'width' width=INT ',' 'height' height=INT (',' intervall+=Intervall)*;

FreezingEffect:
    'freeze' begin=INT '+' frameSeconds=INT;

ZoomEffect:
    'zoom'  x=INT ',' y=INT ',' width=INT ',' height=INT ;

AdjustmentEffect:
    'adjust' ('brightness:' brightness=FLOAT)? (',' 'saturation:' saturation=FLOAT)? ;

Intervall:
    'from'begin=INT |
    'to'end=INT ;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal NL: /\r?\n/;
terminal FLOAT returns number: /[0-9]+(\.[0-9]+)?/;
terminal STRING: /'(\\.|[^'\\])*'|'(\\.|[^'\\])*'/;
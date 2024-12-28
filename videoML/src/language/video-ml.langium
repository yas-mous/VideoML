grammar VideoML

entry TimeLine:
    'timeline' name=ID '{' NL
        layers+=Layer*
    '}';

Layer:
    '---'NL 
    clips+=Clip*;

Clip:
    sourceFile=STRING (',' properties+=ClipProperty)* NL;

ClipProperty:
    begin= 'begin:' FLOAT |
    end= 'end:' FLOAT |
    backgroundColor=STRING ;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal NL: /\r?\n/;
terminal FLOAT returns number: /[0-9]+(\.[0-9]+)?/;
terminal STRING: /'(\\.|[^'\\])*'|'(\\.|[^'\\])*'/;
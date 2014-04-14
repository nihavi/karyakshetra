Akruti = new (function() {
    /* Globals */
    
    var allSvg = new Object(),
    
    svgId = 1,
    
    currentSvg = null,
    
    initialized = false,
    
    zoomState = 'auto',

    allAA = {
        s:{
        },
        l:{
            'x1':'x1',
            'y1':'y1',
            'x2':'x2',
            'y2':'y2',
            'sc':'stroke',
            'sw':'stroke-width',
            //'sd': 'stroke-dasharray',
            //'so':'stroke-opacity',
        },
        sA:{
            'x':'x',
            'y':'y',
            'h':'height',
            'w':'width'
        },
        e:{
            'cx':'cx',
            'cy':'cy',
            'rx':'rx',
            'ry':'ry',
            'sc':'stroke',
            'sw':'stroke-width',
            'f' :'fill',
            //'sd': 'stroke-dasharray',
            //'so':'stroke-opacity',
            //'fo':'fill-opacity',
        },
        r:{
            'x': 'x',
            'y': 'y',
            'rx': 'rx',
            'ry': 'ry',
            'h': 'height',
            'w': 'width',
            'f': 'fill',
            'sc': 'stroke',
            'sw': 'stroke-width',
            'sd' : 'stroke-dasharray',
            //'so':'stroke-opacity',
            //'fo':'fill-opacity',
        }
    };
    
    var Svg = function(arg, parent, editable) {

        /* Creating DOM element */
        this.element = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg');

        /* Setting ID */
        this.pid = parent.id;
        this.id = 's'+svgId++;
        this.element.setAttribute( 'id', this.id );

        /* Setting class  and type*/
        this.t = (editable)?'eS':'vS'; //eS -> Editable Svg | vS -> Viewer Svg
        this.element.classList.add( this.t ); //eS -> Editable Svg | vS -> Viewer Svg
        
        /* Provided Attributes | They will be applied only if they are in svgAA */
        var j;
        for (j in allAA['s']) {
            if (j in arg) {
                this.element.setAttribute(allAA['s'][j],arg[j]);
                this[j] = arg[j];
            }
        }
        
        /* Default Attributes | They will be same everytime */
        this.element.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg');
        //this.element.setAttributeNS( 'http://www.w3.org/2000/svg','xlink','http://www.w3.org/1999/xlink');

        /* Creating master group */
        this.g = document.createElementNS( 'http://www.w3.org/2000/svg', 'g');
        this.g.setAttribute('id', this.id + 'g');
        this.element.appendChild(this.g);


        /* Making page background */
        {
            var alphaSize = 15;
            var colorDark = '#ccc';
            var colorLight = '#fff';
            var defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
            var pattern = document.createElementNS('http://www.w3.org/2000/svg','pattern');
            pattern.setAttribute('id','alpha');
            pattern.setAttribute('x',0);
            pattern.setAttribute('y',0);
            pattern.setAttribute('width',alphaSize*2);
            pattern.setAttribute('height',alphaSize*2);
            pattern.setAttribute('patternUnits','userSpaceOnUse');
            pattern.setAttribute('patternContentUnits','userSpaceOnUse');
            var rects;
            pattern.rects = rects = new Array();
            for (var i=0; i<4 ; i++) {
                rects[i] = document.createElementNS('http://www.w3.org/2000/svg','rect');
                rects[i].setAttribute('height',alphaSize);
                rects[i].setAttribute('width',alphaSize);
                pattern.appendChild(rects[i]);
            }
            rects[0].setAttribute('x', 0);
            rects[0].setAttribute('y', 0);
            rects[0].setAttribute('fill', colorDark);

            rects[1].setAttribute('x', alphaSize);
            rects[1].setAttribute('y', 0);
            rects[1].setAttribute('fill', colorLight);

            rects[2].setAttribute('x', 0);
            rects[2].setAttribute('y', alphaSize);
            rects[2].setAttribute('fill', colorLight);

            rects[3].setAttribute('x', alphaSize);
            rects[3].setAttribute('y', alphaSize);
            rects[3].setAttribute('fill', colorDark);

            defs.appendChild(pattern);
            this.element.appendChild(defs);
        }

        /* Making page */
        {
            this.page = document.createElementNS('http://www.w3.org/2000/svg','rect');
            this.page.setAttribute('id', this.id+'p');
            this.page.setAttribute('x', 0);
            this.page.setAttribute('y', 0);
            this.page.setAttribute('stroke', '#aaa');
            this.page.setAttribute('stroke-width', '1');
            this.page.setAttribute('fill', 'white');
            this.g.appendChild(this.page);
        }

        /* Getting page height width */
        this.pageH = arg.h;
        this.pageW = arg.w;
        this.page.setAttribute('width', this.pageW);
        this.page.setAttribute('height', this.pageH);

        /* Default required svg Height Width | svgH and svgW can't be less than this */
        this.reqH = this.pageH;
        this.reqW = this.pageW;

        /* Calculating dimensions of svg */
        var parentDimension = parent.getBoundingClientRect();
        var h = parentDimension.height;
        var w = parentDimension.width;

        this.svgH = Math.max(h, this.reqH);
        this.svgW = Math.max(w, this.reqW);
        this.element.setAttribute('height',this.svgH);
        this.element.setAttribute('width', this.svgW);
        
        this.element.setAttribute( 'viewBox', '0 0 '+this.svgW+' '+this.svgH);
        this.zoomFactor = 1;
        this.g.setAttribute('transform','translate('+(this.svgW-this.pageW)/2+','+(this.svgH-this.pageH)/2+')');

        /* Setting ondrag to false */
        this.element.ondragstart = function(e){return false;};

        /* appending my Object in DOM object and adding DOM element to its parent*/
        $(this.element).data('myObject',this);
        parent.appendChild(this.element);

        /* Setting Editable properties */
        if (editable) {
            editor.makeEditable(this.element);
        }

        /* For Children of Svg */
        this.childrenId = 1;
        this.children = new Array();
        return this;
    };
    
    var svgResize = function(zoom){
        var parentDimension = this.element.parentNode.getBoundingClientRect();
        var h = parentDimension.height;
        var w = parentDimension.width;
        this.svgH = Math.max(h, (this.zoomFactor*this.reqH));
        this.svgW = Math.max(w, (this.zoomFactor*this.reqW));
        this.element.setAttribute('height',this.svgH);
        this.element.setAttribute('width', this.svgW);

        if(!zoom){
            var viewBoxW = Math.max(this.reqW, w/this.zoomFactor);
            var viewBoxH = Math.max(this.reqH, h/this.zoomFactor);
            this.element.setAttribute( 'viewBox', '0 0 '+viewBoxW+' '+viewBoxH);
        }
        this.g.setAttribute('transform','translate('+(this.svgW-this.zoomFactor*this.pageW)/2+','+(this.svgH-this.zoomFactor*this.pageH)/2+')');
    };

    Svg.prototype.resize = svgResize;

    this.resize = function () {
        var i;
        for(var i in allSvg) {
            if (zoomState == 'fit') {
                var off = allSvg['s1'].element.parentNode.getBoundingClientRect();
                var rx = (off.right - off.left)/allSvg['s1'].reqW;
                var ry = (off.bottom - off.top)/allSvg['s1'].reqH;
                allSvg[i].zoomFactor = Math.min(rx,ry);
            }
            allSvg[i].resize();
        }
    };

    var svgZoom = function(ratio) {

        var parentDimension = this.element.parentNode.getBoundingClientRect();
        var h = parentDimension.height;
        var w = parentDimension.width;

        this.zoomFactor = ratio;
        var viewBoxW = Math.max(this.reqW, w/this.zoomFactor);
        var viewBoxH = Math.max(this.reqH, h/this.zoomFactor);

        this.element.setAttribute('viewBox', '0 0 '+viewBoxW+' '+viewBoxH);

        this.svgH = Math.max(h, (this.zoomFactor*(this.reqH)));
        this.svgW = Math.max(w, (this.zoomFactor*(this.reqW)));
        
        this.element.setAttribute('height', this.svgH);
        this.element.setAttribute('width', this.svgW);
        this.resize(true);
        this.g.setAttribute('transform','translate('+(this.svgW-this.zoomFactor*this.pageW)/2+','+(this.svgH-this.zoomFactor*this.pageH)/2+')');
    };

    Svg.prototype.zoom = svgZoom;

    this.zoom = function(value) {
        
        if (value == 'fit') {
            zoomState = 'fit';
            for (var i in allSvg) {
                var off = allSvg[i].element.parentNode.getBoundingClientRect();
                var rx = (off.right - off.left)/allSvg[i].reqW;
                var ry = (off.bottom - off.top)/allSvg[i].reqH;
                allSvg[i].zoom(Math.min(rx,ry));
            }
        }
        else {
            zoomState = 'auto'
            for (var i in allSvg) {
                allSvg[i].zoom(parseInt(value));
            }
        }
    };

    var changeAttributes = function(arg, pastAlso) {
        var opObject = new Object();
        opObject.newState = this.getOp('ch',[]);
        if (pastAlso) {
            opObject.pastState = Object.create(opObject.newState);
        }
        var j;
        var ele = (this.element)?this.element:document.getElementById(this.id);
        for(j in arg) {
            if (j in allAA[this.t]) {
                if (pastAlso) {
                    opObject.pastState[j] = this[j];
                }
                ele.setAttribute(allAA[this.t][j],arg[j]);
                opObject.newState[j] = this[j] = arg[j];
            }
        }
        
        {
            if (this.pseudo) {
                if (this.sw > 7) {
                    $(this.pseudo).remove();
                    delete this.pseudo;
                }
                else {
                    switch (this.t) {
                        case 'l':
                            this.pseudo.setAttribute('x1',this.x1);
                            this.pseudo.setAttribute('y1',this.y1);
                            this.pseudo.setAttribute('x2',this.x2);
                            this.pseudo.setAttribute('y2',this.y2);
                            break;
                        case 'e':
                            this.pseudo.setAttribute('cx',this.cx);
                            this.pseudo.setAttribute('cy',this.cy);
                            this.pseudo.setAttribute('rx',this.rx);
                            this.pseudo.setAttribute('ry',this.ry);
                            break;
                        case 'r':
                            this.pseudo.setAttribute('x',this.x-3);
                            this.pseudo.setAttribute('y',this.y-3);
                            this.pseudo.setAttribute('h',this.h);
                            this.pseudo.setAttribute('w',this.w);
                            break;
                    }
                }
            }
            else {
                if (this.sw < 7) {
                    switch (this.t) {
                        case 'l':
                            this.pseudo = document.createElementNS('http://www.w3.org/2000/svg','line');
                            this.pseudo.setAttribute('stroke','transparent');
                            this.pseudo.setAttribute('stroke-width',7);
                            this.pseudo.setAttribute('x1',this.x1);
                            this.pseudo.setAttribute('y1',this.y1);
                            this.pseudo.setAttribute('x2',this.x2);
                            this.pseudo.setAttribute('y2',this.y2);
                            this.g.appendChild(this.pseudo);
                            break;
                        case 'e':
                            this.pseudo = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
                            this.pseudo.setAttribute('stroke','transparent');
                            this.pseudo.setAttribute('fill','none');
                            this.pseudo.setAttribute('stroke-width',7);
                            this.pseudo.setAttribute('cx',this.cx);
                            this.pseudo.setAttribute('cy',this.cy);
                            this.pseudo.setAttribute('rx',this.rx);
                            this.pseudo.setAttribute('ry',this.ry);
                            this.g.appendChild(this.pseudo);
                            break;
                        case 'r':
                            this.pseudo = document.createElementNS('http://www.w3.org/2000/svg','rect');
                            this.pseudo.setAttribute('stroke','transparent');
                            this.pseudo.setAttribute('fill','none');
                            this.pseudo.setAttribute('stroke-width',7);
                            this.pseudo.setAttribute('x',this.x-3);
                            this.pseudo.setAttribute('y',this.y-3);
                            this.pseudo.setAttribute('h',this.h);
                            this.pseudo.setAttribute('w',this.w);
                            this.g.appendChild(this.pseudo);
                            break;
                    }
                }
            }
        }
        
        return opObject;
    };

    var Ellipse = function(arg, parent) {

        if (!parent) {
            parent = allSvg[arg.pid];
        }

        /* Creating DOM Element */
        this.g = document.createElementNS('http://www.w3.org/2000/svg','g');
        this.element = document.createElementNS('http://www.w3.org/2000/svg','ellipse');

        /* Setting Class and type */
        this.t = 'e';
        this.g.classList.add(this.t);
        this.g.classList.add('drawing-elements');
        
        /* Setting Id */
        this.pid = parent.id;
        if (arg.id) {
            this.id = arg.id
        }
        else {
            this.id = this.pid+this.t+ parent.childrenId++;
        }

        this.element.setAttribute( 'id', this.id);
        this.g.setAttribute( 'id', this.id + 'g');

        /* Default Attributes */
        this.element.setAttribute('stroke-linecap','round');

        /* Provided Attributes */
        var j;
        for (j in allAA['e']) {
            if (j in arg) {
                this.element.setAttribute(allAA['e'][j],arg[j]);
                this[j] = arg[j];
            }
        }

        if ( this.sw < 7 ) {
            this.pseudo = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
            this.pseudo.setAttribute('stroke','transparent');
            this.pseudo.setAttribute('fill','none');
            this.pseudo.setAttribute('stroke-width',7);
            this.pseudo.setAttribute('cx',this.cx);
            this.pseudo.setAttribute('cy',this.cy);
            this.pseudo.setAttribute('rx',this.rx);
            this.pseudo.setAttribute('ry',this.ry);
            this.g.appendChild(this.pseudo);
        }

        /* Adding Elements to DOM */
        this.g.appendChild(this.element);
        parent.g.appendChild(this.g);

        $(this.g).data('myObject',this);
        $(this.element).data('myObject',this);

        return this;
    };

    var Line = function(arg, parent) {

        if (!parent) {
            parent = allSvg[arg.pid];
        }

        /* Creating DOM Element */
        this.g = document.createElementNS('http://www.w3.org/2000/svg','g');
        this.element = document.createElementNS('http://www.w3.org/2000/svg','line');

        /* Setting Class and type */
        this.t = 'l';
        this.g.classList.add(this.t);
        this.g.classList.add('drawing-elements');

        /* Setting Id */
        this.pid = parent.id;
        
        if (arg.id) {
            this.id = arg.id
        }
        else {
            this.id = this.pid+this.t+ parent.childrenId++;
        }
        this.element.setAttribute( 'id', this.id);
        this.g.setAttribute( 'id', this.id + 'g');

        /* Default Attributes */
        this.element.setAttribute('stroke-linecap','round');

        /* Provided Attributes */
        var j;
        for (j in allAA['l']) {
            if (j in arg) {
                this.element.setAttribute(allAA['l'][j],arg[j]);
                this[j] = arg[j];
            }
        }

        if ( this.sw < 7 ) {
            this.pseudo = document.createElementNS('http://www.w3.org/2000/svg','line');
            this.pseudo.setAttribute('stroke','transparent');
            this.pseudo.setAttribute('stroke-width',7);
            this.pseudo.setAttribute('x1',this.x1);
            this.pseudo.setAttribute('y1',this.y1);
            this.pseudo.setAttribute('x2',this.x2);
            this.pseudo.setAttribute('y2',this.y2);
            this.g.appendChild(this.pseudo);
        }

        /* Adding Elements to DOM */
        this.g.appendChild(this.element);
        parent.g.appendChild(this.g);
        
        $(this.g).data('myObject',this);
        $(this.element).data('myObject',this);
        
        return this;
    };

    var Rectangle = function (arg, parent) {
        
        if (!parent) {
            parent = allSvg[arg.pid];
        }

        /* Creating DOM Element */
        this.g = document.createElementNS('http://www.w3.org/2000/svg','g');
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        
        /* Setting Class and type */
        this.t = 'r';
        this.g.classList.add(this.t);
        this.g.classList.add('drawing-elements');

        /* Setting Id */
        this.pid = parent.id;
        if (arg.id) {
            this.id = arg.id
        }
        else {
            this.id = this.pid+this.t+ parent.childrenId++;
        }
        this.element.setAttribute('id', this.id);
        this.g.setAttribute( 'id', this.id + 'g');
        
        /* Default Attributes */
        this.element.setAttribute('rx', 0);
        this.element.setAttribute('ry', 0);
        this.rx = 0;
        this.ry = 0;

        /* Provided Attributes */
        var j;
        for (j in allAA['r']) {
            if (j in arg) {
                this.element.setAttribute(allAA['r'][j],arg[j]);
                this[j] = arg[j];
            }
        }
        
        if ( this.sw < 7 ) {
            this.pseudo = document.createElementNS('http://www.w3.org/2000/svg','rect');
            this.pseudo.setAttribute('stroke','transparent');
            this.pseudo.setAttribute('fill','none');
            this.pseudo.setAttribute('stroke-width',7);
            this.pseudo.setAttribute('x',this.x-3);
            this.pseudo.setAttribute('y',this.y-3);
            this.pseudo.setAttribute('h',this.h);
            this.pseudo.setAttribute('w',this.w);
            this.g.appendChild(this.pseudo);
        }

        /* Adding Elements to DOM */
        this.g.appendChild(this.element);
        parent.g.appendChild(this.g);
        
        $(this.g).data('myObject',this);
        $(this.element).data('myObject',this);
        
        return this;
    }
    
    Line.prototype.changeAttributes = changeAttributes;
    Ellipse.prototype.changeAttributes = changeAttributes;
    Rectangle.prototype.changeAttributes = changeAttributes;
    
    var getOp = function(op, changeArr) {
        var opObject = new Object();
        opObject.op = op;
        opObject.t = this.t;
        opObject.id = this.id;
        opObject.pid = this.pid;
        
        switch (op) {
            case 'cr':
                for (var i in allAA[this.t]) {
                    opObject[i] = this[i];
                }
                opObject.pos = allSvg[this.pid].children.indexOf(this);
                break;
            case 'd':
                
                break;
            case 'ch':
                for (var i=0; i<changeArr.length; i++) {
                    opObject[changeArr[i]] = this[changeArr[i]];
                }
                break;
        }
        return opObject;
    }
    
    Line.prototype.getOp = getOp;
    Ellipse.prototype.getOp = getOp;
    Rectangle.prototype.getOp = getOp;
    
    var getLinePivots = function(){
        return {
            x:[this.x1,this.x2],
            y:[this.y1,this.y2]
        }
    };
    
    Line.prototype.getPivots = getLinePivots;
    
    var getEllipsePivots = function(){
        return {
            x:[this.cx-this.rx, this.cx+this.rx ],
            y:[this.cy-this.ry, this.cy+this.ry ]
        }
    };
    
    Ellipse.prototype.getPivots = getEllipsePivots;
    
    var getRectanglePivots = function() {
        return {
            x:[this.x, this.x+this.w],
            y:[this.y, this.y+this.h]
        }
    };
    
    Rectangle.prototype.getPivots = getRectanglePivots;
    
    var SelectRef =  ['top-left', 'top', 'top-right', 'left', 'right',
                      'bottom-left', 'bottom', 'bottom-right', 'rotate'];
    
    var resizeCursorRef = ['nw-resize', 'n-resize' , 'ne-resize', 'w-resize',
                           'e-resize', 'sw-resize', 's-resize','se-resize'];
    
    var SelectArea = function(x,y,w,h, mySvgObject) { //arg has x,y,h,w
        
        this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        
        this.pid = mySvgObject.id;
        this.rect.classList.add('select-area');
        this.rect.setAttribute('fill','none');
        this.rect.setAttribute('stroke','#0096fd');
        this.rect.setAttribute('stroke-width',1/mySvgObject.zoomFactor);
        
        this.rect.setAttribute('x', x);
        this.rect.setAttribute('y', y);
        this.rect.setAttribute('height', h);
        this.rect.setAttribute('width', w);
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
        
        
        this.g.appendChild(this.rect);
        mySvgObject.g.appendChild(this.g);
        
        this.p = new Array();
        var radius = 4;             //Basically half of sidelength of pivots
        this.r = radius;
        for (var i=0;i<8;i++) {
            this.p[i] = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            this.p[i].setAttribute('fill','#0096fd');
            this.p[i].setAttribute('stroke','#fff');
            this.p[i].setAttribute('stroke-width',0.5/mySvgObject.zoomFactor);
            this.p[i].setAttribute('height',2*radius);
            this.p[i].setAttribute('width',2*radius);
            this.p[i].id = SelectRef[i];
            this.g.appendChild(this.p[i]);
        }
        
        this.setPivots(x,y,h,w)
        /*
        this.p[8] = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.p[8].id = SelectRef[8];
        this.p[8].setAttribute('r',radius);
        this.p[8].setAttribute('fill','#0096fd');
        this.p[8].setAttribute('stroke','#fff');
        this.p[8].setAttribute('stroke-width',0.5/mySvgObject.zoomFactor);
        this.p[8].setAttribute('cx',x+w/2);
        this.p[8].setAttribute('cy',y-20);
        this.g.appendChild(this.p[8]);
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill','none');
        path.setAttribute('stroke','#0096fd');
        path.setAttribute('stroke-width',1/mySvgObject.zoomFactor);
        path.setAttribute('d','M '+(x+w/2)+' '+(y-20)+' v 20');
        this.g.appendChild(path);
        */
    };
    
    SelectArea.prototype.setPivots = function (x,y,h,w) {
        var radius = this.r;
        this.p[0].setAttribute('x',x-radius);
        this.p[0].setAttribute('y',y-radius);
        this.p[1].setAttribute('x',x+w/2-radius);
        this.p[1].setAttribute('y',y-radius);
        this.p[2].setAttribute('x',x+w-radius);
        this.p[2].setAttribute('y',y-radius);
        this.p[3].setAttribute('x',x-radius);
        this.p[3].setAttribute('y',y+h/2-radius);
        this.p[4].setAttribute('x',x+w-radius);
        this.p[4].setAttribute('y',y+h/2-radius);
        this.p[5].setAttribute('x',x-radius);
        this.p[5].setAttribute('y',y+h-radius);
        this.p[6].setAttribute('x',x+w/2-radius);
        this.p[6].setAttribute('y',y+h-radius);
        this.p[7].setAttribute('x',x+w-radius);
        this.p[7].setAttribute('y',y+h-radius);
    }
    
    Svg.prototype.fillSvg = function(color){
        this.element.setAttribute( 'style', 'background-color:'+color+';');
    };

    Svg.prototype.fillPage = function(color){
        this.page.setAttribute( 'fill', color);
    };

    var deleteSelf = function(){
        
        var pastState = this.getOp('cr');
        $(this.g).remove();
        allSvg[this.pid].children.splice(pastState.pos,1);
        var newState = this.getOp('d');
        return {'pastState':pastState, 'newState':newState}
    };

    Line.prototype.delete = deleteSelf;
    Ellipse.prototype.delete = deleteSelf;
    Rectangle.prototype.delete = deleteSelf;
    
    this.init = function(parent) {
        if ( !initialized ) {
            initialized = true;
            var dim = parent.getBoundingClientRect();
            var arg = {
                h:550,
                w:1000
            };
            var svgObject = new Svg(arg, parent, true);
            allSvg[svgObject.id] = svgObject;
            currentSvg = svgObject;
            this.resize();
            editor.setMode('createLineMode', true);
            Base.focusMenu('tools');
            editor.init();
        }
    };

    this.selectOperation = function(op) {
        editor.currentMode = op;
    };
    
    Array.prototype.insertAt = function (index, item) {
        this.splice(index, 0, item);
    };
    
    this.performOp = function (data) {
        var returnValue = new Object();
        
    //{console.log('perOp', data.op, data.t);d=data;if (data instanceof Array || !data.op ) {alert(data);}}
        
        if (data.op == 'm') {
            var i;
            returnValue.pastState = new Object();
            returnValue.newState = new Object();
            returnValue.pastState.op = returnValue.newState.op = 'm';
            returnValue.pastState.ar = new Array();
            returnValue.newState.ar = data;
            for(i=data.ar.length-1;i>=0;i--) {
                returnValue.pastState.ar[data.ar.length-i-1] = this.performOp(data.ar[i]).pastState;
            }
        }
        else
        if (data.op == 'cr') {
            var myObject;
            switch (data.t) {
                case 'e':
                    myObject = new Ellipse(data);
                    break;
                case 'l':
                    myObject = new Line(data);
                    break;
                case 'r':
                    myObject = new Rectangle(data);
                    break;
            }
            /*
            if (allSvg[data.pid].children.length != data.pos) {
                if (data.pos != 0) {
                    $(myObject.g).detach().insertAfter( $(allSvg[data.pid].children[data.pos-1]) );
                }
                else {
                    $(myObject.g).detach().insertBefore( $(allSvg[data.pid].children[data.pos]) );
                }
            }
            allSvg[data.pid].children.insertAt(data.pos, myObject);
            */
            allSvg[data.pid].children.push(myObject);
            
            editor.makeEditable(myObject.g);
            returnValue.pastState = myObject.getOp('d');
            returnValue.newState = data;
        }
        else
        if (data.op == 'd') {
            var myObject = $('#' + data.id +'g').data('myObject');
            returnValue = myObject.delete();
        }
        else
        if (data.op == 'ch') {
            var myObject = $('#' + data.id + 'g').data('myObject');
            returnValue = myObject.changeAttributes(data, true);
        }
        editor.completeOp(data);
        
        return returnValue;
    };
    
    this.getFileData = function(svg) {
        if (!svg) {
            svg = (currentSvg)?(currentSvg):(allSvg['s1']);
        }
        var data = new Object();
        data.op = 'file';
        data.ar = new Array();
        var element = $('#'+svg.id).data('myObject');
        for (var i=0; i<element.children.length; i++) {
            data.ar[i] = new Object();
            data.ar[i]['id'] = element.children[i]['id'];
            data.ar[i]['pid'] = element.children[i]['pid'];
            data.ar[i]['t'] = element.children[i]['t'];
            for (var j in allAA[element.children[i]['t']]) {
                data.ar[i][j] = element.children[i][j];
            }
        }
        return data;
    };
    
    /*******************************   Editor Module   *******************************/
    var editor = new (function() {

        var superParent = window;
        
        var allModes = ['createLineMode', 'createEllipseMode', 'createRectangleMode', 'createFreeMode', 'magicMode', 'LightningMode', 'selectMode', ]

        this.currentMode = 'createLineMode';
        this.strokeWidth = 2;
        this.strokeColor = '#666';
        this.fillColor   = 'none';
        
        actives = new Object();
        actives.list = new Array();
        
        this.setMode = function(mode,onOff){
            if (onOff == true) {
                if (allModes.indexOf(mode) != -1) {
                    editor.currentMode = mode;
                    if (mode == 'selectMode') {
                        for (var i in allSvg) {
                            allSvg[i].element.style.cursor = 'alias';
                            for (var j=0;j<allSvg[i].children.length; j++) {
                                allSvg[i].children[j].g.style.cursor = 'pointer';
                            }
                        }
                    }
                    else {
                        for (var i in allSvg) {
                            allSvg[i].element.style.cursor = 'crosshair';
                            for (var j=0;j<allSvg[i].children.length; j++) {
                                allSvg[i].children[j].g.style.cursor = 'auto';
                            }
                        }
                    }
                }
            }
        };
        
        this.setStrokeWidth = function(id, value){
            if (actives.list.length == 0) {
                editor.strokeWidth = parseInt(value);
            }
            else {
                var pastState = new Array();
                var newState = new Array();                
                for (var i=0; i<actives.list.length; i++) {
                    var states = actives.list[i].changeAttributes({'sw':value}, true);
                    pastState[i] = states.pastState;
                    newState[i] = states.newState;
                }
                Base.addOp({
                    op:'m',
                    ar:pastState
                },{
                    op:'m',
                    ar:newState
                })
                
            }
            
        }
        
        this.setStrokeColor = function(id, color){
            editor.strokeColor = color;
        };
        
        this.setFillColor = function(id, color){
            editor.fillColor = color;
        };
                
        var getStrokeWidth = function(){
            return editor.strokeWidth;
        }
        
        var getStrokeColor = function(){
            return editor.strokeColor;
        }
        
        var getFillColor = function(){
            return editor.fillColor;
        }
        
        var eq = function (arg1, arg2){
            if (arg1.length != arg2.length) {
                return false;
            }
            for (var i=0;i<arg1.length;i++) {
                for (var j in arg1[i]) {
                    if (arg1[i][j] != arg2[i][j]) {
                        return false;
                    }
                }
            }
            return true;
        };
        
        
        var makeSelectRect = function(pid) {            //pid is the id of the svg where elements are to be selected
            
            if (actives.select) {
                $(actives.select.g).remove();
                delete actives.select;
                if (actives.list.length == 0) {
                    return;
                }
            }
            var pivotsX = new Array();
            var pivotsY = new Array();
            for (var i=0;i<actives.list.length;i++) {
                var getP = actives.list[i].getPivots();
                pivotsX = pivotsX.concat(getP.x);
                pivotsY = pivotsY.concat(getP.y);
            }
            var x1 = Math.min.apply(undefined, pivotsX);
            var y1 = Math.min.apply(undefined, pivotsY);
            var x2 = Math.max.apply(undefined, pivotsX);
            var y2 = Math.max.apply(undefined, pivotsY);
            
            actives.select = new SelectArea(x1, y1, x2-x1, y2-y1, allSvg[pid]);
            var pivots = actives.select.p;
            for (var i=0;i<pivots.length;i++) {
                $(pivots[i]).on('mousedown', pivotsOn.mousedown).css('cursor',resizeCursorRef[i]);
            }
            
            //$(pivots[pivots.length-1]).addClass('rotate-pivot').css('cursor','cell').on('mousedown', elementsRotate.mousedown);
            $(actives.select.rect).on('mousedown',{selectArea:true}, elementOn.mousedown)
            Base.focusMenu('edit');
        };
        
        var selectElement = function(){
            
            if (actives.list.length == 0) {
                $(allSvg[this.pid].element).one('mousedown',deselectAll);
            }
            actives.list.push(this);
            this.g.classList.add('active');
            makeSelectRect(this.pid);
        };
        
        var deselectElement = function(){
            actives.list.splice(actives.list.indexOf(this),1);
            this.g.classList.remove('active');
            makeSelectRect(this.pid);
        };
        
        var deselectAll = function(e){
            if (actives.select)
            {
                $(actives.select.g).remove();
                delete actives.select;
                while (actives.list.length != 0) {
                    actives.list.pop().g.classList.remove('active');
                }
            }
        };

        var selectAll = function(){
            if (currentSvg.children.length == 0) {
                return;
            }
            if (actives.list.length == 0) {
                $(currentSvg.element).one('mousedown',deselectAll);
            }
            for(var j=0; j<currentSvg.children.length; j++) {
                actives.list.push(currentSvg.children[j]);
                currentSvg.children[j].g.classList.add('active');
            }
            makeSelectRect(currentSvg.id);
        };
        
        this.init = function(){
            Base.addShortcuts([
                {
                    ctrl: true,
                    char: 'a',
                    callback: selectAll
                },
            ])
        };
        
        var svgOnMouseDown = function(e) {

            if (e.which == 1) {
                e.data = $(this).data('myObject');
                var element = svgOn[editor.currentMode].mousedown(e);
                
                $(superParent).on('mousemove', element, svgOn[editor.currentMode].mousemove)
                            .on('mouseup', element, function(ev){

                    $(superParent).off('mousemove').off('mouseup');
                    svgOn[editor.currentMode].mouseup(ev);
                });
            }
        };
        
        this.makeEditable = function(element) {
            if ( $(element).is('svg') ) {
                $(element).on('mousedown', svgOnMouseDown);
            }
            else {
                $(element).on('mousedown', elementOn.mousedown);
            }
        };

/*       Key down key up 
        var keyTimeout, keyInterval, currentKey;

        $(window).on('keydown',function(e){

            switch (e.which) {

                case 46:            //DeleteKey
                    if (actives.list.length != 0) {
                        deleteSelected();
                    }
                    break;

                case 37:            //Left Arrow Key
                    if (actives.list.length != 0) {
                        currentKey = 37;
                        clearTimeout(keyTimeout);
                        clearInterval(keyInterval);

                        actives.list.forEach(function(element){
                            element.move('left', e.ctrlKey, e.shiftKey);
                            element.activate();
                        });

                        keyTimeout = setTimeout(function(){
                            keyInterval = setInterval(function(){
                                actives.list.forEach(function(element){
                                    element.move('left', e.ctrlKey, e.shiftKey);
                                    element.activate();
                                });
                            },100);
                        },750);

                    }
                    break;

                case 38:            //Up Arrow Key
                    if (actives.list.length != 0) {
                        currentKey = 38;
                        clearTimeout(keyTimeout);
                        clearInterval(keyInterval);

                        actives.list.forEach(function(element){
                            element.move('up',e.ctrlKey, e.shiftKey);
                            element.activate();
                        });

                        keyTimeout = setTimeout(function(){
                            keyInterval = setInterval(function(){
                                actives.list.forEach(function(element){
                                    element.move('up',e.ctrlKey, e.shiftKey);
                                    element.activate();
                                });
                            },100);
                        },750);

                    }
                    break;

                case 39:            //Right Arrow Key
                    if (actives.list.length != 0) {
                        currentKey = 39;
                        clearTimeout(keyTimeout);
                        clearInterval(keyInterval);

                        actives.list.forEach(function(element){
                            element.move('right', e.ctrlKey, e.shiftKey);
                            element.activate();
                        });

                        keyTimeout = setTimeout(function(){
                            keyInterval = setInterval(function(){
                                actives.list.forEach(function(element){
                                    element.move('right', e.ctrlKey, e.shiftKey);
                                    element.activate();
                                });
                            },100);
                        },750);

                    }
                    break;

                case 40:            //Down Arrow Key
                    if (actives.list.length != 0) {
                        currentKey = 40;
                        clearTimeout(keyTimeout);
                        clearInterval(keyInterval);

                        actives.list.forEach(function(element){
                            element.move('down', e.ctrlKey, e.shiftKey);
                            element.activate();
                        });

                        keyTimeout = setTimeout(function(){
                            keyInterval = setInterval(function(){
                                actives.list.forEach(function(element){
                                    element.move('down', e.ctrlKey, e.shiftKey);
                                    element.activate();
                                });
                            },100);
                        },750);

                    }
                    break;
            }
        });

        $(window).on('keyup',function(e){

            switch (e.which) {

                case 37:            //Left Arrow Key
                    if (actives.list.length != 0) {
                        if (currentKey == 37) {
                            currentKey = null;
                        }
                        clearTimeout(keyTimeout);
                        clearInterval(keyInterval);
                    }
                    break;

                case 38:            //Up Arrow Key
                    if (actives.list.length != 0) {
                        if (currentKey == 38) {
                            currentKey = null;
                        }
                        clearTimeout(keyTimeout);
                        clearInterval(keyInterval);

                    }
                    break;

                case 39:            //Right Arrow Key
                    if (actives.list.length != 0) {
                        if (currentKey == 39) {
                            currentKey = null;
                        }
                        clearTimeout(keyTimeout);
                        clearInterval(keyInterval);

                    }
                    break;

                case 40:            //Down Arrow Key
                    if (actives.list.length != 0) {
                        if (currentKey == 40) {
                            currentKey = null;
                        }
                        clearTimeout(keyTimeout);
                        clearInterval(keyInterval);

                    }
                    break;
            }
        });
        */

        var svgOn = {
            createEllipseMode: {
                mousedown: function(e) {
                    
                    var mySvgObject = currentSvg = e.data;
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    
                    var attributes = {
                        'cx':x,
                        'cy':y,
                        'rx':0,
                        'ry':0,
                        'sc':getStrokeColor(),
                        'sw':getStrokeWidth(),
                        'f' :getFillColor(),
                        //'op':getOpacity(),
                        //'sd':getStrokeDashArray(),
                    };
                    var element = new Ellipse(attributes,mySvgObject);
                    element.X = x;
                    element.Y = y;
                    return element;
                },
                
                mousemove: function(e) {

                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    
                    if (e.shiftKey) {
                        var changes = svgOn.createEllipseMode.snap(element.X,element.Y,x,y);
                        element.changeAttributes({
                            'cx': changes.cx,
                            'cy': changes.cy,
                            'rx': changes.radius,
                            'ry': changes.radius,
                            });
                    }
                    else
                    {
                        element.changeAttributes({
                            'cx': (x + element.X) / 2,
                            'cy': (y + element.Y) / 2,
                            'rx': (Math.abs(x - element.X)) / 2,
                            'ry': (Math.abs(y - element.Y)) / 2,
                            });
                    }
                },
                
                mouseup: function(e) {

                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;

                    if (e.shiftKey) {
                        var changes = svgOn.createEllipseMode.snap(element.X,element.Y,x,y);
                        element.changeAttributes({
                            'cx': changes.cx,
                            'cy': changes.cy,
                            'rx': changes.radius,
                            'ry': changes.radius,
                            });
                    }
                    else
                    {
                        element.changeAttributes({
                            'cx': (x + element.X) / 2,
                            'cy': (y + element.Y) / 2,
                            'rx': (Math.abs(x - element.X)) / 2,
                            'ry': (Math.abs(y - element.Y)) / 2,
                            });
                    }
                    delete element.X;
                    delete element.Y;
                    ele = element;
                    if (element.rx == 0 || element.ry == 0) {
                        $(element.g).remove();
                    }
                    else {
                        $(element.g).on('mousedown', elementOn.mousedown);
                        mySvgObject.children.push(element);
                        Base.addOp(element.getOp('d'),element.getOp('cr'));
                    }
                },
                
                snap: function(sx,sy,x,y) {
                    var radius = Math.max((Math.abs(x - sx)) / 2, (Math.abs(y - sy)) / 2);
                    var cx = (x > sx) ?
                        (sx + radius) :
                        (sx - radius);
                    var cy = (y > sy) ?
                        (sy + radius) :
                        (sy - radius);
                    return {'cx':cx, 'cy':cy, 'radius':radius}
                },
            },

            createLineMode: {

                mousedown: function(e) {

                    var mySvgObject = currentSvg = e.data;
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    
                    var attributes = {
                        'x1':x,
                        'y1':y,
                        'x2':x,
                        'y2':y,
                        'sc':getStrokeColor(),
                        'sw':getStrokeWidth(),
                    };
                    
                    var element = new Line(attributes,mySvgObject);
                    element.origin = 'createLineMode'; element.originData = attributes;
                    return element;
                },

                mousemove: function(e) {

                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];
                    
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    
                    if (e.shiftKey) {
                        var changes = svgOn.createLineMode.snap(element.x1,element.y1,x,y);
                        element.changeAttributes({
                            'x2':changes.x2,
                            'y2':changes.y2
                            });
                    }
                    else
                    {
                        element.changeAttributes({
                            'x2':x,
                            'y2':y
                            });
                    }
                },

                mouseup: function(e) {

                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];

                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;

                    if (e.shiftKey) {

                        var changes = svgOn.createLineMode.snap(element.x1,element.y1,x,y);
                        element.changeAttributes({
                            'x2':changes.x2,
                            'y2':changes.y2
                            });
                    }
                    else {
                        element.changeAttributes({
                            'x2':x,
                            'y2':y
                            });
                    }
                    
                    if (element.x1 == element.x2 && element.y1 == element.y2) {
                        $(element.g).remove();
                    }
                    else {
                        $(element.g).on('mousedown', elementOn.mousedown);
                        mySvgObject.children.push(element);
                        Base.addOp(element.getOp('d'),element.getOp('cr'));
                    }
                },
                
                snap: function(x1,y1,x2,y2) {
                    var dy=y2-y1;
                    var dx=x2-x1;
                    var deg = (Math.atan(dy/dx))*180/Math.PI;
                    if(dx < 0 ){
                        deg = 180 - deg;
                    }
                    else if(deg < 0)
                        deg = 360 + deg;
                    
                    var line = Math.round(deg/45);
                    if(line==8)line=0;
                    
                    if(line%2){
                        dx = (dx/Math.abs(dx)) * Math.max(Math.abs(dx),Math.abs(dy));
                        dy = (dy/Math.abs(dy)) * Math.max(Math.abs(dx),Math.abs(dy));
                    }
                    else if(line%4==0)
                        dy = 0;
                    else
                        dx = 0;
                        
                    x2 = x1 + dx
                    y2 = y1 + dy
                    return {'x2':x2, 'y2':y2}
                },
            },
            
            createRectangleMode:{
                
                mousedown:function(e){
                    var mySvgObject = currentSvg = e.data;
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    var attributes = {
                        'x' :x,
                        'y' :y,
                        'h' :0,
                        'w' :0,
                        'sc': getStrokeColor(),
                        'sw': getStrokeWidth(),
                        'f' : getFillColor()
                    };
                    
                    var element = new Rectangle(attributes,mySvgObject);
                    element.X = x;
                    element.Y = y;
                    return element;
                
                },
                
                mousemove:function(e){
                    
                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    
                    if (e.shiftKey) {
                        var changes = svgOn.createRectangleMode.snap(element.X,element.Y,x,y);
                        element.changeAttributes({
                            'x': changes.x,
                            'y': changes.y,
                            'h': changes.sideLength,
                            'w': changes.sideLength,
                            });
                    }
                    else
                    {
                        element.changeAttributes({
                            'h': Math.abs(element.Y - y),
                            'w': Math.abs(element.X - x),
                            'x': Math.min(element.X, x),
                            'y': Math.min(element.Y, y),
                        });
                    }
                },
                
                mouseup:function(e){

                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    
                    if (e.shiftKey) {
                        var changes = svgOn.createRectangleMode.snap(element.X,element.Y,x,y);
                        element.changeAttributes({
                            'x': changes.x,
                            'y': changes.y,
                            'h': changes.sideLength,
                            'w': changes.sideLength,
                            });
                    }
                    else
                    {
                        element.changeAttributes({
                            'h': Math.abs(element.Y - y),
                            'w': Math.abs(element.X - x),
                            'x': Math.min(element.X, x),
                            'y': Math.min(element.Y, y),
                        });
                    }
                    
                    if (element.h == 0 || element.w == 0) {
                        $(element.g).remove();
                    }
                    else {
                        $(element.g).on('mousedown', elementOn.mousedown);
                        mySvgObject.children.push(element);
                        Base.addOp(element.getOp('d'),element.getOp('cr'));
                    }
                },
                
                snap:function(sx, sy, x, y){
                    var sideLength = Math.max(
                            Math.abs(sy - y),
                            Math.abs(sx - x)
                        );
                        return {

                            'x': (x > sx) ?
                                sx : sx - sideLength,

                            'y': (y > sy) ?
                                sy : sy - sideLength,
                        
                            'sideLength': sideLength,
                        };
                },
                
            },
        
            selectMode: {
                mousedown:function(e){

                    var mySvgObject = currentSvg = e.data;
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    var attributes = {
                        'x' :x,
                        'y' :y,
                        'h' :0,
                        'w' :0,
                        'sc': '#222',
                        'sw': 1,
                        'f' : 'none',
                        'sd':'5 5',
                        'id':'selectDottedRect'
                    };
                    
                    var element = new Rectangle(attributes,mySvgObject);
                    element.shiftX = x;
                    element.shiftY = y;
                    return element;
                },
                
                mousemove:function(e){
                    
                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    
                    if (e.shiftKey) {
                        var changes = svgOn.createRectangleMode.snap(element.shiftX,element.shiftY,x,y);
                        element.changeAttributes({
                            'x': changes.x,
                            'y': changes.y,
                            'h': changes.sideLength,
                            'w': changes.sideLength,
                            });
                    }
                    else
                    {
                        element.changeAttributes({
                            'h': Math.abs(element.shiftY - y),
                            'w': Math.abs(element.shiftX - x),
                            'x': Math.min(element.shiftX, x),
                            'y': Math.min(element.shiftY, y),
                        });
                    }
                },
                
                mouseup:function(e){

                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    
                    if (e.shiftKey) {
                        var changes = svgOn.createRectangleMode.snap(element.shiftX,element.shiftY,x,y);
                        element.changeAttributes({
                            'x': changes.x,
                            'y': changes.y,
                            'h': changes.sideLength,
                            'w': changes.sideLength,
                            });
                    }
                    else
                    {
                        element.changeAttributes({
                            'h': Math.abs(element.shiftY - y),
                            'w': Math.abs(element.shiftX - x),
                            'x': Math.min(element.shiftX, x),
                            'y': Math.min(element.shiftY, y),
                        });
                    }
                    var x1 = element.x;
                    var y1 = element.y;
                    var x2 = element.x + element.w;
                    var y2 = element.y + element.h;
                    $(element.g).remove();
                    for(var i=0;i<mySvgObject.children.length;i++) {
                        var pivots = mySvgObject.children[i].getPivots();
                        var flag =  (x1 <= pivots.x[0]) && (pivots.x[0] <= x2)
                        && (x1 <= pivots.x[1]) && (pivots.x[1] <= x2)
                        && (y1 <= pivots.y[0]) && (pivots.y[0] <= y2)
                        && (y1 <= pivots.y[1]) && (pivots.y[1] <= y2);
                        if(flag) {
                            selectElement.apply(mySvgObject.children[i]);
                        }
                    }
                },
            },
        };

        var elementOn = {

            mousedown : function(e){
                if (editor.currentMode == 'selectMode') {
                    e.stopImmediatePropagation();
                    if (!e.data || !e.data.selectArea) {
                        var myObject = $(this).data('myObject');
                        currentSvg = allSvg[myObject.pid];
                        if (actives.list.indexOf(myObject) == -1) {
                            if (e.ctrlKey) {
                                selectElement.apply(myObject);
                            }
                            else {
                                deselectAll();
                                selectElement.apply(myObject);
                            }
                        }
                        else {
                            if (e.ctrlKey) {
                                deselectElement.apply(myObject);
                            }
                        }
                    }
                    actives.pastState = new Array();
                    for(var i=0;i<actives.list.length;i++) {
                        e.data = actives.list[i];
                        actives.pastState[i] = elementMove[actives.list[i].t].mousedown(e);
                    }
                    $(superParent).on('mousemove',elementOn.mousemove).on('mouseup',elementOn.mouseup);
                }
            },
            
            mousemove : function(e){
                for(var i=0;i<actives.list.length;i++) {
                    e.data = actives.list[i];
                    elementMove[actives.list[i].t].mousemove(e);
                }
                if (actives.list[0]) makeSelectRect(actives.list[0].pid);
            },
            
            mouseup : function(e){
                
                actives.newState = new Array();
                for(var i=0;i<actives.list.length;i++) {
                    e.data = actives.list[i];
                    actives.newState[i] = elementMove[actives.list[i].t].mouseup(e);
                }
                makeSelectRect(actives.select.pid);
                $(superParent).off('mousemove',elementOn.mousemove).off('mouseup',elementOn.mouseup);
                if ( !( eq( actives.pastState, actives.newState )) ) {
                    Base.addOp({
                        'op':'m',
                        'ar':actives.pastState
                    },{
                        'op':'m',
                        'ar':actives.newState
                    });
                }
                delete actives.pastState;
                delete actives.newState;
            },
            
        };

        var elementMove = {

            l : {

                mousedown: function(e) {
                    
                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    element.dx1 = element.x1 - x;
                    element.dy1 = element.y1 - y;
                    element.dx2 = element.x2 - x;
                    element.dy2 = element.y2 - y;
                    return element.getOp('ch', ['x1','y1','x2','y2']);
                },
                mousemove:function(e){
                    
                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    var changes = {
                        'x1':element.dx1+x,
                        'y1':element.dy1+y,
                        'x2':element.dx2+x,
                        'y2':element.dy2+y,
                    }
                    element.changeAttributes(changes);
                    
                },
                mouseup:function(e){
                    
                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    var changes = {
                        'x1':element.dx1+x,
                        'y1':element.dy1+y,
                        'x2':element.dx2+x,
                        'y2':element.dy2+y,
                    }
                    var state = element.changeAttributes(changes);
                    return state.newState;
                },

            },
            
            e:{
                mousedown:function(e){
                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    element.diff = new Object();
                    element.diff.cx = element.cx - x;
                    element.diff.cy = element.cy - y;
                    return element.getOp('ch',['cx','cy']);
                },
                mousemove:function(e){
                    
                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    var changes = {
                        'cx':element.diff.cx+x,
                        'cy':element.diff.cy+y,
                    }
                    element.changeAttributes(changes);
                },
                mouseup:function(e){
                    
                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    var changes = {
                        'cx':element.diff.cx+x,
                        'cy':element.diff.cy+y,
                    }
                    var state = element.changeAttributes(changes);
                    return state.newState;
                }
            },
            
            r:{
                mousedown:function(e){
                    
                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    element.diff = new Object();
                    element.diff.x = element.x - x;
                    element.diff.y = element.y - y;
                    return element.getOp('ch', ['x','y']);
                },
                mousemove:function(e){
                    
                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    var changes = {
                        'x':element.diff.x+x,
                        'y':element.diff.y+y,
                    }
                    element.changeAttributes(changes);
                },
                mouseup:function(e){
                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    var changes = {
                        'x':element.diff.x+x,
                        'y':element.diff.y+y,
                    }
                    var state = element.changeAttributes(changes);
                    return state.newState;
                    
                },
            },
        }
  
        var pivotsOn = {
            mousedown: function(e) {
                e.stopPropagation();
                var tmp = this.id.split('-');
                
                /* Resizing select Rect */
                var mySvgObject = allSvg[actives.select.pid];
                var offset = mySvgObject.page.getBoundingClientRect();
                var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                elementResize['sA'][tmp[0]].mousedown(x,y);
                if (tmp.length == 2) {
                    elementResize['sA'][tmp[1]].mousedown(x,y);
                }
                /* Calling resize of all Actives */
                actives.pastState = new Array();
                for (i=0;i<actives.list.length;i++) {
                    actives.pastState[i] = elementResize[actives.list[i].t].mousedown(actives.list[i],actives.select);
                }
                $(superParent).on('mousemove', pivotsOn.mousemove).on('mouseup',pivotsOn.mouseup);
                actives.tmp = tmp;
            },
            mousemove: function(e, selectRect) {
                var tmp = actives.tmp;
                
                /* Resizing select Rect */
                var mySvgObject = allSvg[actives.select.pid];
                var offset = mySvgObject.page.getBoundingClientRect();
                var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                elementResize['sA'][tmp[0]].mousemove(x,y);
                if (tmp.length == 2) {
                    elementResize['sA'][tmp[1]].mousemove(x,y);
                }
                actives.select.setPivots(actives.select.x,actives.select.y,actives.select.h,actives.select.w);
                
                for (i=0;i<actives.list.length;i++) {
                    elementResize[actives.list[i].t].mousemove(actives.list[i],actives.select);
                }
            },
            mouseup: function(e, selectRect) {
                
                actives.newState = new Array();
                actives.select.setPivots(actives.select.x,actives.select.y,actives.select.h,actives.select.w);
                for (i=0;i<actives.list.length;i++) {
                    actives.newState[i] = elementResize[actives.list[i].t].mouseup(actives.list[i],actives.select);
                }
                makeSelectRect(actives.select.pid);
                $(superParent).off('mousemove', pivotsOn.mousemove).off('mouseup',pivotsOn.mouseup);
                
                if ( !( eq( actives.pastState, actives.newState )) ) {
                    Base.addOp({
                        'op':'m',
                        'ar':actives.pastState
                    },{
                        'op':'m',
                        'ar':actives.newState
                    });
                }
                delete actives.pastState;
                delete actives.newState;
                delete actives.tmp;
            }
        };
        
        var elementResize = {
            
            l : {
                mousedown: function(element, rect) {
                    if (rect.w != 0) {
                        element.ratioX1 = Math.abs(element.x1-rect.x)/rect.w;
                        element.ratioX2 = Math.abs(element.x2-rect.x)/rect.w;
                    }
                    else {
                        element.ratioX1 = element.ratioX2 = 0;
                    }
                    
                    if (rect.h != 0) {
                        element.ratioY1 = Math.abs(element.y1-rect.y)/rect.h;
                        element.ratioY2 = Math.abs(element.y2-rect.y)/rect.h;
                    }
                    else {
                        element.ratioY1 = element.ratioY2 = 0;
                    }
                    
                    return element.getOp('ch', ['x1','y1','x2','y2']);
                },
                mousemove:function(element, rect){
                    var changes = {
                        'x1':rect.x+element.ratioX1*rect.w,
                        'x2':rect.x+element.ratioX2*rect.w,
                        'y1':rect.y+element.ratioY1*rect.h,
                        'y2':rect.y+element.ratioY2*rect.h,
                    }
                    element.changeAttributes(changes);
                },
                mouseup:function(element, rect){
                    
                    var changes = {
                        'x1':rect.x+element.ratioX1*rect.w,
                        'x2':rect.x+element.ratioX2*rect.w,
                        'y1':rect.y+element.ratioY1*rect.h,
                        'y2':rect.y+element.ratioY2*rect.h,
                    }
                    var state = element.changeAttributes(changes);
                    return state.newState;
                },
            },
            e:{
                mousedown:function(element, rect){
                    
                    element.ratioCX = Math.abs(element.cx-rect.x)/rect.w;
                    element.ratioCY = Math.abs(element.cy-rect.y)/rect.h;
                    element.ratioRX = element.rx/rect.w;
                    element.ratioRY = element.ry/rect.h;
                    
                    return element.getOp('ch',['cx','cy','rx','ry']);
                },
                mousemove:function(element, rect) {
                    var changes = {
                        'cx':rect.x+element.ratioCX*rect.w,
                        'cy':rect.y+element.ratioCY*rect.h,
                        'rx':element.ratioRX*rect.w,
                        'ry':element.ratioRY*rect.h,
                    }
                    element.changeAttributes(changes);
                },
                mouseup:function(element, rect) {
                    var changes = {
                        'cx':rect.x+element.ratioCX*rect.w,
                        'cy':rect.y+element.ratioCY*rect.h,
                        'rx':element.ratioRX*rect.w,
                        'ry':element.ratioRY*rect.h,
                    }
                    var state = element.changeAttributes(changes);
                    return state.newState;
                },
            },
            r:{
                mousedown:function(element, rect){
                    
                    element.ratioX = Math.abs(element.x-rect.x)/rect.w;
                    element.ratioY = Math.abs(element.y-rect.y)/rect.h;
                    element.ratioW = element.w/rect.w;
                    element.ratioH = element.h/rect.h;
                    
                    return element.getOp('ch',['x','y','h','w'])
                },
                mousemove:function(element, rect) {
                    var changes = {
                        'x':rect.x+element.ratioX*rect.w,
                        'y':rect.y+element.ratioY*rect.h,
                        'h':element.ratioH*rect.H,
                        'w':element.ratioW*rect.W,
                    }
                    element.changeAttributes(changes);
                    
                },
                mouseup:function(element, rect) {
                    var changes = {
                        'x':rect.x+element.ratioX*rect.w,
                        'y':rect.y+element.ratioY*rect.h,
                        'h':element.ratioH*rect.H,
                        'w':element.ratioW*rect.W,
                    }
                    var state = element.changeAttributes(changes);
                    return state.newState;
                },
            },
            
            sA:{
                left:{
                    mousedown:function(x,y) {
                        actives.select.X1 = actives.select.x;
                        actives.select.W = actives.select.w;
                        actives.select.X2 = actives.select.w+actives.select.x;
                    },
                    mousemove:function(x,y) {
                        actives.select.x = Math.min(x,actives.select.X2)
                        actives.select.w = Math.abs(actives.select.X2-x);
                        actives.select.rect.setAttribute('width', actives.select.w);
                        actives.select.rect.setAttribute('x',actives.select.x);
                    },
                    mouseup:function(x,y) {
                        
                    },
                },
                top:{
                    mousedown:function(x,y) {
                        actives.select.Y1 = actives.select.y;
                        actives.select.H = actives.select.h;
                        actives.select.Y2 = actives.select.h+actives.select.y;
                    },
                    mousemove:function(x,y) {
                        actives.select.y = Math.min(y,actives.select.Y2)
                        actives.select.h = Math.abs(actives.select.Y2-y);
                        actives.select.rect.setAttribute('height', actives.select.h);
                        actives.select.rect.setAttribute('y',actives.select.y);
                    },
                    mouseup:function(x,y) {
                        
                    },
                },
                right:{
                    mousedown:function(x,y) {
                        actives.select.X1 = actives.select.x;
                        actives.select.X2 = actives.select.w+actives.select.x;
                        actives.select.W = actives.select.w;
                    },
                    mousemove:function(x,y) {
                        actives.select.x = Math.min(x,actives.select.X1);
                        actives.select.w = Math.abs(actives.select.X1-x);
                        actives.select.rect.setAttribute('width', actives.select.w);
                        actives.select.rect.setAttribute('x',actives.select.x);
                    },
                    mouseup:function(x,y) {
                        
                    },
                },
                bottom:{
                    mousedown:function(x,y) {
                        actives.select.Y1 = actives.select.y;
                        actives.select.Y2 = actives.select.h+actives.select.y;
                        actives.select.H = actives.select.h;
                    },
                    mousemove:function(x,y) {
                        actives.select.y = Math.min(y,actives.select.Y1)
                        actives.select.h = Math.abs(actives.select.Y1-y);
                        actives.select.rect.setAttribute('height', actives.select.h);
                        actives.select.rect.setAttribute('y',actives.select.y);
                    },
                    mouseup:function(x,y) {
                        
                    },
                },
            }
        }

        this.deleteAllSelected = function(){
            var pastState = new Array();
            var newState = new Array();
            for(var i=0;i<actives.list.length;i++) {
                var states = actives.list[i].delete();
                pastState[i] = states.pastState;
                newState[i] = states.newState;
            }
            Base.addOp({
                'op':'m',
                'ar':pastState
            },{
                'op':'m',
                'ar':newState
            });
            deselectAll();
        }
        
        $(window).on('keydown',function(e){
            if (e.which == 46 && actives.list.length != 0) {                //DeleteKey
                editor.deleteAllSelected();
            }
        });
        
        var elementsRotate = {
            mousedown:function(e){
                $(superParent).on('mousemove',elementsRotate.mousemove).on('mouseup',elementsRotate.mouseup);
                
            },
            mousemove:function(e){
                
            },
            mouseup:function(e){
                $(superParent).off('mousemove',elementsRotate.mousemove).off('mouseup',elementsRotate.mouseup);
            }
            
        };
        
        this.completeOp = function(data) {
            deselectAll()
            switch (data.op) {
                case 'cr':
                    if (this.currentMode == 'selectMode') {
                        $('#'+data.id+'g').css('cursor','pointer');
                    }
                    else {
                        $('#'+data.id+'g').css('cursor','auto');
                    }
                    break;
            }
        };
        
        
        /*
        var lineMoveWithArrowKeys = function(type, ctrlKey, shiftKey) {
            var d;
            if (ctrlKey)
                d = 1;
            else if (shiftKey)
                d = 10;
            else
                d = 4;
            
            switch (type) {
                case 'up':
                    this.changeAttributes({y1:this.y1-d,y2:this.y2-d});
                    break;
            
                case 'down':
                    this.changeAttributes({y1:this.y1+d,y2:this.y2+d});
                    break;
                
                case 'left':
                    this.changeAttributes({x1:this.x1-d,x2:this.x2-d});
                    break;
            
                case 'right':
                    this.changeAttributes({x1:this.x1+d,x2:this.x2+d});
                    break;
            }
        };
        
        Line.prototype.move = lineMoveWithArrowKeys;
        */
        
        
    })();
    /******************************* Editor Module End *******************************/
        
    var defaultMenu = [
        {
            type: 'main',
            id: 'tools',
            title: 'Tools', //Name of menu
            icon: 'fa-star-half-empty', //Font awesome icon name
            groups: [
                {
                    type: 'group',
                    id: 'modeSelectorGroup',
                    multiple: false,
                    required: true,
                    items: [
                        {
                            type:'button',
                            icon: 'fa-hand-o-up',
                            id: 'selectMode',
                            title:'Select',
                            onoff: true,
                            currState:false,
                            callback: editor.setMode
                        },
                        {
                            type: 'button',
                            icon: 'fa-minus',
                            id:'createLineMode',
                            title:'Line',
                            onoff: true,
                            currState:true,
                            callback: editor.setMode
                        },
                        {
                            type: 'button',
                            icon: 'fa-pencil',
                            id: 'createFreeMode',
                            title:'Free Hand Drawing',
                            onoff: true,
                            currState:false,
                            callback: editor.setMode
                        },
                        {
                            type: 'button',
                            icon: 'fa-square-o',
                            id: 'createRectangleMode',
                            title:'Rectangle',
                            onoff: true,
                            currState:false,
                            callback: editor.setMode
                        },
                        {
                            type: 'button',
                            icon: 'fa-circle-o',
                            id: 'createEllipseMode',
                            title:'Ellipse',
                            onoff: true,
                            currState:false,
                            callback: editor.setMode
                        },
                        {
                            type: 'button',
                            icon: 'fa-magic',
                            id: 'magicMode',
                            title:'Magic',
                            onoff: true,
                            currState:false,
                            callback: editor.setMode
                        },
                        {
                            type: 'button',
                            icon: 'fa-bolt',
                            id: 'lightningMode',
                            title:'Lightning',
                            onoff: true,
                            currState:false,
                            callback: editor.setMode
                        }
                    ]
                }
            ]   //Groups inside this menu
        },
        {
            type: 'main',
            id: 'edit',
            title: 'Edit', //Name of menu
            icon: 'fa-edit', //Font awesome icon name
            groups: [
                {
                    type: 'group',
                    id: 'colorGroup',
                    items: [
                        {
                            type: 'color',
                            id: 'fillColor',
                            title:'Fill',
                            text: 'Fill Color',
                            currState: 'none',
                            icon: 'fa-tint',
                            callback: editor.setFillColor,
                        },
                        {
                            type: 'color',
                            id: 'strokeColor',
                            title:'Stroke Color',
                            currState: '#000',
                            icon: 'fa-tint', 
                            text: 'Stroke',
                            callback: editor.setStrokeColor,
                        },
                    ]
                },
                {
                    type: 'group',
                    id: 'delete',
                    items: [
                        {
                            type: 'button',
                            id: 'delete',
                            title: 'Delete',
                            icon: 'fa-eraser', //Font awesome icon name
                            onoff: false,  //Is a on/off button
                            callback: editor.deleteAllSelected
                        },
                    ],
                },
                {
                    type: 'group',
                    id: 'strokeProperties',
                    items: [
                        {
                            type:'list',
                            id:'stroke-width',
                            title:'Stroke Weight',
                            icon:'fa-th-list',
                            currState:2,
                            list:[{"id":1,"value":"1px"},{"id":2,"value":"2px"},{"id":3,"value":"3px"},{"id":4,"value":"4px"},{"id":5,"value":"5px"},{"id":6,"value":"6px"},{"id":7,"value":"7px"},{"id":8,"value":"8px"},{"id":9,"value":"9px"}],
                            callback:editor.setStrokeWidth
                        }
                    ]
                }
            ]  
        },
    ];
    
    this.getMenu = function (){
        return defaultMenu;
    };
    
})();
module = Akruti;
/*
{
            type: 'main',
            id: 'edit',
            title: 'Edit', //Name of menu
            icon: 'fa-edit', //Font awesome icon name
            groups: [
                {
                    type: 'group',
                    id: 'undoRedo',
                    items: [
                        {
                            type: 'button',
                            id: 'undo',
                            title: 'Undo',
                            icon: 'fa-undo',
                            onoff: false,
                            callback: this.undo
                        },
                        {
                            type: 'button',
                            id: 'redo',
                            title: 'Redo',
                            icon: 'fa-repeat', //Font awesome icon name
                            onoff: false,  //Is a on/off button
                            callback: this.redo
                        },
                    ]
                },
            ]
        }*/
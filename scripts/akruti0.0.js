var akruti = new (function() {
    
    /* Globals */
    
    var allSvg = new Object(),
    
    svgId = 1,
    
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
            //'sd' : 'stroke-dasharray',
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
        this.element.setAttribute( 'class', (editable)?'eS':'vS' ); //eS -> Editable Svg | vS -> Viewer Svg
        this.t = (editable)?'eS':'vS'; //eS -> Editable Svg | vS -> Viewer Svg


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

    var changeAttributes = function(arg) {
        
        var pastState = {'op':'ch', 'id':this.id, 'pid':this.pid };
        var newState = {'op':'ch', 'id':this.id, 'pid':this.pid };
        var j;
        var ele = (this.element)?this.element:document.getElementById(this.id);
        for(j in arg) {
            if (j in allAA[this.t]) {
                pastState[j] = this[j];
                ele.setAttribute(allAA[this.t][j],arg[j]);
                newState[j] = this[j] = arg[j];
            }
        }
        
        if (this.pseudo) {
            if (this.sw > 7) {
                this.pseudo.remove();
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
                        this.pseudo.setAttribute('class','l');
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
                        this.pseudo.setAttribute('class','e');
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
                        this.pseudo.setAttribute('class','r');
                        this.pseudo.setAttribute('x',this.x-3);
                        this.pseudo.setAttribute('y',this.y-3);
                        this.pseudo.setAttribute('h',this.h);
                        this.pseudo.setAttribute('w',this.w);
                        this.g.appendChild(this.pseudo);
                        break;
                }
            }
        }
        return {'pastState':pastState, 'newState':newState}
    };

    var Ellipse = function(arg, parent) {

        if (!parent) {
            parent = allSvg[arg.pid];
        }

        /* Creating DOM Element */
        this.g = document.createElementNS('http://www.w3.org/2000/svg','g');
        this.element = document.createElementNS('http://www.w3.org/2000/svg','ellipse');

        /* Setting Class and type */
        this.g.setAttribute( 'class', 'e');
        this.t = 'e';

        /* Setting Id */
        this.pid = parent.id;
        this.id = this.pid+this.t+ parent.childrenId++;

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
            this.pseudo.setAttribute('class','e');
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
        this.g.setAttribute( 'class', 'l');
        this.t = 'l';

        /* Setting Id */
        this.pid = parent.id;
        this.id = this.pid+this.t+ parent.childrenId++;
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
            this.pseudo.setAttribute('class','l');
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
        this.g.setAttribute( 'class', 'r');
        this.t = 'r';

        /* Setting Id */
        this.pid = parent.id;
        this.id = parent.id + 'r' + (parent.childrenId++);
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
            this.pseudo.setAttribute('class','r');
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
    
    var SelectRef =  ['topLeft', 'top', 'topRight', 'left', 'right',
                      'bottomLeft', 'bottom', 'bottomRight', 'rotate'];
    
    var resizeCursorRef = ['nw-resize', 'n-resize' , 'ne-resize', 'w-resize',
                           'e-resize', 'sw-resize', 's-resize','se-resize'];
    
    var SelectArea = function(x,y,w,h, mySvgObject) { //arg has x,y,h,w
        
        this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        
        this.pid = mySvgObject.id;
        
        this.rect.setAttribute('fill','none');
        this.rect.setAttribute('stroke','#0096fd');
        this.rect.setAttribute('stroke-width',2/mySvgObject.zoomFactor);
        this.rect.style.pointerEvents = 'none';
        //this.rect.setAttribute('stroke-dasharray','6 2');
        
        this.rect.setAttribute('x', x);
        this.rect.setAttribute('y', y);
        this.rect.setAttribute('height', h);
        this.rect.setAttribute('width', w);
        
        
        this.g.appendChild(this.rect);
        mySvgObject.g.appendChild(this.g);
        
        this.p = new Array();
        var radius = 4;
        for (var i=0;i<8;i++) {
            this.p[i] = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            this.p[i].setAttribute('fill','#0096fd');
            this.p[i].setAttribute('stroke','#fff');
            this.p[i].setAttribute('stroke-width',0.5);
            this.p[i].setAttribute('height',2*radius);
            this.p[i].setAttribute('width',2*radius);
            this.p[i].id = 'sap'+i;
            this.g.appendChild(this.p[i]);
        }
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
        
        this.p[8] = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.p[8].setAttribute('r',radius);
        this.p[8].setAttribute('fill','#0096fd');
        this.p[8].setAttribute('stroke','#fff');
        this.p[8].setAttribute('stroke-width',0.5);
        this.p[8].setAttribute('cx',x+w/2);
        this.p[8].setAttribute('cy',y-20);
        this.g.appendChild(this.p[8]);
        //<path d="M150 0 L75 200 L225 200 Z" />
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill','none');
        path.setAttribute('stroke','#0096fd');
        path.setAttribute('stroke-width',1);
        path.setAttribute('d','M '+(x+w/2)+' '+(y-20)+' v 20');
        this.g.appendChild(path);
    };

    var fillSvg = function(color){
        this.element.setAttribute( 'style', 'background-color:'+color+';');
    };

    Svg.prototype.fill = fillSvg;

    var deleteSelf = function(){
        
        var pastState = {
            'op' : 'cr',
            'pid': this.pid,
            't'  : this.t,
        }
        for (var i in allAA[this.t]) {
            pastState[i] = this[i];
        }
        
        this.g.remove();
        var arr = allSvg[this.pid].children;
        arr.splice(arr.indexOf(this),1);
        var newState = {
            'op' :'d',
            'id' :this.id,
            'pid':this.pid,
            't'  :this.t
        }
        return {'pastState':pastState, 'newState':newState}
    };

    Line.prototype.delete = deleteSelf;
    Ellipse.prototype.delete = deleteSelf;
    Rectangle.prototype.delete = deleteSelf;


    this.init = function(parent) {
        var dim = parent.getBoundingClientRect();
        var arg = {
            h:(dim.bottom-dim.top-90),
            w:(dim.right-dim.left-160)
        };
        
        var svgObject = new Svg(arg, parent, true);
        allSvg[svgObject.id] = svgObject;
        this.resize();
    };

    this.selectOperation = function(op) {
        editor.currentMode = op;
    };

    this.performOp = function (data) {
        var returnValue;
        
        if (data instanceof Array) {
            var i;
            returnValue = {};
            returnValue.pastState = new Array();
            returnValue.newState = data;
            for(i=0;i<data.length;i++) {
                returnValue.pastState[i] = this.performOp(data[i]);
            }
        }
        else
        if (data.op == 'cr') {
            var myObject;
            switch (data.t) {
            case 'e':
                myObject = new Ellipse(data);
                allSvg[myObject.pid].children.push(myObject);
                break;
            case 'l':
                myObject = new Line(data);
                allSvg[myObject.pid].children.push(myObject);
                break;
            case 'r':
                myObject = new Rectangle(data);
                allSvg[myObject.pid].children.push(myObject);
                break;
            
                
            }
            var pastState = {
                'op' : 'd',
                't'  : myObject.t,
                'id' : myObject.id,
                'pid': myObject.pid,
                
            }
            var newState = data;
            returnValue = {
                'pastState': pastState,
                'newState': newState
            };
        }
        else
        if (data.op == 'd') {
            var myObject = $('#' + data.id +'g').data('myObject');
            returnValue = myObject.delete();
        }
        else
        if (data.op == 'ch') {
            var myObject = $('#' + data.id + 'g').data('myObject');
            returnValue = myObject.changeAttributes(data);
        }
        return returnValue;
    };
    
    this.getMenu = function (){
        return [
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
                        items: [
                            {
                                type:'button',
                                icon: 'fa-hand-o-up',
                                id: 'selectMode',
                                title:'Select',
                                onoff: true,
                                currState:false,
                                callback: setMode
                            },
                            {
                                type: 'button',
                                icon: 'fa-minus',
                                id:'createLineMode',
                                title:'Line',
                                onoff: true,
                                currState:true,
                                callback: setMode
                            },
                            {
                                type: 'button',
                                icon: 'fa-pencil',
                                id: 'createFreeMode',
                                title:'Free Hand Drawing',
                                onoff: true,
                                currState:false,
                                callback: console.log
                            },
                            {
                                type: 'button',
                                icon: 'fa-square-o',
                                id: 'createRectangleMode',
                                title:'Rectangle',
                                onoff: true,
                                currState:false,
                                callback: setMode
                            },
                            {
                                type: 'button',
                                icon: 'fa-circle-o',
                                id: 'createEllipseMode',
                                title:'Ellipse',
                                onoff: true,
                                currState:false,
                                callback: setMode
                            },
                            {
                                type: 'button',
                                icon: 'fa-magic',
                                id: 'magicMode',
                                title:'Magic',
                                onoff: true,
                                currState:false,
                                callback: console.log
                            },
                            {
                                type: 'button',
                                icon: 'fa-bolt',
                                id: 'lightningMode',
                                title:'Lightning',
                                onoff: true,
                                currState:false,
                                callback: console.log
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
                        id: 'g1',
                        items: [
                            {
                                type: 'color',
                                id: 'fillColor',
                                title:'Fill',
                                text: 'Fill Color',
                                icon: 'fa-tint',
                                callback: setFillColor,
                            },
                            {
                                type: 'color',
                                id: 'strokeColor',
                                title:'Stroke Color',
                                icon: 'fa-tint', 
                                text: 'Stroke',
                                callback: setStrokeColor,
                            },
                            /*{
                                type: 'size',
                                id: 'strokeWidth', 
                                title: 'Stroke Width', //Name of button
                                icon: 'fa-barcode', //Font awesome icon name
                                currState: 2, //Default size
                                rangeStart: 2, //Minimum size
                                rangeEnd: 20,   //Maximum size
                                callback: setStrokeWidth,  //Callback on change
                            },*/
                        ],
                    },
                    {
                        type: 'group',
                        id: 'g2',
                        items: [
                            {
                                type: 'button',
                                icon: 'fa-reply',
                                callback: Base.undo,
                            },
                            {
                                type: 'button',
                                icon: 'fa-share',
                                callback: Base.redo,
                            },
                            {
                                type: 'button',
                                icon: 'fa-eraser',
                                callback: deleteElement
                            },
                        ]
                    }
                ]  
            },
        ]
    };
    
    var setMode = function(mode,onOff){
        if (onOff == true) {
            editor.currentMode = mode;
        }
    };
    
    var setFillColor = function(id, color){
        editor.fillColor = color;
    };
    
    var setStrokeColor = function(id, color){
        editor.strokeColor = color;
    };
    
    var deleteElement = function(a,b){
        console.log(a,b)
    };
    
    this.getFileData = function(svg) {
        var data = new Array();
        var element = $('#'+svg.id).data('myObject');
        for (var i=0; i<element.children.length; i++) {
            data[i] = new Object();
            data[i]['id'] = element.children[i]['id'];
            data[i]['pid'] = element.children[i]['pid'];
            data[i]['t'] = element.children[i]['t'];
            for (var j in allAA[element.children[i]['t']]) {
                data[i][j] = element.children[i][j];
            }
        }
        return data;
    };
    
    var editor = new (function() {

        var superParent = window;

        this.currentMode = 'createLineMode';
        this.strokeWidth = 2;
        this.strokeColor = '#555';
        this.fillColor   = 'none';
        
        actives = new Object();
        actives.list = new Array();
        
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
                for (var j in arg1) {
                    if (arg1[j] != arg2[j]) {
                        return false;
                    }
                }
            }
            return true;
            
        };

        var select = function(obj) {
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
            if (actives.select) {
                actives.select.g.remove();
                delete actives.select;
            }
            actives.select = new SelectArea(x1, y1, x2-x1, y2-y1, allSvg[obj.pid]);
            var pivots = actives.select.p;
            for (var i=0;i<pivots.length;i++) {
                $(pivots[i]).on('mousedown',resizeElement).css('cursor',resizeCursorRef[i]);
            }
            
        };
        
        var activateElement = function(){
            
            if (actives.list.length == 0) {
                $(superParent).one('mousedown',deactivateAll);
            }
            actives.list.push(this);
            select(this);
        };
        
        var deactivateElement = function(){
            actives.list.splice(actives.list.indexOf(this),1);
            select(this);
        };
        
        var deactivateAll = function(e){
            if (actives.select)
            {
                actives.select.g.remove();
                delete actives.select;
                actives.list.length = 0;
            }
        }

        var lineMove = function(type, ctrlKey, shiftKey) {
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
                    if (!( this.y1 >= d && this.y2 >= d )) {
                        var svg = allSvg[this.pid];
                        svg.reqH += d/svg.zoomFactor;
                        svg.svgH += d;
                        svg.element.setAttribute('height',svg.svgH);
                    }
                    break;
            
                case 'down':
                    this.changeAttributes({y1:this.y1+d,y2:this.y2+d});
                    if ( this.y1 + d <= allSvg[this.pid].h && this.y2 + d <= allSvg[this.pid].h ) {
                        this.changeAttributes({y1:this.y1+d,y2:this.y2+d});
                    }
                    break;
                
                case 'left':
                    if ( this.x1 >= d && this.x2 >= d ) {
                        this.changeAttributes({x1:this.x1-d,x2:this.x2-d});
                    }
                    break;
            
                    case 'right':
                    if ( this.x1 + d <= allSvg[this.pid].w && this.x2 + d <= allSvg[this.pid].w ) {
                        this.changeAttributes({x1:this.x1+d,x2:this.x2+d});
                    }
                break;
            
            }
            this.activate();
        };
        
        Line.prototype.move = lineMove;
        
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
            $(element).on('mousedown', svgOnMouseDown);
        };

        this.init = function(){
        };

        var keyTimeout, keyInterval, currentKey;

        $(window).on('keydown',function(e){

            switch (e.which) {

                case 46:            //DeleteKey
                    if (actives.list.length != 0) {
                        for(var i=0;i<actives.list.length;i++) {
                            actives.list[i].delete();
                        }
                        deactivateAll();
                        actives.list.length = 0;
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

        var svgOn = {
            
            createEllipseMode: {

                mousedown: function(e) {
                    var mySvgObject = e.data;

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
                    };
                    var element = new Ellipse(attributes,mySvgObject);
                    element.shiftX = x;
                    element.shiftY = y;
                    return element;
                },

                mousemove: function(e) {

                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];

                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    
                    if (e.shiftKey) {
                        var changes = svgOn.createEllipseMode.snap(element.shiftX,element.shiftY,x,y);
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
                            'cx': (x + element.shiftX) / 2,
                            'cy': (y + element.shiftY) / 2,
                            'rx': (Math.abs(x - element.shiftX)) / 2,
                            'ry': (Math.abs(y - element.shiftY)) / 2,
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
                        var changes = svgOn.createEllipseMode.snap(element.shiftX,element.shiftY,x,y);
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
                            'cx': (x + element.shiftX) / 2,
                            'cy': (y + element.shiftY) / 2,
                            'rx': (Math.abs(x - element.shiftX)) / 2,
                            'ry': (Math.abs(y - element.shiftY)) / 2,
                            });
                    }
                    
                    $(element.g).on('mousedown', elementOn.mousedown);
                    mySvgObject.children.push(element);
                    Base.addOp({
                        'op':'d',           //op = [d]elete; when this objects come, delete the Object
                        'id':element.id,
                        'pid':element.pid,
                        't'  :element.t,
                    },{
                        'op':'cr',          //op = [cr]eate; when this objects come, create the Object
                        'cx':element.cx,
                        'cy':element.cy,
                        'rx':element.rx,
                        'ry':element.ry,
                        'sc':element.sc,
                        'sw':element.sw,
                        'f' :element.f,
                        'pid':element.pid,
                        't'  :element.t,
                    });
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

                    var mySvgObject = e.data;
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
                    
                    $(element.g).on('mousedown', elementOn.mousedown);
                    mySvgObject.children.push(element);
                    Base.addOp({
                        'op':'d',           //op = [d]elete; when this objects come, delete the Object
                        'id':element.id,
                        'pid':element.pid,
                        't'  :element.t,
                    },{
                        'op':'cr',          //op = [cr]eate; when this objects come, create the Object
                        'x1':element.x1,
                        'y1':element.y1,
                        'x2':element.x2,
                        'y2':element.y2,
                        'sc':element.sc,
                        'sw':element.sw,
                        'pid':element.pid,
                        't'  :element.t,
                    });
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
                    var mySvgObject = e.data;
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
                    
                    $(element.g).on('mousedown', elementOn.mousedown);
                    mySvgObject.children.push(element);
                    Base.addOp({
                        'op':'d',           //op = [d]elete; when this objects come, delete the Object
                        'id':element.id,
                        'pid':element.pid,
                        't'  :element.t,
                    },{
                        'op':'cr',          //op = [cr]eate; when this objects come, create the Object
                        'x':element.x,
                        'y':element.y,
                        'h':element.h,
                        'w':element.w,
                        'sc':element.sc,
                        'sw':element.sw,
                        'f' :element.f,
                        'pid':element.pid,
                        't'  :element.t,
                    });
                    
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
                    return
                    var mySvgObject = e.data;
                    
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    var attributes = {
                        'x': x,
                        'y': y,
                        'h': 0,
                        'w': 0
                    };
                    element = new SelectArea(attributes, mySvgObject);
                    element.shiftX = x;
                    element.shiftY = y;
                },
                
                mousemove:function(e){
                    return;
                    var element = e.data;
                    var mySvgObject = allSvg[element.pid];
                    
                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = (e.clientX - offset.left)/mySvgObject.zoomFactor;
                    var y = (e.clientY - offset.top)/mySvgObject.zoomFactor;
                    
                    element.changeAttributes({
                            'h': Math.abs(element.shiftY - y),
                            'w': Math.abs(element.shiftX - x),
                            'x': Math.min(element.shiftX,  x),
                            'y': Math.min(element.shiftY,  y),
                        });
                },
                
                mouseup:function(e){
                    
                },
            },
            
        };

        var elementOn = {

            mousedown : function(e){
                if (editor.currentMode == 'selectMode') {
                    
                    e.stopImmediatePropagation();
                    var myObject = $(this).data('myObject');
                    if (actives.list.indexOf(myObject) == -1) {
                        if (e.ctrlKey) {
                            activateElement.apply(myObject);
                        }
                        else {
                            deactivateAll();
                            activateElement.apply(myObject);
                        }
                    }
                    else {
                        if (e.ctrlKey) {
                            deactivateElement.apply(myObject);
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
                if (actives.list[0]) select(actives.list[0]);
            },
            
            mouseup : function(e){
                
                actives.newState = new Array();
                
                for(var i=0;i<actives.list.length;i++) {
                    e.data = actives.list[i];
                    actives.newState[i] = elementMove[actives.list[i].t].mouseup(e);
                }
                if (actives.list[0]) select(actives.list[0]);
                $(superParent).off('mousemove',elementOn.mousemove).off('mouseup',elementOn.mouseup);
                
                if ( !( eq( actives.pastState, actives.newState )) ) {
                    Base.addOp(actives.pastState,actives.newState);
                }
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
                    return {
                        'op' :'ch',
                        'id' : element.id,
                        'pid': element.pid,
                        'x1' : element.x1,
                        'y1' : element.y1,
                        'x2' : element.x2,
                        'y2' : element.y2,
                    }
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
                    element.diff = {};
                    element.diff.cx = element.cx - x;
                    element.diff.cy = element.cy - y;
                    return {
                        'op' :'ch',
                        'id' : element.id,
                        'pid': element.pid,
                        'cx' : element.cx,
                        'cy' : element.cy,
                    }
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
                    element.diff = {};
                    element.diff.x = element.x - x;
                    element.diff.y = element.y - y;
                    return {
                        'op' :'ch',
                        'id' : element.id,
                        'pid': element.pid,
                        'x' : element.x,
                        'y' : element.y,
                    }
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
            
            sA:{
                mousedown:function(e) {
                    
                },
                mousemove:function(e) {
                    
                },
                mouseup:function(e) {
                    
                }
            }
        }
  
        var resizeElement = function(e){
            console.log("please Implement");
            e.stopPropagation();
        };
        
        var elementResize = {
            e:{
                left:{
                    mousedown:function(rect){
                        
                    }
                }
            }
        }

    })();
    
})();

module = akruti;

var gx;
var akruti = new (function() {

    /* Globals */

    var allSvg = new Object(),

        svgId = 1,

        svgAA = {
        },

        lineAA = {
        'x1':'x1',
        'y1':'y1',
        'x2':'x2',
        'y2':'y2',
        'sc':'stroke',
        'sw':'stroke-width',
        },

        allAA = {
        'x1':'x1',
        'y1':'y1',
        'x2':'x2',
        'y2':'y2',
        'sc':'stroke',
        'sw':'stroke-width',
        };

    var Svg = function(arg, parent, editable) {

        /* Creating DOM element */
        this.element = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg');

        /* Setting ID */
        this.id = 's'+svgId++;
        this.element.setAttribute( 'id', this.id );

        /* Setting class  and type*/
        this.element.setAttribute( 'class', (editable)?'eS':'vS' ); //sE -> Editable Svg | sV -> Viewer Svg
        this.t = (editable)?'eS':'vS'; //sE -> Editable Svg | sV -> Viewer Svg


        /* Provided Attributes | They will be applied only if they are in svgAA */
        var j;
        for (j in svgAA) {
            if (j in arg) {
                this.element.setAttribute(svgAA[j],arg[j]);
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
            var colorDark = '#eee';
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
            this.page.setAttribute('stroke', '#fff');
            this.page.setAttribute('stroke-width', '1');
            this.page.setAttribute('fill', 'url(#alpha)');
            this.g.appendChild(this.page);
        }

        /* Getting page height width */
        this.pageH = arg.h;
        this.pageW = arg.w;

        /* Default required svg Height Width | svgH and svgW can't be less than this */
        this.reqH = this.pageH;
        this.reqW = this.pageW;

        /* Calculating dimensions of svg */
        var parentDimension = parent.getBoundingClientRect();
        var h = parentDimension.height;
        var w = parentDimension.width;

        this.svgH = Math.max(h, this.reqH+50);
        this.svgW = Math.max(w, this.reqW+50);
        this.element.setAttribute('height',this.svgH);
        this.element.setAttribute('width', this.svgW);

        this.page.setAttribute('width', this.pageW);
        this.page.setAttribute('height', this.pageH);

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

    var _resize = function(zoom){
        var transFactorX,transFactorY;
        {
            transFactorX = 1;
        }
        var parentDimension = this.element.parentNode.getBoundingClientRect();
        var h = parentDimension.height;
        var w = parentDimension.width;
        this.svgH = Math.max(h, (this.zoomFactor*(this.reqH))+50);
        this.svgW = Math.max(w, (this.zoomFactor*(this.reqW))+50);
        this.element.setAttribute('height',this.svgH);
        this.element.setAttribute('width', this.svgW);

        if(!zoom){
            var viewBoxW = Math.max(this.reqW+50, w/this.zoomFactor);
            var viewBoxH = Math.max(this.reqH+50, h/this.zoomFactor);
            this.element.setAttribute( 'viewBox', '0 0 '+viewBoxW+' '+viewBoxH);
        }
        this.g.setAttribute('transform','translate('+(this.svgW-this.zoomFactor*this.pageW)/2+','+(this.svgH-this.zoomFactor*this.pageH)/2+')');
    };

    Svg.prototype.resize = _resize;

    this.resize = function () {
        for(var i in allSvg)
            allSvg[i].resize();
    };

    var _zoom = function(ratio) {
        var parentDimension = this.element.parentNode.getBoundingClientRect();
        var h = parentDimension.height;
        var w = parentDimension.width;

        this.zoomFactor = ratio;
        var viewBoxW = Math.max(this.reqW+50, w/this.zoomFactor);
        var viewBoxH = Math.max(this.reqH+50, h/this.zoomFactor);

        this.element.setAttribute('viewBox', '0 0 '+viewBoxW+' '+viewBoxH);

        this.svgH = Math.max(h, (this.zoomFactor*(this.reqH))+50);
        this.svgW = Math.max(w, (this.zoomFactor*(this.reqW))+50);

        this.element.setAttribute('height', this.svgH);
        this.element.setAttribute('width', this.svgW);
        this.resize(true);
        this.g.setAttribute('transform','translate('+(this.svgW-this.zoomFactor*this.pageW)/2+','+(this.svgH-this.zoomFactor*this.pageH)/2+')');
    }

    Svg.prototype.zoom = _zoom;

    this.zoom = function(value) {
        document.getElementById('zoomValue').innerHTML = value*100;
        allSvg['s1'].zoom(value);
    }

    /* --------------------------------Line-------------------------------- */

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
        for (j in lineAA) {
            if (j in arg) {
                /*if (j[0] == 'x' || j[0] == 'y') {
                    arg[j] /= parent.zoomFactor;
                }*/
                this.element.setAttribute(lineAA[j],arg[j]);
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

        return this;
    };

    var changeAttributes = function(arg) {

        var j;
        var forEx = {
            'op':'ch',
            'id':this.id
        };

        var ele = (this.element)?this.element:document.getElementById(this.id);
        for(j in arg) {
            if (j in allAA) {
                /*if (j[0] == 'x' || j[0] == 'y') {
                    arg[j] /= allSvg[this.pid].zoomFactor;
                }*/
                forEx[j] = this[j];

                ele.setAttribute(allAA[j],arg[j]);
                this[j] = arg[j];
            }
        }

        if (this.pseudo) {
            if (this.sw > 7) {
                this.pseudo.remove();
            }
            else {
                this.pseudo.setAttribute('x1',this.x1);
                this.pseudo.setAttribute('y1',this.y1);
                this.pseudo.setAttribute('x2',this.x2);
                this.pseudo.setAttribute('y2',this.y2);
            }
        }
        return this;
    };

    Line.prototype.changeAttributes = changeAttributes;

    var activate = function() {

        this.deactivate();
        var g = document.createElementNS('http://www.w3.org/2000/svg','g');
        var ends = new Array();
        var i;
        for (i=0;i<this.pivots.length;i++) {
            ends[i] = document.createElementNS('http://www.w3.org/2000/svg','circle');
            ends[i].setAttribute('r',+Math.max(+this.sw,4));
            ends[i].setAttribute('fill','#057cb8');
            ends[i].setAttribute('stroke','#fff');
            g.appendChild(ends[i]);
            ends[i].setAttribute('cx', this.pivots[i][0]);
            ends[i].setAttribute('cy', this.pivots[i][1]);
        }
        g.setAttribute('id',this.id +'ga');
        allSvg[this.pid].g.appendChild(g);
        this.active = g;
        return this;
    }
    

    var deactivate = function(){

        if(this.active)  {
            this.active.remove(this.active);
            delete this.active;
        }
        return this;
    };


    Line.prototype.activate = activate;
    Line.prototype.deactivate = deactivate;

    var fillSvg = function(color){
        this.element.setAttribute( 'style', 'background-color:'+color+';');
    };

    Svg.prototype.fill = fillSvg;

    var deleteSelf = function(){
        this.deactivate();
        this.g.remove();
        var arr = allSvg[this.pid].children;
        arr.splice(arr.indexOf(this),1);
        var forEx = {
            'op':'d',
            't' :this.t
        };
        for ( var i in allAA ) {
            if( i in this ) {
                forEx[i] = this[i];
            }
        }
        opQueue.addOp(forEx,{});
    };

    Line.prototype.delete = deleteSelf;



    this.init = function(arg) {
        var svgObject = new Svg(arg.attributes, arg.parent, true);
        allSvg[svgObject.id] = svgObject;
    };

    this.selectOperation = function(op) {
        editor.currentMode = op;
    };



    this.performOp = function(data) {
        switch (data.op) {

            case 'cr':
                document.getElementById(data.id).parentNode.myObject.delete();
                break;

            case 'd':
                switch (data.t) {
                    case 'l':
                        var newEle = new Line(data);
                    break;
                }
                break;

            case 'ch':
                document.getElementById(data.id).parentNode.myObject.changeAttributes(data);
                break;
        }
    };

    var editor = new (function() {

        var superParent = window;

        this.currentMode = 'createLineMode';

        var actives = new Array();

        var getStrokeWidth = function(){

            return +document.getElementById('strokeWidth').value;
        }

        var getStrokeColor = function(){

            return '#'+document.getElementById('strokeColor').value;
        }

        var getFillColor = function(){

            return '#'+document.getElementById('fillColor').value;
        }

        var activateElement = function(){
            if (actives.length == 0) {
                $(superParent).on('mousedown',deselectAll);
            }
            this.activate();
            actives.push(this);
            return this;
        };

        Line.prototype.activateElement = activateElement;
        
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

        var deselectAll = function(e){

            if(e) $(superParent).off('mousedown',deselectAll);
            var i;
            for(i=0;i<actives.length;i++)
            {
                actives[i].deactivate();
            }
            actives.length = 0;
        }

        this.makeEditable = function(element) {
            $(element).on('mousedown', svgOnMouseDown);
        };

        this.init = function(){
        };

        var keyTimeout, keyInterval, currentKey;

        $(window).on('keydown',function(e){

            switch (e.which) {

                case 46:            //DeleteKey
                    if (actives.length != 0) {
                        for(var i=0;i<actives.length;i++) {
                            actives[i].delete();
                        }
                        actives.length = 0;
                    }
                    break;

                case 37:            //Left Arrow Key
                    if (actives.length != 0) {
                        currentKey = 37;
                        clearTimeout(keyTimeout);
                        clearInterval(keyInterval);

                        actives.forEach(function(element){
                            element.move('left', e.ctrlKey, e.shiftKey);
                            element.activate();
                        });

                        keyTimeout = setTimeout(function(){
                            keyInterval = setInterval(function(){
                                actives.forEach(function(element){
                                    element.move('left', e.ctrlKey, e.shiftKey);
                                    element.activate();
                                });
                            },100);
                        },750);

                    }
                    break;

                case 38:            //Up Arrow Key
                    if (actives.length != 0) {
                        currentKey = 38;
                        clearTimeout(keyTimeout);
                        clearInterval(keyInterval);

                        actives.forEach(function(element){
                            element.move('up',e.ctrlKey, e.shiftKey);
                            element.activate();
                        });

                        keyTimeout = setTimeout(function(){
                            keyInterval = setInterval(function(){
                                actives.forEach(function(element){
                                    element.move('up',e.ctrlKey, e.shiftKey);
                                    element.activate();
                                });
                            },100);
                        },750);

                    }
                    break;

                case 39:            //Right Arrow Key
                    if (actives.length != 0) {
                        currentKey = 39;
                        clearTimeout(keyTimeout);
                        clearInterval(keyInterval);

                        actives.forEach(function(element){
                            element.move('right', e.ctrlKey, e.shiftKey);
                            element.activate();
                        });

                        keyTimeout = setTimeout(function(){
                            keyInterval = setInterval(function(){
                                actives.forEach(function(element){
                                    element.move('right', e.ctrlKey, e.shiftKey);
                                    element.activate();
                                });
                            },100);
                        },750);

                    }
                    break;

                case 40:            //Down Arrow Key
                    if (actives.length != 0) {
                        currentKey = 40;
                        clearTimeout(keyTimeout);
                        clearInterval(keyInterval);

                        actives.forEach(function(element){
                            element.move('down', e.ctrlKey, e.shiftKey);
                            element.activate();
                        });

                        keyTimeout = setTimeout(function(){
                            keyInterval = setInterval(function(){
                                actives.forEach(function(element){
                                    element.move('down', e.ctrlKey, e.shiftKey);
                                    element.activate();
                                });
                            },100);
                        },750);

                    }
                    break;

                default:
                    log(e.which);
            }
        });

        $(window).on('keyup',function(e){

            switch (e.which) {

                case 37:            //Left Arrow Key
                    if (actives.length != 0) {
                        if (currentKey == 37) {
                            currentKey = null;
                        }
                        clearTimeout(keyTimeout);
                        clearInterval(keyInterval);
                    }
                    break;

                case 38:            //Up Arrow Key
                    if (actives.length != 0) {
                        if (currentKey == 38) {
                            currentKey = null;
                        }
                        clearTimeout(keyTimeout);
                        clearInterval(keyInterval);

                    }
                    break;

                case 39:            //Right Arrow Key
                    if (actives.length != 0) {
                        if (currentKey == 39) {
                            currentKey = null;
                        }
                        clearTimeout(keyTimeout);
                        clearInterval(keyInterval);

                    }
                    break;

                case 40:            //Down Arrow Key
                    if (actives.length != 0) {
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

            createLineMode: {

                mousedown: function(e) {

                    var mySvgObject = e.data;

                    var offset = mySvgObject.page.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    var attributes = {
                        'x1':x,
                        'y1':y,
                        'x2':x,
                        'y2':y,
                        'sc':getStrokeColor(),
                        'sw':getStrokeWidth(),
                    }
                    var element = new Line(attributes,mySvgObject);
                    return element;
                },

                mousemove: function(e) {

                    var element = e.data;

                    var offset = allSvg[element.pid].page.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    if (e.shiftKey) {
                        var changes = svgOn.lineMode.snap(activeElement.x1,activeElement.y1,x,y);
                        element.changeAttributes(changes);
                    }
                    else
                    {
                        element.changeAttributes({'x2':x,'y2':y});
                    }
                },

                mouseup: function(e) {

                    var element = e.data;

                    var offset = allSvg[element.pid].page.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;

                    if (e.shiftKey) {

                        var changes = svgOn.lineMode.snap(this.x1,this.y1,x,y);
                        element.changeAttributes(changes);
                    }
                    else
                    {
                        element.changeAttributes({x2:x,y2:y});
                    }

                    element.pivots = [ [element.x1, element.y1], [element.x2, element.y2]];
                    $(element.g).on('mousedown', lineOn.mousedown);
                    allSvg[element.pid].children.push(element);
                    opQueue.addOp({
                        'ex':'d',           //ex = [d]elete; when this objects come, delete the Object
                        'id':element.id,
                        'pid':element.pid,
                        },{
                        'op':'cr',          //op = [cr]eate; when this objects come, create the Object
                        'x1':element.x1,
                        'y1':element.y1,
                        'x2':element.x2,
                        'y2':element.y2,
                        'sc':element.sc,
                        'sw':element.sw,
                        'pid':element.pid
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
            selectMode: {
                mousedown:function(e){
                    return;
                    log('unimplemented: svgOn -> selectMode -> mousedown fired');
                },
                mousemove:function(e){},
                mouseup:function(e){},
            },
        };

        lineOn = {

            mousedown : function(e){
                if (editor.currentMode == 'selectMode') {
                    e.stopImmediatePropagation();
                    $(this).data('myObject').activateElement();
                    for(var i=0;i<actives.length;i++) {
                        move[actives[i].t].mousedown(e,actives[i]);
                    }
                    $(superParent).on('mousemove',lineOn.mousemove).on('mouseup',lineOn.mouseup);
                }
            },
            mousemove : function(e){
                for(var i=0;i<actives.length;i++) {
                    move[actives[i].t].mousemove(e,actives[i]);
                    actives[i].activate();
                }
            },
            mouseup : function(e){
                $(superParent).off('mousemove',lineOn.mousemove).off('mouseup',lineOn.mouseup);
            },
        }


        move = {

            l : {

                mousedown: function(e,element) {

                    var offset = allSvg[element.pid].page.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    element.dx1 = element.x1 - x;
                    element.dy1 = element.y1 - y;
                    element.dx2 = element.x2 - x;
                    element.dy2 = element.y2 - y;
                },

                mousemove:function(e,element){
                    var offset = allSvg[element.pid].page.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    var changes = {
                        'x1':element.dx1+x,
                        'y1':element.dy1+y,
                        'x2':element.dx2+x,
                        'y2':element.dy2+y,
                    }
                    element.changeAttributes(changes);
                    element.pivots = [ [changes.x1, changes.y1], [changes.x2, changes.y2]];

                },

                mouseup:function(e){
                },

            },
        }

    })();
})();


window.onresize = function(){
    akruti.resize();
};

window.onload = function(){
    akruti.init({
        parent:document.getElementById('svgParent'),
        attributes:{
            'h':450,
            'w':800,
        }
    });
    module = akruti;
}

function log(arg) {
    var string = '| ';
    if (typeof(arg) == 'object') {
        for (var i in arg) {
            string += i+' -> '+arg[i]+' | '
        }
    }
    else
        string = arg;
    document.getElementById('statusbar').innerHTML=string;
    return string;
}
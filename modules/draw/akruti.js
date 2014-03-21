var gx;
var akruti = new (function(){

    /* Globals */

    var allSvg = new Object();

    var currentWorkingSvg;

    var svgId = 1;

    var svgAllowedAttributes = [{'height':'h'},{'width':'w'}];

    /*  Base Objects  Definitions */

    // Svg Object
    var Svg = function(parent, attributes, editable) {

        this.element = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg');

        this.element.setAttribute( 'version', '1.1');
        this.element.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg');

        for (var j in attributes ) {
            if ( svgAllowedAttributes.indexOf(j) != -1) {
                this.element.setAttribute(j, attributes[j]);
                this[j] = attributes[j];
            }
        }
        this.id = 's'+svgId++;
        this.element.setAttribute( 'id', this.id );

        this.element.myObject = this;

        /* Creating Dummy Rectangle so that svg has specified Height Width */
        var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
        rect.setAttribute('x', '0');
        rect.setAttribute('y', '0');
        rect.setAttribute('width', attributes.width);
        rect.setAttribute('height', attributes.height);
        rect.style.fill="transparent";
        this.element.appendChild(rect);

        parent.appendChild(this.element);

        if (editable) {
            editor.init(this.element);
        }

        this.childrenId = 1;
        this.children = new Array();

        return this;
    }

    var Line = function(arg) {
        this.element = document.createElementNS('http://www.w3.org/2000/svg','line');
        var j;
        for (j in arg) {
            this.element.setAttribute(j,arg[j]);
            this[j] = arg[j];
        }

        this.id = currentWorkingSvg.id+'l'+(currentWorkingSvg.myObject.childrenId++);
        this.element.setAttribute( 'id', this.id);
        this.element.setAttribute( 'class', 'line');
        this.element.myObject = this;

        currentWorkingSvg.appendChild(this.element);

        return this;
    };

    var Rectangle = function(arg) {
        this.element = document.createElementNS('http://www.w3.org/2000/svg','rect');
        var j;
        for (j in arg) {
            this.element.setAttribute(j,arg[j]);
            this[j] = arg[j];
        }

        this.id = currentWorkingSvg.id+'r'+(currentWorkingSvg.myObject.childrenId++);
        this.element.setAttribute( 'id', this.id);
        this.element.setAttribute( 'class', 'rect');
        this.element.myObject = this;

        currentWorkingSvg.appendChild(this.element);
        return this;
    }

    var Ellipse = function(arg) {
        this.element = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
        var j;
        for (j in arg) {
            this.element.setAttribute(j,arg[j]);var Derek = new Person();
            this[j] = arg[j];
        }

        this.id = currentWorkingSvg.id+'e'+(currentWorkingSvg.myObject.childrenId++);
        this.element.setAttribute( 'id', this.id);
        this.element.setAttribute( 'class', 'ellipse');
        this.element.myObject = this;

        currentWorkingSvg.appendChild(this.element);
        return this;
    }

    var FreeHandDrawing = function(arg) {
        this.element = document.createElementNS('http://www.w3.org/2000/svg','polyline');
        var j;
        for (j in arg) {
            this.element.setAttribute(j,arg[j]);
            this[j] = arg[j];
        }

        this.id = currentWorkingSvg.id+'f'+(currentWorkingSvg.myObject.childrenId++);
        this.element.setAttribute( 'id', this.id);
        this.element.setAttribute( 'class', 'free');
        this.element.myObject = this;

        currentWorkingSvg.appendChild(this.element);
        return this;
    }

    var changeAttributes = function(arg){
        var j;
        for(j in arg) {
            this.element.setAttribute(j,arg[j]);
            this[j] = arg[j];
        }
    };

    Line.prototype.changeAttributes = changeAttributes;
    Rectangle.prototype.changeAttributes = changeAttributes;
    Ellipse.prototype.changeAttributes = changeAttributes;
    FreeHandDrawing.prototype.changeAttributes = changeAttributes;

    var lineActivate = function(){
        this.deactivate();
        var g = document.createElementNS('http://www.w3.org/2000/svg','g');
        var ends = new Array();
        var i;
        for (i=0;i<2;i++) {
            ends[i] = document.createElementNS('http://www.w3.org/2000/svg','circle');
            ends[i].setAttribute('r',+this["stroke-width"]);
            ends[i].setAttribute('fill','#057cb8');
            ends[i].setAttribute('stroke','#454545');
            g.appendChild(ends[i]);
        }
        ends[0].setAttribute('cx',this.x1);
        ends[0].setAttribute('cy',this.y1);
        ends[1].setAttribute('cx',this.x2);
        ends[1].setAttribute('cy',this.y2);
        g.setAttribute('id','g'+this.id);
        document.getElementById(this.id).parentNode.appendChild(g);
    }

    var freeActivate = function(){
        this.deactivate();
        var g = document.createElementNS('http://www.w3.org/2000/svg','g');
        var ends = new Array();
        var i;
        for (i=0;i<2;i++) {
            ends[i] = document.createElementNS('http://www.w3.org/2000/svg','circle');
            ends[i].setAttribute('r',+this["stroke-width"]);
            ends[i].setAttribute('fill','#057cb8');
            ends[i].setAttribute('stroke','#454545');
            g.appendChild(ends[i]);
        }
        ends[0].setAttribute('cx',this.firstX);
        ends[0].setAttribute('cy',this.firstY);
        ends[1].setAttribute('cx',this.lastX);
        ends[1].setAttribute('cy',this.lastY);
        g.setAttribute('id','g'+this.id);
        document.getElementById(this.id).parentNode.appendChild(g);
    }
    
    var lineActivate = function(){
        this.deactivate();
        var g = document.createElementNS('http://www.w3.org/2000/svg','g');
        var ends = new Array();
        var i;
        for (i=0;i<2;i++) {
            ends[i] = document.createElementNS('http://www.w3.org/2000/svg','circle');
            ends[i].setAttribute('r',+this["stroke-width"]);
            ends[i].setAttribute('fill','#057cb8');
            ends[i].setAttribute('stroke','#454545');
            g.appendChild(ends[i]);
        }
        ends[0].setAttribute('cx',this.x1);
        ends[0].setAttribute('cy',this.y1);
        ends[1].setAttribute('cx',this.x2);
        ends[1].setAttribute('cy',this.y2);
        g.setAttribute('id','g'+this.id);
        document.getElementById(this.id).parentNode.appendChild(g);
    }

    var deactivate = function(){
        var g = document.getElementById('g'+this.id);
        if(g) g.parentNode.removeChild(g);
    };

    Line.prototype.activate = lineActivate;
    FreeHandDrawing.prototype.activate = freeActivate;

    Line.prototype.deactivate = deactivate;
    Rectangle.prototype.deactivate = deactivate;
    Ellipse.prototype.deactivate = deactivate;
    FreeHandDrawing.prototype.deactivate = deactivate;

    this.init = function(arg) {
        var svgObject = new Svg(arg.parent,arg.attributes,true);
        allSvg[svgObject.id] = svgObject;
    };

    this.selectOperation = function(op) {
            editor.currentMode = op;
    }

    var editor = new (function() {

        var superParent = window;

        this.currentMode = 'lineMode';

        var activeElement;

        var svgOnMouseUpFunction = function(ev){

            superParent.removeEventListener('mousemove',svgOn[editor.currentMode].mousemove);
            superParent.removeEventListener('mouseup',svgOnMouseUpFunction);

            svgOn[editor.currentMode].mouseup(ev);

        };

        var svgOnMouseDownFunction = function(e) {
            if (e.which == 1) {
                currentWorkingSvg = this;

                svgOn[editor.currentMode].mousedown(e);

                superParent.addEventListener('mousemove',svgOn[editor.currentMode].mousemove);
                superParent.addEventListener('mouseup',svgOnMouseUpFunction);
            }
        };

        var selectMouseClick = function(e){
            superParent.removeEventListener('mousedown', selectMouseClick);
            activeElement.deactivate();
            activeElement = null;
        }

        this.init = function(element) {
            element.addEventListener('mousedown', svgOnMouseDownFunction);
        };


        svgOn = {
            lineMode: {
                mousedown:function(e) {
                    var offset = currentWorkingSvg.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    activeElement = new Line({
                        'x1'		:x,
                        'y1'		:y,
                        'x2'		:x,
                        'y2'		:y,
                        'stroke'	:'black',
                        'stroke-width'	:5,
                        'stroke-linecap':'round',
                    });
                },

                mousemove:function(e){
                    var offset = currentWorkingSvg.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    if (e.shiftKey) {
                        var changes = svgOn.lineMode.snap(activeElement.x1,activeElement.y1,x,y);
                        activeElement.changeAttributes(changes);
                    }
                    else
                    {
                        activeElement.changeAttributes({x2:x,y2:y});
                    }
                },

                mouseup:function(e){
                    var offset = currentWorkingSvg.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    if (x == activeElement.x1 && y == activeElement.y1 ) {  //Checking if element is tiny
                        currentWorkingSvg.removeChild(activeElement.element)            // (i.e. zero sized)
                    }
                    else {
                        if (e.shiftKey) {
                            var changes = svgOn.lineMode.snap(activeElement.x1,activeElement.y1,x,y);
                            activeElement.changeAttributes(changes);
                        }
                        else
                        {
                            activeElement.changeAttributes({x2:x,y2:y});
                        }

                        activeElement.element.addEventListener('click',lineOn.click);
                        activeElement.element.addEventListener('mousedown',lineOn.mousedown);
                        (delete activeElement.element) || (activeElement.element = null);
                        currentWorkingSvg.myObject.children.push(activeElement)

                    }
                    activeElement = null;
                },
                snap: function(x1,y1,x2,y2) {

                    var dx = x2 - x1;
                    var dy = y2 - y1;
                    var slope = dy / dx;
                    var c1 = Math.tan(Math.PI/8);//0.41421356237309504880168872420969807856967187537694;
                    var c2 = Math.tan(3*Math.PI/8);//2.41421356237309504880168872420969807856967187537694;

                    if (dx >= 0 && dy < 0) {

                        if ((slope < 0) && (slope >= -c1)) {

                            return ({
                                x2: x2,
                                y2: y1
                            });

                        } else
                        if ((slope < -c1) && (slope >= -c2)) {

                            if (slope > -1) {

                                return ({
                                    x2: x2,
                                    y2: x1 - x2 + y1
                                });
                            } else {
                                return ({
                                    x2: x1 - y2 + y1,
                                    y2: y2
                                });
                            }
                        } else {
                            return ({
                                x2: x1,
                                y2: y2,
                            });
                        }

                    } else
                    if ((dx < 0) && (dy < 0)) {

                        if (slope < c1) {
                            return ({
                                x2: x2,
                                y2: y1,
                            });
                        } else
                        if ((slope >= c1) && (slope < c2)) {

                            if (slope < 1) {
                                return ({
                                    x2: x2,
                                    y2: y1 - x1 + x2,
                                });
                            } else {
                                return ({
                                    x2: y2 - y1 + x1,
                                    y2: y2,
                                });
                            }
                        } else {
                            return ({
                                x2: x1,
                                y2: y2,
                            });
                        }
                    } else
                    if ((dx < 0) && (dy >= 0)) {

                        if (slope < -c2) {
                            return ({
                                x2: x1,
                                y2: y2,
                            });
                        } else
                        if ((slope >= -c2) && (slope < -c1)) {

                            if (slope < -1) {
                                return ({
                                    x2: x1 - y2 + y1,
                                    y2: y2,
                                });
                            } else {
                                return ({
                                    x2: x2,
                                    y2: x1 + y1 - x2,
                                });
                            }
                        } else {
                            return ({
                                x2: x2,
                                y2: y1,
                            });
                        }
                    } else {
                        if (slope < c1) {
                            return ({
                                x2: x2,
                                y2: y1,
                            });
                        } else
                        if ((slope >= c1) && (slope < c2)) {
                            if (slope < 1) {
                                return ({
                                    x2: x2,
                                    y2: x2 - x1 + y1,
                                });
                            } else {
                                return ({
                                    x2: y2 - y1 + x1,
                                    y2: y2,
                                });
                            }
                        } else {
                            return ({
                                x2: x1,
                                y2: y2,
                            });
                        }
                    }

                },

            },
            rectangleMode: {
                mousedown:function(e){
                    var offset = currentWorkingSvg.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    activeElement = new Rectangle({
                        'x'     : x,
                        'y'     : y,
                        'height': 0,
                        'width' : 0,
                        'stroke': 'black',
                        'stroke-width': 2,
                        //'style' : 'fill:transparent'
                        'fill':'transparent'
                    });
                    activeElement.pivotX = x;
                    activeElement.pivotY = y;
                },
                mousemove:function(e){
                    var offset = currentWorkingSvg.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    if(e.shiftKey){
                        var sideLength = Math.max(
                                            Math.abs(activeElement.pivotY - y),
                                            Math.abs(activeElement.pivotX - x)
                                         );
                        activeElement.changeAttributes({

                            'x': (x > activeElement.pivotX )?
                                    activeElement.pivotX :
                                        activeElement.pivotX - sideLength,

                            'y': (y > activeElement.pivotY )?
                                    activeElement.pivotY :
                                        activeElement.pivotY - sideLength,

                            'height': sideLength,
                            'width': sideLength
                        });
                    }
                    else {
                        activeElement.changeAttributes({
                            'height': Math.abs(activeElement.pivotY - y),
                            'width': Math.abs(activeElement.pivotX - x),
                            'x': Math.min(activeElement.pivotX, x),
                            'y': Math.min(activeElement.pivotY, y),
                        });
                    }
                },
                mouseup:function(e){
                    var offset = currentWorkingSvg.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    if(e.shiftKey){
                        var sideLength = Math.max(
                                            Math.abs(activeElement.pivotY - y),
                                            Math.abs(activeElement.pivotX - x)
                                         );
                        activeElement.changeAttributes({

                            'x': (x > activeElement.pivotX )?
                                    activeElement.pivotX :
                                        activeElement.pivotX - sideLength,

                            'y': (y > activeElement.pivotY )?
                                    activeElement.pivotY :
                                        activeElement.pivotY - sideLength,

                            'height': sideLength,
                            'width': sideLength
                        });
                    }
                    else {
                        activeElement.changeAttributes({
                            'height': Math.abs(activeElement.pivotY - y),
                            'width': Math.abs(activeElement.pivotX - x),
                            'x': Math.min(activeElement.pivotX, x),
                            'y': Math.min(activeElement.pivotY, y),
                        });
                    }
                    activeElement.element.addEventListener('click',rectOn.click);
                    activeElement.element.addEventListener('mousedown',rectOn.mousedown);
                    (delete activeElement.element) || (activeElement.element = null);
                    currentWorkingSvg.myObject.children.push(activeElement)
                    activeElement = null;
                },
            },
            ellipseMode: {
                mousedown:function(e){
                    var offset = currentWorkingSvg.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    activeElement = new Ellipse({
                        'cx':x,
                        'cy':y,
                        'rx':0,
                        'ry':0,
                        'style':'fill:transparent;stroke:black;stroke-width:2',

                    })
                    activeElement.pivotX = x;
                    activeElement.pivotY = y;
                },
                mousemove:function(e){
                    var offset = currentWorkingSvg.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    if (e.shiftKey) {
                        var radius = Math.max((Math.abs(x-activeElement.pivotX))/2,(Math.abs(y-activeElement.pivotY))/2);
                        var cx = ( x > activeElement.pivotX )?
                                    (activeElement.pivotX+radius):
                                        (activeElement.pivotX-radius);
                        var cy = ( y > activeElement.pivotY )?
                                    (activeElement.pivotY+radius):
                                        (activeElement.pivotY-radius);

                        activeElement.changeAttributes({
                            'cx':cx,
                            'cy':cy,
                            'rx':radius,
                            'ry':radius,
                        })
                    }
                    else {
                        activeElement.changeAttributes({
                            'cx':(x+activeElement.pivotX)/2,
                            'cy':(y+activeElement.pivotY)/2,
                            'rx':(Math.abs(x-activeElement.pivotX))/2,
                            'ry':(Math.abs(y-activeElement.pivotY))/2,
                        })
                    }
                },
                mouseup:function(e){
                    var offset = currentWorkingSvg.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    if (e.shiftKey) {
                        var radius = Math.max((Math.abs(x-activeElement.pivotX))/2,(Math.abs(y-activeElement.pivotY))/2);
                        var cx = ( x > activeElement.pivotX )?
                                    (activeElement.pivotX+radius):
                                        (activeElement.pivotX-radius);
                        var cy = ( y > activeElement.pivotY )?
                                    (activeElement.pivotY+radius):
                                        (activeElement.pivotY-radius);

                        activeElement.changeAttributes({
                            'cx':cx,
                            'cy':cy,
                            'rx':radius,
                            'ry':radius,
                        })
                    }
                    else {
                        activeElement.changeAttributes({
                            'cx':(x+activeElement.pivotX)/2,
                            'cy':(y+activeElement.pivotY)/2,
                            'rx':(Math.abs(x-activeElement.pivotX))/2,
                            'ry':(Math.abs(y-activeElement.pivotY))/2,
                        })
                    }
                    activeElement = null;
                },
            },
            freeMode: {
                mousedown:function(e){
                    var offset = currentWorkingSvg.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    activeElement = new FreeHandDrawing({
                        'points':x+','+y,
                        'stroke':'black',
                        'stroke-width':'2',
                        'fill':'none',
                    })
                    activeElement.firstX = x;
                    activeElement.firstY = y;
                },
                mousemove:function(e){
                    var offset = currentWorkingSvg.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    activeElement.changeAttributes({
                        'points':activeElement.points+' '+x+','+y,
                    })
                },
                mouseup:function(e){
                    var offset = currentWorkingSvg.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    activeElement.changeAttributes({
                        'points':activeElement.points+' '+x+','+y,
                    })
                    activeElement.lastX = x;
                    activeElement.lastY = y;
                    akruti.test = function(){activeElement.activate()};
                },
            },
            selectMode: {
                mousedown:function(e){
                    log('Incomplete svgOn -> selectMode');
                },
                mousemove:function(e){},
                mouseup:function(e){},
            }

        }

        lineOn = {
            click:function(e){
                if (editor.currentMode == 'selectMode') {
                    log('lineClick');
                    this.myObject.activate();
                    e.stopPropagation();
                }
            },
            mousedown:function(e){
                if (editor.currentMode == 'selectMode') {
                    if (activeElement) {
                        activeElement.deactivate();
                    }
                    activeElement = this.myObject;
                    superParent.addEventListener('mousemove',lineOn.mousemove);
                    superParent.addEventListener('mouseup',lineOn.mouseup);
                    var offset = currentWorkingSvg.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    activeElement.diffX1 = activeElement.x1-x;
                    activeElement.diffY1 = activeElement.y1-y;
                    activeElement.diffX2 = activeElement.x2-x;
                    activeElement.diffY2 = activeElement.y2-y;
                    e.stopPropagation();
                }
            },
            mousemove:function(e){
                //log('lineMousemove');
                var offset = currentWorkingSvg.getBoundingClientRect();
                var x = e.clientX - offset.left;
                var y = e.clientY - offset.top;
                //activeElement.element = document.getElementById(activeElement.id);
                activeElement.changeAttributes({
                    'x1':x+activeElement.diffX1,
                    'y1':y+activeElement.diffY1,
                    'x2':x+activeElement.diffX2,
                    'y2':y+activeElement.diffY2,
                });
                activeElement.activate();

            },
            mouseup:function(e){
                superParent.removeEventListener('mousemove',lineOn.mousemove);
                superParent.removeEventListener('mouseup',lineOn.mouseup);
                superParent.addEventListener('mousedown',selectMouseClick);
                var offset = currentWorkingSvg.getBoundingClientRect();
                var x = e.clientX - offset.left;
                var y = e.clientY - offset.top;
                activeElement.activate();
            },
        }

        rectOn = {
            click:function(e){
                console.log('rectClick');
                if (editor.currentMode == 'selectMode') {
                    e.stopPropagation();
                }
            },
            
            mousedown:function(e){
                console.log('rectdown');
                if (editor.currentMode == 'selectMode') {
                    e.stopPropagation();
                
                    superParent.addEventListener('mousemove',rectOn.mousemove);
                    superParent.addEventListener('mouseup',rectOn.mouseup);
                }
            },
            
            mousemove:function(e){
                console.log('rectmove');
                
            },
            
            mouseup:function(e){
                console.log('rectup');
                superParent.removeEventListener('mousemove',rectOn.mousemove);
                superParent.removeEventListener('mouseup',rectOn.mouseup);
            },
        }

        })();
    return this;
})();

window.onload = function(){
    var i=1;
    while (i--) {
        akruti.init({
            parent:document.body,
            attributes:{
                height:450,
                width:800,
            }
        });
    }
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
}

var gx;
var akruti = new (function(){

    /* Globals */

    var allSvg = new Object();
    var svgId = 1;
    
    var svgAA = {
        'h' :'height',
        'w' :'width',
    };

    var lineAA = {
        'x1':'x1',
        'y1':'y1',
        'x2':'x2',
        'y2':'y2',
        'sc':'stroke',
        'sw':'stroke-width',
    };
    
    var allAA = {
        'x1':'x1',
        'y1':'y1',
        'x2':'x2',
        'y2':'y2',
        'sc':'stroke',
        'sw':'stroke-width',
    };
    
    var Svg = function(attributes, parent, editable) {


        /* Creating DOM element */
        this.element = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg');
	
        /* Setting ID */
        this.id = 's'+svgId++;
        this.element.setAttribute( 'id', this.id );

        /* Setting class  and type*/
        this.element.setAttribute( 'class', (editable)?'eS':'vS' ); //sE -> Editable Svg | sV -> Viewer Svg
        this.t = (editable)?'eS':'vS'; //sE -> Editable Svg | sV -> Viewer Svg
	
        /* Default Attributes | They will be same everytime */
        this.element.setAttribute( 'version', '1.1');
        this.element.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg');
	this.element.setAttribute( 'style', 'background-color:black;');
	
        /* Provided Attributes | They will be applied only if they are in svgAA */
        var j;
        for (j in attributes) {
            if (j in svgAA) {
                this.element.setAttribute(svgAA[j],attributes[j]);
                this[j] = attributes[j];
            }
        }

        /* Creating Dummy Rectangle so that svg has specified Height Width */
        {
            var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
            rect.setAttribute('x', '0');
            rect.setAttribute('y', '0');
            rect.setAttribute('width', this.w);
            rect.setAttribute('height', this.h);
            rect.setAttribute('id', 'dr'+this.id);
            rect.style.fill="transparent";
            this.element.appendChild(rect);
            this.dr = rect;         //this.dummyRect = rect;!!!
        }

        /* appending my Object in DOM object and adding DOM element to its parent*/
        this.element.myObject = this;
        parent.appendChild(this.element);

        /* Setting Editable properties */
        if (editable) {
            editor.init(this.element);
        }

        /* For Children of Svg */
        this.childrenId = 1;
        this.children = new Array();
        return this;
    };
    
    var Line = function(arg, parent) {

        if (!parent) {
            parent = document.getElementById(arg.pid);
        }
        
        /* Creating DOM Element */
        this.g = document.createElementNS('http://www.w3.org/2000/svg','g');
        this.element = document.createElementNS('http://www.w3.org/2000/svg','line');

        /* Setting Class and type */
        this.g.setAttribute( 'class', 'l');
        this.t = 'l';
	this.op = 'cr';                  //this.operation = 'create';
        
        /* Setting Id */
        this.pid = parent.id;
        this.id = this.t+parent.myObject.childrenId++;
        
        this.element.setAttribute( 'id', this.pid + this.id);
        this.g.setAttribute( 'id', this.pid + 'g' + this.id);

        /* Default Attributes */
        this.element.setAttribute('stroke-linecap','round');

        /* Provided Attributes */
        var j;
        for (j in lineAA) {
            if (j in arg) {
                this.element.setAttribute(lineAA[j],arg[j]);
                this[j] = arg[j];
            }
        }
        
        if (this.sw < 5 && false) {
            this.pseudo = document.createElementNS('http://www.w3.org/2000/svg','line');
            this.pseudo.setAttribute('stroke','transparent');
            this.pseudo.setAttribute('stroke-width',5);
            this.pseudo.setAttribute('x1',this.x1);
            this.pseudo.setAttribute('y1',this.y1);
            this.pseudo.setAttribute('x2',this.x2);
            this.pseudo.setAttribute('y2',this.y2);
            this.g.appendChild(this.pseudo);
        }
	
        /* Adding Elements to DOM */
        this.g.appendChild(this.element);
        parent.appendChild(this.g);
        
        this.g.myObject = this;

        return this;
    };
    
    var changeAttributes = function(arg) {
        
        var j;
        var ele = (this.element)?this.element:document.getElementById(this.id);
        for(j in arg) {
	    if (j in allAA) {
		ele.setAttribute(allAA[j],arg[j]);
		this[j] = arg[j];
	    }
        }
    };////////////////////////////////////////////////////

    Line.prototype.changeAttributes = changeAttributes;
    
    var lineActivate = function() {
        
        this.deactivate();
        var g = document.createElementNS('http://www.w3.org/2000/svg','g');
        var ends = new Array();
        var i;
        for (i=0;i<2;i++) {
            ends[i] = document.createElementNS('http://www.w3.org/2000/svg','circle');
            ends[i].setAttribute('r',+Math.max(+this.sw,3));
            ends[i].setAttribute('fill','#057cb8');
            ends[i].setAttribute('stroke','#000');
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
    Line.prototype.deactivate = deactivate;
    
    var fillSvg = function(color){
        
	this.element.setAttribute( 'style', 'background-color:'+color+';');
    };
    
    Svg.prototype.fill = fillSvg;
    
    
    this.init = function(arg) {
        
        var svgObject = new Svg(arg.attributes, arg.parent, true);
        allSvg[svgObject.id] = svgObject;
    };

    this.selectOperation = function(op) {
        
            editor.currentMode = op;
    };
    
    var editor = new (function() {
	
        var superParent = window;
        
        this.currentMode = 'lineMode';
	
        var getStrokeWidth = function(){
            
            return +document.getElementById('strokeWidth').value;
        }
	
        var getStrokeColor = function(){
            
            return '#'+document.getElementById('strokeColor').value;
        }
	
        var getFillColor = function(){
            
            return '#'+document.getElementById('fillColor').value;
        }
	
        	    
        var svgOnMouseDown = function(e) {
            
            if (e.which == 1) {
                e.data = this.myObject;
                var newElement = svgOn[editor.currentMode].mousedown(e);
                $(superParent).on('mousemove', newElement, svgOn[editor.currentMode].mousemove);
                $(superParent).on('mouseup', newElement, function(ev){
                    
                    $(superParent).off();
                    $(superParent).off();
                    svgOn[editor.currentMode].mouseup(ev);
                
                });    
            }
        };
	
        var selectMouseClick = function(e){
            
            superParent.removeEventListener('mousedown', selectMouseClick);
            activeElement.deactivate();
            activeElement = null;
        }
	
        this.init = function(element) {
            
            $(element).on('mousedown', svgOnMouseDown);
        };
	
        var svgOn = {
	    
            lineMode: {
		
                mousedown:function(e) {
                    
                    var mySvgObject = e.data;
                    
                    var offset = mySvgObject.dr.getBoundingClientRect();
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
                    var newElement = new Line(attributes,mySvgObject.element);
                    return newElement;
                },

                mousemove:function(e){
                    
                    var newElement = e.data;
                    var offset = newElement.g.parentNode.myObject.dr.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    if (e.shiftKey) {
                        var changes = svgOn.lineMode.snap(activeElement.x1,activeElement.y1,x,y);
                        newElement.changeAttributes(changes);
                    }
                    else
                    {
                        newElement.changeAttributes({'x2':x,'y2':y});
                    }
                },
		
                mouseup:function(e){
                    
                    var newElement = e.data;
                    var offset = newElement.g.parentNode.myObject.dr.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
		
		    if (e.shiftKey) {
			var changes = svgOn.lineMode.snap(this.x1,this.y1,x,y);
			newElement.changeAttributes(changes);
		    }
		    else
		    {
			newElement.changeAttributes({x2:x,y2:y});
		    }
		    
		    //activeElement.element.addEventListener('click',lineOn.click);
		    //activeElement.element.addEventListener('mousedown',lineOn.mousedown);
		    //(delete activeElement.element) || (activeElement.element = null);
                    //    currentWorkingSvg.myObject.children.push(activeElement);
                    //activeElement = null;
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
            selectMode: {
                mousedown:function(e){
                    log('Incomplete svgOn -> selectMode');
                },
                mousemove:function(e){},
                mouseup:function(e){},
            },
        };
        
        lineOn = {
            click:function(e){
                if (editor.currentMode == 'selectMode') {
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
		    activeElement.activate();
                    superParent.addEventListener('mousemove',lineOn.mousemove);
                    superParent.addEventListener('mouseup',lineOn.mouseup);
                    var offset = dummyRect.getBoundingClientRect();
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
                var offset = dummyRect.getBoundingClientRect();
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
                var offset = dummyRect.getBoundingClientRect();
                var x = e.clientX - offset.left;
                var y = e.clientY - offset.top;
                activeElement.activate();
            },
        }

    })();
})();


window.onload = function(){
    var i=1;
    while (i--) {
        akruti.init({
            parent:document.body,
            attributes:{
                'h':500,
                'w':window.innerWidth,
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
    return string;
}

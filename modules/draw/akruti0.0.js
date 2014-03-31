var gx;
var akruti = new(function () {

    /* Globals */

    var allSvg = new Object();

    var currentWorkingSvg;

    var svgId = 1;

    /* Allowed Attributes for different elements */
    var svgAA = {
        'h': 'height',
        'w': 'width',
    }

    var lineAA = {
        'x1': 'x1',
        'y1': 'y1',
        'x2': 'x2',
        'y2': 'y2',
        'sc': 'stroke',
        'sw': 'stroke-width',
    }

    var rectangleAA = {
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
        //'so' : 'stroke-opacity',
        //'fo' : 'fill-opacity',
        //'sj' : 'stroke-linejoin',
        //'sm' : 'stroke-mitterlimit',
    }

    var ellipseAA = {
        'rx': 'rx',
        'ry': 'ry',
        'cx': 'cx',
        'cy': 'cy',
        'f': 'fill',
        'sc': 'stroke',
        'sw': 'stroke-width',
        //'sd' : 'stroke-dasharray',
        //'so' : 'stroke-opacity',
        //'fo' : 'fill-opacity',
    }

    var freeAA = {
        'p': 'points',
        'sc': 'stroke',
        'sw': 'stroke-width',
        //'sd' : 'stroke-dasharray',
        //'so' : 'stroke-opacity',
    }

    var allAA = {
        'h': 'height',
        'w': 'width',
        'x1': 'x1',
        'y1': 'y1',
        'x2': 'x2',
        'y2': 'y2',
        'sc': 'stroke',
        'sw': 'stroke-width',
        'x': 'x',
        'y': 'y',
        'rx': 'rx',
        'ry': 'ry',
        'f': 'fill',
        'cx': 'cx',
        'cy': 'cy',
        'p': 'points',
    }

    /* Base Object prototype
        Svg = {
            'element'   :'SvgDomElement',
            't'         :'type{values=[eS,vS]}',
            'id'        :'s+SomeNumber',
            'h'         :'height',
            'w'         :'width',
            'childrenId':'aNumber',
            'children'  :'arrayOfChildren',

        }

        Line = {

        }
    */

    /*  Base Objects  Definitions */

    // Svg Object
    var Svg = function (attributes, parent, editable) {

        /* Creating DOM element */
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        /* Setting ID */
        this.id = 's' + svgId++;
        this.element.setAttribute('id', this.id);

        /* Setting class  and type*/
        this.element.setAttribute('class', (editable) ? 'eS' : 'vS'); //sE -> Editable Svg | sV -> Viewer Svg
        this.t = (editable) ? 'eS' : 'vS'; //sE -> Editable Svg | sV -> Viewer Svg

        /* Default Attributes | They will be same everytime */
        this.element.setAttribute('version', '1.1');
        this.element.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        this.element.setAttribute('style', 'background-color:black;');
        this.element.setAttribute('preserveAspectRatio', 'none');

        /* Provided Attributes | They will be applied only if they are in svgAA */
        var j;
        for (j in attributes) {
            if (j in svgAA) {
                this.element.setAttribute(svgAA[j], attributes[j]);
                this[j] = attributes[j];
            }
        }

        /* Creating Dummy Rectangle so that svg has specified Height Width */
        {
            var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', '0');
            rect.setAttribute('y', '0');
            rect.setAttribute('width', this.w);
            rect.setAttribute('height', this.h);
            rect.setAttribute('id', 'dummyRect');
            rect.style.fill = "transparent";
            this.element.appendChild(rect);
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
    }

    var Line = function (attributes, parent) {

        /* Creating DOM Element */
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'line');

        /* Setting Id */
        this.pid = parent.id;
        this.id = parent.id + 'l' + (parent.myObject.childrenId++);
        this.element.setAttribute('id', this.id);

        /* Setting Class and type */
        this.element.setAttribute('class', 'l');
        this.t = 'l';
        this.op = 'c'; //this.operation = 'create';

        /* Default Attributes */
        this.element.setAttribute('stroke-linecap', 'round');

        /* Provided Attributes */
        var j;
        for (j in lineAA) {
            if (j in attributes) {
                this.element.setAttribute(lineAA[j], attributes[j]);
                this[j] = attributes[j];
            }
        }

        /* appending my Object in DOM object and adding DOM element to its parent*/
        this.element.myObject = this;
        parent.appendChild(this.element);

        return this;
    };

    var Rectangle = function (attributes, parent) {

        /* Creating DOM Element */
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

        /* Setting Id */
        this.pid = parent.id;
        this.id = parent.id + 'r' + (parent.myObject.childrenId++);
        this.element.setAttribute('id', this.id);

        /*Setting class and shape*/
        this.element.setAttribute('class', 'r');
        this.t = 'r';
        this.op = 'c'; //this.operation = 'create';

        /* Default Attributes */
        this.element.setAttribute('rx', 0);
        this.element.setAttribute('ry', 0);

        /* Provided Attributes */
        var j;
        for (j in rectangleAA) {
            if (j in attributes) {
                this.element.setAttribute(rectangleAA[j], attributes[j]);
                this[j] = attributes[j];
            }
        }

        /* Appending my Object in DOM object and adding DOM element to its parent*/
        this.element.myObject = this;
        parent.appendChild(this.element);

        return this;
    }

    var Ellipse = function (attributes, parent) {

        /*Creating DOM object*/
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');

        /* Setting Id */
        this.pid = parent.id;
        this.id = parent.id + 'e' + (parent.myObject.childrenId++);
        this.element.setAttribute('id', this.id);

        /*Setting class and shape*/
        this.element.setAttribute('class', 'e');
        this.t = 'e';
        this.op = 'c'; //this.operation = 'create';

        /* Default Attributes */

        /* Provided Attributes */
        var j;
        for (j in ellipseAA) {
            if (j in attributes) {
                this.element.setAttribute(ellipseAA[j], attributes[j]);
                this[j] = attributes[j];
            }
        }

        /* Appending my Object in DOM object and adding DOM element to its parent*/
        this.element.myObject = this;
        parent.appendChild(this.element);

        return this;
    }

    var FreeHandDrawing = function (attributes, parent) {

        /*Creating DOM object*/
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');

        /* Setting Id */
        this.pid = parent.id;
        this.id = parent.id + 'f' + (parent.myObject.childrenId++);
        this.element.setAttribute('id', this.id);

        /*Setting class and type */
        this.element.setAttribute('class', 'f');
        this.t = 'f';
        this.op = 'c'; //this.operation = 'create';

        /* Default Attributes */
        this.element.setAttribute('stroke-linecap', 'round');
        this.element.setAttribute('stroke-linejoin', 'round');
        this.element.setAttribute('fill', 'none');

        /* Provided Attributes */
        var j;
        for (j in freeAA) {
            if (j in attributes) {
                this.element.setAttribute(freeAA[j], attributes[j]);
                this[j] = attributes[j];
            }
        }

        /* appending my Object in DOM object and adding DOM element to its parent*/
        this.element.myObject = this;
        parent.appendChild(this.element);

        return this;
    }

    var changeAttributes = function (arg) {
        var j;
        var ele = (this.element) ? this.element : document.getElementById(this.id);
        for (j in arg) {
            if (j in allAA) {
                ele.setAttribute(allAA[j], arg[j]);
                this[j] = arg[j];
            }
        }
    };

    Line.prototype.changeAttributes = changeAttributes;
    Rectangle.prototype.changeAttributes = changeAttributes;
    Ellipse.prototype.changeAttributes = changeAttributes;
    FreeHandDrawing.prototype.changeAttributes = changeAttributes;

    var lineActivate = function () {
        this.deactivate();
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        var ends = new Array();
        var i;
        for (i = 0; i < 2; i++) {
            ends[i] = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            ends[i].setAttribute('r', +Math.max(+this.sw, 3));
            ends[i].setAttribute('fill', '#057cb8');
            ends[i].setAttribute('stroke', '#454545');
            g.appendChild(ends[i]);
        }
        ends[0].setAttribute('cx', this.x1);
        ends[0].setAttribute('cy', this.y1);
        ends[1].setAttribute('cx', this.x2);
        ends[1].setAttribute('cy', this.y2);
        g.setAttribute('id', 'g' + this.id);
        document.getElementById(this.id).parentNode.appendChild(g);
    }

    var freeActivate = function () {
        this.deactivate();
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        var ends = new Array();
        var i;
        for (i = 0; i < 2; i++) {
            ends[i] = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            ends[i].setAttribute('r', +this["stroke-width"]);
            ends[i].setAttribute('fill', '#057cb8');
            ends[i].setAttribute('stroke', '#454545');
            g.appendChild(ends[i]);
        }
        ends[0].setAttribute('cx', this.firstX);
        ends[0].setAttribute('cy', this.firstY);
        ends[1].setAttribute('cx', this.lastX);
        ends[1].setAttribute('cy', this.lastY);
        g.setAttribute('id', 'g' + this.id);
        document.getElementById(this.id).parentNode.appendChild(g);
    }

    var deactivate = function () {
        var g = document.getElementById('g' + this.id);
        if (g) g.parentNode.removeChild(g);
    };

    Line.prototype.activate = lineActivate;
    FreeHandDrawing.prototype.activate = freeActivate;

    Line.prototype.deactivate = deactivate;
    Rectangle.prototype.deactivate = deactivate;
    Ellipse.prototype.deactivate = deactivate;
    FreeHandDrawing.prototype.deactivate = deactivate;

    var fillSvg = function (color) {
        this.element.setAttribute('style', 'background-color:' + color + ';');
    };

    this.init = function (parent) {
        attributes={
            'h': 500,
            'w': 500,
        }
        var svgObject = new Svg(attributes,parent, true);
        allSvg[svgObject.id] = svgObject;
    };

    this.selectOperation = function (op) {
        editor.currentMode = op;
    }

    var editor = new(function () {

        var superParent = window;

        this.currentMode = 'fourMode';

        var activeElement;

        var dummyRect;

        var getRandomColor = function () {

            return 'rgb(' + Math.floor(255 * Math.random()) + ',' + Math.floor(255 * Math.random()) + ',' + Math.floor(255 * Math.random()) + ')';

        };

        var getStrokeWidth = function (magic) {
            return (magic) ? (Math.round(4 * Math.random()) - 2) : +document.getElementById('strokeWidth').value;
        }

        var getStrokeColor = function () {
            return '#' + document.getElementById('strokeColor').value;
        }

        var getFillColor = function () {
            return '#' + document.getElementById('fillColor').value;
        }

        var svgOnMouseUpFunction = function (ev) {

            superParent.removeEventListener('mousemove', svgOn[editor.currentMode].mousemove);
            superParent.removeEventListener('mouseup', svgOnMouseUpFunction);
            svgOn[editor.currentMode].mouseup(ev);

        };

        var svgOnMouseDownFunction = function (e) {
            if (e.which == 1) {
                currentWorkingSvg = this;

                svgOn[editor.currentMode].mousedown(e);

                superParent.addEventListener('mousemove', svgOn[editor.currentMode].mousemove);
                superParent.addEventListener('mouseup', svgOnMouseUpFunction);
            }
        };

        var selectMouseClick = function (e) {
            superParent.removeEventListener('mousedown', selectMouseClick);
            activeElement.deactivate();
            activeElement = null;
        }

        this.init = function (element) {
            element.addEventListener('mousedown', svgOnMouseDownFunction);
            dummyRect = document.getElementById('dummyRect');
        };

        var svgOn = {

            lineMode: {

                mousedown: function (e) {
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    var attributes = {
                        'x1': x,
                        'y1': y,
                        'x2': x,
                        'y2': y,
                        'sc': getStrokeColor(),
                        'sw': getStrokeWidth(),
                    }
                    activeElement = new Line(attributes, currentWorkingSvg);
                },

                mousemove: function (e) {
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    if (e.shiftKey) {
                        var changes = svgOn.lineMode.snap(activeElement.x1, activeElement.y1, x, y);
                        activeElement.changeAttributes(changes);
                    } else {
                        activeElement.changeAttributes({
                            'x2': x,
                            'y2': y
                        });
                    }
                },

                mouseup: function (e) {
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;

                    if (e.shiftKey) {
                        var changes = svgOn.lineMode.snap(activeElement.x1, activeElement.y1, x, y);
                        activeElement.changeAttributes(changes);
                    } else {
                        activeElement.changeAttributes({
                            x2: x,
                            y2: y
                        });
                    }

                    activeElement.element.addEventListener('click', lineOn.click);
                    activeElement.element.addEventListener('mousedown', lineOn.mousedown);
                    (delete activeElement.element) || (activeElement.element = null);
                    currentWorkingSvg.myObject.children.push(activeElement);
                    activeElement = null;
                },

                snap: function (x1, y1, x2, y2) {

                    var dx = x2 - x1;
                    var dy = y2 - y1;
                    var slope = dy / dx;
                    var c1 = Math.tan(Math.PI / 8); //0.41421356237309504880168872420969807856967187537694;
                    var c2 = Math.tan(3 * Math.PI / 8); //2.41421356237309504880168872420969807856967187537694;

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
                mousedown: function (e) {
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    var attributes = {
                        'x': x,
                        'y': y,
                        'h': 0,
                        'w': 0,
                        'sc': getStrokeColor(),
                        'sw': getStrokeWidth(),
                        'f': getFillColor()
                    };
                    activeElement = new Rectangle(attributes, currentWorkingSvg);
                    activeElement.pivotX = x;
                    activeElement.pivotY = y;
                },
                mousemove: function (e) {
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    if (e.shiftKey) {
                        var sideLength = Math.max(
                            Math.abs(activeElement.pivotY - y),
                            Math.abs(activeElement.pivotX - x)
                        );
                        activeElement.changeAttributes({

                            'x': (x > activeElement.pivotX) ?
                                activeElement.pivotX : activeElement.pivotX - sideLength,

                            'y': (y > activeElement.pivotY) ?
                                activeElement.pivotY : activeElement.pivotY - sideLength,

                            'h': sideLength,
                            'w': sideLength
                        });
                    } else {
                        activeElement.changeAttributes({
                            'h': Math.abs(activeElement.pivotY - y),
                            'w': Math.abs(activeElement.pivotX - x),
                            'x': Math.min(activeElement.pivotX, x),
                            'y': Math.min(activeElement.pivotY, y),
                        });
                    }
                },
                mouseup: function (e) {
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    if (e.shiftKey) {
                        var sideLength = Math.max(
                            Math.abs(activeElement.pivotY - y),
                            Math.abs(activeElement.pivotX - x)
                        );
                        activeElement.changeAttributes({

                            'x': (x > activeElement.pivotX) ?
                                activeElement.pivotX : activeElement.pivotX - sideLength,

                            'y': (y > activeElement.pivotY) ?
                                activeElement.pivotY : activeElement.pivotY - sideLength,

                            'h': sideLength,
                            'w': sideLength
                        });
                    } else {
                        activeElement.changeAttributes({
                            'h': Math.abs(activeElement.pivotY - y),
                            'w': Math.abs(activeElement.pivotX - x),
                            'x': Math.min(activeElement.pivotX, x),
                            'y': Math.min(activeElement.pivotY, y),
                        });
                    }

                    if (activeElement.h == 0 && activeElement.w == 0) {
                        currentWorkingSvg.removeChild(activeElement.element);
                    } else {
                        //activeElement.element.addEventListener('click',rectOn.click);
                        //activeElement.element.addEventListener('mousedown',rectOn.mousedown);
                        //(delete activeElement.element) || (activeElement.element = null);
                        //currentWorkingSvg.myObject.children.push(activeElement);
                    }
                    activeElement = null;
                },
            },

            ellipseMode: {

                mousedown: function (e) {
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    var attributes = {
                        'cx': x,
                        'cy': y,
                        'rx': 0,
                        'ry': 0,
                        'f': getFillColor(),
                        'sc': getStrokeColor(),
                        'sw': getStrokeWidth(),
                    };
                    activeElement = new Ellipse(attributes, currentWorkingSvg);
                    activeElement.pivotX = x;
                    activeElement.pivotY = y;
                },
                mousemove: function (e) {
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    if (e.shiftKey) {
                        var radius = Math.max((Math.abs(x - activeElement.pivotX)) / 2, (Math.abs(y - activeElement.pivotY)) / 2);
                        var cx = (x > activeElement.pivotX) ?
                            (activeElement.pivotX + radius) :
                            (activeElement.pivotX - radius);
                        var cy = (y > activeElement.pivotY) ?
                            (activeElement.pivotY + radius) :
                            (activeElement.pivotY - radius);

                        activeElement.changeAttributes({
                            'cx': cx,
                            'cy': cy,
                            'rx': radius,
                            'ry': radius,
                        })
                    } else {
                        activeElement.changeAttributes({
                            'cx': (x + activeElement.pivotX) / 2,
                            'cy': (y + activeElement.pivotY) / 2,
                            'rx': (Math.abs(x - activeElement.pivotX)) / 2,
                            'ry': (Math.abs(y - activeElement.pivotY)) / 2,
                        })
                    }

                },
                mouseup: function (e) {
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    if (e.shiftKey) {
                        var radius = Math.max((Math.abs(x - activeElement.pivotX)) / 2, (Math.abs(y - activeElement.pivotY)) / 2);
                        var cx = (x > activeElement.pivotX) ?
                            (activeElement.pivotX + radius) :
                            (activeElement.pivotX - radius);
                        var cy = (y > activeElement.pivotY) ?
                            (activeElement.pivotY + radius) :
                            (activeElement.pivotY - radius);

                        activeElement.changeAttributes({
                            'cx': cx,
                            'cy': cy,
                            'rx': radius,
                            'ry': radius,
                        })
                    } else {
                        activeElement.changeAttributes({
                            'cx': (x + activeElement.pivotX) / 2,
                            'cy': (y + activeElement.pivotY) / 2,
                            'rx': (Math.abs(x - activeElement.pivotX)) / 2,
                            'ry': (Math.abs(y - activeElement.pivotY)) / 2,
                        })
                    }
                    if (activeElement.rx == 0 && activeElement.ry == 0) {
                        currentWorkingSvg.removeChild(activeElement.element);
                    } else {
                        activeElement.element.addEventListener('click', rectOn.click);
                        activeElement.element.addEventListener('mousedown', rectOn.mousedown);
                        (delete activeElement.element) || (activeElement.element = null);
                        currentWorkingSvg.myObject.children.push(activeElement)
                    }

                    activeElement = null;
                },
            },

            freeMode: {

                mousedown: function (e) {
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    var attributes = {
                        'p': x + ',' + y,
                        'sc': getStrokeColor(),
                        'sw': getStrokeWidth(),
                    }
                    activeElement = new FreeHandDrawing(attributes, currentWorkingSvg);
                    activeElement.firstX = x;
                    activeElement.firstY = y;
                },

                mousemove: function (e) {
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    activeElement.changeAttributes({
                        'p': activeElement.p + ' ' + x + ',' + y,
                    })
                },

                mouseup: function (e) {
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    activeElement.changeAttributes({
                        'p': activeElement.p + ' ' + x + ',' + y,
                    })
                    activeElement.lastX = x;
                    activeElement.lastY = y;
                },

            },

            fourMode: {

                mousedown: function (e) {
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    var all = svgOn.fourMode.getAll(x, y, offset.height, offset.width);
                    activeElement = new Array();
                    for (var i = 0; i < all.length; i++) {
                        activeElement[i] = {};
                        activeElement[i].X = all[i][0];
                        activeElement[i].Y = all[i][1];
                    }
                    activeElement['sw'] = getStrokeWidth();
                },

                mousemove: function (e) {
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    var all = svgOn.fourMode.getAll(x, y, offset.height, offset.width);
                    var color = getRandomColor();
                    activeElement['sw'] = getStrokeWidth();
                    for (var i = 0; i < all.length; i++) {
                        var attributes = {
                            'x1': activeElement[i].X,
                            'y1': activeElement[i].Y,
                            'x2': all[i][0],
                            'y2': all[i][1],
                            'sc': color,
                            'sw': activeElement['sw'],
                        }
                        activeElement[i] = new Line(attributes, currentWorkingSvg);
                        activeElement[i].X = all[i][0];
                        activeElement[i].Y = all[i][1];
                    }
                },

                mouseup: function (e) {
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    var all = svgOn.fourMode.getAll(x, y, offset.height, offset.width);
                    var color = getRandomColor();
                    activeElement['sw'] = getStrokeWidth();
                    for (var i = 0; i < all.length; i++) {
                        var attributes = {
                            'x1': activeElement[i].X,
                            'y1': activeElement[i].Y,
                            'x2': all[i][0],
                            'y2': all[i][1],
                            'sc': color,
                            'sw': activeElement['sw'],
                        }
                        activeElement[i] = new Line(attributes, currentWorkingSvg);
                        activeElement[i].X = all[i][0];
                        activeElement[i].Y = all[i][1];
                    }
                    activeElement = null;
                },
                _getAll: function (x, y, h, w) {
                    return [[x, y], [(w - x), y], [x, (h - y)], [(w - x), (h - y)]];
                },
                getAll: function (x, y, h, w) {
                    if (x == w/2 || x == (x-1)/2)
                        return [  ];
                    var arr1 = svgOn.fourMode._getAll(x, y, h, w);
                    var a = Math.max(arr1[0][0], arr1[1][0]);
                    var b = Math.min(arr1[0][1], arr1[1][1]);
                    var l = (w - a) * h / w;
                    var k = a - (l - b) * (a - w / 2) / (l - h / 2);
                    var arr2 = svgOn.fourMode._getAll(k, l, h, w);
                    return arr1.concat(arr2);
                }

            },

            fourMode2: {

                mousedown: function (e) {
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    var all = svgOn.fourMode2.getAll(x, y, offset.height, offset.width);
                    activeElement = new Array();
                    var color = getRandomColor();
                    for (var i = 0; i < 4; i++) {
                        var attributes = {
                            'p': all[i],
                            'sc': color,
                            'sw': getStrokeWidth(),
                        }
                        activeElement[i] = new FreeHandDrawing(attributes, currentWorkingSvg);
                        activeElement[i].firstX = x;
                        activeElement[i].firstY = y;
                    }
                },

                mousemove: function (e) {
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    var all = svgOn.fourMode2.getAll(x, y, offset.height, offset.width);
                    var color = getRandomColor();
                    for (var i = 0; i < 4; i++) {
                        activeElement[i].changeAttributes({
                            'p': activeElement[i].p + ' ' + all[i],
                            'sc': color,
                        });
                    }
                },

                mouseup: function (e) {
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    var all = svgOn.fourMode2.getAll(x, y, offset.height, offset.width);
                    var color = getRandomColor();
                    for (var i = 0; i < 4; i++) {
                        activeElement[i].changeAttributes({
                            'p': activeElement[i].p + ' ' + all[i],
                            'sc': color,
                        });

                        activeElement[i].lastX = x;
                        activeElement[i].lastY = y;
                    }
                },
                getAll: function (x, y, h, w) {
                    return [x + ',' + y, (w - x) + ',' + y, x + ',' + (h - y), (w - x) + ',' + (h - y), ];
                },

            },

            selectMode: {
                mousedown: function (e) {},
                mousemove: function (e) {},
                mouseup: function (e) {},
            }

        }

        lineOn = {
            click: function (e) {
                if (editor.currentMode == 'selectMode') {
                    this.myObject.activate();
                    e.stopPropagation();
                }
            },
            mousedown: function (e) {
                if (editor.currentMode == 'selectMode') {
                    if (activeElement) {
                        activeElement.deactivate();
                    }
                    activeElement = this.myObject;
                    activeElement.activate();
                    superParent.addEventListener('mousemove', lineOn.mousemove);
                    superParent.addEventListener('mouseup', lineOn.mouseup);
                    var offset = dummyRect.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    activeElement.diffX1 = activeElement.x1 - x;
                    activeElement.diffY1 = activeElement.y1 - y;
                    activeElement.diffX2 = activeElement.x2 - x;
                    activeElement.diffY2 = activeElement.y2 - y;
                    e.stopPropagation();
                }
            },
            mousemove: function (e) {
                var offset = dummyRect.getBoundingClientRect();
                var x = e.clientX - offset.left;
                var y = e.clientY - offset.top;
                //activeElement.element = document.getElementById(activeElement.id);
                activeElement.changeAttributes({
                    'x1': x + activeElement.diffX1,
                    'y1': y + activeElement.diffY1,
                    'x2': x + activeElement.diffX2,
                    'y2': y + activeElement.diffY2,
                });
                activeElement.activate();

            },
            mouseup: function (e) {
                superParent.removeEventListener('mousemove', lineOn.mousemove);
                superParent.removeEventListener('mouseup', lineOn.mouseup);
                superParent.addEventListener('mousedown', selectMouseClick);
                var offset = dummyRect.getBoundingClientRect();
                var x = e.clientX - offset.left;
                var y = e.clientY - offset.top;
                activeElement.activate();
            },
        }

        rectOn = {
            click: function (e) {
                if (editor.currentMode == 'selectMode') {
                    e.stopPropagation();
                }
            },

            mousedown: function (e) {
                if (editor.currentMode == 'selectMode') {
                    e.stopPropagation();

                    superParent.addEventListener('mousemove', rectOn.mousemove);
                    superParent.addEventListener('mouseup', rectOn.mouseup);
                }
            },

            mousemove: function (e) {

            },

            mouseup: function (e) {
                superParent.removeEventListener('mousemove', rectOn.mousemove);
                superParent.removeEventListener('mouseup', rectOn.mouseup);
            },
        }

    })();

    return this;
})();

module = akruti;

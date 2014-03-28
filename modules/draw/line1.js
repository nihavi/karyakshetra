var gx;
var akruti = new (function () {

    /* Globals */

    var allSvg = new Object();
    var svgId = 1;

    var svgAA = {
        'h': 'height',
        'w': 'width',
    };

    var lineAA = {
        'x1': 'x1',
        'y1': 'y1',
        'x2': 'x2',
        'y2': 'y2',
        'sc': 'stroke',
        'sw': 'stroke-width',
    };

    var allAA = {
        'x1': 'x1',
        'y1': 'y1',
        'x2': 'x2',
        'y2': 'y2',
        'sc': 'stroke',
        'sw': 'stroke-width',
    };

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
            rect.setAttribute('id', 'dr' + this.id);
            rect.style.fill = "transparent";
            this.element.appendChild(rect);
            this.dr = rect; //this.dummyRect = rect;!!!
        }

        /* appending my Object in DOM object and adding DOM element to its parent*/
        this.element.myObject = this;
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

    var Line = function (arg, parent) {

        if (!parent) {
            parent = document.getElementById(arg.pid);
        }

        /* Creating DOM Element */
        this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'line');

        /* Setting Class and type */
        this.g.setAttribute('class', 'l');
        this.t = 'l';
        this.op = 'cr'; //this.operation = 'create';

        /* Setting Id */
        this.pid = parent.id;
        this.id = this.pid + this.t + parent.myObject.childrenId++;

        this.element.setAttribute('id', this.id);
        this.g.setAttribute('id', this.pid + 'g' + this.id.replace(this.pid, ''));

        /* Default Attributes */
        this.element.setAttribute('stroke-linecap', 'round');

        /* Provided Attributes */
        var j;
        for (j in lineAA) {
            if (j in arg) {
                this.element.setAttribute(lineAA[j], arg[j]);
                this[j] = arg[j];
            }
        }

        if (this.sw < 7) {
            this.pseudo = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            this.pseudo.setAttribute('stroke', 'transparent');
            this.pseudo.setAttribute('stroke-width', 7);
            this.pseudo.setAttribute('class', 'l');
            this.pseudo.setAttribute('x1', this.x1);
            this.pseudo.setAttribute('y1', this.y1);
            this.pseudo.setAttribute('x2', this.x2);
            this.pseudo.setAttribute('y2', this.y2);
            this.g.appendChild(this.pseudo);
        }

        /* Adding Elements to DOM */
        this.g.appendChild(this.element);
        parent.appendChild(this.g);

        this.g.myObject = this;

        return this;
    };

    var changeAttributes = function (arg) {

        var j;
        var ele = (this.element) ? this.element : document.getElementById(this.id);
        for (j in arg) {
            if (j in allAA) {
                ele.setAttribute(allAA[j], arg[j]);
                this[j] = arg[j];
            }
        }

        if (this.pseudo) {
            if (this.sw > 7) {
                this.pseudo.remove();
            } else {
                this.pseudo.setAttribute('x1', this.x1);
                this.pseudo.setAttribute('y1', this.y1);
                this.pseudo.setAttribute('x2', this.x2);
                this.pseudo.setAttribute('y2', this.y2);
            }
        }
        return this;
    };

    Line.prototype.changeAttributes = changeAttributes;

    var lineActivate = function () {

        this.deactivate();
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        var ends = new Array();
        var i;
        for (i = 0; i < 2; i++) {
            ends[i] = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            ends[i].setAttribute('r', +Math.max(+this.sw, 4));
            ends[i].setAttribute('fill', '#057cb8');
            ends[i].setAttribute('stroke', '#fff');
            g.appendChild(ends[i]);
        }
        ends[0].setAttribute('cx', this.x1);
        ends[0].setAttribute('cy', this.y1);
        ends[1].setAttribute('cx', this.x2);
        ends[1].setAttribute('cy', this.y2);
        g.setAttribute('id', 'ga' + this.pid + this.id);
        document.getElementById(this.pid).appendChild(g);
        this.active = g;
        return this;
    }

    var deactivate = function () {

        if (this.active) {
            this.active.remove(this.active);
            delete this.active;
        }
        return this;
    };

    Line.prototype.activate = lineActivate;
    Line.prototype.deactivate = deactivate;

    var fillSvg = function (color) {
        this.element.setAttribute('style', 'background-color:' + color + ';');
    };

    Svg.prototype.fill = fillSvg;

    this.init = function (arg) {
        var svgObject = new Svg(arg.attributes, arg.parent, true);
        allSvg[svgObject.id] = svgObject;
    };

    this.selectOperation = function (op) {
        editor.currentMode = op;
    };

    var editor = new(function () {

        var superParent = window;

        this.currentMode = 'createLineMode';

        var actives = new Array();

        var getStrokeWidth = function () {

            return +document.getElementById('strokeWidth').value;
        }

        var getStrokeColor = function () {

            return '#' + document.getElementById('strokeColor').value;
        }

        var getFillColor = function () {

            return '#' + document.getElementById('fillColor').value;
        }

        var activateElement = function () {
            if (actives.length == 0) {
                $(superParent).on('mousedown', deselectAll);
            }
            this.activate();
            //$(this.active).addClass('edit').on('mousedown',resize[this.t].mousedown);
            actives.push(this);
            return this;
        };

        Line.prototype.activateElement = activateElement;

        var lineMoveLeft = function (ctrlKey, shiftKey) {
            var d;
            if (ctrlKey)
                d = 1;
            else if (shiftKey)
                d = 10;
            else
                d = 4;

            if (this.x1 >= d && this.x2 >= d) {
                this.changeAttributes({
                    x1: this.x1 - d,
                    x2: this.x2 - d
                });
            }
        };

        var lineMoveRight = function (ctrlKey, shiftKey) {
            var d;
            if (ctrlKey)
                d = 1;
            else if (shiftKey)
                d = 10;
            else
                d = 4;

            if (this.x1 + d <= allSvg[this.pid].w && this.x2 + d <= allSvg[this.pid].w) {
                this.changeAttributes({
                    x1: this.x1 + d,
                    x2: this.x2 + d
                });
            }
        };

        var lineMoveUp = function (ctrlKey, shiftKey) {
            var d;
            if (ctrlKey)
                d = 1;
            else if (shiftKey)
                d = 10;
            else
                d = 4;

            if (this.y1 >= d && this.y2 >= d) {
                this.changeAttributes({
                    y1: this.y1 - d,
                    y2: this.y2 - d
                });
            }
        };

        var lineMoveDown = function (ctrlKey, shiftKey) {
            var d;
            if (ctrlKey)
                d = 1;
            else if (shiftKey)
                d = 10;
            else
                d = 4;

            if (this.y1 + d <= allSvg[this.pid].h && this.y2 + d <= allSvg[this.pid].h) {
                this.changeAttributes({
                    y1: this.y1 + d,
                    y2: this.y2 + d
                });
            }
        };

        Line.prototype.moveLeft = lineMoveLeft;
        Line.prototype.moveRight = lineMoveRight;
        Line.prototype.moveUp = lineMoveUp;
        Line.prototype.moveDown = lineMoveDown;

        var svgOnMouseDown = function (e) {

            if (e.which == 1) {
                e.data = this.myObject;
                var newElement = svgOn[editor.currentMode].mousedown(e);
                $(superParent).on('mousemove', newElement, svgOn[editor.currentMode].mousemove)
                    .on('mouseup', newElement, function (ev) {

                        $(superParent).off('mousemove').off('mouseup');
                        svgOn[editor.currentMode].mouseup(ev);

                    });
            }
        };

        var deselectAll = function (e) {

            if (e) $(superParent).off('mousedown', deselectAll);
            var i;
            for (i = 0; i < actives.length; i++) {
                actives[i].deactivate();
            }
            actives.length = 0;
        }

        this.makeEditable = function (element) {
            $(element).on('mousedown', svgOnMouseDown);
        };

        this.init = function () {};

        var keyTimeout, keyInterval, currentKey;

        $(window).on('keydown', function (e) {

            switch (e.which) {

            case 46: //DeleteKey
                if (actives.length != 0) {
                    for (var i = 0; i < actives.length; i++) {
                        actives[i].deactivate();
                        actives[i].g.remove();
                        var arr = allSvg[actives[i].pid].children;
                        arr.splice(arr.indexOf(actives[i]), 1);
                    }
                    actives.length = 0;
                }
                break;

            case 37: //Left Arrow Key
                if (actives.length != 0) {
                    currentKey = 37;
                    clearTimeout(keyTimeout);
                    clearInterval(keyInterval);

                    actives.forEach(function (element) {
                        element.moveLeft(e.ctrlKey, e.shiftKey);
                        element.activate();
                    });

                    keyTimeout = setTimeout(function () {
                        keyInterval = setInterval(function () {
                            actives.forEach(function (element) {
                                element.moveLeft(e.ctrlKey, e.shiftKey);
                                element.activate();
                            });
                        }, 100);
                    }, 750);

                }
                break;

            case 38: //Up Arrow Key
                if (actives.length != 0) {
                    currentKey = 38;
                    clearTimeout(keyTimeout);
                    clearInterval(keyInterval);

                    actives.forEach(function (element) {
                        element.moveUp(e.ctrlKey, e.shiftKey);
                        element.activate();
                    });

                    keyTimeout = setTimeout(function () {
                        keyInterval = setInterval(function () {
                            actives.forEach(function (element) {
                                element.moveUp(e.ctrlKey, e.shiftKey);
                                element.activate();
                            });
                        }, 100);
                    }, 750);

                }
                break;

            case 39: //Right Arrow Key
                if (actives.length != 0) {
                    currentKey = 39;
                    clearTimeout(keyTimeout);
                    clearInterval(keyInterval);

                    actives.forEach(function (element) {
                        element.moveRight(e.ctrlKey, e.shiftKey);
                        element.activate();
                    });

                    keyTimeout = setTimeout(function () {
                        keyInterval = setInterval(function () {
                            actives.forEach(function (element) {
                                element.moveRight(e.ctrlKey, e.shiftKey);
                                element.activate();
                            });
                        }, 100);
                    }, 750);

                }
                break;

            case 40: //Down Arrow Key
                if (actives.length != 0) {
                    currentKey = 40;
                    clearTimeout(keyTimeout);
                    clearInterval(keyInterval);

                    actives.forEach(function (element) {
                        element.moveDown(e.ctrlKey, e.shiftKey);
                        element.activate();
                    });

                    keyTimeout = setTimeout(function () {
                        keyInterval = setInterval(function () {
                            actives.forEach(function (element) {
                                element.moveDown(e.ctrlKey, e.shiftKey);
                                element.activate();
                            });
                        }, 100);
                    }, 750);

                }
                break;

            default:
                gx = e;
                log(e.which);
            }
        });

        $(window).on('keyup', function (e) {

            switch (e.which) {

            case 37: //Left Arrow Key
                if (actives.length != 0) {
                    if (currentKey == 37) {
                        currentKey = null;
                    }
                    clearTimeout(keyTimeout);
                    clearInterval(keyInterval);
                }
                break;

            case 38: //Up Arrow Key
                if (actives.length != 0) {
                    if (currentKey == 38) {
                        currentKey = null;
                    }
                    clearTimeout(keyTimeout);
                    clearInterval(keyInterval);

                }
                break;

            case 39: //Right Arrow Key
                if (actives.length != 0) {
                    if (currentKey == 39) {
                        currentKey = null;
                    }
                    clearTimeout(keyTimeout);
                    clearInterval(keyInterval);

                }
                break;

            case 40: //Down Arrow Key
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

                mousedown: function (e) {

                    var mySvgObject = e.data;

                    var offset = mySvgObject.dr.getBoundingClientRect();
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
                    var newElement = new Line(attributes, mySvgObject.element);
                    return newElement;
                },

                mousemove: function (e) {

                    var newElement = e.data;

                    var offset = newElement.g.parentNode.myObject.dr.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    if (e.shiftKey) {
                        var changes = svgOn.lineMode.snap(activeElement.x1, activeElement.y1, x, y);
                        newElement.changeAttributes(changes);
                    } else {
                        newElement.changeAttributes({
                            'x2': x,
                            'y2': y
                        });
                    }
                },

                mouseup: function (e) {

                    var newElement = e.data;

                    var offset = newElement.g.parentNode.myObject.dr.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;

                    if (e.shiftKey) {

                        var changes = svgOn.lineMode.snap(this.x1, this.y1, x, y);
                        newElement.changeAttributes(changes);
                    } else {
                        newElement.changeAttributes({
                            x2: x,
                            y2: y
                        });
                    }

                    $(newElement.g).on('mousedown', lineOn.mousedown);
                    allSvg[newElement.pid].children.push(newElement);
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
            selectMode: {
                mousedown: function (e) {
                    return;
                    log('unimplemented: svgOn -> selectMode -> mousedown fired');
                },
                mousemove: function (e) {},
                mouseup: function (e) {},
            },
        };

        lineOn = {

            mousedown: function (e) {
                if (editor.currentMode == 'selectMode') {
                    e.stopImmediatePropagation();
                    if (!e.ctrlKey)
                        deselectAll();
                    this.myObject.activateElement();
                    for (var i = 0; i < actives.length; i++) {
                        move[actives[i].t].mousedown(e, actives[i]);
                    }
                    $(superParent).on('mousemove', lineOn.mousemove).on('mouseup', lineOn.mouseup);
                }
            },

            mousemove: function (e) {
                for (var i = 0; i < actives.length; i++) {
                    move[actives[i].t].mousemove(e, actives[i]);
                    actives[i].activate();
                }
            },
            mouseup: function (e) {
                $(superParent).off('mousemove', lineOn.mousemove).off('mouseup', lineOn.mouseup);
            },
        }

        move = {

            l: {

                mousedown: function (e, element) {

                    var offset = allSvg[element.pid].dr.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    element.dx1 = element.x1 - x;
                    element.dy1 = element.y1 - y;
                    element.dx2 = element.x2 - x;
                    element.dy2 = element.y2 - y;
                },

                mousemove: function (e, element) {
                    var offset = allSvg[element.pid].dr.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    element.changeAttributes({
                        'x1': element.dx1 + x,
                        'y1': element.dy1 + y,
                        'x2': element.dx2 + x,
                        'y2': element.dy2 + y,
                    });

                },

                mouseup: function (e) {},

            },
        }

    })();
})();

window.onload = function () {
    var i = 1;
    while (i--) {
        akruti.init({
            parent: document.body,
            attributes: {
                'h': 500,
                'w': window.innerWidth,
            }
        });
    }
}

function log(arg) {
    var string = '| ';
    if (typeof (arg) == 'object') {
        for (var i in arg) {
            string += i + ' -> ' + arg[i] + ' | '
        }
    } else
        string = arg;
    document.getElementById('statusbar').innerHTML = string;
    return string;
}

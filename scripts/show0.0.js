/*
 * Show - Presentation
 */

Show = new (function(){
    
    var slideId;
    var activeSlide;
    var allSlides;
    var insertOp;
    
    this.init = function(parent, file){
        /*
         * Initialize show
         * 
         * parent: parent DOM element for module
         * 
         */
        
        parent = $(parent);
        var side = $('<div class="sidebar" id="sidebar"></div>').appendTo(parent);
        var slide = $('<div class="slides" id="slides"></div>').appendTo(parent);
        
        slideId = 0;
        allSlides = new Array();
        activeSlide = null;
        insertOp = null;
        
        this.resize();
        
        if( file ){
            var newSlide = new Slide();
            newSlide.renderSlide();
            //Two lines above is a hack, do it properly :FIXME
            this.openFile(file);
        }
        else {
            var newSlide = new Slide();
            newSlide.addElem({
                type: 'title',
                top: 30,
                left: 5,
                width: 90,
                height: 13,
                fontSize: 10,
                text: 'Title',
                style: {textAlign: 'center'}
            });
            newSlide.addElem({
                type: 'text',
                top: 45,
                left: 5,
                width: 90,
                height: 8,
                fontSize: 6,
                text: 'Subtitle',
                style: {
                    textAlign: 'center',
                    color: '#666',
                }
            });
            newSlide.renderSlide();
        }
        
        //Event handlers on slides to manage activeElement
        $('#slides').bind('mousedown',function(ev){
            if(activeElement){
                if (activeElement != $(ev.target).closest('.elem').data('elem')){
                    activeElement.blur();
                    activeElement = null;
                }
            }
        });
        
        Sidebar.init();
    }
    
    resizeEditor = function(){
        var side = $('#sidebar');
        var slide = $('#slides');
        
        if(activeSlide)
            activeSlide.renderSlide();
        
        Sidebar.init();
    }
    this.resize = resizeEditor;
    
    /*
    Slide class
    {
        id: String,
        bgColor: String,    //Background color of slide, default white
        ratio: Number,  //Aspect ratio, width/height, default 4:3
        elems: Object,  //id as key and Elem Object as value
        elemId: Number  //Counter for giving unique id to elem
    }
    Elem
    {
        type: 'title' | 'text',
        parent: Slide Object,   //Parent Slide
        id: String, //Id of element
        aminations: Array,  //Array of Animations
        fontSize: Number,   //Font-size in percentage relative to slide height
        text: String,   //Text inside the box
        style: Object,  //Css key-value pairs
        top: Number,    //Distance from top edge of the slide in percentage
        left: Number,   //Distance from left edge of the slide in percentage
        width: Number,  //Width in percentage with respect to width of slide
        height: Number, //Height in percentage with respect to height of slide
        elemDOM: DOMElement //DOM element corresponding to this object
    }
    Animation
    {
        type: 'entry' | 'highlight' | 'exit',
        name: String,   //Name of animation
        duration: Number,   //Duration of animation in milliseconds
        timing: 'click' | 'wait' | 'do',    //When to trigger animation
    }
    */
    
    var Sidebar = {
        /*
         * Sidebar object
         * 
         * FIXME: Different sizes with and without scrollbar
         */
        init: function(){
            var slide;
            var sidebar = $('#sidebar');
            sidebar.empty();
            for (var i = 0; i<allSlides.length; i++){
                this.addSlide(allSlides[i]);
            }
        },
        addSlide: function(slide){
            var sidebar = $('#sidebar');
            var sNo = $('.side-parent').length+1;
            
            parent = $('<div class="side-parent" id="parent'+slide.id+'"></div>').appendTo(sidebar);
            parent.append('<div class="side-no">'+sNo+'.</div>');
            var slideDOM = $('<div class="side-slide" id="side'+slide.id+'"></div>').appendTo(parent);
            slideDOM.data('slide', slide);
            slideDOM.css({
                height: slideDOM.width()/slide.ratio,
                backgroundColor: slide.bgColor
            });
            if( slide == activeSlide ){
                Sidebar.activate(slide.id);
            }
            slideDOM.click(function(){
                var slide = $(this).data('slide');
                slide.activate();
            });
            slide.renderSlideSide();
        },
        activate: function(slideId){
            $('.side-slide.active').removeClass('active');
            $('#side'+slideId).addClass('active');
        },
        removeSlide: function(slideId){
            $('.side-parent#parent'+slideId).remove();
            Sidebar.updateNo();
        },
        moveSlide: function(slideId, newIndex){
            //newIndex is 1 based
            var slide = $('.side-parent#parent'+slideId).detach();
            
            var insertBefore = $('.side-parent').eq(newIndex - 1);
            if( insertBefore.length )
                insertBefore.before(slide);
            else 
                $('#sidebar').append(slide);
            Sidebar.updateNo();
        },
        updateNo: function(){
            $('.side-no').each(function(index){
                $(this).text((index+1)+'.');
            });
        }
    };
    
    var insertSlide = function(id){
        var newSlide = new Slide();
        newSlide.addElem({
            type: 'title',
            top: 5,
            left: 5,
            width: 90,
            height: 13,
            fontSize: 10,
            text: 'New Slide',
            style: {textAlign: 'center'}
        });
        newSlide.addElem({
            type: 'text',
            top: 25,
            left: 5,
            width: 90,
            height: 70,
            fontSize: 6,
            text: 'Text',
        });
        newSlide.activate();
        Sidebar.addSlide(newSlide);
    }
    var removeSlide = function(id){
        activeSlide.remove();
        if( !allSlides.length ){
            insertSlide();
        }
    }
    var moveSlide = function(btnId){
        activeSlide.moveTo(btnId);
    }
    var slideColor = function(btnId, color){
        activeSlide.bgColor = color;
        activeSlide.renderSlide();
        activeSlide.renderSlideSide();
    }
    
    var clone = function(obj){
        if(obj == null || typeof(obj) != 'object')
            return obj;
        
        var temp;
        if( Array.isArray(obj) ){
            temp = obj.slice();
        }
        else {
            temp = {};

            for(var key in obj)
                if( obj.hasOwnProperty(key) )
                    temp[key] = clone(obj[key]);
        }
        return temp;
    }

    this.getFile = function(){
        var file = {};
        file.slideId = slideId;
        file.slides = [];
        for( var i = 0; i < allSlides.length; ++i ){
            file.slides.push(allSlides[i].purify());
        }
        return JSON.stringify(file);
    }
    
    this.openFile = function(file){
        var file = JSON.parse(file);
        slideId = file.slideId;
        allSlides = [];
        for( var i = 0; i<file.slides.length; ++i ){
            new Slide(file.slides[i]);
        }
        Sidebar.init();
        allSlides[0].renderSlide();
    }
    
    var Slide = function(slide){
        /*
         * Constructor of class Slide
         */
        if( slide ){
            for( var prop in slide ){
                if( prop != 'elems' ){
                    this[prop] = slide[prop];
                }
                else {
                    this[prop] = {};
                    for( var elem in slide[prop] ){
                        this[prop][elem] = this.addElem(slide[prop][elem]);
                    }
                }
            }
        }  
        else {
            this.slideId=slideId;
            this.id = 'slide'+slideId;
            this.ratio = 4/3;
            this.bgColor = 'white';
            this.elems = new Object();
            this.elemId = 0;
            slideId++;
        }
        allSlides.push(this);
    }
    
    Slide.prototype = {
        renderSlide: function(){
            /*
             * slide: Object of type Slide
             */
            
            if(activeElement)activeElement.blur();
            
            var slide = this;
            
            if(!slide || !slide.id){
                //Error: Invalid slide
                return;
            }
            
            $('.slide').remove();
            var slideDOM = $('<div class="slide" id="'+slide.id+'">').appendTo('#slides');
            slideDOM.data('slide', slide);
            
            var contain = $('#slides');
            var slideH = contain.height();
            var slideW = slideH*slide.ratio;
            
            if(slideW > contain.width()){
                slideW = contain.width();
                slideH = slideW/slide.ratio;
            }
            
            slideDOM.css({
                'height': slideH,
                'width': slideW,
                'top': (contain.height()-slideH)/2, 
                'backgroundColor': slide.bgColor
            });
            
            if('elems' in slide){
                var i;
                for(i in slide.elems){
                    slide.elems[i].renderElem();
                }
            }
            
            activeSlide = slide;
        },
        activate: function(){
            this.renderSlide();
            Sidebar.activate(this.id);
            defaultMenus[1].groups[0].items[0].currState = this.bgColor;
            Base.updateMenu(defaultMenus);
        },
        remove: function(){
            var index = allSlides.indexOf(this);
            allSlides.splice(index, 1);
            Sidebar.removeSlide(this.id);
            if( allSlides.length > index ){
                allSlides[index].activate();
            }
            else if( index > 0){
                allSlides[index-1].activate();
            }
        },
        renderSlideSide: function(){
            var slide = this;
            var slideSide = $('#side'+slide.id);
            slideSide.css({
                'backgroundColor': slide.bgColor,
            });
            if('elems' in slide){
                var i;
                for(i in slide.elems){
                    slide.elems[i].renderElemSide(slide.id);
                }
            }
        },
        addElem: function(obj){
            var elem = new Elem(obj);
            if( obj.id ){
                elem.id = obj.id;
            }
            else {
                elem.id = 'elem'+this.elemId;
                this.elemId++;
            }
            this.elems[elem.id] = elem;
            elem.parent = this;
            return elem;
        },
        moveTo: function(newIndex){
            //newIndex is 1 based
            var index = allSlides.indexOf(this);
            if( newIndex == 'up' )
                newIndex = index;
            else if( newIndex == 'down' )
                newIndex = index + 2;
            else 
                newIndex = parseInt(newIndex);
            if( newIndex < 1 ) newIndex = 1;
            if( newIndex > allSlides.length ) newIndex = allSlides.length;
            
            allSlides.splice(index, 1);
            
            allSlides.splice(newIndex - 1, 0, this);
            Sidebar.moveSlide(this.id, newIndex);
        },
        purify: function(){
            var obj = {};
            for( var i in this ){
                if( this.hasOwnProperty(i) ){
                    if( i != 'elems' ){
                        obj[i] = clone(this[i]);
                    }
                    else {
                        obj[i] = {};
                        for( var j in this[i] ){
                            obj[i][j] = this[i][j].purify();
                        }
                    }
                }
            }
            return obj;
        }
    };
    
    var Elem = function(elem){
        /*
         * Constructor of class Elem
         */
        
        this.type = elem.type;
        if ('fontSize' in elem)
            this.fontSize = elem.fontSize;
        else 
            this.fontSize = 5;

        if ('text' in elem)
            this.text = elem.text;
        else 
            this.text = "";
        if ('style' in elem)
            this.style = elem.style;
        else
            this.style = {};
            
        if( !('color' in elem.style) ){
            elem.style.color = '#000000';
        }
        if( !('backgroundColor' in elem.style) ){
            elem.style.backgroundColor = '#ffffff';
        }
        
        this.top = elem.top;
        this.left = elem.left;
        this.width = elem.width;
        this.elemDOM = null;
        if ('height' in elem)
            this.height = elem.height;
        
        if( 'animations' in elem ){
            this.animations = elem.animations;
        }
    }
    
    Elem.prototype = {
        renderElem: function(){
            /* 
             * Renders and adds elem to current slide
             */
            var elem = this;
            
            var slide = $('.slide');
            var slideObj = slide.data('slide');
            
            $('#'+elem.id).unbind()
            $('#'+elem.id).remove();
            
            if('type' in elem){
                if(elem.type == 'title' || elem.type == 'text'){
                    //Parent element for text
                    var elemDOM = $('<div class="elem slide-'+elem.type+'" id="'+elem.id+'">');
                    elemDOM.css({
                        top: (slide.height()*elem.top)/100,
                        left: (slide.width()*elem.left)/100,
                        height: (slide.height()*elem.height)/100,
                        width: (slide.width()*elem.width)/100,
                        fontSize: (slide.height()*elem.fontSize)/100
                    });
                    if(activeElement && activeElement == elem){
                        $('.elem.active').removeClass('active');
                        elemDOM.addClass('active');
                    }
                    
                    //Actual element for text
                    var elemText = $('<div class="elem-text" contentEditable>').html(elem.text).css(elem.style).appendTo(elemDOM);
                    
                    elemDOM.data('elem',elem);
                    elemDOM.appendTo(slide);
                    elemText.focus(textFocus);
                    elemText.blur(textBlur);
                    elemText.bind('keypress keyup', function(ev){
                        elem = $(this).closest('.elem').data('elem');
                        if( elem.text != $(this).html() ){
                            startOp( 'ct '+ elem.parent.slideId +' '+ elem.id +' '+ elem.text );
                            elem.text = $(this).html()
                            endOp( 'ct '+ elem.parent.slideId +' '+ elem.id +' '+ elem.text );
                            elem.renderElemSide(elem.parent.id);
                        }
                    });
                    
                    //To move
                    elemDOM.mousedown(moveInit);
                    
                    //To resize
                    $('<div class="resize resize-r">')
                        .mousedown(resizeRightInit)
                        .appendTo(elemDOM);
                    $('<div class="resize resize-l">')
                        .mousedown(resizeLeftInit)
                        .appendTo(elemDOM);
                    $('<div class="resize resize-t">')
                        .mousedown(resizeTopInit)
                        .appendTo(elemDOM);
                    $('<div class="resize resize-b">')
                        .mousedown(resizeBottomInit)
                        .appendTo(elemDOM);
                    $('<div class="resize resize-tr">')
                        .mousedown(resizeTopRightInit)
                        .appendTo(elemDOM);
                    $('<div class="resize resize-tl">')
                        .mousedown(resizeTopLeftInit)
                        .appendTo(elemDOM);
                    $('<div class="resize resize-bl">')
                        .mousedown(resizeBottomLeftInit)
                        .appendTo(elemDOM);
                    $('<div class="resize resize-br">')
                        .mousedown(resizeBottomRightInit)
                        .appendTo(elemDOM);
                    
                    elem.elemDOM = elemDOM;
                    
                    slideObj.renderSlideSide();
                    return elemDOM;
                }
            }
            else {
                //Error: Elem type is not defined
            }
        },
        renderElemSide: function(slideId){
            //First render in sidebar
            var elem = this;
            
            var slide = $('#side'+slideId);
            var slideObj = slide.data('slide');
            
            $('#'+slideId+elem.id).remove();
            
            if('type' in elem){
                if(elem.type == 'title' || elem.type == 'text'){
                    var elemDOM = $('<div class="elem-side slide-'+elem.type+'" id="'+slideId+elem.id+'">');
                    elemDOM.css({
                        top: (slide.height()*elem.top)/100,
                        left: (slide.width()*elem.left)/100,
                        height: (slide.height()*elem.height)/100,
                        width: (slide.width()*elem.width)/100,
                        fontSize: (slide.height()*elem.fontSize)/100
                    });
                    var elemText = $('<div class="elem-text">').html(elem.text).css(elem.style).appendTo(elemDOM);
                    elemDOM.appendTo(slide);
                }
            }
        },
        editElement: function(changes){
            var i;
            for (i in changes){
                if(i != 'style')
                    this[i] = changes[i];
            }
            if('style' in changes){
                for (i in changes.style){
                    this.style[i] = changes.style[i];
                }
            }
            this.renderElem();
            return this;
        },
        remove: function(){
            $('#'+this.id).remove();
            $('#'+this.parent.id+this.id).remove();
            delete activeSlide.elems[this.id];
            this.blur();
            if( activeElement == this )
                activeElement = null;
        },
        focus: function(){
            Base.updateMenu(defaultMenus.concat(formatMenu(this)));
            Base.focusMenu('format');
        },
        blur: function(){
            this.elemDOM.removeClass('active');
            this.elemDOM.find('.elem-text').blur();
            if( activeElement == this )
                activeElement = null;
            Base.updateMenu(defaultMenus);
        },
        purify: function(){
            //Returns pure object without cyclic references
            /*
             * removes
             * - parent,
             * - elemDOM
             */
            var obj = {};
            for( var i in this ){
                if( i != 'parent' && i != 'elemDOM' && this.hasOwnProperty(i) ){
                    obj[i] = clone(this[i]);
                }
            }
            return obj;
        }
    }
    
    var activeElement = null;
    var createTextBox = function(ev){
        if(ev.which != 1)return;
        var slide = $('.slide');
        var offset = slide.offset();
        var mouseX = ev.clientX;
        var mouseY = ev.clientY;
        var elemX = (mouseX - offset.left)*100/slide.width();
        var elemY = (mouseY - offset.top)*100/slide.height();
        activeElement = activeSlide.addElem({
                            type: 'text',
                            top: elemY,
                            left: elemX,
                            width: 0,
                            fontSize: 6,
                        }).renderElem().data('elem');
        $('#slides').bind('mousemove',resizeNewTextBox);
        $(window).one('mouseup',finishNewTextBox);
        removeInsertOp();
        ev.preventDefault();
    }
    var resizeNewTextBox = function(ev){
        if(ev.which != 1)return;
        var slide = $('.slide');
        var offset = slide.offset();
        var mouseX = ev.clientX;
        var mouseY = ev.clientY;
        var elemX = (mouseX - offset.left)*100/slide.width();
        var elemY = (mouseY - offset.top)*100/slide.height();
        activeElement.editElement({
            height: elemY - activeElement.top,
            width: elemX - activeElement.left,
        });
        ev.preventDefault();
    }
    var finishNewTextBox = function(ev){
        if(ev.which != 1)return;
        var slide = $('.slide');
        var offset = slide.offset();
        var mouseX = ev.clientX;
        var mouseY = ev.clientY;
        var elemX = (mouseX - offset.left)*100/slide.width();
        var elemY = (mouseY - offset.top)*100/slide.height();
        activeElement.editElement({
            height: elemY - activeElement.top,
            width: elemX - activeElement.left,
        }).elemDOM.find('.elem-text').focus();
        $('#slides').unbind('mousemove',resizeNewTextBox);
        startOp('de '+ activeElement.parent.slideId +' '+ activeElement.id);
        endOp('cr '+ activeElement.parent.slideId +' '+ JSON.stringify(activeElement.purify()));
    }
    
    var textFocus = function(ev){
        //Will be called when a contentEdtable is focused
        activeElement = $(this).closest('.elem').data('elem');
        $('.elem.active').removeClass('active');
        activeElement.elemDOM.addClass('active');
        activeElement.elemDOM.addClass('edit');
        activeElement.editable = true;
        activeElement.elemDOM.css({
            cursor: 'auto',
            overflow: 'visible'
        });
        activeElement.focus();
    };
    var textBlur = function(ev){
        //Will be called when a contentEdtable is focused
        if(activeElement){
            activeElement.elemDOM.css({
                cursor: 'move',
                overflow: 'hidden'
            });
        }
        activeElement.elemDOM.removeClass('edit');
        activeElement.editable = false;
    };
    
    /*
     * Undo/redo
     */
    /*
     * opCodes ( separated by -;- )
     * ne   - Next in Slideshow
     * pr   - Previous in Slideshow
     * sw|sh|st|sl [slideId] [elemId] [width]    - set width|height|top|left
     * de [slideId] [elemId]    - Delete element
     * cr [slideId] [elemJSON]  - Create element
     * ct [slideId] [elemId] [newText]  - Change text
     * ca [slideId] [elemId] [left|center|right|justify]    - Change alignment
     * cf [slideId] [elemId] [bold|italics|underline] [true|false]  - Change format
     * ee [slideId] [elemId] [mode] [value] - Edit element with elemEdit
     * cc [slideId] [elemId] [color|backgroundColor] [value] - Change color
     */
    var currOp;
    var startOp = function(state){
        currOp = {};
        currOp.init = state;
    }
    var endOp = function(state){
        currOp.end = state;
        //TODO: Add all op first, then uncomment following line
        //Base.addOp(currOp.init, currOp.end);
    }
    var getSlide = function(slideId){
        for( var i = 0; i<allSlides.length; i++ ){
            if( allSlides[i].slideId == slideId ){
                return allSlides[i];
            }
        }
    }
    var getElem = function(slideId, elemId){
        var slide = getSlide(slideId);
        if( elemId )
            if( 'elems' in slide )
                return slide.elems[elemId];
            else return undefined;
        else 
            return undefined;
    };
    this.performOp = function(command){
        //For now only one command
        
        var ops = command.split('-;-');
        var pastState = '';
        var newState = '';
        for( var i = 0; i<ops.length; i++ ){
            if( i ){
                pastState += '-;-';
                newState += '-;-';
            }
            op = ops[i].split(' ');
            switch( op[0] ){
                case 'ne':
                    SlideShow.next();
                    break;
                case 'pr':
                    SlideShow.previous();
                    break;
                case 'ns':
                    SlideShow.nextSlide();
                    break;
                case 'ps':
                    SlideShow.prevSlide();
                    break;
                case 'sw':
                    var elem = getElem(op[1], op[2]);
                    pastState += 'sw '+ op[1] +' '+ op[2] +' '+ elem.width;
                    elem.editElement({
                        width: parseInt(op[3])
                    });
                    newState += op.join(' ');
                    break;
                case 'sh':
                    var elem = getElem(op[1], op[2]);
                    pastState += 'sh '+ op[1] +' '+ op[2] +' '+ elem.height;
                    elem.editElement({
                        height: parseInt(op[3])
                    });
                    newState += op.join(' ');
                    break;
                case 'st':
                    var elem = getElem(op[1], op[2]);
                    pastState += 'st '+ op[1] +' '+ op[2] +' '+ elem.top;
                    elem.editElement({
                        top: parseInt(op[3])
                    });
                    newState += op.join(' ');
                    break;
                case 'sl':
                    var elem = getElem(op[1], op[2]);
                    pastState += 'sl '+ op[1] +' '+ op[2] +' '+ elem.left;
                    elem.editElement({
                        left: parseInt(op[3])
                    });
                    newState += op.join(' ');
                    break;
                case 'cr':
                    var slide = getSlide(op[1]);
                    obj = JSON.parse(op.slice(2).join(' '));
                    slide.addElem(obj);
                    slide.renderSlide();
                    pastState = 'de ' + slide.slideId +' '+ obj.id;
                    newState = op.join(' ');
                    break;
                case 'de':
                    var elem = getElem(op[1], op[2]);
                    pastState = 'cr '+ elem.parent.slideId +' '+ JSON.stringify(elem.purify())
                    elem.remove();
                    newState = op.join(' ');
                    break;
                case 'ct':
                    var elem = getElem(op[1], op[2]);
                    pastState = 'ct '+ elem.parent.slideId +' '+ elem.id +' '+elem.text;
                    elem.text = op.slice(3).join(' ');
                    elem.renderElem();
                    newState = op.join(' ');
                    break;
                case 'ca':
                    var elem = getElem(op[1], op[2]);
                    pastState = 'ca '+ elem.parent.slideId +' '+ elem.id +' '+elem.style.textAlign;
                    elem.editElement({
                        style: {
                            textAlign: op[3]
                        }
                    });
                    newState = op.join(' ');
                    if(elem == activeElement){
                        Base.updateMenu(defaultMenus.concat(formatMenu(activeElement)));
                    }
                    break;
                case 'cf':
                    var elem = getElem(op[1], op[2]);
                    op[4] = eval(op[4]);
                    pastState = 'cf '+ elem.parent.slideId +' '+ elem.id +' '+ op[3] +' '+ !op[4];
                    elemFormat(elem, op[3], op[4]);
                    newState = op.join(' ');
                    if(elem == activeElement){
                        Base.updateMenu(defaultMenus.concat(formatMenu(activeElement)));
                    }
                    break;
                case 'ee':
                    var elem = getElem(op[1], op[2]);
                    op[4] = op.slice(4).join(' ');
                    var pastVal = elemEdit(elem, op[3], op[4]);
                    pastState = 'ee '+ elem.parent.slideId +' '+ elem.id +' '+ op[3] +' '+ pastVal;
                    newState = op.join(' ');
                    if(elem == activeElement){
                        Base.updateMenu(defaultMenus.concat(formatMenu(activeElement)));
                    }
                    break;
                case 'cc':
                    var elem = getElem(op[1], op[2]);
                    op[4] = op.slice(4).join(' ');
                    var pastVal = elemColor(elem, op[3], op[4]);
                    pastState = 'cc '+ elem.parent.slideId +' '+ elem.id +' '+ op[3] +' '+ pastVal;
                    newState = op.join(' ');
                    if(elem == activeElement){
                        Base.updateMenu(defaultMenus.concat(formatMenu(activeElement)));
                    }
                    break;
            }
        }
        return {
            pastState: pastState,
            newState: newState
        }
    }
    /*
     * Resize mechanisms 
     */
    var resizeRightInit = function(ev){
        if (ev.which != 1)return;
        if(activeElement){
            activeElement.blur();
        }
        var elem = $(this).closest('.elem');
        activeElement = elem.data('elem');
        startOp('sw '+activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.width);
        $('#slides').bind('mousemove',resizeRightMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeRightMove);
            activeElement.elemDOM.css('overflow', 'hidden');
            endOp('sw '+activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.width);
        });
        ev.preventDefault();
    }
    var resizeRightMove = function(ev){
        var slide = $('.slide');
        var offset = slide.offset();
        var mouseX = ev.clientX;
        var elemX = (mouseX - offset.left)*100/slide.width();
        activeElement.editElement({
            width: elemX - activeElement.left
        });
        ev.preventDefault();
    }
    
    var resizeLeftInit = function(ev){
        if (ev.which != 1)return;
        if(activeElement){
            activeElement.blur();
        }
        var elem = $(this).closest('.elem');
        activeElement = elem.data('elem');
        var op = 'sw ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.width;
        op += '-;-';
        op += 'sl ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.left;
        startOp(op);
        $('#slides').bind('mousemove',resizeLeftMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeLeftMove);
            activeElement.elemDOM.css('overflow', 'hidden');
            var op = 'sw ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.width;
            op += '-;-';
            op += 'sl ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.left;
            endOp(op);
        });
        ev.preventDefault();
    }
    var resizeLeftMove = function(ev){
        var slide = $('.slide');
        var offset = slide.offset();
        var mouseX = ev.clientX;
        var elemX = (mouseX - offset.left)*100/slide.width();
        activeElement.editElement({
            left: elemX,
            width: activeElement.left - elemX + activeElement.width
        });
        ev.preventDefault();
    }
    
    var resizeTopInit = function(ev){
        if (ev.which != 1)return;
        if(activeElement){
            activeElement.blur();
        }
        var elem = $(this).closest('.elem');
        activeElement = elem.data('elem');
        var op = 'sh ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.height;
        op += '-;-';
        op += 'st ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.top;
        startOp(op);
        $('#slides').bind('mousemove',resizeTopMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeTopMove);
            activeElement.elemDOM.css('overflow', 'hidden');
            var op = 'sh ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.height;
            op += '-;-';
            op += 'st ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.top;
            endOp(op);
        });
        ev.preventDefault();
    }
    var resizeTopMove = function(ev){
        var slide = $('.slide');
        var offset = slide.offset();
        var mouseY = ev.clientY;
        var elemY = (mouseY - offset.top)*100/slide.height();
        if (elemY > activeElement.top + activeElement.height){
            elemY = activeElement.top + activeElement.height
        }
        activeElement.editElement({
            top: elemY,
            height: activeElement.top - elemY + activeElement.height
        });
        ev.preventDefault();
    }
    
    var resizeBottomInit = function(ev){
        if (ev.which != 1)return;
        if(activeElement){
            activeElement.blur();
        }
        var elem = $(this).closest('.elem');
        activeElement = elem.data('elem');
        startOp('sh '+activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.height);
        $('#slides').bind('mousemove',resizeBottomMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeBottomMove);
            activeElement.elemDOM.css('overflow', 'hidden');
            endOp('sh '+activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.height);
        });
        ev.preventDefault();
    }
    var resizeBottomMove = function(ev){
        var slide = $('.slide');
        var offset = slide.offset();
        var mouseY = ev.clientY;
        var elemY = (mouseY - offset.top)*100/slide.height();
        activeElement.editElement({
            height: elemY - activeElement.top
        });
        ev.preventDefault();
    }
    
    var resizeTopRightInit = function(ev){
        if (ev.which != 1)return;
        if(activeElement){
            activeElement.blur();
        }
        var elem = $(this).closest('.elem');
        activeElement = elem.data('elem');
        var op = 'sh ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.height;
        op += '-;-';
        op += 'st ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.top;
        op += '-;-';
        op += 'sw '+activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.width;
        startOp(op);
        $('#slides').bind('mousemove',resizeTopMove);
        $('#slides').bind('mousemove',resizeRightMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeTopMove);
            $('#slides').unbind('mousemove',resizeRightMove);
            activeElement.elemDOM.css('overflow', 'hidden');
            var op = 'sh ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.height;
            op += '-;-';
            op += 'st ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.top;
            op += '-;-';
            op += 'sw '+activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.width;
            endOp(op);
        });
        ev.preventDefault();
    }
    
    var resizeTopLeftInit = function(ev){
        if (ev.which != 1)return;
        if(activeElement){
            activeElement.blur();
        }
        var elem = $(this).closest('.elem');
        activeElement = elem.data('elem');
        var op = 'sh ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.height;
        op += '-;-';
        op += 'st ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.top;
        op += '-;-';
        op += 'sw '+activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.width;
        op += '-;-';
        op += 'sl ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.left;
        startOp(op);
        $('#slides').bind('mousemove',resizeTopMove);
        $('#slides').bind('mousemove',resizeLeftMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeTopMove);
            $('#slides').unbind('mousemove',resizeLeftMove);
            activeElement.elemDOM.css('overflow', 'hidden');
            var op = 'sh ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.height;
            op += '-;-';
            op += 'st ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.top;
            op += '-;-';
            op += 'sw '+activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.width;
            op += '-;-';
            op += 'sl ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.left;
            endOp(op);
        });
        ev.preventDefault();
    }
    
    var resizeBottomLeftInit = function(ev){
        if (ev.which != 1)return;
        if(activeElement){
            activeElement.blur();
        }
        var elem = $(this).closest('.elem');
        activeElement = elem.data('elem');
        var op = 'sh ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.height;
        op += '-;-';
        op += 'sw '+activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.width;
        op += '-;-';
        op += 'sl ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.left;
        startOp(op);
        $('#slides').bind('mousemove',resizeBottomMove);
        $('#slides').bind('mousemove',resizeLeftMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeBottomMove);
            $('#slides').unbind('mousemove',resizeLeftMove);
            activeElement.elemDOM.css('overflow', 'hidden');
            var op = 'sh ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.height;
            op += '-;-';
            op += 'sw '+activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.width;
            op += '-;-';
            op += 'sl ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.left;
            endOp(op);
        });
        ev.preventDefault();
    }
    
    var resizeBottomRightInit = function(ev){
        if (ev.which != 1)return;
        if(activeElement){
            activeElement.blur();
        }
        var elem = $(this).closest('.elem');
        activeElement = elem.data('elem');
        var op = 'sh ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.height;
        op += '-;-';
        op += 'sw '+activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.width;
        startOp(op);
        $('#slides').bind('mousemove',resizeBottomMove);
        $('#slides').bind('mousemove',resizeRightMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeBottomMove);
            $('#slides').unbind('mousemove',resizeRightMove);
            activeElement.elemDOM.css('overflow', 'hidden');
            var op = 'sh ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.height;
            op += '-;-';
            op += 'sw '+activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.width;
            endOp(op);
        });
        ev.preventDefault();
    }
    
    /*
     * Select and format and move elements
     */
    var elemAlign = function(mode, onoff){
        if(onoff == false)return;
        if(activeElement){
            var op = 'ca ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.style.textAlign;
            startOp(op);
            activeElement.editElement({
                style: {
                    textAlign: mode
                }
            });
            op = 'ca ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.style.textAlign;
            endOp(op);
        }
    }
    var elemFormatForMenu = function(mode, value){
        if(!activeElement)return;
        var op = 'cf ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ mode +' '+ !value;
        startOp(op);
        elemFormat(activeElement, mode, value);
        var op = 'cf ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ mode +' '+ value;
        endOp(op);
    }
    var elemFormat = function(elem, mode, value){
        var style = {}
        switch (mode){
            case 'bold':
                if(value)
                    style.fontWeight = 'bold';
                else 
                    style.fontWeight = 'normal';
                break;
            case 'italics':
                if(value)
                    style.fontStyle = 'italic';
                else 
                    style.fontStyle = 'normal';
                break;
            case 'underline':
                if(value)
                    style.textDecoration = 'underline';
                else 
                    style.textDecoration = 'none';
                break;
        }
        elem.editElement({
            style: style
        });
    }
    var elemEditForMenu = function(mode, value){
        if(!activeElement)return;
        var pastVal = elemEdit(activeElement, mode, value);
        var op = 'ee ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ mode +' '+ pastVal;
        startOp(op);
        var op = 'ee ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ mode +' '+ value;
        endOp(op);
    }
    var elemEdit = function(elem, mode, value){
        var changes = {}
        var oldVal;
        switch ( mode ){
            case 'fontsize':
                oldVal = elem.fontSize;
                changes.fontSize = value;
                break;
        }
        elem.editElement(changes);
        return oldVal;
    }
    var elemColorForMenu = function(mode, value){
        if(!activeElement)return;
        var pastVal = elemColor(activeElement, mode, value);
        var op = 'cc ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ mode +' '+ pastVal;
        startOp(op);
        var op = 'cc ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ mode +' '+ value;
        endOp(op);
    }
    var elemColor = function(elem, mode, color){
        var style = new Object();
        var oldVal = elem.style[mode];
        console.log(oldVal);
        style[mode] = color;
        elem.editElement({
            style: style
        });
        return oldVal;
    }
    var elemAnimation = function(id, name){
        if( activeElement ){
            if( !('animations' in activeElement) ){
                activeElement.animations = [];
            }
            if( name == 'none' ){
                activeElement.animations = [];
            }
            else if( activeElement.animations.length ){
                activeElement.animations[0].name = name;
            }
            else {
                activeElement.animations[0] = {
                    type: 'entry',
                    name: name,
                    duration: 'normal',
                    timing: 'click'
                }
            }
            Base.updateMenu(defaultMenus.concat(formatMenu(activeElement)));
            Base.focusMenu('animation');
        }
    }
    var elemEditAnimation = function(mode, value){
        if( activeElement ){
            if( ('animations' in activeElement) && activeElement.animations.length ){
                activeElement.animations[0][mode] = value;
            }
        }
    }
    var elemAnimTiming = function(mode, value){
        if( mode == 'delay' ) {
            var sec = parseFloat(value) * 1000;
            elemEditAnimation('delay', sec);
            return;
        }
        if(!value)return;
        elemEditAnimation('timing', mode);
        if( mode != 'wait' ) {
            delete activeElement.animations[0].delay;
        }
        Base.updateMenu(defaultMenus.concat(formatMenu(activeElement)));
        Base.focusMenu('animation');
    }
    var removeElem = function(btnId){
        if(activeElement){
            startOp('cr '+ activeElement.parent.slideId +' '+ JSON.stringify(activeElement.purify()));
            endOp('de '+ activeElement.parent.slideId +' '+ activeElement.id);
            activeElement.remove();
        }
    }
    var log = function(a, b){
        console.log(a, b);
    }
    var formatMenu = function(elem){
        /*
         * elem is Object of type Elem
         * Returns menus corresponding to element
         */
        
        var format = {
            type: 'main',
            id: 'format',
            title: 'Format', //Name of menu
            icon: 'fa-format', //Font awesome icon name
            groups: []
        };
        
        var group;
        
        //Text align group
        group = {
            type: 'group',
            id: 'align',
            multiple: false,
            required: true,
            items: [
                {
                    type: 'button',
                    icon: 'fa-align-left',
                    id: 'left',
                    title: 'Left align',
                    onoff: true,
                    callback: elemAlign
                },
                {
                    type: 'button',
                    icon: 'fa-align-center',
                    id: 'center',
                    title: 'Center align',
                    onoff: true,
                    callback: elemAlign
                },
                {
                    type: 'button',
                    icon: 'fa-align-right',
                    id: 'right',
                    title: 'Right align',
                    onoff: true,
                    callback: elemAlign
                },
                {
                    type: 'button',
                    icon: 'fa-align-justify',
                    id: 'justify',
                    title: 'Justify',
                    onoff: true,
                    callback: elemAlign
                },
            ]
        };
        if(('style' in elem) && ('textAlign' in elem.style)){
            if(elem.style.textAlign == 'left')
                group.items[0].currState = true;
            else if(elem.style.textAlign == 'center')
                group.items[1].currState = true;
            else if(elem.style.textAlign == 'right')
                group.items[2].currState = true;
            else if(elem.style.textAlign == 'justify')
                group.items[3].currState = true;
        }
        else {
            group.items[0].currState = true;
        }
        
        format.groups.push(group);
        
        //Formating group
        group = {
            type: 'group',
            id: 'textDecor',
            multiple: true,
            required: false,
            items: [
                {
                    type: 'button',
                    icon: 'fa-bold',
                    id: 'bold',
                    title: 'Bold',
                    onoff: true,
                    callback: elemFormatForMenu
                },
                {
                    type: 'button',
                    icon: 'fa-italic',
                    id: 'italics',
                    title: 'Italics',
                    onoff: true,
                    callback: elemFormatForMenu
                },
                {
                    type: 'button',
                    icon: 'fa-underline',
                    id: 'underline',
                    title: 'Underline',
                    onoff: true,
                    callback: elemFormatForMenu
                }
            ]
        };
        if(('style' in elem)){
            if( 'fontWeight' in elem.style && elem.style.fontWeight == 'bold')
                group.items[0].currState = true;
            else 
                group.items[0].currState = false;
                
            if( 'fontStyle' in elem.style && elem.style.fontStyle == 'italic')
                group.items[1].currState = true;
            else 
                group.items[1].currState = false;
                
            if( 'textDecoration' in elem.style && elem.style.textDecoration == 'underline')
                group.items[2].currState = true;
            else 
                group.items[2].currState = false;
        }
        
        format.groups.push(group);
        
        //Font size
        group = {
            type: 'group',
            id: 'fontsize',
            items: [
                {
                    type: 'list',
                    id: 'fontsize',
                    title: 'Font size',
                    list: [
                        {
                            id: '4',
                            value: '4'
                        },
                        {
                            id: '6',
                            value: '6'
                        },
                        {
                            id: '8',
                            value: '8'
                        },
                        {
                            id: '10',
                            value: '10'
                        },
                        {
                            id: '12',
                            value: '12'
                        },
                        {
                            id: '14',
                            value: '14'
                        },
                        {
                            id: '16',
                            value: '16'
                        },
                        {
                            id: '18',
                            value: '18'
                        },
                        {
                            id: '20',
                            value: '20'
                        }
                    ],
                    callback: elemEditForMenu
                },
            ]
        }
        group.items[0].currState = elem.fontSize;
        
        format.groups.push(group);
        
        //Colors group
        group = {
            type: 'group',
            id: 'colors',
            items: [
                {
                    type: 'color',
                    icon: 'fa-circle',
                    id: 'color',
                    title: 'Font color',
                    currState: '#000000',
                    text: 'F',
                    callback: elemColorForMenu
                },
                {
                    type: 'color',
                    icon: 'fa-circle',
                    id: 'backgroundColor',
                    title: 'Background color',
                    currState: '#ffffff',
                    text: 'B',
                    callback: elemColorForMenu
                }
            ]
        }
        if(('style' in elem) && ('color' in elem.style)){
            group.items[0].currState = elem.style.color;
        }
        else {
            group.items[0].currState = '#000';
        }
        
        if(('style' in elem) && ('backgroundColor' in elem.style)){
            group.items[1].currState = elem.style.backgroundColor;
        }
        else {
            group.items[1].currState = '#fff';
        }
        
        format.groups.push(group);
        
        group = {
            type: 'group',
            id: 'remove',
            items: [
                {
                    type: 'button',
                    icon: 'fa-times',
                    id: 'remove',
                    title: 'Remove textbox',
                    callback: removeElem
                }
            ]
        };
        format.groups.push(group);
        
        /*var wordArt = {
            type: 'main',
            id: 'wordart',
            title: 'Word Art', //Name of menu
            icon: 'fa-font', //Font awesome icon name
            groups: []
        };
        
        group = {
            type: 'group',
            id: 'remove',
            items: [
                {
                    type: 'list',
                    id: 'textShadow',
                    title: 'Font effect',
                    list: [
                        {
                            id: 'none',
                            value: '<span style="text-shadow: none">No Effect</span>'
                        },
                        {
                            id: 'blue1',
                            value: '<span style="text-shadow: 1px 1px blue">Blue Shadow</span>'
                        },
                        {
                            id: 'blue2',
                            value: '<span style="text-shadow: 2px 2px 2px blue">Blue Shadow</span>'
                        }
                    ],
                    callback: console.log
                }
            ]
        };
        wordArt.groups.push(group);
        */
        
        var animation = {
            type: 'main',
            id: 'animation',
            title: 'Animation', //Name of menu
            icon: 'fa-magic', //Font awesome icon name
            groups: []
        };
        
        group = {
            type: 'group',
            id: 'animationName',
            items: [
                {
                    type: 'list',
                    id: 'animName',
                    title: 'Animation',
                    list: [
                        {
                            id: 'none',
                            value: 'None'
                        }
                    ],
                    callback: elemAnimation
                }
            ]
        };
        
        for(var i in allAnims){
            group.items[0].list.push({
                id: i,
                value: allAnims[i].name
            });
        }
        
        if( ('animations' in elem) && (elem.animations.length) ){
            group.items[0].currState = elem.animations[0].name;
        }
        else {
            group.items[0].currState = 'none';
        }
        
        animation.groups.push(group);
        
        if( group.items[0].currState != 'none' ) {
            var anim = allAnims[group.items[0].currState];
            if( !('duration' in anim && anim.duration == false) ){
                group = {
                    type: 'group',
                    id: 'animSpeed',
                    items: [
                        {
                            type: 'list',
                            id: 'duration',
                            title: 'Animation speed',
                            list: [
                                {
                                    id: 'slow',
                                    value: 'Slow'
                                },
                                {
                                    id: 'normal',
                                    value: 'Normal'
                                },
                                {
                                    id: 'fast',
                                    value: 'Fast'
                                },
                                {
                                    id: 300,
                                    value: '0.3 s'
                                },
                                {
                                    id: 600,
                                    value: '0.6 s'
                                },
                                {
                                    id: 900,
                                    value: '0.9 s'
                                },
                                {
                                    id: 1200,
                                    value: '1.2 s'
                                },
                                {
                                    id: 1500,
                                    value: '1.5 s'
                                }
                            ],
                            callback: elemEditAnimation,
                            currState: elem.animations[0].duration
                        }
                    ]
                };
                animation.groups.push(group);
            }
            
            group = {
                type: 'group',
                id: 'animTiming',
                multiple: false,
                required: true,
                items: [
                    {
                        type: 'button',
                        id: 'click',
                        icon: 'fa-stop',
                        title: 'Wait for user input',
                        onoff: true,
                        callback: elemAnimTiming,
                    },
                    {
                        type: 'button',
                        id: 'wait',
                        icon: 'fa-clock-o',
                        title: 'After previous animation',
                        onoff: true,
                        callback: elemAnimTiming,
                    },
                    {
                        type: 'button',
                        id: 'do',
                        icon: 'fa-play',
                        title: 'With previous animation',
                        onoff: true,
                        callback: elemAnimTiming,
                    }
                ]
            };
            switch ( elem.animations[0].timing ){
                case 'click':
                    group.items[0].currState = true;
                    break;
                case 'wait':
                    group.items[1].currState = true;
                    break;
                case 'do':
                    group.items[2].currState = true;
                    break;
            }
            animation.groups.push(group);
            
            if( elem.animations[0].timing == 'wait' ){
                group = {
                    type: 'group',
                    id: 'animTiming',
                    multiple: false,
                    required: true,
                    items: [
                        {
                            type: 'text',
                            id: 'delay',
                            title: 'Delay (in seconds)',
                            callback: elemAnimTiming,
                        }
                    ],
                };
                
                if( 'delay' in elem.animations[0] ){
                    group.items[0].currState = (elem.animations[0].delay / 1000) + ' s';
                }
                else {
                    group.items[0].currState = '0 s';
                    elem.animations[0].delay = 0;
                }
                
                animation.groups.push(group);
            }
        }
        
        return [format, animation];
        
    }
    var moveInit = function(ev){
        if(ev.which != 1)return;
        
        var secondClick = false;
        if (activeElement){
            if(activeElement == $(ev.target).closest('.elem').data('elem')){
                secondClick = true;
                if(activeElement.editable)
                    return;
            }
            else {
                activeElement.blur()
            }
        }
        if ($(ev.target).closest('.elem-text').length == 0){
            ev.preventDefault();
            var elem = $(this);
            $('.elem.active').removeClass('active');
            elem.addClass('active');
            activeElement = elem.data('elem');
            activeElement.focus();
            return;
        }
        
        ev.preventDefault();
        
        var elem = $(this);
        $('.elem.active').removeClass('active');
        elem.addClass('active');
        activeElement = elem.data('elem');
        activeElement.origMousePos = {
            y: ev.clientY,
            x: ev.clientX
        }
        activeElement.lastMousePos = {
            y: ev.clientY,
            x: ev.clientX
        }
        //activeElement.elemDOM.css('overflow', 'visible');
        var op = 'sl ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.left;
        op += '-;-';
        op += 'st ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.top;
        startOp(op);
        
        $('#slides').bind('mousemove', moveElement);
        activeElement.focus();
        
        if(secondClick){
            $(window).one('mouseup', function(ev){
                $('#slides').unbind('mousemove', moveElement);
                activeElement.elemDOM.css('overflow', 'hidden');
                if(ev.clientX == activeElement.origMousePos.x && ev.clientY == activeElement.origMousePos.y){
                    activeElement.elemDOM.find('.elem-text').focus();
                    activeElement.editable = true;
                    delete activeElement.origMousePos;
                    delete activeElement.lastMousePos;
                    ev.preventDefault();
                }
                else {
                    delete activeElement.origMousePos;
                    delete activeElement.lastMousePos;
                    var op = 'sl ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.left;
                    op += '-;-';
                    op += 'st ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.top;
                    endOp(op);
                }
            });
        }
        else {
            $(window).one('mouseup', function(ev){
                $('#slides').unbind('mousemove', moveElement);
                activeElement.elemDOM.css('overflow', 'hidden');
                if(ev.clientX == activeElement.origMousePos.x && ev.clientY == activeElement.origMousePos.y){
                    delete activeElement.origMousePos;
                    delete activeElement.lastMousePos;
                    ev.preventDefault();
                }
                else {
                    delete activeElement.origMousePos;
                    delete activeElement.lastMousePos;
                    var op = 'sl ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.left;
                    op += '-;-';
                    op += 'st ' + activeElement.parent.slideId +' '+ activeElement.id +' '+ activeElement.top;
                    endOp(op);
                }
            });
        }
    }
    var moveElement = function(ev){
        if (ev.which != 1) return;
        var slide = $('.slide');
        var mouseXold = activeElement.lastMousePos.x;
        var mouseYold = activeElement.lastMousePos.y;
        var mouseX = ev.clientX;
        var mouseY = ev.clientY;
        activeElement.lastMousePos = {
            y: ev.clientY,
            x: ev.clientX
        }
        var elemX = activeElement.left + ((mouseX - mouseXold)*100/slide.width());
        var elemY = activeElement.top + ((mouseY - mouseYold)*100/slide.height());
        
        activeElement.editElement({
            top: elemY,
            left: elemX
        });
        //ev.preventDefault();
    }
    
    /*
     * Available animations
        id: {
            name: String,   //Human readable name for animation
            duration: Boolean,  //Is duration applicable for animation, default true
            execute: Function(object),  //Accepts object and do animation. On completion call SlideShow.finishAnim
            finish: Function(object),   //Accepts animation object and ends animation.
            cancel: Function(object),   //Accepts animation object and rollbacks animation.
        }
    */
    
    var allAnims = {
        'appear': {
            name: 'Appear',
            duration: false,
            execute: function(object){
                object.elem.elemDOM.show();
                SlideShow.finishAnim(object);
            },
            finish: function(object){
                //It is already finished
            },
            cancel: function(object){
                object.elem.elemDOM.hide();
            }
        },
        'ease': {
            name: 'Ease',
            execute: function(object){
                var finish = function(){
                    SlideShow.finishAnim(object);
                }
                object.elem.elemDOM.show(object.duration, finish);
            },
            finish: function(object){
                object.elem.elemDOM.finish();
                SlideShow.finishAnim(object);
            },
            cancel: function(object){
                //Because it is entry animation
                object.elem.elemDOM.stop();
                object.elem.elemDOM.hide();
            }
        },
        'fade': {
            name: 'Fade',
            execute: function(object){
                var finish = function(){
                    SlideShow.finishAnim(object);
                }
                object.elem.elemDOM.fadeIn(object.duration, finish);
            },
            finish: function(object){
                object.elem.elemDOM.finish();
                SlideShow.finishAnim(object);
            },
            cancel: function(object){
                //Because it is entry animation
                object.elem.elemDOM.stop();
                object.elem.elemDOM.hide();
            }
        },
        'slidedown': {
            name: 'Slide Down',
            execute: function(object){
                var finish = function(){
                    SlideShow.finishAnim(object);
                }
                object.elem.elemDOM.slideDown(object.duration, finish);
            },
            finish: function(object){
                object.elem.elemDOM.finish();
                SlideShow.finishAnim(object);
            },
            cancel: function(object){
                //Because it is entry animation
                object.elem.elemDOM.stop();
                object.elem.elemDOM.hide();
            }
        },
    }
    /*
     * for slideshow
     */
    Slide.prototype.renderSlideShow = function(reverse){
        var slide = this;
        
        if(!slide || !slide.id){
            //Error: Invalid slide
            return;
        }
        
        $('.slide').unbind();
        $('.slide').remove();
        var slideDOM = $('<div class="slide" id="'+slide.id+'">').appendTo('#slides');
        slideDOM.data('slide', slide);
        
        var contain = $('#slides');
        var slideH = contain.height();
        var slideW = slideH*slide.ratio;
        
        if(slideW > contain.width()){
            slideW = contain.width();
            slideH = slideW/slide.ratio;
        }
        
        slideDOM.css({
            'height': slideH,
            'width': slideW,
            'top': (contain.height()-slideH)/2, 
            'backgroundColor': slide.bgColor,
            'boxShadow': 'none'
        });
        
        SlideShow.animQueue = [];
        if('elems' in slide){
            var i;
            for(i in slide.elems){
                slide.elems[i].renderElemShow();
                
                if ( ('animations' in slide.elems[i])
                    && (slide.elems[i].animations.length)
                    && (slide.elems[i].animations[0].type == 'entry') ) {
                        
                    var anim = Object.create( slide.elems[i].animations[0] );
                    anim.elem = slide.elems[i];
                    SlideShow.animQueue.push(anim);
                    if( !reverse )
                        slide.elems[i].elemDOM.hide();
                }
            }
        }
        
        activeSlide = slide;
        if( !reverse )
            SlideShow.finishAnim();
    }
    Elem.prototype.renderElemShow = function(){
        /* 
         * Renders and adds elem to current slide
         */
        var elem = this;
        var slide = $('.slide');
        var slideObj = slide.data('slide');
        
        $('#'+elem.id).unbind();
        $('#'+elem.id).remove();
                
        if('type' in elem){
            if(elem.type == 'title' || elem.type == 'text'){
                //Parent element for text
                var elemDOM = $('<div class="elem-pres slide-'+elem.type+'" id="'+elem.id+'">');
                elemDOM.css({
                    top: (slide.height()*elem.top)/100,
                    left: (slide.width()*elem.left)/100,
                    height: (slide.height()*elem.height)/100,
                    width: (slide.width()*elem.width)/100,
                    fontSize: (slide.height()*elem.fontSize)/100
                });
                
                //Actual element for text
                elemText = $('<div class="elem-text">').html(elem.text).css(elem.style).appendTo(elemDOM);
                
                elemDOM.data('elem',elem);
                elemDOM.appendTo(slide);
                
                elem.elemDOM = elemDOM;
                
                return elemDOM;
            }
        }
        else {
            //Error: Elem type is not defined
        }
    }
    
    var SlideShow = new (function(){
        var currSlideShowIndex;
        var endSlide;
        this.animQueue;
        var animCount;
        this.init = function(){
            endSlide = 0;
            animCount = 0;
            
            $('#sidebar').hide();
            $('#slides').css({
                'width': '100%',
                'backgroundColor': 'black'
            })
            
            for( var i = 0; i<allSlides.length; i++ ) {
                if( allSlides[i] == activeSlide ){
                    currSlideShowIndex = i;
                    break;
                }
            }
            
            activeSlide.renderSlideShow();
            var endBtn = $('<div class="end-pres"><i class="fa">X</i></div>').appendTo('#interface');
            endBtn.click(function(){
                SlideShow.end(true);
            });
            Base.listen(true);
            
            $('#slides').bind('click', SlideShow.next);
            $(window).bind('keydown', showKeyBindings);
        };
        
        var showKeyBindings = function(ev){
            var nextKeys = [13, 39, 32];
            var prevKeys = [8, 37]
            if( nextKeys.indexOf(ev.keyCode) > -1 ){
                SlideShow.next();
            }
            else if( prevKeys.indexOf(ev.keyCode) > -1 ){
                SlideShow.previous();
            }
            else if( ev.keyCode == 27 ){
                SlideShow.end(true);
            }
        }
        
        
        var runnigAnims;
        var runnigAnimList;
        
        this.finishAnim = function(anim){
            --runnigAnims;
            if( runnigAnims < 0 )
                runnigAnims = 0;
            var index;
            if( runnigAnimList &&  (index = runnigAnimList.indexOf(anim)) > -1 ){
                runnigAnimList.splice(index, 1);
            }
            if( !runnigAnims && (animCount < SlideShow.animQueue.length)
                && (SlideShow.animQueue[animCount].timing == 'wait' || SlideShow.animQueue[animCount].timing == 'do' ) ) {
                SlideShow.next();
            }
        }
        
        this.next = function(){
            if( runnigAnimList && runnigAnimList.length ){
                for( var i = 0; i < runnigAnimList.length; i++ ){
                    anim = runnigAnimList[i];
                    if( anim.timeout ){
                        clearTimeout(anim.timeout);
                        delete anim.timeout;
                        allAnims[anim.name].execute(anim);
                    }
                    allAnims[anim.name].finish(anim);
                }
            }
            else if( animCount < SlideShow.animQueue.length ){
                runnigAnims = 0;
                runnigAnimList = [];
                var anim;
                do{
                    ++runnigAnims;
                    anim = SlideShow.animQueue[animCount++];
                    runnigAnimList.push(anim);
                    switch( anim.type ){
                        case 'entry':
                            if( anim.delay ){
                                anim.timeout = setTimeout( function(){
                                    delete anim.timeout;
                                    allAnims[anim.name].execute(anim);
                                }, anim.delay );
                            }
                            else {
                                allAnims[anim.name].execute(anim);
                            }
                            break;
                    }
                }while( (animCount < SlideShow.animQueue.length) && (SlideShow.animQueue[animCount].timing == 'do') );
            }
            else {
                SlideShow.nextSlide();
            }
        }
        
        this.previous = function(){
            if( runnigAnimList && runnigAnimList.length ){
                for( var i = 0; i < runnigAnimList.length; i++ ){
                    anim = runnigAnimList[i];
                    if( anim.timeout ){
                        clearTimeout(anim.timeout);
                        delete anim.timeout;
                    }
                    else {
                        allAnims[anim.name].cancel(anim);
                    }
                    --animCount;
                    runnigAnimList.splice(i, 1);
                }
                runnigAnims = 0;
            }
            if( animCount > 0){
                do{
                    anim = SlideShow.animQueue[--animCount];
                    switch( anim.type ){
                        case 'entry':
                            allAnims[anim.name].cancel(anim);
                            break;
                    }
                }while( (animCount > 0) && (SlideShow.animQueue[animCount].timing == 'do') );
            }
            else {
                SlideShow.prevSlide();
            }
        }
        
        this.nextSlide = function(){
            currSlideShowIndex++;
            if( currSlideShowIndex < allSlides.length ){
                animCount = 0;
                allSlides[currSlideShowIndex].renderSlideShow();
                activeSlide = allSlides[currSlideShowIndex];
            }
            else {
                animCount = 0;
                SlideShow.animQueue = [];
                SlideShow.end();
            }
        };
        
        this.prevSlide = function(){
            if( endSlide ){
                endSlide = 0;
                $('.pres-end-mes').remove();
            }
            currSlideShowIndex--;
            if( currSlideShowIndex >= 0 ){
                allSlides[currSlideShowIndex].renderSlideShow(true);
                animCount = SlideShow.animQueue.length;
                activeSlide = allSlides[currSlideShowIndex];
            }
            else {
                currSlideShowIndex = 0;
            }
        }
        
        this.resize = function(){
            if(activeSlide)
                activeSlide.renderSlideShow();
        };
        
        this.end = function(force){
            $('#slides').empty();
            if(endSlide == 0 && !force){
                $('#slides').append('<div class="pres-end-mes">Click once more to exit the show</div>');
                endSlide = 1;
                return;
            }
            Base.listen(false);
            Show.resize = resizeEditor;
            Base.showMenu();
            Base.exitFullscreen();
            $('#slides').unbind('click', SlideShow.next);
            $(window).unbind('keydown', showKeyBindings);
            $('#slides').css({
                'width': '80%',
                'backgroundColor': ''
            });
            $('#sidebar').show();
            activeSlide.renderSlide();
            Sidebar.init();
        }
    })();
    
    var slideshow = function(mode){
        Base.hideMenu(true);
        Base.fullscreen();
        Show.resize = SlideShow.resize;
        if( mode == 'begin' ){
            activeSlide = allSlides[0];
        }
        SlideShow.init();
    }
    /*
     * for slideshow ends here
     */
     
    var removeInsertOp = function(){
        insertOp = null;
        $('#slides').unbind('mousedown',createTextBox);
    };
    
    var selectOp = function(id){
        insertOp = id;
        $('#slides').bind('mousedown',createTextBox);
    };
    
    var defaultMenus = [
        {
            type: 'main',
            id: 'insert',
            title: 'Insert', //Name of menu
            icon: 'fa-edit', //Font awesome icon name
            groups: [
                {
                    type: 'group',
                    id: 'adsf',
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-list',
                            id: 'insert-text',
                            title: 'Textbox',
                            callback: selectOp
                        },
                        {
                            type: 'button',
                            icon: 'fa-list-alt',
                            id: 'insert-slide',
                            title: 'Slide',
                            callback: insertSlide
                        },
                    ]
                }
            ]
        },
        {
            type: 'main',
            id: 'slide',
            title: 'Slide', //Name of menu
            icon: 'fa-list-alt', //Font awesome icon name
            groups: [
                {
                    type: 'group',
                    id: 'slideformat',
                    items: [
                        {
                            type: 'color',
                            icon: 'fa-circle',
                            id: 'backgroundColor',
                            title: 'Background color',
                            currState: '#ffffff',
                            text: 'B',
                            callback: slideColor
                        }
                    ]
                },
                {
                    type: 'group',
                    id: 'slideorder',
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-chevron-down',
                            id: 'down',
                            title: 'Move Down',
                            callback: moveSlide
                        },
                        {
                            type: 'button',
                            icon: 'fa-chevron-up',
                            id: 'up',
                            title: 'Move Up',
                            callback: moveSlide
                        },
                    ]
                },
                {
                    type: 'group',
                    id: 'removeslide',
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-times',
                            id: 'remove-slide',
                            title: 'Remove Slide',
                            callback: removeSlide
                        },
                    ]
                }
            ]
        },
        {
            type: 'main',
            id: 'show',
            title: 'Slide Show', //Name of menu
            icon: 'fa-desktop', //Font awesome icon name
            groups: [
                {
                    type: 'group',
                    id: 'slideShow',
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-desktop',
                            id: 'begin',
                            title: 'Start Slideshow from begining',
                            callback: slideshow
                        },
                        {
                            type: 'button',
                            icon: 'fa-desktop',
                            id: 'current',
                            title: 'Start Slideshow',
                            callback: slideshow
                        },
                    ]
                }
            ]
        },
    ];
    this.getMenu = function(){        
        return defaultMenus;
    }
    
})();

module = Show;

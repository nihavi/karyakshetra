/*
 * Show - Presentation
 */

Show = new (function(){
    
    var slideId;
    var activeSlide;
    var allSlides;
    var insertOp;
    
    this.init = function(parent){
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
        
        var newSlide = new Slide();
        newSlide.addElem({
                type: 'title',
                top: 5,
                left: 5,
                width: 90,
                height: 13,
                fontSize: 10,
                text: 'Title here',
                style: {textAlign: 'center'}
            });
        newSlide.renderSlide();
        
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
            var sNo = slide.slideId+1;
            
            sidebar.append('<div class="side-no">'+sNo+'.</div>');
            slideDOM = $('<div class="side-slide" id="side'+slide.id+'"></div>').appendTo(sidebar);
            slideDOM.data('slide', slide);
            slideDOM.css({
                height: slideDOM.width()/slide.ratio,
                backgroundColor: slide.bgColor
            });
            slideDOM.click(function(){
                $(this).data('slide').renderSlide();
            });
            slide.renderSlideSide();
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
        newSlide.renderSlide();
        Sidebar.addSlide(newSlide);
    }
    
    var Slide = function(){
        /*
         * Constructor of class Slide
         */
        this.slideId=slideId;
        this.id = 'slide'+slideId;
        this.ratio = 4/3;
        this.bgColor = 'white';
        this.elems = new Object();
        this.elemId = 0;
        allSlides.push(this);
        slideId++;
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
        renderSlideSide: function(){
            var slide = this;
            if('elems' in slide){
                var i;
                for(i in slide.elems){
                    slide.elems[i].renderElemSide(slide.id);
                }
            }
        },
        addElem: function(obj){
            var elem = new Elem(obj);
            elem.id = 'elem'+this.elemId;
            this.elemId++;
            this.elems[elem.id] = elem;
            elem.parent = this;
            return elem;
        },
    };
    
    var Elem = function(elem){
        /*
         * Constructor of class Elem
         */
        
        this.type = elem.type;
        //this.type = 'title';
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
        
        this.top = elem.top;
        this.left = elem.left;
        this.width = elem.width;
        this.elemDOM = null;
        if ('height' in elem)
            this.height = elem.height;
            
        this.animations = [
            {
                type: 'entry',
                name: 'fade',
                duration: 'normal',
                timing: 'click'
            }
        ]
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
                    elemText = $('<div class="elem-text" contentEditable>').html(elem.text).css(elem.style).appendTo(elemDOM);
                    
                    elemDOM.data('elem',elem);
                    elemDOM.appendTo(slide);
                    elemText.focus(textFocus);
                    elemText.blur(textBlur);
                    elemText.bind('keypress keyup', function(ev){
                        elem = $(this).closest('.elem').data('elem');
                        elem.text = $(this).html();
                        elem.renderElemSide(elem.parent.id);
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
            $('#'+activeSlide.id+this.id).remove();
            delete activeSlide.elems[activeElement.id];
            activeElement.blur();
            activeElement = null;
        },
        focus: function(){
            Base.updateMenu(defaultMenus.concat(formatMenu(this)));
            Base.focusMenu('format');
        },
        blur: function(){
            activeElement.elemDOM.removeClass('active');
            activeElement.elemDOM.find('.elem-text').blur();
            activeElement = null;
            Base.updateMenu(defaultMenus);
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
     * Resize mechanisms 
     */
    var resizeRightInit = function(ev){
        if (ev.which != 1)return;
        if(activeElement){
            activeElement.blur();
        }
        var elem = $(this).closest('.elem');
        activeElement = elem.data('elem');
        $('#slides').bind('mousemove',resizeRightMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeRightMove);
            activeElement.elemDOM.css('overflow', 'hidden');
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
        $('#slides').bind('mousemove',resizeLeftMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeLeftMove);
            activeElement.elemDOM.css('overflow', 'hidden');
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
        $('#slides').bind('mousemove',resizeTopMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeTopMove);
            activeElement.elemDOM.css('overflow', 'hidden');
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
        $('#slides').bind('mousemove',resizeBottomMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeBottomMove);
            activeElement.elemDOM.css('overflow', 'hidden');
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
        $('#slides').bind('mousemove',resizeTopMove);
        $('#slides').bind('mousemove',resizeRightMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeTopMove);
            $('#slides').unbind('mousemove',resizeRightMove);
            activeElement.elemDOM.css('overflow', 'hidden');
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
        $('#slides').bind('mousemove',resizeTopMove);
        $('#slides').bind('mousemove',resizeLeftMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeTopMove);
            $('#slides').unbind('mousemove',resizeLeftMove);
            activeElement.elemDOM.css('overflow', 'hidden');
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
        $('#slides').bind('mousemove',resizeBottomMove);
        $('#slides').bind('mousemove',resizeLeftMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeBottomMove);
            $('#slides').unbind('mousemove',resizeLeftMove);
            activeElement.elemDOM.css('overflow', 'hidden');
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
        $('#slides').bind('mousemove',resizeBottomMove);
        $('#slides').bind('mousemove',resizeRightMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeBottomMove);
            $('#slides').unbind('mousemove',resizeRightMove);
            activeElement.elemDOM.css('overflow', 'hidden');
        });
        ev.preventDefault();
    }
    
    /*
     * Select and format and move elements
     */
    var elemAlign = function(mode, onoff){
        if(onoff == false)return;
        if(activeElement){
            activeElement.editElement({
                style: {
                    textAlign: mode
                }
            });
        }
    }
    var elemFormat = function(mode, value){
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
        if(activeElement){
            activeElement.editElement({
                style: style
            });
        }
    }
    var elemEdit = function(mode, value){
        var changes = {}
        switch ( mode ){
            case 'fontsize':
                changes.fontSize = value;
                break;
        }
        if(activeElement){
            activeElement.editElement(changes);
        }
    }
    var elemColor = function(mode, color){
        if(activeElement){
            var style = new Object();
            style[mode] = color;
            activeElement.editElement({
                style: style
            });
        }
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
    var elemAnimTiming = function(mode, onoff){
        if(!onoff)return;
        elemEditAnimation('timing', mode);
    }
    var removeElem = function(btnId){
        if(activeElement)
            activeElement.remove();
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
                    callback: elemFormat
                },
                {
                    type: 'button',
                    icon: 'fa-italic',
                    id: 'italics',
                    title: 'Italics',
                    onoff: true,
                    callback: elemFormat
                },
                {
                    type: 'button',
                    icon: 'fa-underline',
                    id: 'underline',
                    title: 'Underline',
                    onoff: true,
                    callback: elemFormat
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
                    callback: elemEdit
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
                    callback: elemColor
                },
                {
                    type: 'color',
                    icon: 'fa-circle',
                    id: 'backgroundColor',
                    title: 'Background color',
                    currState: '#ffffff',
                    text: 'B',
                    callback: elemColor
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
                                    value: '300 ms'
                                },
                                {
                                    id: 600,
                                    value: '600 ms'
                                },
                                {
                                    id: 900,
                                    value: '900 ms'
                                },
                                {
                                    id: 1200,
                                    value: '1200 ms'
                                },
                                {
                                    id: 1500,
                                    value: '1500 ms'
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
                    //activeElement = null;
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
                    //activeElement = null;
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
            execute: Function(object),  //Accepts object and do animation. On completion call SlideShow.finishAnim
            duration: Boolean,  //Is duration applicable for animation, default true
        }
    */
    
    allAnims = {
        'appear': {
            name: 'Appear',
            duration: false,
            execute: function(object){
                object.elem.elemDOM.show();
                SlideShow.finishAnim();
            }
        },
        'ease': {
            name: 'Ease',
            execute: function(object){
                object.elem.elemDOM.show(object.duration, SlideShow.finishAnim);
            }
        },
        'fade': {
            name: 'Fade',
            execute: function(object){
                object.elem.elemDOM.fadeIn(object.duration, SlideShow.finishAnim);
            }
        },
        'slidedown': {
            name: 'Slide Down',
            execute: function(object){
                object.elem.elemDOM.slideDown(object.duration, SlideShow.finishAnim);
            }
        },
    }
    /*
     * for slideshow
     */
    Slide.prototype.renderSlideShow = function(){
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
                    
                    slide.elems[i].elemDOM.hide();
                }
            }
        }
        
        activeSlide = slide;
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
        this.init = function(){
            endSlide = 0;
            
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
            $('#slides').bind('click', SlideShow.next);
            $(window).bind('keydown', SlideShow.next);
        };
        
        var runnigAnims;
        this.finishAnim = function(){
            --runnigAnims;
            if( !runnigAnims && animQueue.length && animQueue[0].timing == 'wait' ){
                SlideShow.next();
            }
        }
        
        this.next = function(ev){
            if( SlideShow.animQueue.length ){
                runnigAnims = 0;
                var anim;
                do{
                    ++runnigAnims;
                    anim = SlideShow.animQueue.shift();
                    switch( anim.type ){
                        case 'entry':
                            allAnims[anim.name].execute(anim);
                            break;
                    }
                }while( SlideShow.animQueue.length && SlideShow.animQueue[0].timing == 'do' );
            }
            else {
                SlideShow.nextSlide(ev);
            }
        }
        
        this.nextSlide = function(ev){
            currSlideShowIndex++;
            if( currSlideShowIndex < allSlides.length ){
                allSlides[currSlideShowIndex].renderSlideShow();
                activeSlide = allSlides[currSlideShowIndex];
            }
            else {
                SlideShow.end();
            }
        };
        
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
            Show.resize = resizeEditor;
            Base.showMenu();
            Base.exitFullscreen();
            $('#slides').unbind('click', SlideShow.next);
            $(window).unbind('keydown', SlideShow.next);
            $('#slides').css({
                'width': '80%',
                'backgroundColor': ''
            });
            $('#sidebar').show();
            activeSlide.renderSlide();
            Sidebar.init();
        }
    })();
    
    var slideshow = function(){
        Show.resize = SlideShow.resize;
        Base.hideMenu(true);
        Base.fullscreen();
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
            id: 'show',
            title: 'Slide Show', //Name of menu
            icon: 'fa-desktop', //Font awesome icon name
            groups: [
                {
                    type: 'group',
                    id: 'adsf',
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-desktop',
                            id: 'insert-text',
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

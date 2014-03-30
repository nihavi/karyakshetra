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
        this.slides = allSlides;
    }
    
    this.getMenu = function(){
        return {
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
                            callback: selectOp
                        },
                        {
                            type: 'button',
                            icon: 'fa-question-circle',
                            callback: console.log
                        },
                        {
                            type: 'button',
                            icon: 'fa-question-circle',
                            callback: console.log
                        }
                    ]
                }
            ]
        };
    }
    
    this.resize = function(){
        var side = $('#sidebar');
        var slide = $('#slides');
        
        side.css('width','20%');
        slide.css('width','80%');
        
        if(activeSlide)
            activeSlide.renderSlide();
    }
    
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
        fontSize: Number,   //Font-size in percentage relative to slide height
        text: String,   //Text inside the box
        style: Object,  //Css key-value pairs
        top: Number,    //Distance from top edge of the slide in percentage
        left: Number,   //Distance from left edge of the slide in percentage
        width: Number,  //Width in percentage with respect to width of slide
        height: Number,  //Height in percentage with respect to height of slide
        elemDOM: DOMElement //DOM element corresponding to this object
    }
    */
    
    
    var Slide = function(){
        /*
         * Constructor of class Slide
         */
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
            
            var slide = this;
            
            if(!slide || !slide.id){
                //Error: Invalid slide
                return;
            }
            
            $('.slide').remove();
            var slideDOM = $('<div class="slide" id="'+slide.id+'">').appendTo('#slides');
            
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
        addElem: function(obj){
            var elem = new Elem(obj);
            elem.id = 'elem'+this.elemId;
            this.elemId++;
            this.elems[elem.id] = elem;
            return elem;
        }
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
    }
    
    Elem.prototype = {
        renderElem: function(){
            /* 
             * Renders and adds elem to current slide
             */
            var elem = this;
            
            var slide = $('.slide');
            
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
                    
                    //Actual element for text
                    elemText = $('<div class="elem-text" contentEditable>').text(elem.text).css(elem.style).appendTo(elemDOM)
                    elemText.focus(textFocus);
                    
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
                    
                    elem.elemDOM = elemDOM;
                    
                    elemDOM.data('elem',elem);
                    elemDOM.appendTo(slide);
                    return elemDOM;
                }
            }
            else {
                //Error: Elem type is not defined
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
                            fontSize: 5,
                        }).renderElem().data('elem');
        $('#slides').bind('mousemove',resizeNewTextBox);
        $('#slides').one('mouseup',finishNewTextBox);
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
    };
    
    /*
     * Resize mechanisms 
     */
    var resizeRightInit = function(ev){
        if (ev.which != 1)return;
        var elem = $(this).parent('.elem');
        activeElement = elem.data('elem');
        $('#slides').bind('mousemove',resizeRightMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeRightMove);
            activeElement = null;
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
        var elem = $(this).parent('.elem');
        activeElement = elem.data('elem');
        $('#slides').bind('mousemove',resizeLeftMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeLeftMove);
            activeElement = null;
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
        var elem = $(this).parent('.elem');
        activeElement = elem.data('elem');
        $('#slides').bind('mousemove',resizeTopMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeTopMove);
            activeElement = null;
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
        var elem = $(this).parent('.elem');
        activeElement = elem.data('elem');
        $('#slides').bind('mousemove',resizeBottomMove);
        $(window).one('mouseup', function(){
            $('#slides').unbind('mousemove',resizeBottomMove);
            activeElement = null;
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
    
    var removeInsertOp = function(){
        insertOp = null;
        $('#slides').unbind('mousedown',createTextBox);
    };
    
    var selectOp = function(id){
        insertOp = id;
        $('#slides').bind('mousedown',createTextBox);
    };
    
})();

module = Show;

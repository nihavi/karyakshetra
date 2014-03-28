/*
 * Show - Presentation
 */

Show = new (function(){
    
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
    }
    
    this.getMenu = function(){
    }
})();

module = Show;

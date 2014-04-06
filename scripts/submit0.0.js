Submit = new(function(){
    /*
     * JSON
     */
    
    var Form = function(){

        //meta information
        //form id, form title to be obtained from the back-end
        this.children = [];
        this.children.push(new Page());
    };
    
    Form.prototype = {

        addPages = function(pages){
            this.children.push(pages);
            return this;
        }

        addPagesAtStart = function(pages){
            this.children.unshift(pages);
            return this;
        }

        movePageToEnd = function(page){
        }

    }

    var Page = function(){

        this.containers = [];
        this.containers.push(new Control());
    };

    var Control = function(){
    };


    /*
     * DOM Manipulation
     */

    this.init = function(){
    
    };

    this.getMenu = function(){
    
        return {}
    };
    
    this.resize = function(){
    
    };

})();

module = Submit;

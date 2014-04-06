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
    
    var Page = function(){

        this.containers = [];
        this.containters.push(new Control());
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

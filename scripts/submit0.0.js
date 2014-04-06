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

        addPagesAtEnd = function(pages){
            this.children.push(pages);
            return this;
        }

        addPagesAtStart = function(pages){
            this.children.unshift(pages);
            return this;
        }

        movePageToEnd = function(page){
            if (page in this.children){
                var index = this.children.indexOf(page);
                if (index > -1){
                    var moveToEnd = this.children.splice(index, 1);
                    this.addPages(moveToEnd);
                }
            }
            return this;
        }

        movePageToStart = function(page){
            if (page in this.children){
                var index = this.children.indexOf(page);
                if (index > -1){
                    var moveToStart = this.children.splice(index, 1);
                    this.addPagesAtStart(moveToStart);
                }
            }
            return this;
        }

        removePages = function(pages){
            for (var currentPage in pages){
                if (currentPage in this.children){
                    var index = this.children.indexOf(currentPage);
                    if(index > -1){
                        this.children.splice(index, 1);
                    }
                }
            }
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

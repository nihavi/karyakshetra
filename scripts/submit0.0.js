Submit = new(function(){
    /*
     * JSON
     */
    
    
    /* The following are the getters required for testing.
	 * Maybe later when the base tries to access stuff.
	 */ 
    this.newForm = function(){
		return new Form();
	}
	
	this.newPage = function(){
		return new Page();
	}
	
	this.newContainer = function(){
		return new Container();
	}
	
	this.newControl = function(){
		return new Control();
	}
	
    var Form = function(){
        this.id = 1;
        this.children = [];
        this.children.push(new Page());
    };
    
    Form.prototype = {
		
        addPagesAtEnd : function(pages){
            this.children.push(pages);
            return this;
        },

        addPagesAtStart : function(pages){
            this.children.unshift(pages);
            return this;
        },

        movePageToEnd : function(page){
            if (page in this.children){
                var index = this.children.indexOf(page);
                var moveToEnd = this.children.splice(index, 1);
                this.addPagesAtEnd(moveToEnd);
            }
            return this;
        },

        movePageToStart : function(page){
            if (page in this.children){
                var index = this.children.indexOf(page);
				var moveToStart = this.children.splice(index, 1);
				this.addPagesAtStart(moveToStart);
            }
            return this;
        },

        removePages : function(pages){
            for (var currentPage in pages){
                if (currentPage in this.children){
                    var index = this.children.indexOf(currentPage);
                    this.children.splice(index, 1);
                }
            }
        }
    }
    var Page = function(){
        this.containers = [];
        this.containers.push(new Control());
    };
    
    Page.prototype = {
		
		addContainersAtEnd : function(containerList){
			this.containers.push(containerList);
			return this;
		},
		
		addContainersAtStart : function(containerList){
			this.containers.unshift(containerList);
			return this;
		},
		
		moveContainerToEnd : function(singleContainer){
			if (singleContainer in this.containers){
				var index = this.containers.indexOf(singleContainer);
				var moveToEnd = this.containers.splice(index, 1);
				this.addContainersAtEnd(moveToEnd);
			}
			return this;
		},
		
		moveContainerToStart : function(singleContainer){
			if (singleContainer in this.containers){
				var index = this.containers.indexOf(singleContainer);
				var moveToStart = this.containers.splice(index, 1);
				this.addContainersAtStart(moveToStart);
			}
			return this;
		},
		
		removeContainers : function(containerList){
			for (singleContainer in containerList){
				if (singleContainer in this.containers){
					var index = this.containers.indexOf(singleControl);
					this.children.splice(index, 1);
				}
			}
		}
	}

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

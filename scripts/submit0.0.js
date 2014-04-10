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
        //this.children.push(new Page());
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
            return this;
        }
    }
    var Page = function(){
        this.containers = [];
        this.containers.push(new Container());
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
			for (var singleContainer in containerList){
				if (singleContainer in this.containers){
					var index = this.containers.indexOf(singleContainer);
					this.children.splice(index, 1);
				}
			}
			return this;
		}
	}

    var Container = function(){
		this.controls = [];
		this.controls.push(new Control());
    };
    
    Container.prototype = {
		
		addControlsAtEnd : function(controlList){
			this.controls.push(controlList);
			return this;
		},
		
		addControlsAtStart : function(controlList){
			this.controls.unshift(controlList);
			return this;
		},
		
		moveControlToEnd : function(singleControl){
			if (singleControl in this.controls){
				var index = this.controls.indexOf(singleControl);
				var moveToEnd = this.controls.splice(index, 1);
				this.addControlsAtEnd(moveToEnd);
			}
			return this;
		},
		
		moveControlToStart : function(singleControl){
			if (singleControl in this.controls){
				var index = this.controls.indexOf(singleControl);
				var moveToStart = this.controls.splice(index, 1);
				this.addControlsAtStart(moveToStart);
			}
			return this;
		},
		
		removeControls: function (controlList){
			for (var singleControl in controlList){
				if (singleControl in this.controls){
					var index = this.controls.indexOf(singleControl);
					this.controls.splice(index, 1);
				}
			}
			return this;
		}
	}
	/*
	var Control = function(controlType){
		
		this.type = controlType;
		if (this.type == "text"){
			//either single line or mutliple lines
		}
		else
		if (this.type == "radio"){
		}
		else
		if (this.type == "checkboxes"){
		}
		else
		if (this.type == "dropdown"){
		}
		else
		if (this.type == "datetime"){
		}
	}*/

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

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
    };
    
    Form.prototype = {
		
        addPages : function(pages){
            this.children.push(pages);
            return this;
        },
        
        addPageToIndex : function(page, moveToIndex){
			this.children.splice(moveToIndex, 0, page);
		},
		
		movePageToIndex : function(page, moveToIndex){
			if (page in this.children){
				var index = this.children.indexOf(page);
				addPageToIndex(page, moveToIndex);
				if (moveToIndex < index){
					index++;
				}
				this.children.splice(index, 1);
			}
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
    };
    
    Page.prototype = {
		
		addContainers : function(containerList){
			this.containers.push(containerList);
			return this;
		},
		
		addContainerToIndex : function(container, moveToIndex){
			this.containers.splice(moveToIndex, 0, container);
		},
		
		moveContainerToIndex : function(container, moveToIndex){
			if (container in this.containers){
				var index = this.containers.indexOf(container);
				addContainerToIndex(container, moveToIndex);
				if (moveToIndex < index){
					index++;
				}
				this.containers.splice(index, 1);
			}
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
    };
    
    Container.prototype = {
		
		addControls : function(controlList){
			this.controls.push(controlList);
			return this;
		},
		
		addControlToIndex : function(control, moveToIndex){
			this.controls.splice(moveToIndex, 0, control);
		},
		
		moveControlToIndex : function(control, moveToIndex){
			if (control in this.controls){
				var index = this.controls.indexOf(control);
				addControlToIndex(control, moveToIndex);
				if (moveToIndex < index){
					index++;
				}
				this.controls.splice(index, 1);
			}
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
	
	var Control = function(controlType){
		
		this.type = controlType;
		if (this.type == "text"){
			var options = {
				name : null,
				minLength : 10,
				maxLength : 99,
				required : true,
				placeholder : "Input required data"
			};
			textBoxObject = new textBox(options);
		}
		else
		if (this.type == "radioButtonGroup"){
			var options = {
				name : null,
				value : new Array(),
				checked : new Array(),
				defaultCheck : null
			};
			radioButtonObject = new radioButtonGroup(options);
		}
		else
		if (this.type == "checkboxGroup"){
			var options = {
				name : null,
				value : new Array(),
				checked : new Array(),
				defaultCheck : null
			};
			checkboxObject = new checkboxGroup(options);
		}
		else
		if (this.type == "dropdown"){
			var options = {
				name : null,
				size : null,
				multiple : null,
				selected : null
			};
			dropdownObject = new dropdown(options);
		}
		else
		if (this.type == "datetime"){
			var options = {
				name : null,
				year : null,
				month : null,
				date : null,
				hour : null,
				minute : null
			};
			dateTimeObject = new datetime(options);
		}
	}

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

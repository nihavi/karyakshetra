Submit = new(function(){

	//var listOfPages = [];
	//var listOfContainers = [];
	//var listOfControls = [];
	
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

//add code for new page and 'addPage' this new page

    Form.prototype = {
        
        addPage : function(page){
            this.children.push(page);
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

        addPageAtStart : function(page){
            this.children.unshift(page);
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
        
        addContainer : function(containerList){
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
        
        addContainerAtStart : function(containerList){
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
        
        addControl : function(controlList){
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
        
        addControlAtStart : function(controlList){
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

	var Control = function(controlType, options) {
        
        this.type = controlType;
        
        if (this.type == "text") {
			var textBoxObject = new TextBox(options);
        }
        
        else if (this.type == "radioButtonGroup") {
            var radioButtonObject = new RadioButtonGroup(options);
        }
        
        else if (this.type == "checkboxGroup"){
            checkboxObject = new CheckboxGroup(options);
        }
        
        else if (this.type == "dropdown"){
            dropdownObject = new Dropdown(options);
        }
        
        else if (this.type == "datetime"){
            dateTimeObject = new Datetime(options);
        }
        
        var TextBox = function(options){
			if('label' in options ){
				this.label = options.label;
			}
			if('name' in options){
				this.name = options.name;
			}
			if('minLength' in options){
				this.minLength = options.minLength;
			}
			if('maxLength' in options){
				this.maxLength = options.maxLength;
			}
			if('required' in options){
				this.required = options.required;
			}
			if('value' in options){
				this.value = options.value;
			}
		}
		TextBox.prototype = {
            isEmpty : function() {
                return !(this.value.length);
			},
		}
        
        var RadioButtonGroup = function(options){
			if('name' in options){
				this.name = options.name;
			}
			if('value' in options){
				this.value = options.value;
			}
			if('checked' in options){
				this.checked = options.checked;
			}
			if('defaultCheck' in options){
				this.defaultCheck = options.defaultCheck;
			}
        }
        
        var CheckboxGroup = function(options){
			if('name' in options){
				this.name = options.name;
			}
            if('value' in options){
				this.value = options.value;
			}
            if('checked' in options){
				this.checked = options.checked;
			}
            if('defaultCheck' in options){
				this.defaultCheck = options.defaultCheck;
			}
        }
        
        var Dropdown = function(options){
			if('name' in options){
				this.name = options.name;
			}
            if('size' in options){
				this.size = options.size;
			}
            if('multiple' in options){
				this.multiple = options.multiple;
			}
            if('selected' in options){
				this.selected = options.selected;
			}
            if('optList' in options){
				this.optList = options.optList;
			}
        }
        
        var Datetime = function(options){
			if('name' in options){
				this.name = options.name;
			}
            if('year' in options){
				this.year = options.year;
			}
            if('month' in options){
				this.month = options.month;
			}
            if('date' in options){
				this.date = options.date;
			}
            if('hour' in options){
				this.hour = options.hour;
			}
            if('minute' in options){
				this.minute = options.minute;
			}
        }
    }
    
    /*
     * DOM manipulation
     */
    
    var DOM = {
        addPage : function() {
            var page = $('<div class="page"></div>').appendTo($('#form'));
            
            var titleElem = {
                type: 'heading',
                value: 'Page title'
            };
            
            /*
            var pElem = {
                type: 'paragraph',
                value: 'This is a sample paragraph.',
                block: true
            };
            */
            var inputElem = {
                type: 'textbox',
                value: 'Some text',
                label: 'Label:',
            }
            
            
            DOM.addControl(page, titleElem);
            //DOM.addControl(page, pElem);
            DOM.addControl(page, inputElem);
        },
        addControl: function(page, elem) {
            
            var control, innerText;
            switch (elem.type) {
                case 'heading':
                    var control = $('<h1 class="control"></h1>');
                    
                    var inner = $('<div contenteditable="true" class="in"></div>').on('focus', function() {
                        $(this).closest('.control').addClass('focus');
                        $(this).closest('.page').addClass('focus');
                    }).on('blur', function() {
                        $(this).closest('.control').removeClass('focus');
                        $(this).closest('.page').removeClass('focus');
                    });
                    
                    
                    if ('value' in elem) {
                        inner.text(elem.value);
                    }
                    
                    control.append(inner);
                    page.append(control);
                    break;
                
                case 'paragraph':
                    var control = $('<p class="control"></p>');
                    
                    var inner = $('<div contenteditable="true" class="in"></div>').on('focus', function() {
                        $(this).closest('.control').addClass('focus');
                        $(this).closest('.page').addClass('focus');
                    }).on('blur', function() {
                        $(this).closest('.control').removeClass('focus');
                        $(this).closest('.page').removeClass('focus');
                    });

                    if ('value' in elem) {
                        inner.text(elem.value);
                    }
                    
                    control.append(inner);
                    page.append(control);
                    break;
                
                case 'textbox':
                    var control = $('<span style="display:inline-block" class="textbox control"><input style="margin-left: 5px;" type="text"></span>');
                    
                    var inner = $('<span contenteditable="true" class="in"></span>').on('focus', function() {
                            $(this).closest('.control').addClass('focus');
                            $(this).closest('.page').addClass('focus');
                        }).on('blur', function() {
                            $(this).closest('.control').removeClass('focus');
                            $(this).closest('.page').removeClass('focus');
                        });
                    
                    if ('label' in elem) {
                        inner.text(elem.label);
                    }
                    control.prepend(inner);
                    page.append(control);
                    
                    break;
            }
        }
    }
    
    function log(arg1, arg2) {
        console.log(arg1, arg2);
    }
    var defaultMenus = [
        {
            type: 'main',
            id: 'file',
            title: 'File', //Name of menu
            icon: 'fa-file', //Font awesome icon name
            groups: [
                {
                    type: 'group',
                    id: 'g1',
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-save',
                            title: 'Save',
                            callback: log
                        }
                    ]
                }
            ]
        },
        {
            type: 'main',
            id: 'insert',
            title: 'Insert', //Name of menu
            icon: 'fa-plus', //Font awesome icon name
            groups: [
                {
                    type: 'group',
                    id: 'g2',
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-square-o',
                            title:'New page',
                            callback: DOM.addPage
                        }
                    ]
                }
            ]
        }
    ];
    
    var menu = defaultMenus;
    
    this.init = function() {
        var form = $('<div id="form"></div>').appendTo($('#editable'));
    };

    this.getMenu = function(){
        return menu;
    };
    
    this.resize = function(){
    
    };

})();

module = Submit;

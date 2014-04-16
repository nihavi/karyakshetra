Submit = new(function(){
	
    var newForm = function(){
        return new Form();
    }
    
    var newPage = function(){
        return new Page();
    }
    
    var newContainer = function(){
        return new Container();
    }
    
    var newControl = function(){
        return new Control();
    }
    
    var Form = function(){
        this.id = 'form' + formCount;
        this.children = [];
    };

	var formCount = 0;
	var pageCount = 0;
	var containerCount = 0;
	var controlCount = 0;
	
    Form.prototype = {
		
        addPage : function(){
			newestPage = new Page();
			pageCount++;
            this.children.push(newestPage);
            return newestPage;
        },
        
        addPageToIndex : function(moveToIndex){
			newestPage = new Page();
			pageCount++;
            this.children.splice(moveToIndex, 0, newestPage);
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

        addPageAtStart : function(){
			newestPage = new Page();
			pageCount++;
            this.children.unshift(newestPage);
            return newestPage;
        },

        movePageToEnd : function(page){
            if (page in this.children){
                var index = this.children.indexOf(page);
                var moveToEnd = this.children.splice(index, 1);
                this.addPagesAtEnd(moveToEnd);
            }
        },

        movePageToStart : function(page){
            if (page in this.children){
                var index = this.children.indexOf(page);
                var moveToStart = this.children.splice(index, 1);
                this.addPagesAtStart(moveToStart);
            }
        },

        removePages : function(pages){
            for (var currentPage in pages){
                if (currentPage in this.children){
                    var index = this.children.indexOf(currentPage);
                    del = this.children.splice(index, 1);
                }
            }
            return del;
        }
    }
    var Page = function(){
		this.id = 'page' + pageCount;
        this.containers = [];
    };

    Page.prototype = {
        
        addContainer : function(){
			newestContainer = new Container();
			containerCount++;
            this.containers.push(newestContainer);
            return newestContainer;
        },
        
        addContainerToIndex : function(moveToIndex){
			newestContainer = new Container();
			containerCount++;
            this.containers.splice(moveToIndex, 0, newestContainer);
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
        
        addContainerAtStart : function(){
			newestContainer = new Container();
			containerCount++;
            this.containers.unshift(newestContainer);
            return newestContainer;
        },
        
        moveContainerToEnd : function(singleContainer){
            if (singleContainer in this.containers){
                var index = this.containers.indexOf(singleContainer);
                var moveToEnd = this.containers.splice(index, 1);
                this.addContainersAtEnd(moveToEnd);
            }
        },
        
        moveContainerToStart : function(singleContainer){
            if (singleContainer in this.containers){
                var index = this.containers.indexOf(singleContainer);
                var moveToStart = this.containers.splice(index, 1);
                this.addContainersAtStart(moveToStart);
            }
        },
        
        removeContainers : function(containerList){
            for (var singleContainer in containerList){
                if (singleContainer in this.containers){
                    var index = this.containers.indexOf(singleContainer);
                    del = this.children.splice(index, 1);
                }
            }
            return del;
        }
    }
    
    var Container = function(){
		this.id = 'container' + containerCount;
        this.controls = [];
    };
    
    Container.prototype = {
        
        addControl : function(type, args){
			newestControl = Control(type, args);
			controlCount++;
            this.controls.push(newestControl);
            return newestControl;
        },
        
        addControlToIndex : function(moveToIndex){
			newestControl = Control(type, args);
			controlCount++;
            this.controls.splice(moveToIndex, 0, newestControl);
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
        
        addControlAtStart : function(){
			newestControl = Control(type, args);
			controlCount++;
            this.controls.unshift(newestControl);
            return newestControl;
        },
        
        moveControlToEnd : function(singleControl){
            if (singleControl in this.controls){
                var index = this.controls.indexOf(singleControl);
                var moveToEnd = this.controls.splice(index, 1);
                this.addControlsAtEnd(moveToEnd);
            }
        },
        
        moveControlToStart : function(singleControl){
            if (singleControl in this.controls){
                var index = this.controls.indexOf(singleControl);
                var moveToStart = this.controls.splice(index, 1);
                this.addControlsAtStart(moveToStart);
            }
        },
        
        removeControls: function (controlList){
            for (var singleControl in controlList){
                if (singleControl in this.controls){
                    var index = this.controls.indexOf(singleControl);
                    del = this.controls.splice(index, 1);
                }
            }
            return del;
        }
    }

	var Control = function(controlType, options) {
        this.id = 'control' + controlCount;
        this.type = controlType;
        
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
			
			isRequired : function() {
				return this.required;
			},
			
			getLabel : function() {
				return this.label;
			},
			
			getName : function() {
				return this.name;
			},
			
			getMinLength : function() {
				return this.minLength;
			},
			
			getMaxLength : function() {
				return this.maxLength;
			},
			
			getValue : function() {
				return this.value;
			},
			
			setMinLength : function(length) {
				this.minLength = length;
			},
			
			setMaxLength : function(length) {
				this.maxLength = length;
			},
			
			setRequired : function(required) {
				this.required = required;
			},
			
			setValue : function(value) {
				this.value = value;
			},
		}
        
        var RadioButtonGroup = function(options){
			if('name' in options){
				this.name = options.name;
			}
			if('value' in options){
				this.value = options.value;
			}
			if('label' in options){
				this.label = options.label;
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
        
        if (this.type == "text") {
			var textBoxObject = new TextBox(options);
			return textBoxObject;
        }
        
        else if (this.type == "radioButtonGroup") {
            var radioButtonObject = new RadioButtonGroup(options);
            return radioButtonObject;
        }
        
        else if (this.type == "checkboxGroup"){
            checkboxObject = new CheckboxGroup(options);
            return checkboxObject;
        }
        
        else if (this.type == "dropdown"){
            dropdownObject = new Dropdown(options);
            return dropdownObject;
        }
        
        else if (this.type == "datetime"){
            dateTimeObject = new Datetime(options);
            return dateTimeObject;
        }
    }
    
    /*
     * DOM manipulation
     */
    var activePage;
    var activeContainer;
    var DOM = {
        addPage : function() {
            var page = $('<div class="page"></div>').appendTo($('#form'));
            if (activePage) {
                activePage.removeClass('focus');
            }
            activePage = page; 
            activePage.addClass('focus');
            DOM.addContainer();
            var titleElem = {
                type: 'heading',
                value: 'Page title'
            };
            
            DOM.addControl(activeContainer, titleElem);
            
            /*
            var pElem = {
                type: 'paragraph',
                value: 'This is a sample paragraph.',
                block: true
            };
            */
            /*var inputElem = {
                type: 'textbox',
                value: 'Some text',
                label: 'Label:',
            }
            */
            
            //DOM.addControl(page, pElem);
            //DOM.addControl(page, inputElem);
        },
        addContainer : function() {
            var container = $('<div class="container"></div>').appendTo(activePage);
            if (activeContainer) {
                activeContainer.removeClass('focus');
            }
            activeContainer = container;
            activeContainer.addClass('focus');
        },
        addTextbox: function() {
            var input = {
                type: 'textbox',
                val: 'Enter Text Here',
                label: 'Label:',
            }
            DOM.addControl(activeContainer, input);
        },
        addHeading: function() { 
            var titleElem = {
                type: 'heading',
                value: 'Page title'
            };
            
            DOM.addControl(activeContainer, titleElem);
        },
        addParagraph: function() {
            var pElem = {
                type: 'paragraph',
                value: 'This is a sample paragraph.',
                block: true
            };
            DOM.addControl(activeContainer, pElem);
        },
        addControl: function(page, elem) {
            
            var control, innerText;
            switch (elem.type) {
                case 'heading':
                    var control = $('<h1 class="control"></h1>');
                    
                    var inner = $('<div contenteditable="true" class="in"></div>').on('focus', function() {
                        $(this).closest('.control').addClass('focus');
                        activePage = $(this).closest('.page');
                        activePage.addClass('focus');
                        activeContainer = $(this).closest('.container');
                        activeContainer.addClass('focus');
                    }).on('blur', function() {
                        $(this).closest('.control').removeClass('focus');
                        $(this).closest('.container').removeClass('focus');
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
                        activePage = $(this).closest('.page');
                        activePage.addClass('focus');
                        activeContainer = $(this).closest('.container');
                        activeContainer.addClass('focus');
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
                    var control = $('<span style="display:inline-block" class="textbox control"></span>');

                    var textbox = $('<input style="margin-left: 5px" class="textbox"></input>').on('focus', function() {
                            $(this).closest('.control').addClass('focus');
                            activePage = $(this).closest('.page');
                            activePage.addClass('focus');
                            activeContainer = $(this).closest('.container');
                            activeContainer.addClass('focus');
                        }).on('blur', function() {
                            $(this).closest('.control').removeClass('focus');
                            $(this).closest('.page').removeClass('focus');
                        });
                    
                    var inner = $('<span contenteditable="true" class="in"></span>').on('focus', function() {
                            $(this).closest('.control').addClass('focus');
                            activePage = $(this).closest('.page');
                            activeContainer = $(this).closest('.container');
                            activeContainer.addClass('focus');
                        }).on('blur', function() {
                            $(this).closest('.control').removeClass('focus');
                            $(this).closest('.page').removeClass('focus');
                        });
                     
                    if ('label' in elem) {
                        inner.text(elem.label);
                    }
                    if ('value' in elem ) {
                        textbox.val(elem.value);
                    }
                    control.prepend(inner);
                    control.append(textbox);
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
                        },
                        {
                            type: 'button',
                            icon: 'fa-square-o',
                            title: 'New Container',
                            callback: DOM.addContainer
                        },
                        {
                            type: 'button',
                            icon: 'fa-square-o',
                            title: 'New textbox',
                            callback: DOM.addTextbox
                        },
                        {
                            type: 'button',
                            icon: 'fa-square-o',
                            title: 'New heading',
                            callback: DOM.addHeading
                        },
                        {
                            type: 'button',
                            icon: 'fa-square-o',
                            title: 'New paragraph',
                            callback: DOM.addParagraph
                        }
                    ]
                }
            ]
        }
    ];
    
    var menu = defaultMenus;
    
    this.init = function() {
		var jsonObject = {
			minLength : 10,
		};
        var form = $('<div id="form"></div>').appendTo($('#editable'));
        DOM.addPage();
        /*
        var jForm = new Form();
        var jPage1 = jForm.addPage();
        var jPage2 = jForm.addPage();
        var jContainer0101 = jPage1.addContainer();
        var control1 = jContainer0101.addControl("text", jsonObject);
        console.log(jForm, jPage1, jPage2, jContainer0101, control1);
        */
    };

    this.getMenu = function(){
        return menu;
    };
    
    this.resize = function(){
    
    };

})();

module = Submit;

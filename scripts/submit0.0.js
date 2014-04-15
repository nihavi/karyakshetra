Submit = new(function(){
    
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
    
    var updateJSON = function(defaultObject, userObject) {
        for (key in defaultObject) {
            if (key in userObject) {
                defaultObject[key] = userObject[key];
            }
        }
        return defaultObject;
    }

var Control = function(controlType, args) {
        
        this.type = controlType;
        
        if (this.type == "text") {
            var options = {
                name : null,
                minLength : 10,
                maxLength : 99,
                required : true,
                placeholder : "Input required data",
                //value: "",
            };
            options = updateJSON(options, args);
            var textBoxObject = new TextBox(options);	//TODO
        }
        
        else if (this.type == "radioButtonGroup") {
            var options = {
                name : null,
                value : new Array(),
                checked : new Array(),
                defaultCheck : null,
            };
            options = updateJSON(options, args);
            radioButtonObject = new RadioButtonGroup(options);
        }
        
        else if (this.type == "checkboxGroup"){
            var options = {
                name : null,
                value : new Array(),
                checked : new Array(),
                defaultCheck : null,
            };
            options = updateJSON(options, args);
            checkboxObject = new CheckboxGroup(options);
        }
        
        else if (this.type == "dropdown"){
            var options = {    
                name : null,
                size : null,
                multiple : null,
                selected : null,
                optList : new Array(),
            };
            options = updateJSON(options, args);
            dropdownObject = new Dropdown(options);
        }
        
        else if (this.type == "datetime"){
            var options = {
                name : null,
                year : null,
                month : null,
                date : null,
                hour : null,
                minute : null,
            };
            options = updateJSON(options, args);
            dateTimeObject = new Datetime(options);
        }
        
        var TextBox = function(options){
            this.name = options.name;
            this.minLength = options.minLength;
            this.maxLength = options.maxLength;
            this.required = options.required;
            this.placeholder = options.placeholder;
            
            this.value = options.value;
            
            this.isEmpty = function() {
                return !(this.value.length);
            }
            
        }
        
        var RadioButtonGroup = function(options){
            this.name = options.name;
            this.value = options.value;
            this.checked = options.checked;
            this.defaultCheck = options.defaultCheck;
        }
        
        var CheckboxGroup = function(options){
            this.name = options.name;
            this.value = options.value;
            this.checked = options.checked;
            this.defaultCheck = options.defaultCheck;
        }
        
        var Dropdown = function(options){
            this.name = options.name;
            this.size = options.size;
            this.multiple = options.multiple;
            this.selected = options.selected;
            this.optList = options.optList;
            if (multiple == true){        
            }
            else{
            }
        }
        var Datetime = function(options){
            this.name = options.name;
            this.year = options.year;
            this.month = options.month;
            this.date = options.date;
            this.hour = options.hour;
            this.minute = options.minute;
        }
    }
    
    /*
     * DOM manipulation
     */
    
    var DOM = {
        form : $('#form'),
        addPage : function() {
            var page = $('<div class="page"></div>').appendTo(form);
            var titleElem = {
                type: 'heading',
                value: 'Page title',
                block: true
            };
            
            var pElem = {
                type: 'paragraph',
                value: 'This is a sample paragraph.',
                block: true
            };
            
            var inputElem = {
                type: 'textbox',
                value: 'Some text',
                label: 'Label:',
            }
            
            DOM.addControl(page, titleElem);
            DOM.addControl(page, pElem);
            DOM.addControl(page, inputElem);
        },
        addControl: function(page, elem) {
            
            var control, innerText;
            switch (elem.type) {
                case 'heading':
                    var control = $('<h1 class="control"></h1>');
                    if (elem.value) {
                        innerText = elem.value;
                    }
                    if (elem.block) {
                        var inner = $('<div contenteditable="true" class="in"></div>').on('focus', function() {
                            $(this).closest('.control').addClass('focus');
                            $(this).closest('.page').addClass('focus');
                        }).on('blur', function() {
                            $(this).closest('.control').removeClass('focus');
                            $(this).closest('.page').removeClass('focus');
                        });
                    }
                    else
                    {
                        var inner = $('<span contenteditable="true" class="in"></span>').on('focus', function() {
                            $(this).closest('.control').addClass('focus');
                            $(this).closest('.page').addClass('focus');
                        }).on('blur', function() {
                            $(this).closest('.control').removeClass('focus');
                            $(this).closest('.page').removeClass('focus');
                        });
                    }

                    if (innerText) {
                        inner.html(innerText);
                    }
                    control.append(inner);
                    page.append(control);
                    break;
                
                case 'paragraph':
                    var control = $('<p class="control"></p>');
                    if (elem.value) {
                        innerText = elem.value;
                    }
                    
                    if (elem.block) {
                        var inner = $('<div contenteditable="true" class="in"></div>').on('focus', function() {
                            $(this).closest('.control').addClass('focus');
                            $(this).closest('.page').addClass('focus');
                        }).on('blur', function() {
                            $(this).closest('.control').removeClass('focus');
                            $(this).closest('.page').removeClass('focus');
                        });
                    }
                    else
                    {
                        var inner = $('<span contenteditable="true" class="in"></span>').on('focus', function() {
                            $(this).closest('.control').addClass('focus');
                            $(this).closest('.page').addClass('focus');
                        }).on('blur', function() {
                            $(this).closest('.control').removeClass('focus');
                            $(this).closest('.page').removeClass('focus');
                        });
                    }
                    if (innerText) {
                        inner.html(innerText);
                    }
                    control.append(inner);
                    page.append(control);
                    break;
                case 'textbox':
                    var control = $('<span style="display:inline-block" class="textbox control"><input style="margin-left: 5px;" type="text"></span>');
                    if (elem.value) {
                        control.val(elem.value);
                    }
                    var inner = $('<span contenteditable="true" class="in"></span>').on('focus', function() {
                            $(this).closest('.control').addClass('focus');
                            $(this).closest('.page').addClass('focus');
                        }).on('blur', function() {
                            $(this).closest('.control').removeClass('focus');
                            $(this).closest('.page').removeClass('focus');
                        });
                    
                    if (elem.label) {
                        inner.html(elem.label);
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
                            title: 'Save lalala',
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
    
    this.init = function(){
        var form = $('<div id="form"></div>').appendTo($('#editable'));
    };

    this.getMenu = function(){
        return menu;
    };
    
    this.resize = function(){
    
    };

})();

module = Submit;

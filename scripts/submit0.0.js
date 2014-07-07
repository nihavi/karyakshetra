Submit = new(function(){
    
    var activePage, activeContainer;
    
    function Form() {
        this.children = [];
        this.DOMElement = $('<div id="form"></div>').data('objRef', this);
    }
    
    function Container() {
        this.children = [];
        this.DOMElement = $('<div class="container"></div>').data('objRef', this);
    }

    function Page() {
        this.children = [];
        this.DOMElement = $('<div class="page"></div>').data('objRef', this);
    }

    function Control(type, controlArgs) {
        args = controlArgs ? controlArgs : {};
        switch(type) {
            case 'text':
            case 'email':
            case 'password':
                var label = ('label' in args) ? args.label : type.capitalize() + ':';
                this.DOMElement = $('<div class="control"><span class="label" contenteditable="true">' + label + '</span><input type="' + type + '">');
                this.DOMElement.data('objRef', this);
                break;
            case 'title':
                var text = ('text' in args) ? args.text : 'Title'
                this.DOMElement = $('<div class="control"><h1 contenteditable="true">' + text + '</h1></div>');
                this.DOMElement.data('objRef', this);
        }
    }

    Control.prototype.focus = function() {
        this.DOMElement.focus();
    }
    
    Container.prototype.append = function(control) {
        this.children.push(control);
        control.parent = this;
        
        if ('DOMElement' in control) {
            nohl();
            this.DOMElement.appendControl(control);
            
            activeContainer = this;
            activePage = this.parent;
            activeContainer.DOMElement.addClass('focus');
            activePage.DOMElement.addClass('focus');
            control.focus();
        }
    }
        
    Page.prototype.append = function(container) {
        this.children.push(container);
        container.parent = this;
        
        if ('DOMElement' in container) {
            nohl();
            this.DOMElement.appendControl(container);
            
            activePage = this;
            activeContainer = container;
            activeContainer.DOMElement.addClass('focus');
            activePage.DOMElement.addClass('focus');
        }
    }
    
    Form.prototype.append = function append(page) {
        this.children.push(page);
        page.parent = this;
        
        if ('DOMElement' in page) {
            nohl();
            this.DOMElement.append(page.DOMElement);
            activePage = page;
        }
    }
    
    function nohl() {
        if (activePage) 
            activePage.DOMElement.removeClass('focus');
        if (activeContainer)
            activeContainer.DOMElement.removeClass('focus');
    }
    
    this.init = function() {
        
        jQuery.fn.extend({
            appendControl: function(control) {
                this.append(control.DOMElement);
            }
        });
        
        var f = new Form();
        $('#editable').appendControl(f);
        
        $('#form').on('focus', '.control', function() {
            $this = $(this);
            nohl();
            activeContainer = $this.closest('.container').addClass('focus').data('objRef');
            activePage = $this.closest('.page').addClass('focus').data('objRef');
        }).on('blur', '.control', function() {
            nohl();
        });
        
        activePage = new Page();
        activeContainer = new Container();
        activePage.append(activeContainer);
        
        f.append(activePage);

        activeContainer.append(new Control('title', {'text':'Container Title'}));
        Base.focusMenu('insert');
    };

    function openInsertDialog() {
        var insertDialog = $(Base.openDialog('Insert Form Control'));
        insertDialog.append($('<div><input type="radio" name="control-type" value="textbox"/>Textbox</div>'));
        insertDialog.append($('<div><input type="radio" name="control-type" value="textarea"/>Textarea</div>'));
        insertDialog.append($('<input type="button" value="Ok" class="button" />').on('click', Base.closeModal));
        insertDialog.append($('<input type="button" value="Cancel" class="button" />').on('click', Base.closeModal));
    }
    
    this.getMenu = function(){
        return {
            type: 'main',
            id: 'insert',
            title: 'Insert', //Name of menu
            icon: 'fa-plus', //Font awesome icon name
            groups: [
                {
                    type: 'group',
                    id: 'g1',
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-plus-square',
                            title: 'Insert element dialog',
                            callback: openInsertDialog
                        }
                    ]
                },
                {
                    type: 'group',
                    id: 'g2',
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-check-square',
                            title: 'Insert Checkbox',
                            callback: function() {}
                        }
                    ]
                }
            ]
        };
    }
    this.resize = function(){

    };

})();

module = Submit;

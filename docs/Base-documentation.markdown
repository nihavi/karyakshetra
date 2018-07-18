# Base function reference

### init: function ()
    Not for use in module. Do not use.

### setEditable: function ()
    Adjusts the editable portion accoring to the screen size.
    Normally not used by module.


----------


### setPalette: function (newPalette)
    newPalette: Array, required
        Array of size character hex codes of colors
        
    Sets the color palette of color selector in menus with given colors.

### updateMenu: function (menuObject)
    menuObject: Array or Object, required
        Array containing objects or an object specified for menu
    
    This function will update existing menu with new menu given by menuObject

### focusMenu: function (id)
    id: String, required
        Id of menu to be focused
    
    return: Boolean
        True on success, False if not found.
    
    This function will focus a menu specified by id.
    Id is the same as given in menuObject while updateMenu or while initialization process

### getFocusMenu: function ()
    return: String
        Id of the focused menu
    
    This function returns id of the currently focused menu

### hideMenu: function (complete)
    complete: Boolean, optional
        Default: False
        True if you want to hide the menu completely without leaving the option to show it via GUI
    
    This function hides the menu, and shows a little button on top-right to show it again if complete is false

### showMenu: function ()
    Shows menubar if hidden previously.


----------


### openModal: function (height, width, callback)
    height: Number or String, optional
        Default: null
        Height of the modal box in px or any other unit, use carefully
    width:  Number or String, optional
        Default: null
        Width of the modal box in px or any other unit, use carefully
    callback: Function, optional
        Default: null
        Function to be called when modal is closed
    return: DOMElement
        The element in which module should add its content
    
    - Opens modal box with automatic height and width if not specified.
    - Calls the callback function when modal is closed.
    - Returns a DOMElement to add content.

### closeModal: function (callback)
    callback: Boolean
        Default: true
        False to prevent calling modal callback
    
    Closes modal box, and calls callback if not specified otherwise

### prompt: function (text, callback, value, ok, cancel)
    Prompt is a special king of modal, that works as prompt
    
    text: String, Optional
        Default: Default string asking for input
        Text to be shown in prompt dialog box asking for input
    callback: Function (response), required
        response: Mixed
            If prompt fails, response will be False
            Else response will be a string entered by user
        Function to be called when prompt is closed
    value: String, optional
        Default: ''
        Default value for prompt
    ok: String, optional
        Default: 'OK'
        String to be shown in OK button.
    cancel: String, optional
        Default: 'Cancel'
        String to be shown in Cancel button.
    
    Opens a prompt dialog box, and asks for an input


----------


### fullscreen: function ()
    Tries to get fullscreen for karyakshetra winodw, if supported and not blocked by the browser
### exitFullscreen: function ()
    Exits from fullscreen


----------


### addShortcuts: function ( shortcuts )
    shortcuts: Array, required
        Array of objects specified for shoertcuts
        
    Adds keyboard shortcuts.
    If some shortcut is already registered, first remove older shortcut.

### getShortcuts: function ()
    return: Object, required
        Object with all shortcuts.
    
    Returns object with all registred shortcuts, to refer if the shortcut is already registered.

### removeShortcuts: function ( shortcuts )
    shortcuts: Array, required
        Array of objects represting shortcuts to be removed
    
    Removes specified keyboard shortcuts.


----------


### addOp: function (pastState, newState)
    pastState: String, required
        The state before the operation.
    newState: String, required
        The state after the operation.
    
    Adds op into the opQueue for future undo/redo or live viewer

### undo: function ()
    Undo the last operation

### redo: function ()
    Redo the last undoed operation

### stream: function (mode)
    mode: Boolean, required
        Boolean depending on whether you want to start streaming or stop streaming
    
    Starts streaming for live viewers

### listen: function (mode)
    mode: Boolean, required
        Boolean depending on whether you want to start listening or stop listening
    
    Starts listening for live view
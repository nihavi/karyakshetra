/*
{
    type: 'main',
    id: String, //Id selected by module
    title: String, //Name of menu
    icon: String, //Font awesome icon name
    groups: Array //Groups inside this menu
},
{
    type: 'group',
    id: String, //Id selected by module
    multiple: Boolean,  //Is multiple select allowed, Default true
    required: Boolean,  //Is required(alteast one should be selected), Default false
    items: Array //Items inside this group
},
{
    type: 'button',
    id: String, //Id selected by module
    title: String, //Name of button
    icon: String, //Font awesome icon name
    onoff: Boolean,  //Is a on/off button
    currState: Boolean,   //Is on or off, Only if onoff is true
    callback: Function(String id),  //If onoff is false
    callback: Function(String id, Boolean state)    //If onoff is true, state will represent if it turned on or off
},
{
    type: 'color',
    id: String, //Id selected by module
    title: String, //Name of button
    icon: String, //Font awesome icon name
    currState: String, //Default color
    text: String, //Text to show, aside
    callback: Function(String id, String color) //Callback on change
},
{
    type: 'font',
    id: String, //Id selected by module
    title: String, //Name of button
    icon: String, //Font awesome icon name
    currState: String, //Default font name
    callback: Function(String id, String fontName)  //Callback on change
},
{
    type: 'size',
    id: String, //Id selected by module
    title: String, //Name of button
    icon: String, //Font awesome icon name
    currState: Number, //Default size
    rangeStart: Number, //Minimum size
    rangeEnd: Number,   //Maximum size
    callback: Function(String id, Number size)  //Callback on change
},
{
    type: 'text',
    id: String, //Id selected by module
    title: String, //Name of input
    currState: String, //Default value
    callback: Function(String id, Number newValue)    //Callback on change
}
{
    type: 'list',
    id: String, //Id selected by module
    title: String,  //Name of button
    state: Boolean, //Is state maintained, default true
    currState: String, //Default state
    list = Array, //Array of Objects. Object is defined as {id: String, value: String}
    callback: Function(String id, Number selectedItemId)    //Callback on change
}
*/

Base = new (function(){
    /*
     * Base backend
     */
    
    /*
     * File save mechanism
     */
    var currFileId;
    var lastSavedFile;
    var fileName;

    var saveFile = function(filedata, filename){
        var postData = {
            file: filedata,
            module: moduleId,
        }
        var url;
        if( currFileId ){
            //If current file is not new file
            url = baseUrl + 'save/file/';
            postData.id = currFileId;
        }
        else {
            url = baseUrl + 'save/newfile/';
            if( filename )
                postData.filename = filename;
            else
                postData.filename = 'Untitled file';
        }
        $.ajax({
            type: 'POST',
            url: url,
            data: postData,
            success: function(data){
                currFileId = data;
                lastSavedFile = filedata;
                console.log('File saved with id ' + data);
                console.log(postData.filename);
                $('#file-name').text(postData.filename);
            },
            error: function(){
                console.log('File not saved');
            }
        });
    }
    
    var isNewFile = function(){
        if( currFileId )
            return false;
        else 
            return true;
    }
    
    
    /*
     * opQueue implementation
     */
     exQueue = new Array();
     newQueue = new Array();
     exPointer = 0;
    
    this.addOp = function(pastState, newState){
        /*
         * pastState - previous state to be restored on undo
         * newState - next state to be rendered on viewer
         * 
         * Will not return anything
         */
        exQueue[exPointer] = pastState;
        exPointer++;
        exQueue[exPointer] = null;
        exQueue.splice(exPointer + 1);
        newQueue.push(newState);
        if( isStreaming )
            sendOp(newState);
    };
    
    this.undo = function(){
        /*
         * if undo is possible,
         * This function will call module's 'performOp' function with pastState
         * Assuming module is an object with performOp function defined
         * 
         * module.performOp should return pastState and newState in a object 
         * with properties of same names
         * 
         * Will not return anything
         */
        if(exPointer > 0){
            if( isStreaming ){
                //Doing it before everything else to reduce lag in viewer
                sendOp(exQueue[exPointer-1]);
            }
            var op = module.performOp(exQueue[exPointer-1]);
            if(exQueue.length == exPointer+1)
                exQueue[exPointer+1] = null;
            exQueue[exPointer] = op.pastState;
            exPointer--;
            exQueue[exPointer] = null;
            newQueue.push(op.newState);
        }
    }
    this.redo = function(){
        /*
         * if redo is possible,
         * This function will call module's 'performOp' function with newState
         * Assuming module is an object with performOp function defined
         * 
         * module.performOp should return pastState and newState in a object 
         * with properties of same names
         * 
         * Will not return anything
         */
        if(exQueue[exPointer+1] != null){
            if( isStreaming ){
                //Doing it before everything else to reduce lag in viewer
                sendOp(exQueue[exPointer+1]);
            }
            var op = module.performOp(exQueue[exPointer+1]);
            exQueue[exPointer] = op.pastState;
            exPointer++;
            exQueue[exPointer] = null;
            newQueue.push(op.newState);
        }
    }
    var isListening = false;
    var isStreaming = false;
    var lastLoadedOp;
    
    var startListening = function(){
        var updateOp = function(){
            $.ajax({
                type: 'POST',
                url: baseUrl+'opqueue/getop/',
                data: {
                    fid: currFileId,
                    last: lastLoadedOp
                },
                success: function(data){
                    if( !isListening )
                        return;
                    if( data ){
                        data = JSON.parse(data);
                        for(var i = 0; i < data.ops.length; ++i){
                            module.performOp(data.ops[i].op)
                        }
                        lastLoadedOp = data.lastOp;
                    }
                    updateOp();
                }
            });
        }
        if( currFileId ) {
            $.ajax({
                type: 'POST',
                url: baseUrl+'opqueue/lastop/',
                data: {
                    fid: currFileId,
                },
                success: function(data){
                    lastLoadedOp = data;
                    updateOp();
                }
            });
        }
        else {
            return false;
        }
    }
    
    var sendOp = function(op){
        $.ajax({
            type: 'POST',
            url: baseUrl+'opqueue/addop/',
            data: {
                fid: currFileId,
                op: op
            },
            success: function(data){
                //Do nothing
                //TODO: Failiure detection
            }
        });
    }
    this.listen = function(mode){
        if( isListening == mode )return;
        if( mode ){
            this.stream(false);
            isListening = true;
            startListening();
        }
        else {
            isListening = false;
        }
    }
    this.stream = function(mode){
        if( isStreaming == mode )return;
        if( mode ){
            this.listen(false);
            isStreaming = true;
        }
        else {
            isStreaming = false;
        }
    }
    
    
    /*
     * Keyboard shortcuts
     *
    
    Prototype of shortcut object
    {
        ctrl: Boolean,
        shift: Boolean,
        alt: Boolean,
        char: String,
        callback: Function()
    }
    
    */
    
    var registeredShortcuts = new Object();
    
    this.getShortcuts = function(){
        /*
         * Returns object containing all registered shortcuts
         */
        return registeredShortcuts;
    }
    
    this.addShortcuts = function( shortcuts ){
        /*
         * Adds key shortcuts
         * 
         * Expects an Array of Objects as argument.
         * Object is defined as followed
        
        {
            ctrl: Boolean,
            shift: Boolean,
            alt: Boolean,
            char: String,
            callback: Function()
        }
        
         */
        var i;
        for ( i = 0; i<shortcuts.length; i++ ){
            var short = shortcuts[i];
            if( short.char ){
                short.char = short.char.charAt(0).toUpperCase();
                if((short.char >= 'A' && short.char <= 'Z') || (short.char > '0' && short.char < '9')){
                    if( short.ctrl || short.shift || short.alt ){
                        //Create key binding string
                        var reg = '';
                        if( short.ctrl )reg += 'ctrl+';
                        if( short.shift )reg += 'shift+';
                        if( short.alt )reg += 'alt+';
                        reg += short.char;
                        //If not already registered, register.
                        if( !(reg in registeredShortcuts)){
                            registeredShortcuts[reg] = short.callback;
                        }
                        else {
                            //Error: Shortcut already registered
                        }
                    }
                    else {
                        //Error: Invalid controll key
                    }
                }
                else {
                    //Error: Invalid character
                }
            }
            else {
                //Error: Invalid character
            }
        }
    };
    
    this.removeShortcuts = function( shortcuts ){
        /*
         * Removes key shortcuts
         * 
         * Expects an Array of Objects as argument.
         * Object is defined as followed
        
        {
            ctrl: Boolean,
            shift: Boolean,
            alt: Boolean,
            char: String,
        }
        
         */
        var i;
        for ( i = 0; i<shortcuts.length; i++ ){
            var short = shortcuts[i];
            if( short.char ){
                short.char = short.char.charAt(0).toUpperCase();
                if((short.char >= 'A' && short.char <= 'Z') || (short.char > '0' && short.char < '9')){
                    if( short.ctrl || short.shift || short.alt ){
                        //Create key binding string
                        var reg = '';
                        if( short.ctrl )reg += 'ctrl+';
                        if( short.shift )reg += 'shift+';
                        if( short.alt )reg += 'alt+';
                        reg += short.char;
                        //If registered, remove.
                        if( (reg in registeredShortcuts)){
                            if(delete registeredShortcuts[reg]){
                                registeredShortcuts[reg] = null;
                            }
                        }
                        else {
                            //Error: Shortcut not registered
                        }
                    }
                    else {
                        //Error: Invalid controll key
                    }
                }
                else {
                    //Error: Invalid character
                }
            }
            else {
                //Error: Invalid character
            }
        }
    };
    
    var handleKeyShortcuts = function(ev){
        var comb = '';
        if( ev.ctrlKey )comb += 'ctrl+';
        if( ev.shiftKey )comb += 'shift+';
        if( ev.altKey )comb += 'alt+';
        comb += String.fromCharCode(ev.which);
                
        if( comb in registeredShortcuts && registeredShortcuts[comb] != null){
            registeredShortcuts[comb]();
            ev.preventDefault();
        }
    }
    
    //Add event listener for key shortcuts
    $(window).keydown(handleKeyShortcuts);
    
    //Common shortcuts are added at the end of this script to avoid undefined functions
    
    /*
     * Base Frontend
     */
    var defaultPalette = [
        '000000',
        '434343',
        '666666',
        '999999',
        'b7b7b7',
        'cccccc',
        'd9d9d9',
        'efefef',
        'f3f3f3',
        'ffffff',
        'e6b9b1',
        'f2cbcb',
        'fae3cd',
        'fff1cc',
        'd9e8d3',
        'd1e0e3',
        'cbdbf7',
        'd0e2f2',
        'd9d3e8',
        'e8d1db',
        'db7e6b',
        'e89999',
        'f7ca9c',
        'ffe499',
        'b7d6a9',
        'a1c2c7',
        'a5c2f2',
        '9ec4e6',
        'b3a7d4',
        'd4a5bc',
        'cc4227',
        'de6666',
        'f5b06c',
        'ffd966',
        '92c27c',
        '76a4ad',
        '6ea0eb',
        '70a9db',
        '8d7cc2',
        'c27ca0',
        'a61c00',
        'cc0000',
        'e68f39',
        'f0c032',
        '6ba650',
        '45808c',
        '3c7ad6',
        '3c7ad6',
        '654ea6',
        'a64e78',
        '851f0d',
        '990000',
        'b35d07',
        'bd8e00',
        '39751d',
        '13505c',
        '1256cc',
        '0c5494',
        '331c73',
        '731c46',
        '590d00',
        '660000',
        '783e05',
        '7d5e00',
        '274d13',
        '0c323b',
        '1c4485',
        '083761',
        '20124d',
        '4a112e',
    ];

    var palette;

    this.setPalette = function(newPalette) {
        palette = new Array();
        for (var i = 0; i < newPalette.length; ++i) {
            var val = parseInt('0x' + newPalette[i]);
            if (!isNaN(val) && val >= 0 && val <= 0xFFFFFF)
                palette.push(newPalette[i]);
        }
        if (palette.length == 0)
            palette = defaultPalette;
    }
    
    var log = function(id,t){
        console.log(id,t);
    }
    
    var saveFrontEnd = function(){
        if( 'getFile' in module ){
            var data = module.getFile();
            if( isNewFile() ){
                Base.prompt("Enter file name", function(filename){
                    if( !filename )return;
                    saveFile(data, filename);
                }, 'Untitled file', 'Save');
            }
            else {
                saveFile(data);
            }
        }
        else {
            alert('File save not supported');
        }
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
                            callback: saveFrontEnd
                        }
                    ]
                }
            ]
        }
    ];
    
    var menus;//Keeps track and information of the menus
    var menuMeta;//Mapping of modules id and DOM id
    var groupMeta;//Keeps information about groups in current submenu
    var submenu;//Keeps track and information of the current submenu
    var menuId;
    
    /*
     * Global variables from response
     */
    
    var baseUrl;
    var moduleMode;
    
    /*
     * Dependency solver
     */
    var loadingDep;
    
    var loadMathJax = function(){
        window.MathJax = {
            root: baseUrl+'libs/MathJax',
            extensions: ["tex2jax.js"],
            jax: ["input/TeX","output/HTML-CSS"],
            showProcessingMessages: false,
            messageStyle: 'none',
            showMathMenu: false,
            showMathMenuMSIE: false,
            tex2jax: {
                inlineMath: [["$","$"],["\\(","\\)"]],
                preview: ["loading..."]
            }
        };
        path = baseUrl + 'libs/MathJax/MathJax.js';
        $.ajax({
            url: path,
            dataType: "script",
            cache: true,
            success: function(){
                MathJax.Hub.Queue(
                    ["Typeset",MathJax.Hub,$('<div id="dummyMathJaxdummy" style="position:absolute;top:-100px;left:-1000px;">$\pm sin \left( x \right)$</div>').appendTo('body').get(0)],
                    function(){
                        $('#dummyMathJaxdummy').remove();
                    },
                    solvedDep
                )
            }
        })
    };
    
    var solveDepend = function(depends){
        var availLibs = {
            'MathJax': loadMathJax
        };
        loadingDep = 0;
        for( var i = 0; i < depends.length; ++i ){
            if( depends[i] in availLibs ){
                ++loadingDep;
                availLibs[depends[i]]();
            }
        }
    }
    
    var solvedDep = function(){
        --loadingDep;
        if(loadingDep < 1)
            init2();
    }
    
    this.init = function(){
        /*
         * init function for Base
         * To be called when all js and css are loaded for the first time
         */
        
        // Get base url from response
        baseUrl = response.baseUrl;
        moduleId = response.moduleId;
        moduleMode = response.mode;
        
        /*
         * Check excludes and set environment accordingly
         */
        
        if( 'exclude' in module ){
            for(var i = 0; i < module.exclude.length; ++i){
                switch( module.exclude[i] ){
                    case 'defaultMenu':
                        showDefaultMenu = false;
                        break;
                    case 'fileName':
                        showFileName = false;
                        break;
                }
            }
        }
        
        /*
         * Check dependencies and load libraries 
         */
        if( 'depends' in module ){
            solveDepend(module.depends);
        }
        else {
            init2();
        }
    }
    var init2 = function(){
        /*
         * Init level 2.
         * Dependencies are solved by now.
         */
        
        if( ('fileId' in response) && ('fileData' in response) ){
            //Open file
            if( !('openFile' in module) ){
                alert('Files are not supported');
            }
            else {
                currFileId = response.fileId;
                var file = response.fileData;
                lastSavedFile = file;
                fileName = response.fileName;
            }
        }
        
        $( "#wait-message" ).remove();
        
        //Set default palette
        Base.setPalette(defaultPalette);
        
        //Append interface div that contains everything inside body
        $('<div class="interface" id="interface"></div>').appendTo('body');
        
        //Append menubar to interface
        //menubar contains whole menu with all submenus
        $('<div class="toolbars" id="menubar"></div>').appendTo('#interface');
        
        //Append main to menubar
        var mainMenu = $('<div class="bar bar-super" id="mainMenu"></div>').appendTo('#menubar');
        
        mainMenu.mousedown(function(ev){
            ev.preventDefault();
        });
        
        //Add main menu items inside this level
        //Items are defined in menus
        menuId = 0;
        menus = new Object();
        menuMeta = new Object();
        Base.updateMenu(module.getMenu());
        focusFirstMenu();
        

        //Append editable to interface
        var edit = $('<div class="editable" id="editable"></div>').appendTo('#interface');
        Base.setEditable();
        
        //Call module's init
        module.init(edit.get(0), file, moduleMode);
        module.resize();
                
        window.onbeforeunload = function(){
            //To prevent unload if file is changed
            if( 'getFile' in module ){
                if( module.getFile() != lastSavedFile )
                    return "You have not saved the file yet. You may lose the changes.";
            }
        };
    }

    function createColorPicker() {
        
        $('.colorpicker').remove();
        var domElement = $('<div class="colorpicker clearfloat"></div>');

        for (var i=0;i<palette.length;++i) {
            domElement.append('<div class="color" style="background-color: #' + palette[i] + '"></div>');
        }

        domElement.css({
            'position'  :  'absolute',
            'z-index'   :  '20'
        });

        domElement.hide();
        $('.toolbars').append(domElement);

        var onColorClick = function(e) {
            $('.colorpicker .color.active').removeClass('active');
            $(this).addClass('active');
            var selectedColor = $(this).css('background-color');
            $('#' + $('.colorpicker').data('caller')).find('i').css('color', selectedColor);
            var item = submenu[$('.colorpicker').data('caller')];
            item.currState = selectedColor;
            item.callback(item.id, selectedColor);
        }

        $('.colorpicker .color').bind('click', onColorClick);
        
    };
    
    var activeMenu;
    var showDefaultMenu = true;
    var showFileName = true;
    this.updateMenu = function(menuObject){
        //Will be called by module with menuObject
        //Will merge defaultMenus and menuObject and create menu
        var oldActiveMenu = activeMenu;
        var menu;
        if( showDefaultMenu ){
            menu = defaultMenus;
        }
        else {
            menu = [];
        }
        if ( menuObject ){
            menu = menu.concat(menuObject);
        }
        createMenu(menu);
        if( !this.focusMenu(oldActiveMenu) )
            focusFirstMenu();
    };
    
    var focusFirstMenu = function(){
        var i;
        for( i in menuMeta ){
            Base.focusMenu(i);
            break;
        }
    }
    
    this.focusMenu = function(id){
        //Will be called by module with id of a menu to activate that menu
        if (id && id in menuMeta){
            activateMenu.call($('#'+menuMeta[id]));
            return true;
        }
        else {
            return false;
        }
    }
    
    this.getFocusMenu = function(){
        return activeMenu;
    }
    
    var createMenu = function(menuObject){
        //Create menu labels in menubar, and merge menus with same id
        var item, i, menuItem;
        var id;
        var mainMenu = $('#mainMenu');
        menuMeta = new Array();
        mainMenu.empty();
        $('#subMenu').remove();
        
        var homeLink = $('<a class="a-home" href="'+baseUrl+'">')
            .append($('<div class="btn btn-big btn-home"></div>')
            .append($('<i class="fa fa-home"></i>')))
            .appendTo(mainMenu);

        var accountOptions = $('<a href="' + baseUrl +'account/logout/" class="account-options pull-right" >Logout</a>').appendTo(mainMenu);
        
        if (showFileName) {    
            $('<span style="color:#aaa;" id="file-name" class=" pull-right">' + ((fileName) ? fileName : 'Untitled file') + '</span>').appendTo(mainMenu);
        }
        
        for(var i = 0; i<menuObject.length; ++i){
            item = menuObject[i];
            if( ('type' in item) && (item.type == 'main') && ('title' in item) && ('icon' in item) ){
                if(('id' in item) && (item.id in menuMeta)){
                    //Merge menus
                    id = menuMeta[item.id];
                    menuItem = menus[id];
                    menuItem.groups = menuItem.groups.concat(item.groups);
                }
                else {
                    //Insert menu into DOM
                    id = 'menuHead'+menuId;
                    var menuItem = $('<div class="btn btn-big" id="'+id+'"></div>').appendTo(mainMenu);
                    
                    menuItem.click(activateMenu);
                    $('<i class="fa '+item.icon+'"></i>').appendTo(menuItem);
                    $('<span> '+item.title+'</span>').appendTo(menuItem);
                    //Insert menu into menus
                    if(('id' in item) && item.id){
                        menuMeta[item.id] = id;
                    }
                    menus[id] = Object.create(item);
                    menuId++;
                }
            }
            else {
                //Error: invalid menu item, ignored
            }
        }
        createColorPicker();
    }
    
    var activateMenu = function(ev){
        /* 
         * Onclick event handler on main menu items
         * Creates menu associated with label
         */
        var id = $(this).attr('id');
        var menu = menus[id];
        activeMenu = menu.id;
        
        //Change classes of item in main menu
        $('#mainMenu .active').removeClass('active');
        $(this).addClass('active');
        
        //Remove old submenu
        $('#subMenu').remove();
        groupMeta = new Object();
        submenu = new Object();
        var subMenuId = 0;
        
        //Append submenu to menubar
        var subMenu = $('<div class="bar bar-sub blue" id="subMenu"></div>').appendTo('#menubar');
        subMenu.mousedown(function(ev){
            if( !$(ev.target).closest('.input-text').length )
                ev.preventDefault();
        });
        //Append submenu items to submenu
        var item,i,j;
        var id, group;
        if( 'groups' in menu ){
            for ( j in menu.groups){
                if( ('items' in menu.groups[j]) && ('id' in menu.groups[j])){
                    group = menu.groups[j];
                    groupMeta[group.id] = new Object();
                    if(('multiple' in group) && (group.multiple == false)){
                        groupMeta[group.id].multiple = false;
                    }
                    else {
                        groupMeta[group.id].multiple = true;
                    }
                    if('required' in group)
                        groupMeta[group.id].required = group.required;
                    for( i in group.items ){
                        item = group.items[i];
                        id = 'menuItem'+subMenuId;
                        if( ('type' in item) && ('callback' in item) ){
                            //Append menu item to DOM
                            var menuItem = $('<div class="btn" id="'+id+'"></div>').appendTo(subMenu);
                            if(item.title){
                                menuItem.attr({
                                    'rel': 'tooltip',
                                    'title': item.title
                                });
                            }
                            if (item.icon) {
                                $('<i class="fa '+item.icon+'"></i>').appendTo(menuItem);
                                menuItem.addClass('btn-icon');
                            }
                            
                            if( item.type == 'color' ){
                                menuItem.addClass('btn-color');
                                menuItem.find('i').css('font-size', '0.5em');
                                if ('currState' in item) {
                                    menuItem.find('i').css('color', item.currState);
                                }
                                if (item.text) {
                                    $('<span class="btn-intext">' + item.text + '</span>').prependTo(menuItem);
                                    menuItem.addClass('btn-text');
                                }
                            }
                            else if( item.type == 'font' ){
                            }
                            else if( item.type == 'size' ){
                            }
                            else if( item.type == 'text' ){
                                menuItem.empty();
                                menuItem.addClass('input-text btn-text btn-intext btn-icon');
                                var input = $('<input class="menu-input" />').appendTo(menuItem);
                                if( 'currState' in item ){
                                    input.val(item.currState);
                                }
                                input.change(function(){
                                    //FIXME: on updateMenu text does not get changed
                                    var elem = $(this).closest('.input-text');
                                    var itemId = elem.attr('id');
                                    var item = submenu[itemId];
                                    item.callback(item.id, $(this).val());
                                    item.currState = $(this).val();
                                });
                            }
                            else if( item.type == 'list' ){
                                if('list' in item) {
                                    menuItem.empty();
                                    menuItem.addClass('select btn-text btn-intext btn-icon');
                                    var dropdown = $('<div class="dropdown"></div>').appendTo(menuItem);
                                    for(var i = 0; i<item.list.length; i++) {
                                        
                                        var op = $('<div class="option">'+(item.list[i].value)+'</div>')
                                            .data({
                                                'id': item.list[i].id,
                                                'index' : i
                                            })
                                            .appendTo(dropdown);
                                        
                                        op.click(function() {
                                            var elem = $(this).closest('.select');
                                            var itemId = elem.attr('id');
                                            var item = submenu[itemId];
                                            var selected = $(this).data('id');
                                            item.callback(item.id, selected);
                                            
                                            if( !('state' in item) || item.state ){
                                                elem.find('.btn-intext').html(item.list[$(this).data('index')].value);
                                                item.currState = selected;
                                            }
                                        });
                                    }
                                    
                                    menuItem.css('min-width', dropdown.width() + (menuItem.outerWidth() - menuItem.width()) * 2);
                                    
                                    var x = menuItem.offset().left;
                                    var y = $('.toolbars').height() + 2;
                                    
                                    dropdown.css({
                                        'top' : y,
                                        'left': x,
                                        'min-width': parseInt(menuItem.css('min-width')) + 14
                                    });
                                    
                                    var text = $('<span class="btn-intext"></span>').prependTo(menuItem);
                                    
                                    if('currState' in item){
                                        if( !('state' in item) || item.state ){
                                            for (var i=0;i<item.list.length;++i) {
                                                if (item.list[i].id == item.currState) {
                                                    text.html(item.list[i].value);
                                                }
                                            }
                                        }
                                        else {
                                            text.html(item.currState);
                                        }
                                    }
                                    else {
                                        item.currState = item.list[0].id;
                                        text.html(item.list[0].value);
                                    }
                                }
                            }
                            else { // if item.type == 'button' or item.type is not known
                                if(('onoff' in item) && item.onoff == true){
                                    if ( ('currState' in item) && item.currState == true ){
                                        menuItem.addClass('active');
                                    }
                                }
                            }
                            
                            menuItem.mousedown(function(ev){
                                if( !$(ev.target).closest('.input-text').length )
                                    ev.preventDefault();
                            });
                            menuItem.click(handleMenuClick);
                            //Append menu item to submenu object
                            item.parentGroup = group.id;
                            submenu[id] = item;
                            subMenuId++;
                        }
                        else {
                            //Error: invalid submenu item, ignored
                        }
                    }
                    //If group is not last, append separator
                    if( j <= menu.groups.length-2 ){
                        $('<div class="sep">|</div>').appendTo(subMenu);
                    }
                }
                else {
                    //Error: empty/invalid group, ignored
                }
            }
        }
        else {
            //Error: empty menu item, ignored
        }
        setTooltip();
    }
    
    var handleMenuClick = function(ev){
        //Handles click on toolbar items
        var elem = $(this);
        var itemId = $(this).attr('id');
        var item = submenu[itemId];
        
        if( item.type == 'color' ){
                    
            var hideColorPicker = function(e) {
                if (($(e.target).closest('.colorpicker').length == 0)
                    && ($(e.target).closest('.btn-color').length == 0)) {

                    $(window).unbind('click', hideColorPicker);
                    $('#'+$('.colorpicker').data('caller')).attr('rel','tooltip');
                    $('.colorpicker').hide().data('caller', '');
                }
            }
            
            if (($('.colorpicker').css('display') == 'none') || ($('.colorpicker').data('caller') != itemId)) {
                
                var x = elem.offset().left;
                var y = $('.toolbars').height() + 1;
                
                $('.colorpicker').css({
                    'top': y,
                    'left': x
                });
                
                var dummy = $('<div>').css('backgroundColor',item.currState);
                var color = dummy.css('backgroundColor');
                dummy.remove()
                $('.colorpicker .color').removeClass('active');
                $('.colorpicker .color').filter(function(i){
                    return $(this).css('backgroundColor') == item.currState || $(this).css('backgroundColor') == color;
                }).first().addClass('active');
                
                $('.colorpicker').show().data('caller', itemId);
                $(window).bind('click', hideColorPicker);
                $('.btn-color').attr('rel','tooltip');
                elem.removeAttr('rel');
            }
            else {
                elem.attr('rel','tooltip');
                $('.colorpicker').hide().data('caller', '');
                $(window).unbind('click', hideColorPicker);
            }
        }
        
        else if( item.type == 'font' ){
        }
        else if( item.type == 'size' ){
        }
        else if( item.type == 'text' ){
            //Do nothing
        }
        else if( item.type == 'list' ){
            var dropdown = elem.find('.dropdown');
            
            var hideDropdown = function(e) {
                if ($(e.target).closest('.dropdown').length == 0) {
                    if( $(e.target).closest('.select').length == 0 ){                      
                        $(window).unbind('click', hideDropdown);
                        $('.dropdown').hide();
                        $('.btn.select').attr('rel','tooltip');
                    }
                }
            }
            
            if (dropdown.css('display') == 'none') {
                $('.dropdown').hide();
                dropdown.show();
                $(window).bind('click', hideDropdown);
                $('.btn.select').attr('rel','tooltip');
                elem.removeAttr('rel');
            }
            else {
                dropdown.hide();
                $(window).unbind('click', hideDropdown);
                elem.attr('rel','tooltip');
            }
        }
        else { // if item.type == 'button' or item.type is not known
            if ( ('onoff' in item) && item.onoff == true ){
                if ( !('currState' in item) || item.currState == false ){
                    //Inactive any active button in this group
                    if ( groupMeta[item.parentGroup].multiple == false ){
                        var subButtons = $('.bar-sub .btn.active').each(function(){
                            if( submenu[$(this).attr('id')].parentGroup == item.parentGroup ){
                                //Update state in object
                                submenu[$(this).attr('id')].currState = false;
                                submenu[$(this).attr('id')].callback(item.id, false);
                                //Update state in DOM
                                $(this).removeClass('active');
                            }
                        });
                    }
                    //Update state in object
                    item.currState = true;
                    item.callback(item.id, true);
                    //Update state in DOM
                    elem.addClass('active');
                }
                else {
                    //To ensure required
                    if (('required' in groupMeta[item.parentGroup]) && (groupMeta[item.parentGroup].required == true)){
                        var count = 0;
                        var subButtons = $('.bar-sub .btn.active').each(function(){
                            if( submenu[$(this).attr('id')].parentGroup == item.parentGroup ){
                                //Update state in object
                                if (submenu[$(this).attr('id')].currState == true)
                                    count++;
                            }
                        });
                        if(count==1)return;
                    }
                    //Update state in object
                    item.currState = false;
                    item.callback(item.id, false);
                    //Update state in DOM
                    elem.removeClass('active');
                }
            }
            else {
                item.callback(item.id);
            }
        }
    }
    
    /*
     * Implementation of modal box
     */
    var modalCallback = false;
    var closeModalEsc = function(ev){
        //Close modal if key pressed is Esc
        if( ev.keyCode == 27 ){
            Base.closeModal();
        }
    }
    this.openModal = function(height, width, callback){
        Base.closeModal();
        var content;
        var style = {};
        if ( height ){
            style.height = height;
        }
        if ( width ){
            style.width = width;
        }
        if ( callback ){
            modalCallback = callback;
        }
        $(document).bind('keyup', closeModalEsc);
        $('<div class="modal-cont"></div>').append(
            $('<div class="modal"></div>').css(
                style
            ).append(
                $('<div class="modal-close">⨯</div>').bind('click', Base.closeModal)
            ).append(
                content = $('<div class="modal-content"></div>')
            )
        ).appendTo($('body'));
        
        content = content.get(0);
        return content;
    }
    this.closeModal = function(callback){
        //callback is boolean describing should it call callback or not, default true
        if( typeof callback == 'undefined' ) callback = true;
        if( callback && modalCallback ){
            modalCallback();
        }
        modalCallback = false;
        $(document).bind('keyup', closeModalEsc);
        $('.modal-cont').remove();
    }
    
    /*
     * Implementation of prompt
     */
    var closePrompt = function(){
    }
    /*
     * Base.prompt accepts
     * String text  - Text for prompt
     * Function callback(Mixed response) - callback when prompt is complete, 
     *      if it fails response will be false, otherwise String
     * String value - Default value for prompt
     * String ok    - Text to be shown in ok btn, default OK
     * String cancel    - Text to be shown in cancel btn, default Cancel
     */
    this.prompt = function(text, callback, value, ok, cancel){
        if( !text )
            text = 'Enter value in given textbox';
        if( !callback )
            return;
        if( !value )
            value = '';
        if( !ok )
            ok = 'OK';
        if( !cancel )
            cancel = 'Cancel';
        var modal = Base.openModal(null, null, function(){
                callback(false);
            });
        var promptEnter = function(){
                callback($('.prompt-in').val());
                Base.closeModal(false);
            }
        $('<div class="prompt-text">'+text+'</div>').appendTo(modal);
        $('<input class="prompt-in" value="'+value+'">')
            .keyup(function(ev){
                    if(ev.keyCode == 13){
                        promptEnter();
                    }
                })
            .appendTo(modal)
            .focus();
        $('<div class="prompt-btn"></div>')
            .append($('<input type="button" value="'+cancel+'" class="button" />').bind('click',function(){
                    Base.closeModal();
                }))
            .append($('<input type="button" value="'+ok+'" class="button" />').bind('click',promptEnter))
            .appendTo(modal);
    }
    
    this.setEditable = function(){
        //Adjusts the editable portion accoring to the screen size.
        var edit = $('#editable');
        var menu = $('#menubar');
        if($('#menubar').css('display')=='none'){
            edit.css('height', $(window).innerHeight());
        }
        else {
            edit.css('height', $(window).innerHeight() - $('#menubar').outerHeight());
        }
    }
    
    var handleResize = function(){
        Base.setEditable();
        //Call module's resize function
        module.resize();
    }
    $(window).resize(handleResize);
    
    
    /*
     * Tooltip implementation
     * From http://osvaldas.info/elegant-css-and-jquery-tooltip-responsive-mobile-friendly
     * 
     * Edited
     */
    var setTooltip = function()
    {
        var targets = $( '[rel~=tooltip]' ),
            target  = false,
            tooltip = false,
            title   = false;
     
        targets.bind( 'mouseenter', function()
        {
            target  = $( this );
            tip     = target.attr( 'title' );
            tooltip = $( '<div id="tooltip"></div>' );
     
            if( !tip || tip == '' || target.attr('rel')!='tooltip')
                return false;
     
            target.removeAttr( 'title' );
            tooltip.css( 'opacity', 0 )
                   .html( tip )
                   .appendTo( 'body' );
     
            var init_tooltip = function()
            {
                if( $( window ).width() < tooltip.outerWidth() * 1.5 )
                    tooltip.css( 'max-width', $( window ).width() / 2 );
                else
                    tooltip.css( 'max-width', 340 );
     
                var pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( tooltip.outerWidth() / 2 ),
                    pos_top  = target.offset().top + target.outerHeight();
     
                if( pos_left < 0 )
                {
                    pos_left = target.offset().left + target.outerWidth() / 2 - 20;
                    tooltip.addClass( 'left' );
                }
                else
                    tooltip.removeClass( 'left' );
     
                if( pos_left + tooltip.outerWidth() > $( window ).width() )
                {
                    pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
                    tooltip.addClass( 'right' );
                }
                else
                    tooltip.removeClass( 'right' );
                
                if( pos_top + tooltip.outerHeight() + 20 > $( window ).height() ){
                    pos_top  = target.offset().top - tooltip.outerHeight() - 20,
                    tooltip.removeClass( 'top' );
                }
                else
                {
                    tooltip.addClass( 'top' );
                }
                    
                tooltip.css( { left: pos_left, top: pos_top } )
                       .animate( { top: '+=10', opacity: 1 }, 50 );
            };
     
            init_tooltip();
            $( window ).resize( init_tooltip );
     
            var remove_tooltip = function()
            {
                tooltip.animate( { top: '-=10', opacity: 0 }, 50, function()
                {
                    $( this ).remove();
                });
     
                target.attr( 'title', tip );
            };
     
            target.bind( 'mouseleave', remove_tooltip );
            target.bind( 'click', remove_tooltip );
            tooltip.bind( 'click', remove_tooltip );
        });
    }
    
    /*
     * Full screen request
     */
     
    this.fullscreen = function() {
        element=document.body;
        // Supports most browsers and their versions.
        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
        
        if (requestMethod) { // Native full screen.
            requestMethod.call(element);
        }
        else if( typeof window.ActiveXObject !== "undefined" ){ // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
        handleResize();
    }
    
    this.exitFullscreen = function() {
        // Supports most browsers and their versions.
        var requestMethod = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
        
        if (requestMethod) { // Native full screen.
            requestMethod.call(document);
        }
        else if( typeof window.ActiveXObject !== "undefined" ){ // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
        handleResize();
    }
    
    this.hideMenu = function(complete){
        //Hide menus completely if complete is true
        $('#menubar').hide();
        if(!complete){
            var showBtn = $('<div id="showMenu"><i class="fa fa-angle-down"></i></div>').appendTo('#interface');
            showBtn.click(function(){
                Base.showMenu();
            });
        }
        handleResize();
    }
    
    this.showMenu = function(){
        $('#menubar').show();
        $('#showMenu').remove();
        handleResize();
    }
    
    
    //Add common shortcuts
    this.addShortcuts([
        {
            ctrl: true,
            char: 'Z',
            callback: this.undo
        },
        {
            ctrl: true,
            shift: true,
            char: 'Z',
            callback: this.redo
        },
        {
            ctrl: true,
            char: 'Y',
            callback: this.redo
        },
        {
            ctrl: true,
            char: 'R',
            callback: this.redo
        },
        {
            ctrl: true,
            char: 'S',
            callback: saveFrontEnd
        }
    ]);
    
})();

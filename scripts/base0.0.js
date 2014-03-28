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
    items: Array //Items inside this group
    multiple: Boolean   //Is multiple select allowed, Default true
},
{
    type: 'button',
    id: String, //Id selected by module
    title: String, //Name of button
    icon: String, //Font awesome icon name
    onoff: Boolean,  //Is a on/off button
    callback: Function(String id),  //If onoff is false
    callback: Function(String id, Boolean state)    //If onoff is true, state will represent if it turned on or off
},
{
    type: 'color',
    id: String, //Id selected by module
    title: String, //Name of button
    icon: String, //Font awesome icon name
    default: String, //Default color 
    callback: Function(String id, String color) //Callback on change
},
{
    type: 'font',
    id: String, //Id selected by module
    title: String, //Name of button
    icon: String, //Font awesome icon name
    default: String, //Default font name
    callback: Function(String id, String fontName)  //Callback on change
},
{
    type: 'size',
    id: String, //Id selected by module
    title: String, //Name of button
    icon: String, //Font awesome icon name
    default: Number, //Default size
    rangeStart: Number, //Minimum size
    rangeEnd: Number,   //Maximum size
    callback: Function(String id, Number size)  //Callback on change
},
{
    type: 'list',
    id: String, //Id selected by module
    title: String, //Name of button
    icon: String, //Font awesome icon name
    default: String, //Default size
    list = Object, //An associative array with key = Id and value = Text
    callback: Function(String id, Number selectedItemId)    //Callback on change
}
*/

Base = new (function(){
    var log = function(id,t){
        console.log(id,t);
    }
    var defaultMenus = [
        {
            type: 'main',
            id: 'create',
            title: 'Create', //Name of menu
            icon: 'fa-plus', //Font awesome icon name
            groups: [
                {
                    type: 'group',
                    id: 'g1',
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-print',
                            onoff: true,
                            callback: log
                        },
                        {
                            type: 'button',
                            icon: 'fa-coffee',
                            onoff: true,
                            callback: log
                        }
                    ]
                },
                {
                    type: 'group',
                    id: 'g2',
                    multiple: false,
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-picture-o',
                            onoff: true,
                            callback: log
                        },
                        {
                            type: 'button',
                            icon: 'fa-rss',
                            onoff: true,
                            callback: log
                        },
                        {
                            type: 'button',
                            icon: 'fa-pencil',
                            onoff: true,
                            callback: log
                        }
                    ]
                }
            ]   //Groups inside this menu
        },
        {
            type: 'main',
            id: 'edit',
            title: 'Edit', //Name of menu
            icon: 'fa-pencil', //Font awesome icon name
            groups: [
                {
                    type: 'group',
                    id: 'dsafgf',
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-qrcode',
                            callback: log
                        },
                        {
                            type: 'button',
                            icon: 'fa-laptop',
                            callback: log
                        },
                        {
                            type: 'button',
                            icon: 'fa-picture-o',
                            callback: log
                        },
                        {
                            type: 'button',
                            icon: 'fa-pencil',
                            callback: log
                        },
                        {
                            type: 'button',
                            icon: 'fa-edit',
                            callback: log
                        },
                        {
                            type: 'button',
                            icon: 'fa-coffee',
                            callback: log
                        }
                    ] //Items inside this menu
                }
            ]
        },
        {
            type: 'main',
            id: 'format',
            title: 'Format', //Name of menu
            icon: 'fa-edit', //Font awesome icon name
            groups: [
                {
                    type: 'group',
                    id: 'adsf',
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-picture-o',
                            callback: log
                        },
                        {
                            type: 'button',
                            icon: 'fa-print',
                            callback: log
                        },
                        {
                            type: 'button',
                            icon: 'fa-coffee',
                            callback: log
                        }
                    ]
                },
                {
                    type: 'group',
                    id: 'gdd',
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-rss',
                            callback: log
                        },
                        {
                            type: 'button',
                            icon: 'fa-pencil',
                            callback: log
                        },
                        {
                            type: 'button',
                            icon: 'fa-print',
                            callback: log
                        },
                        {
                            type: 'button',
                            icon: 'fa-coffee',
                            callback: log
                        },
                        {
                            type: 'button',
                            icon: 'fa-picture-o',
                            callback: log
                        },
                        {
                            type: 'button',
                            icon: 'fa-rss',
                            callback: log
                        },
                        {
                            type: 'button',
                            icon: 'fa-pencil',
                            callback: log
                        }
                    ] //Items inside this menu
                }
            ]
        }
    ]
    
    var menus;//Kepps track and information of the menus
    var menuMeta;//Maping of modules id and DOM id
    var groupMeta;//Keeps information about groups in current submenu
    var submenu;//Kepps track and information of the current submenu
    var menuId;
    
    this.menu = function(){
        console.log(menus);
    }
    this.submenu = function(){
        console.log(submenu);
    }
    this.group = function(){
        console.log(groupMeta);
    }
    
    this.init = function(){
        /*
         * init function for Base
         * To be called when all js and css are loaded for the first time
         */
        
        //Append interface div that contains everything inside body
        $('<div class="interface" id="interface"></div>').appendTo('body');
        
        //Append menubar to interface
        //menubar contains whole menu with all submenus
        $('<div class="toolbars" id="menubar"></div>').appendTo('#interface');
        
        //Append main to menubar
        var mainMenu = $('<div class="bar bar-super" id="mainMenu"></div>').appendTo('#menubar');
        
        //Add main menu items inside this level
        //Items are defined in menus
        menuId = 0;
        menus = new Object();
        menuMeta = new Object();
        createMenu(defaultMenus);
        activateMenu.bind($('#menuHead0'))();
        
        //Append editable to interface
        $('<div class="editable" id="editable"></div>').appendTo('#interface');
        this.setEditable();
        
        //Call module's init
    }
    createMenu = function(menuObject){
        var item, i, menuItem;
        var id;
        var mainMenu = $('#mainMenu');
        for( i in menuObject ) {
            item = menuObject[i];
            if( ('type' in item) && (item.type == 'main') && ('title' in item) && ('icon' in item) ){
                //Insert menu into DOM
                if(('id' in item) && (item.id in menuMeta)){
                    id = menuMeta[item.id];
                    menuItem = menus[id];
                    menuItem.groups = menuItem.groups.concat(item.groups);
                }
                else {
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
    }
    activateMenu = function(ev){
        //Onclick event handler on main menu items
        var id = $(this).attr('id');
        var menu = menus[id];
        
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
                    for( i in group.items ){
                        item = group.items[i];
                        id = 'menuItem'+subMenuId;
                        if( ('type' in item) && ('icon' in item) && ('callback' in item) ){
                            //Append menu item to DOM
                            var menuItem = $('<div class="btn btn-icon" id="'+id+'"></div>').appendTo(subMenu);
                            $('<i class="fa '+item.icon+'"></i>').appendTo(menuItem);
                            if( item.type == 'color' ){
                            }
                            else if( item.type == 'font' ){
                            }
                            else if( item.type == 'size' ){
                            }
                            else if( item.type == 'list' ){
                            }
                            else { // if item.type == 'button' or item.type is not known
                                if(('onoff' in item) && item.onoff == true){
                                    if ( ('currState' in item) && item.currState == true ){
                                        menuItem.addClass('active');
                                    }
                                }
                            }
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
                    if( j == menu.groups.length-2 ){
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
    }
    
    var handleMenuClick = function(ev){
        var elem = $(this);
        var itemId = $(this).attr('id');
        var item = submenu[itemId];
        
        if( item.type == 'color' ){
        }
        else if( item.type == 'font' ){
        }
        else if( item.type == 'size' ){
        }
        else if( item.type == 'list' ){
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
    
    this.setEditable = function(){
        var edit = $('#editable');
        var menu = $('#menubar');
        edit.css('height', $(window).innerHeight() - $('#menubar').outerHeight());
    }
})();


$(window).resize(function(){
    Base.setEditable();
    //Call module's resize function
});

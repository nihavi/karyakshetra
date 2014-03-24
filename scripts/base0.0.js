/*
{
    type: 'main',
    title: String, //Name of menu
    icon: String, //Font awesome icon name
    items: Array //Items inside this menu
},
{
    type: 'button',
    id: String, //Id selected by module
    title: String, //Name of button
    icon: String, //Font awesome icon name
    onoff: Boolean,  //Is a on/off button
    if(onoff){
        onActivate: Function(String id),    //Callback when switched on
        onDeactivate: Function(String id)   //Callback when switched off
    }
    else {
        callback: Function(String id)   //Callback when clicked
    }
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
    menus = {
        'create': {
            type: 'main',
            title: 'Create', //Name of menu
            icon: 'fa-plus', //Font awesome icon name
            items: [
                {
                    type: 'button',
                    icon: 'fa-print'
                },
                {
                    type: 'button',
                    icon: 'fa-coffee'
                },
                {
                    type: 'button',
                    icon: 'fa-picture-o'
                },
                {
                    type: 'button',
                    icon: 'fa-rss'
                },
                {
                    type: 'button',
                    icon: 'fa-pencil'
                }
            ] //Items inside this menu
        },
        'edit': {
            type: 'main',
            title: 'Edit', //Name of menu
            icon: 'fa-pencil', //Font awesome icon name
            items: [
                {
                    type: 'button',
                    icon: 'fa-qrcode'
                },
                {
                    type: 'button',
                    icon: 'fa-laptop'
                },
                {
                    type: 'button',
                    icon: 'fa-picture-o'
                },
                {
                    type: 'button',
                    icon: 'fa-pencil'
                },
                {
                    type: 'button',
                    icon: 'fa-edit'
                },
                {
                    type: 'button',
                    icon: 'fa-coffee'
                }
            ] //Items inside this menu
        },
        'format': {
            type: 'main',
            title: 'Format', //Name of menu
            icon: 'fa-edit', //Font awesome icon name
            items: [
                {
                    type: 'button',
                    icon: 'fa-picture-o'
                },
                {
                    type: 'button',
                    icon: 'fa-print'
                },
                {
                    type: 'button',
                    icon: 'fa-coffee'
                },
                {
                    type: 'button',
                    icon: 'fa-rss'
                },
                {
                    type: 'button',
                    icon: 'fa-pencil'
                },
                {
                    type: 'button',
                    icon: 'fa-print'
                },
                {
                    type: 'button',
                    icon: 'fa-coffee'
                },
                {
                    type: 'button',
                    icon: 'fa-picture-o'
                },
                {
                    type: 'button',
                    icon: 'fa-rss'
                },
                {
                    type: 'button',
                    icon: 'fa-pencil'
                }
            ] //Items inside this menu
        }
    }
    
    this.init = function(){
        /*
         * init function for Base
         * To be called when all js and css are loaded for the first time
         */
        //TODO: check class and id
        
        //Append interface div that contains everything inside body
        $('<div class="interface" id="interface"></div>').appendTo('body');
        
        //Append menubar to interface
        //menubar contains whole menu with all submenus
        $('<div class="menubar" id="menubar"></div>').appendTo('#interface');
        
        //Append main to menubar
        var mainMenu = $('<div class="level" id="mainMenu"></div>').appendTo('#menubar');
        
        //Add main menu items inside this level
        //Items are defined in menus
        var item, id;
        for( id in menus ) {
            item = menus[id];
            if( ('type' in item) && (item.type == 'main') && ('title' in item) && ('icon' in item) ){
                var menuItem = $('<div class="btn btn-big" id="menuHead'+id+'"></div>').appendTo(mainMenu);
                menuItem.click(activateMenu);
                $('<i class="fa '+item.icon+'"></i>').appendTo(menuItem);
                $('<span> '+item.title+'</span>').appendTo(menuItem);
            }
            else {
                //Error: invalid menu item, ignored
            }
        }
    }
    
    activateMenu = function(ev){
        //Onclick event handler on main menu items
        var id = this.id.substr(8);
        var menu = menus[id];
        
        //Change classes of item in main menu
        $('#mainMenu .active').removeClass('active');
        $(this).addClass('active');
        
        //Remove old submenu
        $('#subMenu').remove();
        
        //Append submenu to menubar
        var subMenu = $('<div class="level level-two blue" id="subMenu"></div>').appendTo('#menubar');
        
        //Append submenu items to submenu
        var item,i;
        if( 'items' in menu ){
            for( i in menu.items ){
                item = menu.items[i];
                if( ('type' in item) && ('icon' in item) ){
                    var menuItem = $('<div class="btn btn-icon-only"></div>').appendTo(subMenu);
                    $('<i class="fa '+item.icon+'"></i>').appendTo(menuItem);
                }
                else {
                    //Error: invalid submenu item, ignored
                }
            }
        }
        else {
            //Error: empty menu item, ignored
        }
    }
    
})();

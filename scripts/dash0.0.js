function objectFunction(){
    
    var baseUrl;
    var currDirectory;
    
    //features not required from base
    //not sure whether the above comment is very reasonable though
    this.exclude = ['defaultMenu', 'fileName'];
    
    function download() {
        
        var arg = '';
        
        var selectedFiles = $('#file-list .file.focus');
        
        //different destination URIs if a zip of multiple files is required
        if (selectedFiles.length > 1) {
            selectedFiles.each(function (i) {
            
                arg += $(this).data('fid') + '-';
            
            });
        
            window.location = response.baseUrl + 'download/files/' + arg;
        
        }
        else
        {
            window.location = response.baseUrl + 'download/file/' + selectedFiles.data('fid');
        }
    }
    
    function upload()
    {
        var modal = Base.openModal(null, null, null);
        modal = $(modal);
        modal.append($('<span class="wait"></span>'));
        
        $.ajax({
            'type': 'GET',
            'url' : baseUrl + 'upload/',
            'success' : function(data) {
                modal.html(data);
            }
        });
    }
    
    function updateFileListUI (data) {
        
        $('#file-list').empty();
        
        var files = data.files;
        for (var i=0;i<files.length;++i) {
            var file = files[i];
            var dir = false;
            if( !file.module ){
                dir = true;
            }
        
            var f = $('<div></div>');
            f.addClass('file');
            
            f.data('fid', file.id);
            f.data('fname', file.fname);
            f.data('ftype', file.ftype);
            
            var a = $('<a></a>');
            if(dir){
                a.attr('href', 'javascript:;');
                a.data('fid', file.id);
                a.click(function (ev){
                    getFileList($(this).data('fid'));
                });
            }
            else {
                a.attr('target', '_blank');
                a.attr('href', file.module + '/' + file.id);
            }
            a.text(file.name);
            f.append($('<input class="file-selector" type="checkbox">'));
    
            f.append(a);
            var moduleLabel;
            
            if( dir ){
                moduleLabel = 'Directory';
            }
            else {
                moduleLabel = file.module.charAt(0).toUpperCase() + file.module.slice(1) + ' file';
            }
            
            moduleLabel = $('<span class="disabled module-label pull-right">' + moduleLabel + '</span>');
            f.append(moduleLabel);
            
            f.on('click', function(e) {
                
                if (!$(e.target).is('a')) {
                    var file = $(this);
                    if (file.hasClass('focus')) {
                        file.removeClass('focus');
                        file.find('input.file-selector').prop('checked', false);
                    }
                    else {
                        file.addClass('focus');
                        file.find('input.file-selector').prop('checked', true);
                    }
                }
            });
            
            $('#file-list').append(f);
        }
        
    }
    
    function getFileList(parent) {
        $.ajax({
            dataType: "json",
            url: baseUrl + 'storage/filelist/' + parent +'/',
            success: function (data){
                updateFileListUI(data);
                currDirectory.id = data.dir.id;
                currDirectory.pid = data.dir.parent;
            },
        });
    }
    
    function newDirectory(){
        Base.prompt("Enter new directory name", function(name){
            if( !name )
                return;
            $.ajax({
                type: 'POST',
                url: baseUrl + 'storage/mkdir/',
                data: {
                    name: name,
                    parent: currDirectory.id,
                },
                success: function(data){
                    getFileList(currDirectory.id);
                },
                error: function(){
                    Base.alert('Could not create directory');
                }
            });
        }, 'New directory', 'Create');
    }
    
    function directoryUp(){
        getFileList(currDirectory.pid);
    }
    
    function renameFiles(){
        var toRename = [];
        var renameFiles = $('#file-list .file')
            .filter( function( index, elem ){
                if( $(elem).find('input.file-selector').prop('checked') )
                    return true;
                else 
                    return false;
            });
        
        var renameCount = renameFiles.length;
        
        if( renameCount <= 0 ){
            return;
        }
        else if( renameCount > 1 ){
            Base.alert('Batch rename is not supported yet.');
        }
        else {
            var renameFileId = renameFiles.data('fid');
            
            Base.prompt('Enter new file name', function(value){
                    if( !value )
                        return;
                    $.ajax({
                        type: 'POST',
                        dataType: "json",
                        url: baseUrl + 'storage/rename/',
                        data: {
                            rename: [
                                {
                                    fid: renameFileId,
                                    name: value,
                                }
                            ]
                        },
                        success: function(data){
                            var text;
                            if( data.fail ){
                                text = 'Could not rename file';
                            }
                            else {
                                text = 'File successfully renamed';
                            }
                                
                            Base.alert(text);
                            
                            getFileList(currDirectory.id);
                        },
                        error: function(){
                            Base.alert('Could not rename file');
                        }
                    });
                }, renameFiles.data('fname'));
        }
    }
    function removeFiles(){
        var toRemove = [];
        $('#file-list .file')
            .filter( function( index, elem ){
                if( $(elem).find('input.file-selector').prop('checked') )
                    return true;
                else 
                    return false;
            })
            .each( function( index ){
                toRemove[index] = $(this).data('fid');
            });
        
        if( toRemove.length ){
            $.ajax({
                type: 'POST',
                dataType: "json",
                url: baseUrl + 'storage/remove/',
                data: {
                    remove: toRemove
                },
                success: function(data){
                    var text;
                    if( data.fail == 0){
                        if( data.success == 1 ){
                            text = "File successfully removed.";
                        }
                        else {
                            text = data.success + " files successfully removed."
                        }
                    }
                    else {
                        if( data.fail == 1 && data.success == 0 ){
                            text = "Could not remove file";
                        }
                        else {
                            text =  data.success + " file" + ((data.success > 1)?"s":"") + " removed.<br>"
                            text += "Could not remove " + data.fail + " file" + ((data.success > 1)?"s":"");
                        }
                    }
                    Base.alert(text);
                    
                    getFileList(currDirectory.id);
                },
                error: function(){
                    Base.alert('Could not remove files');
                }
            });
        }
    }
    
    this.init = function(parent){
        
        baseUrl = response.baseUrl;
        currDirectory = {
            id: 0,
            pid: 0,
        };
        parent = $(parent);
        
        var newFile = $('<div></div>');

        /*
         * Module name to module URI path map
         * Necessary because server sends module name, but URI is required for link
         * */
        var modules = [
            {
                'name'  : 'Akruti',
                'link'  : 'akruti'
            },
            {
                'name'  : 'Prastuti',
                'link'  : 'show'
            },
            {
                'name'  : 'Aalekhan',
                'link'  : 'aalekhan'
            },
            {
                'name'  : 'Aksharam',
                'link'  : 'aksharam'
            },
            
        ];
    
        for (var i=0; i<modules.length; ++i) {
            var module = modules[i];
            $('<a class="module-link" href="' + module.link +'">' + module.name + '</a>').appendTo(newFile);
        }
        
        $('<div id="new-file" class="column"></div>').append(newFile).appendTo(parent);
        $('<div id="file-list" class="column"></div>').appendTo(parent);
        getFileList(currDirectory.id);
    };
    
    this.getMenu = function(){
        return [
            {
                type: 'main',
                id: 'files',
                title: 'Files', //Name of menu
                icon: 'fa-file', //Font awesome icon name
                groups: [
                    {
                        type: 'group',
                        id: 'directory',
                        items: [
                            {
                                type: 'button',
                                icon: 'fa-folder-o',
                                title: 'New Directory',
                                callback: newDirectory,
                            },
                            {
                                type: 'button',
                                icon: 'fa-reply',
                                title: 'One level up',
                                callback: directoryUp,
                            }
                        ]
                    },
                    {
                        type: 'group',
                        id: 'fileOperations',
                        items: [
                            {
                                type: 'button',
                                icon: 'fa-font',
                                title: 'Rename',
                                callback: renameFiles
                            },
                            {
                                type: 'button',
                                icon: 'fa-times',
                                title: 'Remove',
                                callback: removeFiles
                            },
                        ]
                    },
                    {
                        type: 'group',
                        id: 'upload',
                        items: [
                            {
                                type: 'button',
                                icon: 'fa-cloud-download',
                                title: 'Download',
                                callback: download
                            },
                            {
                                type: 'button',
                                icon: 'fa-cloud-upload',
                                title: 'Upload',
                                callback: upload
                            }
                        ]
                    },
                ]
            }
        ];
        
    };
    
    this.resize = function(){
    
    };

};

Dash = new objectFunction();

module = Dash;

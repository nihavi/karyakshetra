function objectFunction(){
    
    var baseUrl;
    
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
    
    this.init = function(parent){
        
        baseUrl = response.baseUrl;
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
        $.ajax({
            dataType: "json",
            url: response.baseUrl + 'storage/dash/',
            success: function(data) {
                var files = data.files;
                
                for (var i=0;i<files.length;++i) {
                    var file = files[i];
                
                    var f = $('<div></div>');
                    f.addClass('file');
                    
                    f.data('fid', file.id);
                    
                    var a = $('<a></a>');
                    a.attr('target', '_blank');
                    a.attr('href', file.module + '/' + file.id);
                    a.text(file.name);
                    f.append($('<input class="file-selector" type="checkbox">'));
            
                    f.append(a);
                    //capitalise string
                    //could actually be made a utility function
                    file.module = file.module.charAt(0).toUpperCase() + file.module.slice(1);
                    var moduleLabel = $('<span class="disabled module-label pull-right">' + file.module + ' file</span>');
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
        });
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
                        id: 'g1',
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

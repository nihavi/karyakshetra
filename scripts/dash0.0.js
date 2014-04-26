Dash = new(function(){
    
    this.exclude = ['defaultMenu'];
    
    function download() {
        
        var arg = '';
        
        var selectedFiles = $('#editable .file.focus');
        
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
    
    this.init = function(){
        var newFile = $('<div></div>');
        //var newAkruti = $('<a>New Akruti</a>').appendTo(newFile);
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
        
        $('<div class="new-file column"></div>').append(newFile).appendTo('#editable');
        $('<div class="file-list column"></div>').appendTo('#editable');
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
                    
                    $('.file-list').append(f);
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
                            }
                        ]
                    }
                ]
            }
        ];
        
    };
    
    this.resize = function(){
    
    };

})();

module = Dash;

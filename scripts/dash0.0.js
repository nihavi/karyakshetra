Dash = new(function(){
    this.init = function(){
        $('<div class="explorer column"></div>').html('&nbsp;').appendTo('#editable');
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
                    
                    var a = $('<a></a>')
                    a.attr('target', '_blank');
                    a.attr('href', file.module + '/' + file.id);
                    a.text(file.name);
            
                    f.append($('<input class="file-selector" type="checkbox">')
                        .on('change', function() {
                            var input = $(this);
                        }
                    ));
            
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
        return {}
    };
    
    this.resize = function(){
    
    };

})();

module = Dash;

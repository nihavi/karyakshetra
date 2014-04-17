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
                    var a = $('<div></div>');
                    var b = $('<a></a>')
                    b.attr('target', '_blank');
                    b.attr('href', file.module + '/' + file.id);
                    a.addClass('file');
                    b.text(file.name);
                    a.append(b);
                    a.prepend($('<input class="file-selector" type="checkbox">')
                        .on('change', function() {
                            var input = $(this);
                            /*
                            if(input.is(':checked')) {
                                input.closest('.file').addClass('focus');
                            }
                            else {
                                input.closest('.file').removeClass('focus');
                            }
                            */
                        }
                    ));
                    a.on('click', function() {
                        var file = $(this);
                        if (file.hasClass('focus')) {
                            file.removeClass('focus');
                            file.find('input.file-selector').prop('checked', false);
                        }
                        else {
                            file.addClass('focus');
                            file.find('input.file-selector').prop('checked', true);
                        }
                    });
                    
                    $('.file-list').append(a);
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

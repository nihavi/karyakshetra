function loadJquery(fallback)
{
    var url='//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js';
    if(fallback)
        url=response.baseUrl + 'scripts/jquery-1.11.0.min.js';
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState==4){
                if(xmlhttp.status==200){
                    var script=document.createElement('script');
                    script.language='javascript';
                    script.type='text/javascript';
                    script.defer=true;
                    script.text=xmlhttp.responseText;
                    document.body.appendChild(script);
                }
                if(!window.jQuery){
                    if(fallback){
                        //Error: Jquery is not loaded
                        document.write('Could not load jQuery');
                    }
                    else
                        loadJquery(true);
                }
                else {
                    var base_script = response.baseUrl + 'scripts/' + response.paths.baseScript;
                    var module_script = response.baseUrl + 'scripts/' + response.paths.moduleScript;
                    var module_style = response.baseUrl + 'styles/' + response.paths.moduleStyle;
                    window.setTimeout(function() {
                        if(document.getElementById('wait-message'))
                            document.getElementById('wait-message').innerHTML = "Calm down. Take a deep breath. Unfortunately, something's broken. :/";
                    },3000);
                    $.when(
                        $.ajax({
                            url: base_script,
                            dataType: "script",
                            cache: true,
                        }),
                        $.ajax({
                            url: module_script,
                            dataType: "script",
                            cache: true
                        }),
                        $.ajax({
                            url: module_style,
                            cache: true,
                            success: applyCss
                        }),
                        $.ajax({
                            url: response.baseUrl + 'styles/normalize.css',
                            cache: true,
                            success: applyCss
                        }),
                        $.ajax({
                            url: response.baseUrl + 'styles/interface.css',
                            cache: true,
                            success: applyCss
                        })
                    ).then(
                        function(){
                            //Scripts loaded
                            linkCss(response.baseUrl + 'styles/font-awesome.min.css').load(function(){
                                Base.init();
                            }).error(function(){
                                //Error: font-awesome error
                                document.write('Some error occured');
                            });
                            linkCss('http://fonts.googleapis.com/css?family=Source+Sans+Pro');
                            linkCss('http://fonts.googleapis.com/css?family=Open+Sans');
                        },
                        function(){
                            //Error: scripts loading failed
                        }
                    );
                }
            }
        }
        xmlhttp.open("GET",url,true);
        xmlhttp.send();
    }
    else {
        //Error: old browser
        document.write('Your browser is not supported');
    }
}
function applyCss(data){
    //Assuming jQuery is loaded
    var styleE = $('<style></style>');
    styleE.html(data);
    $('head').append(styleE);
}
function linkCss(url){
    //Assuming jQuery is loaded
    //Catch errors: TODO
    //Returns jQuery link element
    var linkE = $('<link>',{
        'href': url,
        'rel': 'stylesheet',
        'type': 'text/css'
    });
    $('head').append(linkE);
    return linkE;
}

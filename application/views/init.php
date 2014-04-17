<?php
    $this->load->helper('url');
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Karyakshetra</title>
        <script>
            // A global variable for baseUrl
            response = {
                baseUrl: '<?php echo base_url(); ?>',
                moduleId: '<?php echo $module_id; ?>',
                mode: '<?php echo $mode; ?>',
                <?php 
                    if( isset($file_id) ){
                        echo "fileId: '".$file_id."',";
                        echo "fileData: '".$file_data."',";
                    }
                ?>
            }
            function loadJquery(fallback)
            {
                fallback = true;
                var url='//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js';
                if(fallback)
                    url='<?php echo base_url().'scripts/jquery-1.11.0.min.js'; ?>';
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
                                var base_script = '<?php echo base_url().'scripts/'.$base_script; ?>';
                                var module_script = '<?php echo base_url().'scripts/'.$module_script; ?>';
                                var module_style = '<?php echo base_url().'styles/'.$module_style; ?>';
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
                                        url: '<?php echo base_url(); ?>styles/normalize.css',
                                        cache: true,
                                        success: applyCss
                                    }),
                                    $.ajax({
                                        url: '<?php echo base_url(); ?>styles/interface.css',
                                        cache: true,
                                        success: applyCss
                                    })
                                ).then(
                                    function(){
                                        //Scripts loaded
                                        linkCss('<?php echo base_url(); ?>styles/font-awesome.min.css').load(function(){
                                            $( "#wait-message" ).remove();
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
        </script>
    </head>
    <body onload='loadJquery()'>
        <div id='wait-message'>Please wait...</div>
    </body>
</html>

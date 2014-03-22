<?php
    $this->load->helper('url');
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Karyakshetra</title>
        <script>
            function loadJquery(fallback)
            {
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
                                    })
                                ).then(
                                    function(){
                                        //Scripts loaded
                                        $( "#wait_message" ).remove();
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
        </script>
    </head>
    <body onload='loadJquery()'>
        <div id='wait_message'>Please wait...</div>
    </body>
</html>

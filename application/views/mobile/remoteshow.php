<!doctype html>
<html class="no-js">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Karyakshetra | Doordarshan</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script>
            var currFileId = <?php echo $fid; ?>;
            var baseUrl = '<?php echo base_url(); ?>';
    
            var sendOp = function(op){
                xmlhttp=new XMLHttpRequest();
                xmlhttp.open("POST",baseUrl+'opqueue/addop',true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                xmlhttp.send('fid='+currFileId+'&op='+op);
                
                /*$.ajax({
                    type: 'POST',
                    url: baseUrl+'opqueue/addop',
                    data: {
                        fid: currFileId,
                        op: op
                    },
                    success: function(data){
                        //Do nothing
                        //TODO: Failiure detection
                    }
                });*/
            }
            
            var next = function(){
                sendOp('ne');
            }
        </script>
    </head>
    <body>
        <!--[if lt IE 8]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
        <button onclick="next()" id="next">Next</button>
    </body>
</html>

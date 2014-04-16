<!doctype html>
<html class="no-js">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Karyakshetra | Doordarshan</title>
        <style>
            html, body {
                height: 100%;
            }
            body {
                background-color: #eee;
                font-size: 22px;
                font-family: sans-serif;
            }
            
            #next {
                width: 50%;
                max-width: 100px;
                background-color: orange;
                text-align: center;
                margin: auto;
                padding: 0.5em;
                border-radius: 2px;
                display: inline-block;
                vertical-align: middle;
            }
            
            #next:hover,
            #next:focus,
            #next:active {
                background-color: darkorange;
                cursor: pointer;
            }
            
            .btn-container {
                text-align: center;
                height: 100%;
            }
            
            /* The ghost, nudged to maintain perfect centering */
            .btn-container:before {
                content: '';
                display: inline-block;
                height: 100%;
                vertical-align: middle;
                margin-right: -0.25em; /* Adjusts for spacing */
            }
        </style>
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
        <div class="btn-container">
            <div onclick="next()" id="next">Next</div>
        </div>
    </body>
</html>

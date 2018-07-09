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
                paths: {
                    baseScript: '<?php echo $base_script; ?>',
                    moduleScript: '<?php echo $module_script; ?>',
                    moduleStyle: '<?php echo $module_style; ?>',
                },
                <?php
                    if( isset($file_id) ){
                        echo "fileId: '".$file_id."',";
                        echo "fileData: '".$file_data."',";
                        echo "fileName: '".$file_name."',";
                    }
                ?>
            }

            var script=document.createElement('script');
            script.src=response.baseUrl + 'scripts/loader0.0.js';
            document.head.appendChild(script);
        </script>
    </head>
    <body onload='loadJquery()'>
        <div id='wait-message'>Please wait...</div>
    </body>
</html>

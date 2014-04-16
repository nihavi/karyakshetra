<?php
    $this->load->helper('url');
?><!DOCTYPE html>
<html>
<head>
    <title>Karyakshetra | Dash</title>
    <link href="<?php echo base_url();?>styles/normalize.css" rel="stylesheet">
    <link href="<?php echo base_url();?>styles/interface.css" rel="stylesheet">
    <link href="<?php echo base_url();?>styles/dash0.0.css" rel="stylesheet">
    <script>
        var response = {
        baseUrl: 'http://localhost:8080/karyakshetra/'
    }
    </script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script>
        if (typeof jQuery == 'undefined') {
        document.write(unescape("%3Cscript src='<?php echo base_url();?>scripts/jquery-1.11.0.min.js' type='text/javascript'%3E%3C/script%3E"));
    }
    </script>
    
    <script src="<?php echo base_url();?>scripts/dash0.0.js" rel="stylesheet"></script>
</head>
<body onload=Base.init()>
    <div class="explorer column">Explorer area</div>
    <div class="file-list column">
    <?php foreach ($files as $file): ?>
        <a target="_blank" href="<?php echo base_url() . $file['module'] . '/' . $file['id'] ?>/" class="file">
            <span><?php echo $file['name']; ?></span>
            <span><?php echo $file['modified']; ?></span>
        </a>
        <?php endforeach; ?>
    </div>
</body>
</html>
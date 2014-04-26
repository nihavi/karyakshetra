<!doctype html>
<html class="no-js">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Karyakshetra | Login</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="<?php echo base_url();?>styles/normalize.css" rel="stylesheet">
        <link href="<?php echo base_url();?>styles/login.css" rel="stylesheet">
    </head>
    <body><?php
    
        $this->load->helper('form');
    
        ?><div class="container">
            <h1>Login to Karyakshetra</h1>
            <?php echo form_open(base_url() . 'account/login/') . "\n";?>
                <label for="username">Username: <input type="text" id="username" name="username" value="<?php echo set_value('username'); ?>"></label>
                <label for="password">Password: <input id="password" type="password" name="password"></label>
                <input type="submit" value="Log in">
            <?php echo form_close(); ?>
                <div class="errors">
                <?php echo validation_errors('<div class="errors"></div>'); ?>
                <?php
                    if(!empty($invalid) && $invalid)
                        echo '<p>The username or password you entered is incorrect.</p>';
                ?>
                </div>
        </div>
    </body>
</html>
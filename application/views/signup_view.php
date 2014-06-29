<!DOCTYPE HTML>
<html class="no-js">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Karyakshetra | Sign up</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="<?php echo base_url();?>styles/normalize.css" rel="stylesheet">
        <link href="<?php echo base_url();?>styles/login.css" rel="stylesheet">
    </head>
    <body><?php
    
        $this->load->helper('form');
    
        ?><div class="container">
            <h1>Sign up</h1>
            <?php echo form_open(base_url() . 'account/signup/') . "\n";?>
                <label for="username">Username: <input type="text" name="username" value="<?php echo set_value('username'); ?>"></label>
                <label for="password">Password: <input type="password" name="password"></label>
                <label for="password-conf">Re-enter password: <input type="password" name="password_conf"></label>
                <input type="submit" value="Sign up">
            <?php echo form_close(); ?>
                <div class="errors">
                <?php echo validation_errors(); ?>
                <?php
                    if (!empty($invalid) && $invalid)
                    {
                        echo '</p>Sorry, some error occured. Please try again.</p>';    
                    }
                ?>
                </div>
                <p><a href="<?php echo base_url() . 'account/login';?>">Login</a> if you already have an account.</p>
        </div>
    </body>
</html>

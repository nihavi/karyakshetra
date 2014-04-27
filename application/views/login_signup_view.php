<!DOCTYPE html>
<html class="no-js">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Karyakshetra | Welcome</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="<?php echo base_url();?>styles/normalize.css" rel="stylesheet">
    <link href="<?php echo base_url();?>styles/login_signup.css" rel="stylesheet">
    <script src="<?php echo base_url();?>scripts/jquery-1.11.0.min.js"></script>
    <script src="<?php echo base_url();?>scripts/login_signup.js"></script>
</head>
<body><?php

    $this->load->helper('form');

    ?>
    <div class="container">
        <div id="big-circle">
            
        </div>
        <div id="small-circle">
            <div id="login-container">
                <?php echo form_open(base_url() . 'account/login/') . "\n";?>
                    <div class="form-items">
                        <label for="login-username">Username</label>
                        <input type="text" id="login-username" name="username" value="<?php echo set_value('username'); ?>" class="textbox" required>
                    </div>
                    <div class="form-items">
                        <label for="login-password">Password</label>
                        <input type="password" id="login-password"  name="password" class="textbox" required>
                    </div>
                    <div class="form-items">
                        <input type="submit" value="Log in" class="btn">
                    </div>
                <?php echo form_close(); ?>
                <div class="errors">
                    <?php echo validation_errors('<div class="errors"></div>'); ?>
                    <?php
                        if(!empty($invalid) && $invalid)
                            echo '<p>The username or password you entered is incorrect.</p>';
                    ?>
                </div>
                <span class="bottom-text">
                    Don't have an account?
                    <span class="go-to-other" id="show-signup">Sign up</span>
                    here
                </span>
            </div>
            <div id="signup-container">
                <?php echo form_open(base_url() . 'account/signup/') . "\n";?>
                    <div class="form-items">
                        <label for="signup-name">Full Name</label>
                        <input id="signup-name" name="name" type="text" class="textbox" required>
                    </div>
                    <div class="form-items">
                        <label for="signup-username">Username</label>
                        <input type="text" id="signup-username" name="username" value="<?php echo set_value('username'); ?>" class="textbox" required>
                    </div>
                    <div class="form-items">
                        <label for="signup-password">Password</label>
                        <input type="password" id="signup-password" name="password" class="textbox" required>
                    </div>
                    <div class="form-items">
                        <label for="signup-repassword">Re-enter Password</label>
                        <input type="password" id="signup-repassword" name="password_conf" class="textbox" required>
                    </div>
                    <input type="submit" class="btn" value="Sign up">
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
                <span class="bottom-text">
                    Already have an account?
                    <span class="go-to-other" id="show-login">Login</span>
                    from here.
                </span>
            </div>
        </div>
        <div id="big-title">
            Karyakshetra
            <div id="login-title" class="small-title">Log In</div>
            <div id="signup-title" class="small-title">Sign Up</div>
        </div>
    </div>
</body>
</html>
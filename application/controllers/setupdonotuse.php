<?php
/*
 * To setup tables for the first time
 * 
 * Works perfectly.
 * Make sure that someone does not use it accidently
 * 
 */
class Setupdonotuse extends CI_Controller {
    function index()
    {
        $this->load->model('Setup_model', 'setup');
        echo "<pre>";
        $this->setup->setup_tables();
        echo "</pre>";
        echo "Database is ready if you cannot see any error in log!";
    }
}

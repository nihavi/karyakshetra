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
        $this->load->model('setupdb');
        $this->setupdb->setupTables();
        echo "Done";
    }
}
?>

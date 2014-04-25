<?php

class Remote extends CI_Controller{
    
    function index()
    {
        if (!$this->session->userdata('uname'))
        {
            redirect(base_url() . 'account/login');
        }
    }
    
    function show($fid = "")
    {
        //TODO authenticate
        
        if(is_numeric($fid))
        {
            $this->load->view('mobile/remoteshow', array(
               'fid' => $fid
            ));
        }
    }
    
}

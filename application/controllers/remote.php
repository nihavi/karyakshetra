<?php

class Remote extends CI_Controller{
    
    function index()
    {
        
    }
    
    function show($fid = "")
    {
        if(is_numeric($fid))
        {
            $this->load->view('mobile/remoteshow', array(
               'fid' => $fid
            ));
        }
        else
        {
            
        }
    }
    
}

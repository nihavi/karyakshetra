<?php

class Remote extends CI_Controller{
    
    function index()
    {
        
    }
    
    function show($id = "")
    {
        if(is_numeric($id))
        {
            $this->load->view('mobile/remoteshow', array(
               'id' => $id 
            ));
        }
        else
        {
            
        }
    }
    
}
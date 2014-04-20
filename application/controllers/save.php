<?php

class Save extends CI_Controller {
    
    function index()
    {
        echo "Sorry, you need to know the predefined internal structure to use file saving.";
    }
    
    function newfile()
    {
        $user_id = $this->session->userdata('uid');
        
        if ($user_id)
        {
            $this->load->model('File_model', 'file');
            
            $fname = $this->input->post('filename', TRUE);
            $ftype = $this->input->post('module', TRUE);
            
            if(!$fname)
            {
                $fname = 'Untitled file';
            }
            
            $data = $this->input->post('file');
            
            $file_id = $this->file->save_as($fname, $data, $ftype, $user_id);
            
            echo $file_id;
        }
        else
        {
            echo 'User not logged in.';//TODO
        }
    }
    
    function file()
    {
        $this->load->model('File_model', 'file');
        
        $fid = $this->input->post('id', TRUE);
        $data = $this->input->post('file');
        
        $file_id = $this->file->save($fid, $data);
        
        echo $file_id;
    }
}

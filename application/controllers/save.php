<?php

class Save extends CI_Controller {
    
    function index()
    {
        echo "You need to know internal structure to use file saving.";
    }
    
    function newfile()
    {
        $this->load->model('File_model', 'file');
        
        $fname = $this->input->post('filename', TRUE);
        if( !$fname ){
            $fname = 'Untitled file';
        }
        $data = $this->input->post('file');
        
        $file_id = $this->file->save_as($fname, $data);
        
        echo $file_id;
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

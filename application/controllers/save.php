<?php

class Save extends CI_Controller {
    
    function index()
    {
        $this->load->model('File_model', 'file');
        $this->file->save_as('testfile');
    }
    
}

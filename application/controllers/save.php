<?php

class Save extends CI_Controller {
    
    function index()
    {
        $this->load->model('File_model', 'file');
        $this->file->save_as('testfile', 'Random text data. Random hash: eb4585ad9fe0426781ed7c49252f8225.' . "\n");
    }
}
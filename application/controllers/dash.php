<?php

class Dash extends CI_Controller {
    
    function index()
    {
        $this->load->model('File_model', 'file');
        
        $files = $this->file->get_files_of_user('public');
        /*
        <div>
            <div>Name</div>
            <div>id</div>
            <div>data</div>
        </div>
        */
    }
    
}

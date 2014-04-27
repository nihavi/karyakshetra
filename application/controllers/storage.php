<?php

class Storage extends CI_Controller {
    
    function dash()
    {
        $this->auth->require_authentication(true);
        
        $this->load->model('File_model', 'file');
        $uid = $this->session->userdata('uid');
        
        $files = array();
        
        if ($uid)
        {
            $user_files = $this->file->get_files_of_user($uid);
            $files = $user_files;
        }
    
        $file_list = array();
        
        $this->load->helper('module_helper');
        
        foreach ($files as $f) {
        
            $module = module($f->ftype);
            
            $file = array(
                'name'     => $f->fname,
                'module'   => $module['name'],
                'id'      => $f->fid,
                'modified' => $f->modified,
            );
            
            $file_list[] = $file;
        }
        
        $data = array(
            'files' => $file_list
        );
        
        echo json_encode($data);
    }
    
    //function submit($mode, $fid)
    //{
        /*
         * available modes
         *  create  - creates database
         *  submit  - insert in database
         */
        /*
        $this->load->model('Submit_model', 'submit');
        
        if ($mode == 'create')
        {
            //The structure of database must be posted
            $this->auth->require_authentication(true);
            
            //$structure = json_decode($this->input->post('struct', TRUE));
            $structure='';
            
            $this->submit->create($fid, $structure);
        }
    }*/
}

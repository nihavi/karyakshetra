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
}

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
                
        $module = array(
            '0' =>'dash',
            '1' =>'akruti',
            '2' => 'show',
            '3' => 'submit',
            '4' => 'aalekhan',
            '5' =>'aksharam',
        );
    
        $file_list = array();
        
        foreach ($files as $f) {
        
            $file = array(
                'name'     => $f->fname,
                'module'   => $module[$f->ftype],
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

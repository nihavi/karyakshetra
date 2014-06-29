<?php

class Storage extends CI_Controller {
    
    function filelist( $parent_id = 0)
    {
        $this->auth->require_authentication(true);
        
        $this->load->model('File_model', 'file');
        $uid = $this->session->userdata('uid');
        
        $dir = array();
        if( $parent_id != 0 ){
            $d = $this->file->get_file($parent_id);
            if( !$d || $d->ftype != 0){
                echo 'false';
                return false;
            }
            $dir = array(
                'id'        => $d->fid,
                'name'      => $d->fname,
                'modified'  => $d->modified,
                'parent'    => $d->pid,
            );
        }
        else {
            $dir = array(
                'id'        => 0,
                'name'      => '',
                'modified'  => '',
                'parent'    => 0,
            );
        }
        
        $files = array();
        
        if ($uid)
        {
            $user_files = $this->file->get_files_of_user($uid, $parent_id);
            $files = $user_files;
        }
    
        $file_list = array();
        
        $this->load->helper('module_helper');
        
        foreach ($files as $f) {
        
            $module = module($f->ftype);
            
            $file = array(
                'name'      => $f->fname,
                'module'    => $module['name'],
                'id'        => $f->fid,
                'modified'  => $f->modified,
            );
            
            $file_list[] = $file;
        }
        
        $data = array(
            'dir' => $dir,
            'files' => $file_list
        );
        
        echo json_encode($data);
    }
    
    function mkdir()
    {
        $this->auth->require_authentication(true);
        
        $dir_name = $this->input->post('name', TRUE);
        $parent_id = $this->input->post('parent', TRUE);
        
        if( !$parent_id ){
            $parent_id = 0;
        }
            
        $this->load->model('File_model', 'file');
        $uid = $this->session->userdata('uid');
        
        return $this->file->mkdir($dir_name, $parent_id, $uid);
    }
    
    function remove()
    {
        $this->auth->require_authentication(true);
        
        $remove = $this->input->post('remove', TRUE);
        $recursive = $this->input->post('recur', TRUE);
        
        if ( $recursive )
            $recursive = true;
        else 
            $recursive = false;
        
        $this->load->model('File_model', 'file');
        $uid = $this->session->userdata('uid');
        
        $succ = 0;
        $fail = 0;
        
        $noOfFiles = sizeof($remove);
        for( $i = 0; $i < $noOfFiles; $i++ )
        {
            $f = $this->file->get_file( $remove[$i] );
            if( !$f )
                continue;
            
            if( $f->ftype == 0 ){
                if( $this->file->remove_dir($f->fid, $recursive) === false )
                    $fail++;
                else 
                    $succ++;
            }
            else {
                if( $this->file->remove_file($f->fid) === false )
                    $fail++;
                else 
                    $succ++;
            }
        }
        
        $data = array(
            'success' => $succ,
            'fail' => $fail
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

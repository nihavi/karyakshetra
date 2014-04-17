<?php

class Storage extends CI_Controller {
    
    function dash()
    {
        $this->load->model('File_model', 'file');
        
        $files = $this->file->get_files_of_user('1');
        //var_dump($files->result());
        
        $module = array(
            '0' =>'dash',
            '1' =>'akruti',
            '2' => 'show',
            '3' => 'submit',
            '4' => 'aalekhan',
            '5' =>'aksharam',
        );
        
        $file_list = array();
        //var_dump($files->result());
        foreach ($files->result() as $f) {
        
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

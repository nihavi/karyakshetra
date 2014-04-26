<?php

class Download extends CI_Controller {
    
    function file($fid = '')
    {   
        if ($fid != '')
        {
            $this->load->model('File_model', 'file');
            
            $file = $this->file->get_file($fid);
            
            if ($file)
            {
                $fpath = $file->path;
                $module = array(
                '0' =>'dash',
                '1' =>'akruti',
                '2' => 'show',
                '3' => 'submit',
                '4' => 'aalekhan',
                '5' =>'aksharam',
                );
                
                $this->load->library('zip');
                $this->zip->read_dir($fpath, false, $fpath);
            
                $this->load->helper('download');
                force_download($file->fname . '.' . $module[$file->ftype], $this->zip->get_zip());
            }
        }
    }
    
}

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
                
                $this->load->helper('module_helper');
                
                $module = module($file->ftype);
                
                if ($module)
                {
                    $this->load->library('zip');
                    $this->zip->read_dir($fpath, false, $fpath);
                
                    $this->load->helper('download');
                    force_download($file->fname . '.' . $module['name'], $this->zip->get_zip());
                }
            }
        }
    }
    
}

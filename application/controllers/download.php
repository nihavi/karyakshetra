<?php

class Download extends CI_Controller {
    
    function file($fid = '')
    {
        if ($fid !== '')
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
    
    function files($flist = '')
    {
        if ($flist !== '')
        {
            $flist = explode("-", $flist);
            
            $this->load->model('File_model', 'file');
            $this->load->helper('module_helper');
            $this->load->library('zip');
            
            $files_list = array();
            
            for ($i = 0; $i < count($flist); ++$i)
            {
                if (! is_numeric($flist[$i]))
                {
                    continue;
                }
                
                $fid = $flist[$i];
                
                $file = $this->file->get_file($fid);
                
                $fpath = $file->path;
                
                $this->load->helper('module_helper');
                
                $module = module($file->ftype);
                
                if ($module)
                {
                    $this->zip->clear_data();
                    $this->zip->read_dir($fpath, false, $fpath);
                    
                    $files[] = array(
                        'name' => $file->fname . '.' . $module['name'],
                        'data' => $this->zip->get_zip()
                    );
                }
            }
            
            $this->zip->clear_data();
            
            for ($i = 0; $i < count($files); ++$i)
            {
                $file = $files[$i];
                $this->zip->add_data($file['name'], $file['data']);
            }
            
            $this->load->helper('download');
            force_download('Karyakshetra files ' . date('Y-m-d') . '.zip' , $this->zip->get_zip());
        }
    }
    
}

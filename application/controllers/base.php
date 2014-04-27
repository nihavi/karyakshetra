<?php

class Base extends CI_Controller
{
    /*
    function akruti($file_id = null, $mode = 'edit')
    {
        $this->index('akruti', $file_id, $mode);
    }
    
    function dash($file_id = null)
    {
        $this->index('dash', $file_id);
    }
    
    function show($file_id = null)
    {
        $this->index('show', $file_id);
    }
    
    function submit($file_id = null)
    {
        $this->index('submit', $file_id);
    }
    
    function aalekhan($file_id = null)
    {
        $this->index('aalekhan', $file_id);
    }
    
    function aksharam($file_id = null)
    {
        $this->index('aksharam', $file_id);
    }
    */
    function index($module = 'dash', $file_id = null, $mode = 'edit')
    {
        $this->session->set_userdata('redirectTo', uri_string());
        $this->auth->require_authentication();
        
        /*
         * Assumes that /scripts contains '<module>.js' file for each module
         */
        
        $this->load->helper('module_helper');
        
        $module_id = module_id($module);
        
        if( !$module_id )
        {
            echo "Module not found";
            exit;
        }
        
        $module_data = module($module_id);
        
        $data = array (
            'module' => $module,
            'base_script' => 'base0.0.js',
            'module_script' => $module_data['script'],
            'module_style' => $module_data['style'],
            'module_id' => $module_id,
            'mode' => $mode,
        );
        
        if( $file_id ){
            $this->load->model('File_model', 'file');
            $file = $this->file->open($file_id);
            
            if($file){
                $data['file_id'] = $file_id;
                $data['file_data'] = $file['data'];
                $data['file_name'] = $file['name'];
            }
        }
        
        $this->load->view('init', $data);
    }
}

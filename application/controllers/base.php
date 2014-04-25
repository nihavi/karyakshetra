<?php

class Base extends CI_Controller
{
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
    
    function index($module = 'dash', $file_id = null, $mode = 'edit')
    {
        if (!$this->session->userdata('uname'))
        {
            redirect(base_url() . 'account/login/');
        }
        
        /*
         * Assumes that /scripts contains '<module>.js' file for each module
         */
        $module_id = array(
            'dash' => '0',
            'akruti' => '1',
            'show' => '2',
            'submit' => '3',
            'aalekhan' => '4',
            'aksharam' => '5'
        );
        $module_scripts_repo = array(
            'base' => 'base0.0.js',
            'dash' => 'dash0.0.js',
            'akruti' => 'akruti0.0.js',
            'show' => 'show0.0.js',
            'submit' => 'submit0.0.js',
            'aalekhan' => 'aalekhan0.0.js',
            'aksharam' => 'aksharam0.0.js'
        );
        $module_style_repo = array(
            'dash' => 'dash0.0.css',
            'akruti' => 'akruti0.0.css',
            'show' => 'show0.0.css',
            'submit' => 'submit0.0.css',
            'aalekhan' => 'aalekhan0.0.css',
            'aksharam' => 'aksharam0.0.css'
        );
        if( !array_key_exists($module, $module_scripts_repo) )
        {
            echo "Module not found";
            exit;
        }
        $data = array (
            'module' => $module,
            'base_script' => $module_scripts_repo['base'],
            'module_script' => $module_scripts_repo[$module],
            'module_style' => $module_style_repo[$module],
            'module_id' => $module_id[$module],
            'mode' => $mode,
        );
        
        if( $file_id ){
            $this->load->model('File_model', 'file');
            $file_data = $this->file->open($file_id);
            
            if($file_data){
                $data['file_id'] = $file_id;
                $data['file_data'] = $file_data;
            }
        }
        
        $this->load->view('init', $data);
    }
}

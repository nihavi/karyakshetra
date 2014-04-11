<?php

class Base extends CI_Controller
{
    function akruti()
    {
        $this->index('akruti');
    }
    function dash()
    {
        $this->index('dash');
    }
    function show()
    {
        $this->index('show');
    }
    function submit()
    {
        $this->index('submit');
    }
    function aksharam()
    {
        $this->index('aksharam');
    }
    
    function index($module = 'dash')
    {
        /*
         * Assumes that /scripts contains '<module>.js' file for each module
         */
        $module_scripts_repo = array(
            'base' => 'base0.0.js',
            'dash' => 'dash0.0.js',
            'akruti' => 'akruti0.0.js',
            'show' => 'show0.0.js',
            'submit' => 'submit0.0.js',
            'aksharam' => 'aksharam0.0.js'
        );
        $module_style_repo = array(
            'dash' => 'dash0.0.css',
            'akruti' => 'akruti0.0.css',
            'show' => 'show0.0.css',
            'submit' => 'submit0.0.css',
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
            'module_style' => $module_style_repo[$module]
        );
        $this->load->view('init', $data);
    }
}

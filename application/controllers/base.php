<?php

class Base extends CI_Controller
{
    function index($module = 'dash')
    {
        /*
         * Assumes that /scripts contains '<module>.js' file for each module
         */
        $module_scripts_repo = array(
            'base' => 'base0.0.js',
            'dash' => 'dash0.0.js',
            'akruti' => 'akruti0.0.js'
        );
        if(  !array_key_exists($module, $module_scripts_repo) )
        {
            echo "Module not found";
            exit;
        }
        $data = array (
            'module' => $module,
            'base_script' => $module_scripts_repo['base'],
            'module_script' => $module_scripts_repo[$module],
        );
        $this->load->view('init', $data);
    }
}

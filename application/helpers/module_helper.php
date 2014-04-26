<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function module($id)
{
    $module = array(
        '1' => 'dash',
        '2' =>'akruti',
        '3' => 'show',
        '4' => 'submit',
        '5' => 'aalekhan',
        '6' =>'aksharam',
    );
    
    $module_scripts_repo = array(
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
    
    if( array_key_exists($id, $module) )
    {
        $module_name = $module[$id];
        return array(
            'name'   => $module_name,
            'script' => $module_scripts_repo[$module_name],
            'style'  => $module_style_repo[$module_name]
        );
    }
    else
    {
        return false;
    }
    
}

function module_id($module)
{
    $module_id = array(
        'dash' => '1',
        'akruti' => '2',
        'show' => '3',
        'submit' => '4',
        'aalekhan' => '5',
        'aksharam' => '6'
    );
    
    if( array_key_exists($module, $module_id) )
    {
        return $module_id[$module];
    }
    else
    {
        return false;
    }
}
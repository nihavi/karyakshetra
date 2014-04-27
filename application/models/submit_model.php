<?php

class Submit_model extends CI_Model {
    
    /*
     * Nothing works!!
     */
     
    function __construct()
    {
        parent::__construct();
        date_default_timezone_set('Asia/Kolkata');
        $this->load->database();
        $this->load->model('File_model', 'file');
    }
    
    /*
    function create($fid, $db_structure){
        $file = $this->file->get_file($fid);
        
        if( $file ){
            
            $fpath = $file->path;
            $config = array();
            $config['hostname'] = '';
            $config['username'] = '';
            $config['password'] = '';
            $config['database'] = 'sqlite:' . $fpath . 'responses.db';
            $config['dbdriver'] = 'sqlite3';
            $config['dbprefix'] = '';
            $config['pconnect'] = FALSE;
            $config['db_debug'] = TRUE;
            $config['cache_on'] = FALSE;
            $config['cachedir'] = '';
            $config['char_set'] = 'utf8';
            $config['dbcollat'] = 'utf8_general_ci';
            $config['stricton'] = FALSE;
            //echo $config['database'];
            //$database = $this->load->database($config, TRUE);
            $database = new SQLite3($fpath . 'responses.db');
            echo print_r($database);
        }
        else {
            return false;
        }
    }*/
    
}

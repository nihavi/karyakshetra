<?php
/*
 * To setup tables for the first time
 * 
 * Works perfectly.
 * Make sure that someone does not use it accidently
 * 
 */
class Setupdonotuse extends CI_Controller {
    function index()
    {
        $this->load->model('Setup_model', 'setup');
        echo "<pre>";
        $this->setup->setupTables();
        echo "</pre>";
        echo "Database is ready if you cannot see any error in log!";
    }
}

/*
    function savefile()
    {
        $this->db->trans_start();
        
        //saving data in files
        $data = array(
            'fname'=>'file_name',
            'path'=>'file_path',
            'ftype'=>'bit_pattern',
            'pid'=>'parent_id',
        );
        $this->db->set('modified', 'NOW()', FALSE);
        $this->db->insert('files',$data);
        $file_id = $this->db->insert_id();
    
        //saving data in filepermissions
        $data = array(
            'fid'=> $file_id,
            'pid'=> 'parent_id',
            'rights'=>'rights_given'
        );
        $this->db->insert('filepermissions',$data);
        
        
        $this->db->trans_complete(); 
    }
*/

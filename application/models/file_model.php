<?php

class File_model extends CI_Model {
    
    function __construct()
    {
        parent::__construct();
        $this->load->database();
    }
    
    function save($file_path, $file_data, $update_db = TRUE)
    {
        $this->load->helper('file');
        write_file($file_path . 'data.kdat', $file_data);
    }
    
    function save_as($file_name, $file_data, $ftype = 0)
    {
        $this->db->trans_start();

        $data = array(
            'fname'=> $file_name,
            'ftype'=> 0,
            'pid'=> 0
        );

        $this->db->set('modified', 'NOW()', FALSE);
        $this->db->insert('files', $data);
        $file_id = $this->db->insert_id();
        $this->db->where('fid', $file_id);
        
        $date_path =  strtolower(date('Y/M/'));
        
        $file_path = DATAPATH . $date_path . $file_id . '/';
        
        if (!is_dir($file_path))
        {
            mkdir($file_path, '0777', true);
        }
        
        $this->db->set('path', $file_path);
        $this->db->update('files');

        $this->save($file_path, $file_data, FALSE);
        
        $this->db->trans_complete();
    }
}
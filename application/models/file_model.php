<?php

class File_model extends CI_Model {
    
    function __construct()
    {
        parent::__construct();
        date_default_timezone_set('Asia/Kolkata');
        $this->load->database();
    }
    
    function save($file_id, $file_data, $file_path = NULL, $update_db = TRUE)
    {
        if( !$file_path ){
            $this->db->where('fid', $file_id);
            $query = $this->db->get('files');
            $file_path = $query->row()->path;
        }
        
        /*
         * TODO
         * Check and report if soft file/physical file does not exist
         */
        
        $this->load->helper('file');
        write_file($file_path . 'data.kdat', $file_data);
        
        if ( $update_db )
        {
            $this->db->trans_start();
            $this->db->where('fid', $file_id);
            $this->db->set('modified', 'NOW()', FALSE);
            $this->db->update('files');
            $this->db->trans_complete();
        }
        
        return $file_id;
    }
    
    function save_as($file_name, $file_data, $ftype = 0)
    {
        $this->db->trans_start();
        
        //Prepare array for insertion
        $data = array(
            'fname'=> $file_name,
            'ftype'=> 0,
            'pid'=> 0
        );

        $this->db->set('modified', 'NOW()', FALSE);
        $this->db->insert('files', $data);
        
        //Prepare file path
        $file_id = $this->db->insert_id();
        $this->db->where('fid', $file_id);
        
        $date_path =  strtolower(date('Y/M/'));
        
        $file_path = DATAPATH . $date_path . $file_id . '/';
        
        
        if (!is_dir($file_path))
        {
            umask(0);
            mkdir($file_path, 0777, true);
        }
        
        //Insert file path into DB
        $this->db->set('path', $file_path);
        $this->db->update('files');

        //Add file permissions, default to `public` for now
        
        $this->db->where('gname', 'public');
        $query = $this->db->get('groups');
        
        $public_id = $query->row()->gid;
        
        $this->db->insert('filePermissions', array(
                'gid'       => $public_id,
                'fid'       => $file_id,
                'rights'    => 7
            )
        );
        
        //Actual file save call
        $this->save($file_id, $file_data, $file_path, FALSE);
        
        $this->db->trans_complete();
        
        return $file_id;
    }
    
    function open($file_id){
        $this->db->where('fid', $file_id);
        $query = $this->db->get('files');
        if ($query->num_rows() > 0){
            $file_path = $query->row()->path;
            
            $this->load->helper('file');
            
            $file_data = read_file( $file_path . 'data.kdat' );
            
            return $file_data;
        }
        else {
            return false;
        }
    }
}

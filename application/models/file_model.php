<?php

class File_model extends CI_Model {
    
    function __construct()
    {
        parent::__construct();
        $this->load->database();
    }
    
    function save($file_id, $file_path, $file_data, $update_db = TRUE)
    {
        $this->load->helper('file');
        write_file($file_path . 'data.kdat', $file_data);
        
        if ($update_db)
        {
            $this->db->trans_start();
            $this->db->where('fid', $file_id);
            $this->db->set('modified', 'NOW()', FALSE);
            $this->db->update('files');
            $this->db->trans_complete();
        }
        
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
            echo $file_path;
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
        $this->save($file_id, $file_path, $file_data, FALSE);
        
        
        $this->db->trans_complete();
    }
}

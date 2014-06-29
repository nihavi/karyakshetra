<?php

class File_model extends CI_Model {
    
    function __construct()
    {
        parent::__construct();
        date_default_timezone_set('Asia/Kolkata');
        $this->load->database();
    }
    
    function mkdir($dir_name, $parent_id = 0, $user_id = null)
    {
        return $this->save_as($dir_name, null, 0, $parent_id, $user_id, false, true);
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
    
    function save_as($file_name, $file_data, $ftype, $parent_id = 0, $user_id = null, $uploaded = false, $isDir = false)
    {
        /*
         * $uploaded = false, It'll save file and return fid
         *           = true, It'll save empty file and return file_path
         * 
         * if !$file_data, It'll save empty file and return fid
         */
        
        $this->db->trans_start();
        
        //Prepare array for insertion
        $data = array(
            'fname'=> $file_name,
            'ftype'=> $ftype,
            'pid'=> $parent_id
        );

        $this->db->set('modified', 'NOW()', FALSE);
        $this->db->insert('files', $data);
        
        $file_id = $this->db->insert_id();
        
        if( !$isDir ){
            //Prepare file path
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
        }
        
        if ($user_id == null)
        {
            $this->db->where('gname', 'public');
            $query = $this->db->get('groups');
            $user_id = $query->row()->gid;
        }
        
        //Add file permissions, default to `public` for now
        
        $this->db->insert('filepermissions', array(
                'gid'       => $user_id,
                'fid'       => $file_id,
                'rights'    => 7
            )
        );
        
        //Actual file save call
        if (! $uploaded)
        {
            if ( $file_data )
            {
                $this->save($file_id, $file_data, $file_path, FALSE);
            }
            $this->db->trans_complete();
            return $file_id;
        }
        else
        {
            $this->db->trans_complete();
            return $file_path;
        }
        
    }
    
    function open($file_id){
        
        $this->db->where('fid', $file_id);
        
        $query = $this->db->get('files');
        
        if ($query->num_rows() > 0){
            $file_path = $query->row()->path;
            
            $this->load->helper('file');
            
            $file_data = read_file( $file_path . 'data.kdat' );
            
            return array(
                'name' => $query->row()->fname,
                'data' => $file_data
            );
        }
        else {
            return false;
        }
    }

    function get_files_of_user($group_id, $parent_id = 0)
    {
        $this->db->select('files.*');
        $this->db->from('files, filepermissions');
        $this->db->where('files.fid = filepermissions.fid');
        $this->db->where("filepermissions.gid = $group_id");
        $this->db->where("files.pid = $parent_id");
        $this->db->order_by('modified', 'desc');
        $query = $this->db->get();
        
        return $query->result();
    }
    
    function get_file($file_id)
    {
        $query = $this->db->get_where('files', array('fid' => $file_id));
        
        if ($query->num_rows() > 0)
        {
            return $query->row();
        }
        else
        {
            return false;
        }
    }
    
    function extract_upload($file_name, $file_ext, $file_path)
    {
        $module = substr($file_ext, 1);
        $this->load->helper('module_helper');
        $ftype = module_id($module);
        
        $save_path = $this->save_as($file_name, null, $ftype, $this->session->userdata('uid'), true);
    
        $zip = new ZipArchive; 
        $zip->open($file_path); 
        $zip->extractTo($save_path); 
        $zip->close();
    }
    
}

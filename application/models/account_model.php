<?php

class Account_model extends CI_Model {
    
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }
    
    function valid_credentials($uname, $upass)
    {
        $upass = sha1($upass);
        
        $query = $this->db->get_where('users', array('username' => $uname, 'password' => $upass));
        if ($query->num_rows() > 0)
        {
            return $query->row()->uid;
        }
        else
        {
            return false;
        }
    }
    
    function register_user($uname, $upass)
    {
        $upass = sha1($upass);
        
        $this->db->trans_start();
        $this->db->insert('groups', array(
                'gname' => $uname,
                'isUser' => TRUE
            ));
        $gid = $this->db->insert_id();
        $this->db->insert('users', array(
                'uid' => $gid,
                'username' => $uname,
                'password' => $upass
            ));
        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE)
        {
            return FALSE;
        }
        else 
        {
            return $gid;
        }
    }
    
}

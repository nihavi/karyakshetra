<?php

class Opqueue_model extends CI_Model {
    
    function __construct()
    {
        parent::__construct();
        date_default_timezone_set('Asia/Kolkata');
        $this->load->database();
    }
    
    function addop($fid, $op)
    {
        $this->db->trans_start();
        
        //Prepare array for insertion
        $data = array(
            'fid'=> $fid,
            'op'=> $op,
        );

        $this->db->insert('opqueue', $data);
        
        $id = $this->db->insert_id();
        $this->db->trans_complete();
        
        return $id;
    }
    
    function getop($fid, $last_id)
    {
        $this->db->select('id, op');
        $this->db->where('id >', $last_id);
        $this->db->where('fid', $fid);
        
        $query = $this->db->get('opqueue');
        $query = $query->result();
        
        $res = Array(
            'lastOp' => $query[count($query) - 1]->id,
            'ops' => $query,
        );
        
        return $res;
    }
    
}

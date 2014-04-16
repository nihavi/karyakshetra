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
        
        if( count($query) ){
            $res = Array(
                'lastOp' => $query[count($query) - 1]->id,
                'ops' => $query,
            );
        }
        else{
            $res = '';
        }
        
        return $res;
    }
    
    function getlastop($fid)
    {
        $this->db->select_max('id');
        $this->db->where('fid', $fid);
        $query = $this->db->get('opqueue');
        return $query->row()->id;
        //return $query->row()->id;
    }
}

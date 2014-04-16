<?php

class Opqueue extends CI_Controller {
    
    function index()
    {
        echo "Sorry, you need to know the predefined internal structure to use opQueue.";
    }
    
    function addop()
    {
        $this->load->model('Opqueue_model', 'opqueue');
        
        $fid = $this->input->post('fid', TRUE);
        $op = $this->input->post('op', TRUE);
        
        $op_id = $this->opqueue->addop($fid, $op);
        
        echo $op_id;
    }
    
    function getop()
    {
        $this->load->model('Opqueue_model', 'opqueue');
        
        $fid = $this->input->post('fid', TRUE);
        $last_op = $this->input->post('last', TRUE);
        
        $ops = $this->opqueue->getop($fid, $last_op);
        
        if( $ops )
            echo json_encode($ops);
        else 
            echo '';
    }
    
    function lastop()
    {
        $this->load->model('Opqueue_model', 'opqueue');
        
        $fid = $this->input->post('fid', TRUE);
        
        echo $this->opqueue->getlastop($fid);
    }
}

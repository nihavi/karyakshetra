<?php

class Opqueue extends CI_Controller {

    function addop()
    {
        $this->auth->require_authentication(true);
        
        $this->load->model('Opqueue_model', 'opqueue');
        
        $fid = $this->input->post('fid', TRUE);
        $op = $this->input->post('op', TRUE);
        
        $op_id = $this->opqueue->addop($fid, $op);
        
        echo $op_id;
    }
    
    function getop()
    {
        $this->auth->require_authentication(true);
        
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
        $this->auth->require_authentication(true);
        
        $this->load->model('Opqueue_model', 'opqueue');
        
        $fid = $this->input->post('fid', TRUE);
        
        echo $this->opqueue->getlastop($fid);
    }
}

<?php

class Account extends CI_Controller{
    
    function index()
    {
        $this->auth->require_authentication();
    }
    
    function login()
    {
        if ($this->session->userdata('uname'))
        {
            redirect(base_url());
        }
        
        $this->load->library('form_validation');
        
        $this->form_validation->set_rules('username', 'Username', 'trim|required');
        $this->form_validation->set_rules('password', 'Password', 'trim|required');
        
        if ($this->form_validation->run() == FALSE)
		{
			$this->load->view('login_view');
		}
		else
		{
			$uname = $this->input->post('username');
            $upass = $this->input->post('password');
            
            $this->load->model('Account_model', 'account');
            
            $uid = $this->account->valid_credentials($uname, sha1($upass));
            if ($uid)
            {
                $this->session->set_userdata(array('uname' => $uname, 'uid' => $uid));
                redirect(base_url() . $this->session->userdata('redirectTo'));
            }
            else
            {
                $this->load->view('login_view', array('invalid' => true));
            }
        }
    }
    
    function logout()
    {
        $this->session->sess_destroy();
        redirect(base_url() . 'account/login/');
    }
    
    function signup()
    {
        if ($this->session->userdata('uname'))
        {
            redirect(base_url());
        }
        
        $this->load->library('form_validation');
        $this->load->database();
        
        $this->form_validation->set_rules('username', 'username', 'trim|required|alpha_numeric|min_length[5]|max_length[32]|is_unique[users.username]');
        $this->form_validation->set_rules('password', 'password', 'trim|required|min_length[5]|max_length[128]');
        $this->form_validation->set_rules('password_conf', 'password confirmation', 'trim|required|matches[password]');
        
        if ($this->form_validation->run() == FALSE)
		{
			$this->load->view('signup_view');
		}
		else
		{
			$uname = $this->input->post('username');
            $upass = $this->input->post('password');
            
            $this->load->model('Account_model', 'account');
            
            $uid = $this->account->register_user($uname, sha1($upass));
            if ($uid)
            {
                $this->session->set_userdata(array('uname' => $uname, 'uid' => $uid));
                redirect(base_url());
            }
            else
            {
                $this->load->view('signup_view', array('invalid' => true));
            }
        }
    }
    
}

<?php

class Upload extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		$this->load->helper(array('form', 'url'));
	}

	function index()
	{
		$this->auth->require_authentication();
		
		if (! $this->input->post())
		{
			$this->load->view('upload_view');
		}
		else
		{
			$config['upload_path'] = './data/uploads';
			$config['allowed_types'] = '*';
			
			$this->load->library('upload', $config);
	
			if ( ! $this->upload->do_upload())
			{
				$error = array('error' => $this->upload->display_errors());
	
				$this->load->view('upload_view', $error);
			}
			else
			{
				$this->load->model('File_model', 'file');
				
				$upload_data = $this->upload->data();
				
				$this->file->extract_upload(implode("", explode('.', $upload_data['client_name'], -1)),  $upload_data['file_ext'], $upload_data['full_path']);
				$data = array('success' => true);
	
				$this->load->view('upload_view', $data);
				redirect(base_url());
			}
		}
	}
}

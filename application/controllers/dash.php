<?php

class Dash extends CI_Controller {
    
    function index()
    {
        $this->load->model('File_model', 'file');
        
        //passing the gid, assumed that public has gid = 1
       //$some_id = 1;
        //$files = $this->file->get_files_of_user($some_id);
       
       $files = $this->file->get_files_of_user('1');
        //var_dump($files->result());
        
        foreach ($files->result() as $fi){
			
			echo "  <div>
						<span>".$fi->fname."</span>
						<span>".$fi->created."</span>
						<span>".$fi->modified."</span>
					</div>
					";
		}
		
   
    }
    
}

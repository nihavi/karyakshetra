<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 

class Auth {
    
    public function require_authentication($ajax = false)
    {
        $CI = & get_instance();
        
        if (!$CI->session->userdata('uname'))
        {
            if ($ajax)
            {
                show_error('You must be logged in to access this data.', 403, 'Unauthorized access.');
                exit();
            }
            else
            {
                $CI->session->set_userdata('redirectTo', uri_string());
                redirect(base_url() . 'account/login');
                exit();
            }
        }
    }
    
}

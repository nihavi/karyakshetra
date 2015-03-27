<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function fs_write_file($file_path, $data)
{
    $CI =& get_instance();
    $CI->load->helper('file');

    $simulate = $CI->config->item('simulate_filesystem', 'karyakshetra');

    if ( $simulate )
    {
        $CI->db->select('id');
        $CI->db->where("filepath = '$file_path'");
        $query = $CI->db->get('filesystem');

        if ($query->num_rows() > 0)
        {
            $CI->db->where("filepath = '$file_path'");
            $CI->db->update('filesystem', array(
                    'data'  => $data
                )
            );
        }
        else
        {
            $CI->db->insert('filesystem', array(
                    'filepath'  => $file_path,
                    'data'      => $data
                )
            );
        }
        return ($CI->db->affected_rows() > 0);
    }
    else
    {
        return write_file($file_path, $data);
    }
}

function fs_read_file($file_path)
{
    $CI =& get_instance();
    $CI->load->helper('file');

    $simulate = $CI->config->item('simulate_filesystem', 'karyakshetra');

    if ( $simulate )
    {
        $CI->db->select('data');
        $CI->db->where("filepath = '$file_path'");
        $query = $CI->db->get('filesystem');

        if ($query->num_rows() > 0)
        {
            return $query->row()->data;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return read_file($file_path);
    }
}

function fs_mkdir($pathname, $mode = 0777, $recursive = false)
{
    $CI =& get_instance();
    $CI->load->helper('file');

    $simulate = $CI->config->item('simulate_filesystem', 'karyakshetra');

    if ( $simulate )
    {
        // No need to do anything
    }
    else
    {
        return mkdir($pathname, $mode, $recursive);
    }
}

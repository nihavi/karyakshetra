<?php
class Setup_model extends CI_Model {
    /*
     * Model for first time setup of databases (and maybe other things)
     */
    
    function __construct()
    {
        parent::__construct();
    }
    
    function setup_tables() {
        $this->load->database();
        $this->load->dbforge();

        //Files Table
        if ($this->db->table_exists('files')){
            $this->dbforge->drop_table('files');
            echo "Table 'files' dropped\n";
        }
        $fields = array(
            'fid' => array(
                'type' => 'INT',
                'constraint' => 9,
                'auto_increment' => TRUE
            ),
            'fname'=> array(
                'type'=>'VARCHAR',
                'constraint' => '256'
            ),
            'path'=>array(
                'type'=>'VARCHAR',//Physical path
                'constraint' => '256'
            ),
            'created TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
            'modified'=>array(
                'type'=>'DATETIME'
            ),
            'ftype'=>array(
                'type'=>'SMALLINT'//double check the datatype for this.
            ),
            'pid'=>array(
                'type'=>'INT'
            ),
        );

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('fid', TRUE);
        $this->dbforge->create_table('files');
        
        echo "Table 'files' created\n";
        

        //Groups Table
        if ($this->db->table_exists('groups')){
            $this->dbforge->drop_table('groups');
            echo "Table 'groups' dropped\n";
        }
        $fields = array(
            'gid' => array(
                'type' => 'INT',
                'constraint' => 9,
                'auto_increment' => TRUE
            ),
            'gname' => array(
                'type'=>'VARCHAR',
                'constraint'=>100
            ),
            'created TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
            'isUser' => array(
                'type'=>'BOOLEAN'
            ),
        );

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('gid',TRUE);
        $this->dbforge->create_table('groups');
        echo "Table 'groups' created\n";
        
        //Users Login Table
        
        $this->dbforge->drop_table('users');
        echo "Table 'users' dropped\n";
        
        $fields=array(
            'uid' => array(
                'type' => 'INT',
                'constraint' => 9,
            ),
            'username'=>array(
                'type'=>'VARCHAR',
                'constraint'=>'100'
            ),
            'password'=>array(
                'type'=>'VARCHAR',
                'constraint' => '100'
            ),
            'created TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
            'lastlogin'=>array(
                'type'=>'DATETIME'
            )
        );
        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('uid', TRUE);
        $this->dbforge->create_table('users');
        echo "Table 'users' created\n";

        //Ownership Table
        if ($this->db->table_exists('filePermissions')){
            $this->dbforge->drop_table('filePermissions');
            echo "Table 'filePermissions' dropped\n";
        }
        $fields=array(
            'gid'=>array(
                'type'=>'INT'
            ),
            'fid'=>array(
                'type'=>'INT'
            ),
            'rights'=>array(
                'type'=>'SMALLINT'//flags for r,w,rw etc.
            )
        );

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('gid', TRUE);
        $this->dbforge->add_key('fid', TRUE);
        $this->dbforge->create_table('filePermissions');
        echo "Table 'filePermissions' created\n";


        //Group Mapping(parent files to child files)

        if ($this->db->table_exists('groupMapping')){
            $this->dbforge->drop_table('groupMapping');
            echo "Table 'groupMapping' dropped\n";
        }
        $fields=array(
            'gid'=>array(
                'type'=>'INT'
            ),
            'uid'=>array(
                'type'=>'INT'
            )
        );

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('gid', TRUE);
        $this->dbforge->add_key('uid', TRUE);
        $this->dbforge->create_table('groupMapping');
        echo "Table 'groupMapping' created\n";
        
        echo "Inserting 'public' user";
        $this->db->trans_start();
        $this->db->insert('groups', array(
                'gname' => 'Public',
                'isUser' => TRUE
            ));
        $gid = $this->db->insert_id();
        $this->db->insert('users', array(
                'uid' => $gid,
                'username' => 'public'
            ));
        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE)
        {
            echo "\t\t[Failed]\n";
        }
        else 
        {
            echo "\t\t[Done]\n";
        }
    }
    
}
?>

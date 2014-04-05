<?php
class Setupdb extends CI_Model {
    /*
     * Model for first time setup of databases
     */
    
    function __construct()
    {
        parent::__construct();
    }
    
    function setupTables(){
        $this->load->database();
        $this->load->dbforge();

        //Files Table

       $fields=array(
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
        

        //Groups Table

        $fields=array(
            'gid' => array(
                'type' => 'INT',
                'constraint' => 9,
                'auto_increment' => TRUE
            ),
            'gname'=>array(
                'type'=>'VARCHAR',
                'constraint'=>100
            ),
            'created TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
            'isUser'=>array(
                'type'=>'BOOLEAN'
            ),
        );

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('gid',TRUE);
        $this->dbforge->create_table('groups');
        
        //Users Login Table

        $fields=array(
            'uid' => array(
                'type' => 'INT',
                'constraint' => 9,
                'auto_increment' => TRUE
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
        $this->dbforge->add_key('uid');
        $this->dbforge->create_table('users');

        //Ownership Table

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


        //Group Mapping(parent files to child files)


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
        $this->dbforge->create_table('GroupMapping');
        
    }
    
}
?>

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
            'removed'=>array(
                'type'=>'BOOLEAN',
                'default'=>0
            ),
        );

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('fid', TRUE);
        $this->dbforge->create_table('files');

        echo "Table 'files' created\n";


        //Groups Table

        $this->dbforge->drop_table('groups');
        echo "Table 'groups' dropped\n";

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
            'created TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
        );
        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('uid', TRUE);
        $this->dbforge->create_table('users');
        echo "Table 'users' created\n";

        //Ownership Table
        $this->dbforge->drop_table('filepermissions');
        echo "Table 'filepermissions' dropped\n";

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
        $this->dbforge->create_table('filepermissions');
        echo "Table 'filepermissions' created\n";


        //Group Mapping(parent files to child files)

        $this->dbforge->drop_table('groupmapping');
        echo "Table 'groupmapping' dropped\n";

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

        $this->dbforge->create_table('groupmapping');
        echo "Table 'groupmapping' created\n";

        echo "Inserting 'public' user";
        $this->db->trans_start();
        $this->db->insert('groups', array(
                'gname' => 'public',
                'isUser' => TRUE
            ));
        $gid = $this->db->insert_id();
        $this->db->insert('users', array(
                'uid' => $gid,
                'username' => 'public',
                'password' => ''
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

        //OpQueue Table
        $this->dbforge->drop_table('opqueue');
        echo "Table 'opqueue' dropped\n";

        $fields=array(
            'id' => array(
                'type' => 'INT',
                'constraint' => 9,
                'auto_increment' => TRUE
            ),
            'fid'=>array(
                'type'=>'INT'
            ),
            'op'=>array(
                'type'=>'VARCHAR',
                'constraint'=>'2048'
            ),
            'time TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        );

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->create_table('opqueue');
        echo "Table 'opqueue' created\n";

        //filesystem Table
        if ( $this->config->item('simulate_filesystem', 'karyakshetra') )
        {
            $this->dbforge->drop_table('filesystem');
            echo "Table 'filesystem' dropped\n";

            $fields=array(
                'id' => array(
                    'type' => 'INT',
                    'constraint' => 9,
                    'auto_increment' => TRUE
                ),
                'filepath'=>array(
                    'type'=>'VARCHAR',
                    'constraint'=>'256'
                ),
                'data'=>array(
                    'type'=>'MEDIUMBLOB'
                )
            );

            $this->dbforge->add_field($fields);
            $this->dbforge->add_key('id', TRUE);
            $this->dbforge->create_table('filesystem');
            echo "Table 'filesystem' created\n";
        }
    }

}
?>

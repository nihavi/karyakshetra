<?php

$this->load->database();
$this->load->dbforge();


//Files Table
$this->dbforge->create_databases('File');

$fields=array(
    'name'=> array(
        'type'=>'VARCHAR';
        'constraint'=>'100';
    ),
    'link'=>array(
        'type'=>'VARCHAR';//Hyperlink

    ),
    'created'=>array(
        'type'=>'TIMESTAMP';
    ),
    'modified'=>array(
        'type'=>'TIMESTAMP';
    ),
    'typesaved'=>array(
        'type'='SMALLINT';//double check the datatype for this.
    )
    'parentId'array(
        'type'=>'INT';
        ),
    );

$this->dbforge->add_field($fields);



//Groups Table
$this->dbforge->create_databases('Groups');

$fields=array(
       'groupId'=>array(
            'type'=>'INT';
            'unsigned'=TRUE;
            'auto_increment'=>TRUE;
        ),
       'groupname'=>array(
        'type'=>'VARCHAR';
            'constraint'=>100;
        ),
        'firstcreated'=>array(
          'type'=>'TIMESTAMP';
        ),
        'GRU'=>array(
            'type'=>bool;
        ),
    );

$this->dbforge->add_field($fields);

//Users Login Table
$this->dbforge->create_databases('Users');

$fields=array(
      
        'username'=>array(
            'type'=>'VARCHAR';
            'constraint'=>'100';
        ),
        'password'=>array(
            'type'=>'VARCHAR';
        ),
        'lastlogin'=>array(
            'type'=>'TIMESTAMP';
        ),
        'created'=>array(
            'type'=>'TIMESTAMP';
        ),
    );
$this->dbforge->add_field($fields);



//Ownership Table
$this->dbforge->create_databases('Groups');

$fields=array(
       'groupId'=>array(
            'type'=>'INT';
        ),
       'fileId'=>array(
        'type'=>'INT';
        ),
        'rights'=>array(
          'type'=>'INT';//flags for r,w,rw etc.
        ),
    );

$this->dbforge->add_field($fields);



//Group Mapping(parent files to child files)
$this->dbforge->create_databases('GroupMapping');

$fields=array(
    'parentId'=>array(
        'type'=>'INT';
        ),
    'childId'=>array(
        'type'=>'INT';
        ),
    );

$this->dbforge->add_fields($fields);


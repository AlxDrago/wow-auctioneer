<?php

include '../config/config.php';
include 'db.php';

function getRecipes () {
    global $db;
    global $config;

    db::getInstance()->Connect($config['db_user'], $config['db_password'], $config['db_base']);
    $db = db::getInstance()->Select('SELECT * FROM recipes WHERE profession = :profession',
        [
            'profession' => $_POST['prof'],
        ]);

    print_r(json_encode($db));
}

getRecipes();

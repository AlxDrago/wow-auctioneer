<?php

include '../config/config.php';
include 'db.php';

function sendRecipes () {
    global $db;
    global $config;
    $item = array();
    $request = '';
    $requestData = '';

    for ($i = 0; $i < $_POST['number']; $i++) {
        $item['item' . $i] = $_POST['item' . $i];
        $request .= 'item' . $i . ', ';
        $requestData .= ':item' . $i . ', ';
    }

    $item ['name_recipes'] =  $_POST['nameRec'];
    $item ['id_recipes'] =  $_POST['idRec'];
    $item ['profession'] =  $_POST['profession'];

    db::getInstance()->Connect($config['db_user'], $config['db_password'], $config['db_base']);
    $db = db::getInstance()->Query('INSERT INTO recipes (' . $request .' name_recipes, id_recipes, profession) VALUES  (' . $requestData . ' :name_recipes, :id_recipes, :profession)',
        $item
    );

    print_r($db);
}

sendRecipes();

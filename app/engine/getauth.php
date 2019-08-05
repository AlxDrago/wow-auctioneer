<?php
include '../config/config.php';

function startAuth () {
    global $config;

    $accessToken = $_POST['token'];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,'https://eu.api.blizzard.com/wow/auction/data/'
        . $config['realm'] . '?locale=ru_ru'
        .'&access_token=' . $accessToken);
    $content = curl_exec($ch);

    echo $content;
}

startAuth();
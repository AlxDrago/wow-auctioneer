<?php

function getAucData() {
    $url = $_POST['url'];
    $response = file_get_contents($url);
    $dump = '../data/dump.txt';
    $date = '../data/date.txt';
    file_put_contents($dump, $response);
    file_put_contents($date, $_POST['date']);

//    $response = file_get_contents($dump);
    print_r($response);
}

getAucData();

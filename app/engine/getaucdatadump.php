<?php

function getAucDataDump() {
    $dump = '../data/dump.txt';
    $response = file_get_contents($dump);
    $date = file_get_contents('../data/date.txt');

    print_r(json_encode([$response, $date]));
}

getAucDataDump();

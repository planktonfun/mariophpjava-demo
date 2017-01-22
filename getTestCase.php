<?php

$start = microtime(true);

require_once __DIR__ .'/vendor/TcpClient.php';

$server = new TcpClient('127.0.0.1', '1313');

$server->send(['getUncalculatedMember' => 1]);

echo $server->wait();
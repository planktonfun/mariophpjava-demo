<?php

require_once __DIR__ .'/vendor/autoload.php';

// Connect To Redis
$redis = new \Predis\Client([
    "scheme"     => "tcp",
    "host"       => "127.0.0.1",
    "port"       => 6379,
    "password"   => "foobared",
    "database"   => 3,
    "persistent" => "1"
]);

$directory = './external data';
$dirs = scandir($directory);

foreach ($dirs as $key => $value) {
    if($value != "." && $value != "..") {
        $content = file_get_contents($directory . '/' . $value);
        $json    = json_decode($content, true);

        $redis->set($json[0], $json[1]);
    }
}

// $keys = $redis->keys("*");

// foreach ($keys as $index => $key) {
// 	file_put_contents($index, json_encode([
// 		$key,
// 		$redis->get($key)
// 	]));
// }
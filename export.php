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

$keys = $redis->keys("*");

foreach ($keys as $index => $key) {
	file_put_contents($index, json_encode([
		$key,
		$redis->get($key)
	]));
}
<?php

class TcpClient
{
	public function __construct($ip, $port)
	{
		$addr = gethostbyname($ip);
		$client = stream_socket_client("tcp://$addr:$port", $errno, $errorMessage);

		if ($client === false) {
		    throw new UnexpectedValueException("Failed to connect: $errorMessage");
		}

		return $this->client = $client;

	}

	public function send($mixed)
	{
		fwrite($this->client, json_encode($mixed));
	}

	public function wait()
	{
		return stream_get_contents($this->client);
	}

	public function __destruct()
	{
		fclose($this->client);
	}
}
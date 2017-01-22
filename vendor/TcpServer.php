<?php

class TcpServer
{
	public function __construct(\Processor $processor)
	{
		$this->processor = $processor;
	}

	public function listen($ip, $port)
	{
		$addr   = gethostbyname($ip);
		$server = stream_socket_server("tcp://" . $addr . ":" . $port, $errno, $errorMessage);

		echo PHP_EOL . "visit " . __FILE__ . ' FROM BROWSER ' ;
		echo PHP_EOL . "connected to: $addr : $port";

		if ($server === false) {
	        throw new UnexpectedValueException("Could not bind to socket: $errorMessage");
		}

		// loop forever
		for (;;) {
		    $client = @stream_socket_accept($server);

		    if ($client) {
			    $recv = fread($client, 2048);

		    	echo $recv;

		    	$input = json_decode($recv, true);

		    	fwrite($client, json_encode($this->processor->process($input)));

		        stream_socket_shutdown($client, STREAM_SHUT_RDWR);
		    }
		}
	}
}

?>
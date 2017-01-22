<?php

require_once __DIR__ .'/vendor/Gene.php';
require_once __DIR__ .'/vendor/Population.php';
require_once __DIR__ .'/vendor/TcpServer.php';
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

// Make Populaton
$helloWorld = [];
for ($i=0; $i < 2; $i++) {
    for ($x=0; $x < 13; $x++) {
        for ($y=0; $y < 13; $y++) {
            $helloWorld[] = 'H';
        }
    }
}

$helloWorld = implode('', $helloWorld);
$population = new Population($helloWorld, 20, $redis);

// Create a Callback for a tcp server
class Processor
{
    /**
     * [__construct description]
     * @param \Predis\Client $redis      [description]
     * @param \Population    $population [description]
     */
    public function __construct(
        \Predis\Client $redis,
        \Population $population
    ) {
        $this->redis      = $redis;
        $this->population = $population;
    }

    /**
     * [process description]
     * @param  array  $input [description]
     * @return [type]        [description]
     */
    public function process(array $input)
    {
        if (isset($input['getUncalculatedMember'])) {
            return $this->getUncalculatedMember();
        }

        $code       = $input['code'];
        $cost       = (int) $input['cost'];
        $calculated = true;
        $taken      = true;

        var_dump (
            $cost,
            $this->population->generationNumber
        );

        if(!is_null($this->redis->get($code))) {
            echo 'not null';
            $this->redis->set($code, json_encode([
                $cost,
                $calculated,
                $taken
            ]));
        }

        $memberIndex = $this->population->findGeneByCode($code);
        if(!is_null($memberIndex)) {
            $this->population->members[$memberIndex]->cost = $cost;
        }

        return "OK";
    }

    /**
     * [getUncalculatedMember description]
     * @return [type] [description]
     */
    public function getUncalculatedMember()
    {
        $keys   = $this->redis->keys("*");
        $result = null;

        foreach ($keys as $key => $value) {
            $array  = json_decode($this->redis->get($value), true);

            $cost       = 0;
            $calculated = false;
            $taken      = $array[2];

            if($taken == false) {
                $taken = true;

                $this->redis->set($value, json_encode([
                    $cost,
                    $calculated,
                    $taken
                ]));

                $result = $value;
                break;
            }
        }

        if(!is_null($result)) {
            return $result;
        }

        return $this->nextStep();
    }

    /**
     * [nextStep description]
     * @return [type] [description]
     */
    public function nextStep()
    {
        var_dump("===============================================",
            $this->population->members[0]->cost,
            $this->population->members[1]->cost,
            "==============================================="
        );

        $this->population->sort();

        var_dump("===============================================",
            $this->population->members[0]->cost,
            $this->population->members[1]->cost,
            "==============================================="
        );

        $children  = $this->population->members[0]->mate($this->population->members[1]);
        $children2 = $this->population->members[2]->mate($this->population->members[3]);
        $children3 = $this->population->members[4]->mate($this->population->members[5]);

        array_splice($this->population->members, count($this->population->members)-2, 2, $children);
        array_splice($this->population->members, count($this->population->members)-4, 2, $children2);
        array_splice($this->population->members, count($this->population->members)-6, 2, $children3);

        unset($children);
        unset($children2);
        unset($children3);

        for ($i=0; $i < count($this->population->members); $i++) {
            $this->population->members[$i]->mutate(0.5);
        }

        $this->syncRedis();
        $this->ResetRedisValues();

        $this->population->generationNumber++;
    }

    private function syncRedis()
    {
        $keys = $this->redis->keys("*");

        foreach ($keys as $code) {
            $memberIndex = $this->population->findGeneByCode($code);

            if(is_null($memberIndex)) {
                $this->redis->del($code);
            }
        }
    }

    private function ResetRedisValues()
    {
        foreach ($this->population->members as $index => $member) {
            $value = $this->redis->get($member->code);

            $this->redis->set($member->code, json_encode([
                $member->cost,
                false,
                false
            ]));
        }
    }
}

// Start TCP Server
$tcpServer = new \TcpServer(new \Processor($redis, $population));
$tcpServer->listen('0.0.0.0', '1313');

echo "Connected to Redis";
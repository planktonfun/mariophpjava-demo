<?php

/**
  * Usage
  * $population = new Population("Hello, world!", 20);
  * $population->generation();
  */

class Population
{
  /**
   * [__construct description]
   * @param [type] $goal [description]
   * @param [type] $size [description]
   */
  public function __construct($goal = null, $size = null, $redis=null)
  {
      $this->members = [];
      $this->goal = $goal;
      $this->generationNumber = 0;
      $this->redis = $redis;
      $this->taken = false;
      $this->calculated = false;
      $this->size = $size;

      $redis = $this->redis;
      $keys  = $redis->keys('*');

      if(count($keys) > 3) {
          foreach ($keys as $key) {
            $gene = new Gene($key);
            $this->members[] = $gene;
          }
      } else {
        for ($i=0; $i < $this->size; $i++) {
          $gene = new Gene();
          $gene->random(strlen($this->goal));
          $this->members[] = $gene;
        }
      }

      $this->saveToRedis();
  }

  /**
   * [findByCode description]
   * @return Gene
   */
  public function findGeneByCode($code)
  {
    $response = null;
    foreach ($this->members as $index => $value) {
      if ($value->code == $code) {
        $response = $index;
        break;
      }
    }

    return $response;
  }

  // Save to Redis
  private function saveToRedis()
  {
      $redis = $this->redis;
      $keys  = $redis->keys('*');
      if (count($keys) < $this->size) {
          foreach ($this->members as $index => $member) {
              $value = $redis->get($member->code);
              if (is_null($value)) {
                  $redis->set($member->code, json_encode([
                      $member->cost,
                      $this->calculated,
                      $this->taken
                  ]));
              }
          }
      }
  }

  /**
   * [display description]
   * @return [type] [description]
   */
  public function display()
  {
    echo PHP_EOL . "Generation: ". $this->generationNumber;
    foreach ($this->members as $key => $value) {
      echo PHP_EOL . $value->code .  "(". $value->cost . ")".  "(". strlen($value->code) . ")". $this->generationNumber;
    }
  }

  /**
   * [sortDesc description]
   * @param  [type] $a [description]
   * @param  [type] $b [description]
   * @return [type]    [description]
   */
  public function sortDesc($a,$b)
  {
    return ($a->cost > $b->cost) ? -1 : 1;
  }

  /**
   * [sort description]
   * @return [type] [description]
   */
  public function sort()
  {
    usort($this->members,[$this, "sortDesc"]);
  }

  /**
   * [generation description]
   * @return [type] [description]
   */
  public function generation()
  {
    for ($i = 0; $i < count($this->members); $i++) {
        $this->members[$i]->calcCost($this->goal);
    }

    $this->sort();
    $this->display();

    $mates = floor($this->size*0.15);

    for ($i=0; $i < $mates; $i++) {
        $index    = $i*2;
        $children = $this->members[$index]->mate($this->members[$index+1]);
        array_splice($this->members, count($this->members)-($index+2), 2, $children);
        unset($children);
    }

    unset($children);
    unset($children2);
    unset($children3);

    for ($i=0; $i < count($this->members); $i++) {
        $this->members[$i]->mutate(0.5);
        $this->members[$i]->calcCost($this->goal);
        if ($this->members[$i]->code == $this->goal) {
            $this->sort();
            $this->display();
            return true;
        }
    }

    $this->generationNumber++;
    $this->generation();
  }
}
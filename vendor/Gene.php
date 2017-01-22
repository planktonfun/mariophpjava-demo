<?php
class Gene
{
    /**
     * [$characterCollection description]
     * @var [type]
     */
    protected $characterCollection;

    /**
     * [$code description]
     * @var string
     */
    public $code = "";

    /**
     * [__construct description]
     * @param [type] $code [description]
     * map:
     * 6 is 1 and 2 actions combined
     * 7 is 1 and 3 actions combined
     * 8 is 1 and 5 actions combined
     * 9 is 2 and 3 actions combined
     * A is 2 and 5 actions combined
     * B is 3 and 5 actions combined
     */
    public function __construct($code = null)
    {
      $this->characterCollection = "123506789AB";

      if (!is_null($code)) {
          $this->code = $code;
      }

      $this->cost = 0;
    }

    /**
     * [random description]
     * @param  [type] $length [description]
     * @return [type]         [description]
     */
    public function random($length = null)
    {
      for ($i=0; $i < $length; $i++) {
        $this->code .= $this->randomCharacter();
      }
    }

    /**
     * [randomCharacter description]
     * @return [type] [description]
     */
    private function randomCharacter()
    {
      return substr(
        str_shuffle($this->characterCollection),
      -1);
    }

    /**
     * [getShiftLetters description]
     * @param  [type] $upOrDown [description]
     * @return [type]           [description]
     */
    private function getShiftLetters($currentCharacter, $upOrDown)
    {
      $haystack = $this->characterCollection;
      $index    = $this->getStringIndex($currentCharacter);

      if ($index == (strlen($haystack)-1)) {
        return substr($haystack,0,1);
      }
      return substr($haystack, ($index + $upOrDown), 1);
    }

    /**
     * [mutate description]
     * @param  [type] $chance [description]
     * @return [type]         [description]
     */
    public function mutate($chance)
    {
      if (rand(0,99) > ($chance*100)) {
        return ;
      }

      $index     = rand(0, strlen($this->code)-1);
      $upOrDown  = (rand(0,99) >= 50) ? -1 : 1;
      $newChar   = $this->getShiftLetters($this->code[$index], $upOrDown);
      $newString = "";

      for ($i=0; $i < strlen($this->code); $i++) {
          if ($i == $index) {
            $newString .= $newChar;
          } else {
            $newString .= $this->code[$i];
          }
      }

      $this->code = $newString;
    }

    /**
     * [mate description]
     * @param  Gene   $gene [description]
     * @return [type]       [description]
     */
    public function mate(Gene $gene)
    {
      $pivot  = strlen($this->code)/2;
      $child1 = substr($this->code,0,$pivot) . substr($gene->code,$pivot);
      $child2 = substr($gene->code,0,$pivot) . substr($this->code,$pivot);

      return [
        new Gene($child1),
        new Gene($child2)
      ];
    }

    /**
     * [calcCost description]
     * @param  [type] $compareTo [description]
     * @return [type]            [description]
     */
    public function calcCost($compareTo)
    {
      $total = 0;

      for ($i=0; $i < strlen($this->code); $i++) {
          $stringDistance = $this->getStringDistance($this->code[$i], $compareTo[$i]);

          $total += $stringDistance*$stringDistance;
      }

      $this->cost = $total;
    }

    /**
     * [getStringDistance description]
     * @param  [type] $a [description]
     * @param  [type] $b [description]
     * @return [type]    [description]
     */
    private function getStringDistance($a, $b)
    {
      return abs($this->getStringIndex($a) - $this->getStringIndex($b));
    }

    /**
     * [getStringIndex description]
     * @param  [type] $string [description]
     * @return [type]         [description]
     */
    private function getStringIndex($string)
    {
      return strpos($this->characterCollection, $string);
    }
}
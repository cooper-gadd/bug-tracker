<?php

class Priority
{
  public $id;
  public $priority;

  public function __construct(int $id, string $priority)
  {
    $this->id = $id;
    $this->priority = $priority;
  }

  // Add CRUD methods here
}

?>

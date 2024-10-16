<?php

class Priority
{
  public $id;
  public $priority;

  public function __construct($id = null, $priority = "")
  {
    $this->id = $id;
    $this->priority = $priority;
  }

  // Add CRUD methods here
}

?>

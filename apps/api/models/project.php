<?php

class Project
{
  public $id;
  public $project;

  public function __construct($id = null, $project = "")
  {
    $this->id = $id;
    $this->project = $project;
  }

  // Add CRUD methods here
}

?>

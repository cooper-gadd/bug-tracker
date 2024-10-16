<?php

class Project
{
  public $id;
  public $project;

  public function __construct(int $id, string $project)
  {
    $this->id = $id;
    $this->project = $project;
  }

  // Add CRUD methods here
}

?>

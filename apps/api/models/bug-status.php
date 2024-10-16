<?php

class BugStatus
{
  public $id;
  public $status;

  public function __construct(int $id, string $status)
  {
    $this->id = $id;
    $this->status = $status;
  }

  // Add CRUD methods here
}

?>

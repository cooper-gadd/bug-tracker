<?php

class BugStatus
{
  public $id;
  public $status;

  public function __construct($id = null, $status = "")
  {
    $this->id = $id;
    $this->status = $status;
  }

  // Add CRUD methods here
}

?>

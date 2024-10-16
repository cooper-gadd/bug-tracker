<?php

class Role
{
  public $id;
  public $role;

  public function __construct($id = null, $role = "")
  {
    $this->id = $id;
    $this->role = $role;
  }

  // Add CRUD methods here
}

?>

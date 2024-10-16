<?php

class Role
{
  public $id;
  public $role;

  public function __construct(int $id, string $role)
  {
    $this->id = $id;
    $this->role = $role;
  }

  // Add CRUD methods here
}

?>

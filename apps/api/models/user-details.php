<?php

class UserDetails
{
  public $id;
  public $username;
  public $roleId;
  public $projectId;
  public $password;
  public $name;

  public function __construct(
    int $id,
    string $username,
    int $roleId,
    ?int $projectId,
    string $password,
    string $name
  ) {
    $this->id = $id;
    $this->username = $username;
    $this->roleId = $roleId;
    $this->projectId = $projectId;
    $this->password = $password;
    $this->name = $name;
  }

  // Add CRUD methods here
}

?>

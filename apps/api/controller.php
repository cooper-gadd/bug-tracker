<?php

include "db.php";

class Controller
{
  private $db;

  public function __construct()
  {
    $this->db = (new DB())->getConnection();
  }

  public function getUsers(): void
  {
    $sql = "SELECT * FROM user_details";
    $stmt = $this->db->query($sql);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
  }

  public function getUsersByProjectId(int $projectId): void
  {
    $sql = "SELECT * FROM user_details WHERE ProjectId = :project_id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([":project_id" => $projectId]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
  }

  public function getUserById(int $id): void
  {
    $sql = "SELECT * FROM user_details WHERE Id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([":id" => $id]);
    echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
  }

  public function createUser(
    string $username,
    int $roleId,
    ?int $projectId,
    string $password,
    string $name
  ): void {
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $sql =
      "INSERT INTO user_details (Username, RoleID, ProjectId, Password, Name) VALUES (:username, :roleId, :projectId, :password, :name)";
    $stmt = $this->db->prepare($sql);

    try {
      $stmt->execute([
        ":username" => $username,
        ":roleId" => $roleId,
        ":projectId" => $projectId,
        ":password" => $hashedPassword,
        ":name" => $name,
      ]);
      echo json_encode(["id" => $this->db->lastInsertId()]);
    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(["error" => $e->getMessage()]);
    }
  }

  public function updateUser(
    int $id,
    string $username,
    int $roleId,
    ?int $projectId,
    string $password,
    string $name
  ): void {
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $sql =
      "UPDATE user_details SET Username = :username, RoleID = :roleId, ProjectId = :projectId, Password = :password, Name = :name WHERE Id = :id";
    $stmt = $this->db->prepare($sql);

    try {
      $stmt->execute([
        ":id" => $id,
        ":username" => $username,
        ":roleId" => $roleId,
        ":projectId" => $projectId,
        ":password" => $hashedPassword,
        ":name" => $name,
      ]);
      echo json_encode(["success" => true]);
    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(["error" => $e->getMessage()]);
    }
  }

  public function deleteUser(int $id): void
  {
    $sql = "DELETE FROM user_details WHERE Id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([":id" => $id]);
    echo json_encode(["success" => true]);
  }
}

?>

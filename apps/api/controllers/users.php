<?php

class UsersController
{
  private $db;

  public function __construct()
  {
    try {
      $this->db = new PDO(
        "mysql:host=" . $_SERVER["DB_HOST"] . ";dbname=" . $_SERVER["DB_NAME"],
        $_SERVER["DB_USER"],
        $_SERVER["DB_PASS"]
      );
      $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
      die("Connection failed: " . $e->getMessage());
    }
  }

  public function getUsers(): void
  {
    $sql = "SELECT * FROM user_details";
    $stmt = $this->db->query($sql);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
  }

  public function getUser(int $id): void
  {
    $sql = "SELECT * FROM user_details WHERE id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([":id" => $id]);
    echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
  }

  /**
   * @param array<int,mixed> $data
   */
  public function createUser(array $data): void
  {
    $columns = implode(", ", array_keys($data));
    $placeholders = ":" . implode(", :", array_keys($data));
    $sql = "INSERT INTO user_details ($columns) VALUES ($placeholders)";
    $stmt = $this->db->prepare($sql);
    $stmt->execute($data);
    echo json_encode(["id" => $this->db->lastInsertId()]);
  }

  public function deleteUser(int $id): void
  {
    $sql = "DELETE FROM user_details WHERE id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([":id" => $id]);
    echo json_encode(["success" => true]);
  }
}

?>

<?php

class DB
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
      $this->dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
      die("Connection failed: " . $e->getMessage());
    }
  }

  public static function list(string $table): array
  {
    $sql = "SELECT * FROM $table";
    $stmt = $this->db->query($sql);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public static function retrieve(string $table, int $id): array|false
  {
    $sql = "SELECT * FROM $table WHERE id = :id";
    $stmt = $this->dbh->prepare($sql);
    $stmt->execute([":id" => $id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  /**
   * @param array<int,mixed> $data
   */
  public static function insert(string $table, array $data): int
  {
    $columns = implode(", ", array_keys($data));
    $placeholders = ":" . implode(", :", array_keys($data));
    $sql = "INSERT INTO $table ($columns) VALUES ($placeholders)";
    $stmt = $this->dbh->prepare($sql);
    $stmt->execute($data);
    return $this->dbh->lastInsertId();
  }

  /**
   * @param array<int,mixed> $data
   */
  public static function update(string $table, int $id, array $data): bool
  {
    $set = implode(
      ", ",
      array_map(fn($key) => "$key = :$key", array_keys($data))
    );
    $sql = "UPDATE $table SET $set WHERE id = :id";
    $data["id"] = $id;
    $stmt = $this->dbh->prepare($sql);
    return $stmt->execute($data);
  }

  public static function delete(string $table, int $id): bool
  {
    $sql = "DELETE FROM $table WHERE id = :id";
    $stmt = $this->dbh->prepare($sql);
    return $stmt->execute([":id" => $id]);
  }
}

?>

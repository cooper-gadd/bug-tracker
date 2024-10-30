<?php

class Controller
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
      $this->db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
      $this->db->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, false);
    } catch (PDOException $e) {
      die("Connection failed: " . $e->getMessage());
    }
  }

  public function getBugs(): void
  {
    $sql = "
        SELECT
          b.id,
          p.project,
          p.id AS projectId,
          u1.name AS owner,
          u2.name AS assignedTo,
          u2.id AS assignedToId,
          bs.status,
          pr.priority,
          b.summary,
          b.description,
          b.fixDescription AS fixDescription,
          b.dateRaised,
          b.targetDate,
          b.dateClosed
        FROM
          bugs b
        LEFT JOIN
          project p ON b.projectId = p.id
        LEFT JOIN
          user_details u1 ON b.ownerId = u1.id
        LEFT JOIN
          user_details u2 ON b.assignedToId = u2.id
        LEFT JOIN
          bug_status bs ON b.statusId = bs.id
        LEFT JOIN
          priority pr ON b.priorityId = pr.id
      ";
    $stmt = $this->db->query($sql);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
  }

  public function getProjects(): void
  {
    $sql = "SELECT id, project FROM project ORDER BY project";
    $stmt = $this->db->query($sql);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
  }

  public function createProject(string $project): void
  {
    $sql = "INSERT INTO project (project) VALUES (:project)";
    $stmt = $this->db->prepare($sql);
    try {
      $stmt->execute([":project" => $project]);
      echo json_encode(["id" => $this->db->lastInsertId()]);
    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(["error" => $e->getMessage()]);
    }
  }

  public function getRoles(): void
  {
    $sql = "SELECT id, role FROM role ORDER BY role";
    $stmt = $this->db->query($sql);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
  }

  public function assign(int $bugId, int $assignedToId): void
  {
    $sql =
      "UPDATE bugs SET assignedToId = :assignedToId, statusId = 2 WHERE id = :bugId";
    $stmt = $this->db->prepare($sql);
    try {
      $stmt->execute([
        ":assignedToId" => $assignedToId,
        ":bugId" => $bugId,
      ]);
      echo json_encode(["success" => true]);
    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(["error" => $e->getMessage()]);
    }
  }

  public function close(int $bugId, string $fixDescription): void
  {
    $sql =
      "UPDATE bugs SET statusId = 3, fixDescription = :fixDescription, dateClosed = now() WHERE id = :bugId";
    $stmt = $this->db->prepare($sql);
    try {
      $stmt->execute([
        ":fixDescription" => $fixDescription,
        ":bugId" => $bugId,
      ]);
      echo json_encode(["success" => true]);
    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(["error" => $e->getMessage()]);
    }
  }

  public function getUsers(): void
  {
    $sql = "SELECT
    ud.id,
    ud.username,
    r.role,
    p.project,
    ud.name
    FROM
    user_details ud
    LEFT JOIN
    role r ON ud.RoleID = r.id
    LEFT JOIN
    project p ON ud.ProjectId = p.id
    ORDER BY ud.name";
    $stmt = $this->db->query($sql);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
  }

  public function getUsersByProjectId(int $projectId): void
  {
    $sql =
      "SELECT id, name FROM user_details WHERE ProjectId = :project_id ORDER BY name";
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
    try {
      $this->db->beginTransaction();

      // remove from assignedToId in bugs
      $sql = "UPDATE bugs SET assignedToId = NULL WHERE assignedToId = :id";
      $stmt = $this->db->prepare($sql);
      $stmt->execute([":id" => $id]);

      // remove from ownerId in bugs and assign to admin
      $sql = "UPDATE bugs SET ownerId = 6 WHERE ownerId = :id";
      $stmt = $this->db->prepare($sql);
      $stmt->execute([":id" => $id]);

      // remove from user_details
      $sql = "DELETE FROM user_details WHERE Id = :id";
      $stmt = $this->db->prepare($sql);
      $stmt->execute([":id" => $id]);

      $this->db->commit();
      echo json_encode(["success" => true]);
    } catch (PDOException $e) {
      $this->db->rollBack();
      http_response_code(500);
      echo json_encode(["error" => $e->getMessage()]);
    }
  }
}

?>

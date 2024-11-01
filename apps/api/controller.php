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

  public function login(string $username, string $password): void
  {
    $sql =
      "SELECT id, username, password FROM user_details WHERE username = :username";
    $stmt = $this->db->prepare($sql);
    try {
      $stmt->execute(["username" => $username]);
      $user = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($user && password_verify($password, $user["password"])) {
        session_start();
        $_SESSION["user_id"] = $user["id"];
        http_response_code(200);
        echo json_encode(["success" => true]);
      } else {
        http_response_code(401);
        echo json_encode(["success" => false]);
      }
    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
  }

  public function logout(): void
  {
    unset($_SESSION["user_id"]);
    http_response_code(200);
    echo json_encode(["success" => true]);
  }

  public function getCurrentUser(): void
  {
    if (isset($_SESSION["user_id"])) {
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
              WHERE
                ud.id = :id";
      $stmt = $this->db->prepare($sql);
      $stmt->execute(["id" => $_SESSION["user_id"]]);
      echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    } else {
      http_response_code(401);
      echo json_encode(["error" => "Not logged in"]);
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
          bs.id AS statusId,
          pr.priority,
          pr.id AS priorityId,
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
        ORDER BY
          b.dateRaised DESC";
    $stmt = $this->db->query($sql);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
  }

  public function createBug(
    int $projectId,
    int $ownerId,
    int $priorityId,
    int $statusId,
    string $summary,
    string $description,
    ?string $assignedToId,
    ?string $targetDate
  ): void {
    if ($targetDate !== null) {
      $targetDate = date("Y-m-d H:i:s", strtotime($targetDate));
    }

    $sql =
      "INSERT INTO bugs (projectId, ownerId, priorityId, statusId, summary, description, assignedToId, targetDate) VALUES (:projectId, :ownerId, :priorityId, :statusId, :summary, :description, :assignedToId, :targetDate)";
    $stmt = $this->db->prepare($sql);
    try {
      $stmt->execute([
        ":projectId" => $projectId,
        ":ownerId" => $ownerId,
        ":priorityId" => $priorityId,
        ":statusId" => $statusId,
        ":summary" => $summary,
        ":description" => $description,
        ":assignedToId" => $assignedToId,
        ":targetDate" => $targetDate,
      ]);
      echo json_encode(["id" => $this->db->lastInsertId()]);
    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(["error" => $e->getMessage()]);
    }
  }

  public function updateBug(
    int $id,
    int $projectId,
    int $priorityId,
    int $statusId,
    string $summary,
    string $description,
    ?string $assignedToId,
    ?string $targetDate,
    ?string $fixDescription,
    ?string $dateClosed
  ): void {
    if ($targetDate !== null) {
      $targetDate = date("Y-m-d H:i:s", strtotime($targetDate));
    }
    if ($dateClosed !== null) {
      $dateClosed = date("Y-m-d H:i:s", strtotime($dateClosed));
    }

    $sql = "
      UPDATE bugs
      SET
        projectId = :projectId,
        priorityId = :priorityId,
        statusId = :statusId,
        summary = :summary,
        description = :description,
        assignedToId = :assignedToId,
        targetDate = :targetDate,
        fixDescription = :fixDescription,
        dateClosed = :dateClosed
      WHERE id = :id";
    $stmt = $this->db->prepare($sql);

    try {
      $stmt->execute([
        ":id" => $id,
        ":projectId" => $projectId,
        ":priorityId" => $priorityId,
        ":statusId" => $statusId,
        ":summary" => $summary,
        ":description" => $description,
        ":assignedToId" => $assignedToId,
        ":targetDate" => $targetDate,
        ":fixDescription" => $fixDescription,
        ":dateClosed" => $dateClosed,
      ]);
      echo json_encode(["success" => true]);
    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(["error" => $e->getMessage()]);
    }
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

  public function getPriorities(): void
  {
    $sql = "SELECT id, priority FROM priority ORDER BY priority";
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
      $sql = "UPDATE bugs SET ownerId = 10 WHERE ownerId = :id";
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

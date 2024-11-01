<?php

session_name("bug-tracker");
session_start();

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
      http_response_code(500);
      echo json_encode(["error" => "Connection failed: " . $e->getMessage()]);
      exit();
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
        $_SESSION["user_id"] = $user["id"];
        http_response_code(200);
        echo json_encode(["success" => true]);
      } else {
        http_response_code(401);
        echo json_encode([
          "success" => false,
          "error" => "Invalid credentials",
        ]);
      }
    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(["error" => $e->getMessage()]);
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
    if (!isset($_SESSION["user_id"])) {
      http_response_code(401);
      echo json_encode(["error" => "Not logged in"]);
      return;
    }

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
    if (!isset($_SESSION["user_id"])) {
      http_response_code(401);
      echo json_encode(["error" => "Not logged in"]);
      return;
    }

    $sql = "SELECT roleId, projectid from user_details where id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(["id" => $_SESSION["user_id"]]);
    $currentUserInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    $roleId = $currentUserInfo["roleId"];
    $projectId = $currentUserInfo["projectid"];
    $sql = "
        SELECT
          b.id,
          p.project,
          p.id AS projectId,
          u1.name AS owner,
          u1.id AS ownerId,
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
          priority pr ON b.priorityId = pr.id";
    if ($roleId === 3) {
      $stmt = $this->db->prepare(
        $sql . " WHERE p.id = :projectId AND b.statusId != 3"
      );
      $stmt->execute(["projectId" => $projectId]);
      echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } else {
      $stmt = $this->db->query($sql);
      echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
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
    if (!isset($_SESSION["user_id"])) {
      http_response_code(401);
      echo json_encode(["error" => "Not logged in"]);
      return;
    }

    $sql = "SELECT roleId, projectid from user_details where id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(["id" => $_SESSION["user_id"]]);
    $currentUserInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    $roleId = $currentUserInfo["roleId"];

    if ($roleId === 3 && $projectId !== $currentUserInfo["projectid"]) {
      http_response_code(403);
      echo json_encode(["error" => "Forbidden"]);
      return;
    }

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
      http_response_code(201);
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
    if (!isset($_SESSION["user_id"])) {
      http_response_code(401);
      echo json_encode(["error" => "Not logged in"]);
      return;
    }

    $sql = "SELECT roleId, projectid from user_details where id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(["id" => $_SESSION["user_id"]]);
    $currentUserInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    $roleId = $currentUserInfo["roleId"];

    $sql = "SELECT ownerId from bugs where id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(["id" => $id]);
    $ownerId = $stmt->fetch(PDO::FETCH_ASSOC);

    if (
      $roleId === 3 &&
      $projectId !== $currentUserInfo["projectid"] &&
      $ownerId !== $_SESSION["user_id"]
    ) {
      http_response_code(403);
      echo json_encode(["error" => "Forbidden"]);
      return;
    }

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
      http_response_code(200);
      echo json_encode(["success" => true]);
    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(["error" => $e->getMessage()]);
    }
  }

  public function getProjects(): void
  {
    if (!isset($_SESSION["user_id"])) {
      http_response_code(401);
      echo json_encode(["error" => "Not logged in"]);
      return;
    }

    $sql = "SELECT roleId, projectid from user_details where id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(["id" => $_SESSION["user_id"]]);
    $currentUserInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    $roleId = $currentUserInfo["roleId"];
    $projectId = $currentUserInfo["projectid"];

    $sql = "SELECT id, project FROM project ORDER BY project";
    $stmt = $this->db->query($sql);
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // only return user's project if not admin or manager
    if ($roleId === 3) {
      $projects = array_filter($projects, function ($project) use ($projectId) {
        return $project["id"] === $projectId;
      });
      $projects = array_values($projects);
    }

    echo json_encode($projects);
  }

  public function createProject(string $project): void
  {
    if (!isset($_SESSION["user_id"])) {
      http_response_code(401);
      echo json_encode(["error" => "Not logged in"]);
      return;
    }

    $sql = "SELECT roleId from user_details where id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(["id" => $_SESSION["user_id"]]);
    $currentUserInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    $roleId = $currentUserInfo["roleId"];

    if ($roleId === 3) {
      http_response_code(403);
      echo json_encode(["error" => "Forbidden"]);
      return;
    }

    $sql = "INSERT INTO project (project) VALUES (:project)";
    $stmt = $this->db->prepare($sql);
    try {
      $stmt->execute([":project" => $project]);
      http_response_code(201);
      echo json_encode(["id" => $this->db->lastInsertId()]);
    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(["error" => $e->getMessage()]);
    }
  }

  public function getRoles(): void
  {
    if (!isset($_SESSION["user_id"])) {
      http_response_code(401);
      echo json_encode(["error" => "Not logged in"]);
      return;
    }

    $sql = "SELECT roleId from user_details where id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(["id" => $_SESSION["user_id"]]);
    $currentUserInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    $roleId = $currentUserInfo["roleId"];

    if ($roleId !== 1) {
      http_response_code(403);
      echo json_encode(["error" => "Forbidden"]);
      return;
    }

    $sql = "SELECT id, role FROM role ORDER BY role";
    $stmt = $this->db->query($sql);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
  }

  public function getPriorities(): void
  {
    if (!isset($_SESSION["user_id"])) {
      http_response_code(401);
      echo json_encode(["error" => "Not logged in"]);
      return;
    }

    $sql = "SELECT roleId from user_details where id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(["id" => $_SESSION["user_id"]]);
    $currentUserInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    $roleId = $currentUserInfo["roleId"];

    $sql = "SELECT id, priority FROM priority ORDER BY priority";
    $stmt = $this->db->query($sql);
    $priorities = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // only return medium priority if not admin or manager
    if ($roleId === 3) {
      $priorities = array_filter($priorities, function ($priority) {
        return $priority["id"] === 2;
      });
      $priorities = array_values($priorities);
    }

    echo json_encode($priorities);
  }

  public function assign(int $bugId, int $assignedToId): void
  {
    if (!isset($_SESSION["user_id"])) {
      http_response_code(401);
      echo json_encode(["error" => "Not logged in"]);
      return;
    }

    $sql = "SELECT roleId from user_details where id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(["id" => $_SESSION["user_id"]]);
    $currentUserInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    $roleId = $currentUserInfo["roleId"];

    if ($roleId === 3) {
      http_response_code(403);
      echo json_encode(["error" => "Forbidden"]);
      return;
    }

    $sql =
      "UPDATE bugs SET assignedToId = :assignedToId, statusId = 2 WHERE id = :bugId";
    $stmt = $this->db->prepare($sql);
    try {
      $stmt->execute([
        ":assignedToId" => $assignedToId,
        ":bugId" => $bugId,
      ]);
      http_response_code(200);
      echo json_encode(["success" => true]);
    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(["error" => $e->getMessage()]);
    }
  }

  public function close(int $bugId, string $fixDescription): void
  {
    if (!isset($_SESSION["user_id"])) {
      http_response_code(401);
      echo json_encode(["error" => "Not logged in"]);
      return;
    }

    $sql =
      "UPDATE bugs SET statusId = 3, fixDescription = :fixDescription, dateClosed = now() WHERE id = :bugId";
    $stmt = $this->db->prepare($sql);
    try {
      $stmt->execute([
        ":fixDescription" => $fixDescription,
        ":bugId" => $bugId,
      ]);
      http_response_code(200);
      echo json_encode(["success" => true]);
    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(["error" => $e->getMessage()]);
    }
  }

  public function getUsers(): void
  {
    if (!isset($_SESSION["user_id"])) {
      http_response_code(401);
      echo json_encode(["error" => "Not logged in"]);
      return;
    }

    $sql = "SELECT roleId from user_details where id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(["id" => $_SESSION["user_id"]]);
    $currentUserInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    $roleId = $currentUserInfo["roleId"];

    if ($roleId !== 1) {
      http_response_code(403);
      echo json_encode(["error" => "Forbidden"]);
      return;
    }

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
    if (!isset($_SESSION["user_id"])) {
      http_response_code(401);
      echo json_encode(["error" => "Not logged in"]);
      return;
    }

    $sql = "SELECT roleId from user_details where id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(["id" => $_SESSION["user_id"]]);
    $currentUserInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    $roleId = $currentUserInfo["roleId"];

    $sql =
      "SELECT id, name FROM user_details WHERE ProjectId = :project_id ORDER BY name";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([":project_id" => $projectId]);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // if user, then only display current user
    if ($roleId === 3) {
      $users = array_filter($users, function ($user) {
        return $user["id"] === $_SESSION["user_id"];
      });
      $users = array_values($users);
    }
    echo json_encode($users);
  }

  public function createUser(
    string $username,
    int $roleId,
    ?int $projectId,
    string $password,
    string $name
  ): void {
    if (!isset($_SESSION["user_id"])) {
      http_response_code(401);
      echo json_encode(["error" => "Not logged in"]);
      return;
    }

    $sql = "SELECT roleId from user_details where id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(["id" => $_SESSION["user_id"]]);
    $currentUserInfo = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($currentUserInfo["roleId"] !== 1) {
      http_response_code(403);
      echo json_encode(["error" => "Forbidden"]);
      return;
    }

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
      http_response_code(201);
      echo json_encode(["id" => $this->db->lastInsertId()]);
    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(["error" => $e->getMessage()]);
    }
  }

  public function deleteUser(int $id): void
  {
    if (!isset($_SESSION["user_id"])) {
      http_response_code(401);
      echo json_encode(["error" => "Not logged in"]);
      return;
    }

    $sql = "SELECT roleId from user_details where id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(["id" => $_SESSION["user_id"]]);
    $currentUserInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    $roleId = $currentUserInfo["roleId"];

    if ($roleId !== 1) {
      http_response_code(403);
      echo json_encode(["error" => "Forbidden"]);
      return;
    }

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
      http_response_code(200);
      echo json_encode(["success" => true]);
    } catch (PDOException $e) {
      $this->db->rollBack();
      http_response_code(500);
      echo json_encode(["error" => $e->getMessage()]);
    }
  }

  public function init(): void
  {
    try {
      $this->db->beginTransaction();

      $this->db->exec("
      -- Create databases on Solace, only tables
      USE ctg7866;

      DROP TABLE IF EXISTS bugs;
      DROP TABLE IF EXISTS user_details;
      DROP TABLE IF EXISTS bug_status;
      DROP TABLE IF EXISTS priority;
      DROP TABLE IF EXISTS role;
      DROP TABLE IF EXISTS project;

      CREATE TABLE project
      (
       Id INT NOT NULL AUTO_INCREMENT,
       Project CHAR(50) NOT NULL,
       PRIMARY KEY(Id)
      ) ENGINE=InnoDB;
      INSERT INTO project (Project) values ('Zed'),('Cursor');

      CREATE TABLE role
      (
       Id INT NOT NULL AUTO_INCREMENT,
       Role VARCHAR(50) NOT NULL,
       PRIMARY KEY(Id)
      ) ENGINE=InnoDB;
      INSERT INTO role (Role) values ('Admin'),('Manager'),('User');

      CREATE TABLE user_details
      (
       Id INT NOT NULL AUTO_INCREMENT,
       Username CHAR(50) NOT NULL,
       RoleID INT NOT NULL,
       ProjectId INT NULL, -- manager and admin are null
       Password VARCHAR(100), -- must be hashed
       Name VARCHAR(250) NOT NULL,
       PRIMARY KEY(Id),
       KEY `fk_role` (`RoleId`),
       KEY `fk_project_assigned` (`ProjectId`),
       CONSTRAINT `fk_role` FOREIGN KEY (`RoleId`) REFERENCES `role` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
       CONSTRAINT `fk_project_assigned` FOREIGN KEY (`ProjectId`) REFERENCES `project` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB;
      INSERT INTO user_details (Username, RoleID, ProjectId, Password, Name) VALUES
      ('steve@me.me', 3, 1, 'me', 'Steve Jobs'),
      ('elon@me.me', 3, 1, 'me', 'Elon Musk'),
      ('bill@me.me', 3, 1, 'me', 'Bill Gates'),
      ('mark@me.me', 3, 2, 'me', 'Mark Zuckerberg'),
      ('jeff@me.me', 3, 2, 'me', 'Jeff Bezos'),
      ('larry@me.me', 3, 2, 'me', 'Larry Page'),
      ('marissa@me.me', 2, NULL, 'me', 'Marissa Mayer'),
      ('meg@me.me', 2, NULL, 'me', 'Meg Whitman'),
      ('michael@me.me', 2, NULL, 'me', 'Michael Dell'),
      ('sam@me.me', 1, NULL, 'me', 'Sam Altman');

      CREATE TABLE bug_status
      (
       Id INT NOT NULL AUTO_INCREMENT,
       Status CHAR(50) NOT NULL,
       PRIMARY KEY(Id)
      );
      INSERT INTO bug_status (Status) VALUES ('Unassigned'), ('Assigned'), ('Closed');

      CREATE TABLE priority
      (
       Id INT NOT NULL AUTO_INCREMENT,
       Priority VARCHAR(10) NOT NULL,
       PRIMARY KEY(Id)
      );
      INSERT INTO priority (Priority) VALUES ('Low'), ('Medium'), ('High'),('Urgent');

      CREATE TABLE `bugs` (
       `id` INT NOT NULL AUTO_INCREMENT,
       `projectId` INT NOT NULL,
       `ownerId` INT NOT NULL,
       `assignedToId` INT NULL,
       `statusId` INT NOT NULL,
       `priorityId` INT NOT NULL,
       `summary` VARCHAR(250) NOT NULL,
       `description` VARCHAR(2500) NOT NULL,
       `fixDescription` VARCHAR(2500) DEFAULT NULL,
       `dateRaised` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       `targetDate` timestamp NULL DEFAULT NULL,
       `dateClosed` timestamp NULL DEFAULT NULL,
       PRIMARY KEY (`id`),
       KEY `fk_project` (`projectId`),
       KEY `fk_owner` (`ownerId`),
       KEY `fk_assigned` (`assignedToId`),
       KEY `fk_status` (`statusId`),
       KEY `fk_priority` (`priorityId`),
       CONSTRAINT `fk_project` FOREIGN KEY (`projectId`) REFERENCES `project` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
       CONSTRAINT `fk_owner` FOREIGN KEY (`ownerId`) REFERENCES `user_details` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
       CONSTRAINT `fk_assigned` FOREIGN KEY (`assignedToId`) REFERENCES `user_details` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
       CONSTRAINT `fk_status` FOREIGN KEY (`statusId`) REFERENCES `bug_status` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
       CONSTRAINT `fk_priority` FOREIGN KEY (`priorityId`) REFERENCES `priority` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;

      INSERT INTO bugs (projectId, ownerId, assignedToId, statusId, priorityId, summary, description, fixDescription, dateRaised, targetDate, dateClosed) VALUES
      ('1', '1', null, '1', '1', 'SQL Format', 'Formatting fails with default prettier instance.', null, '2023-10-30T07:01:07', null, null),
      ('1', '2', null, '1', '2', 'Formatting Large Files', 'Massive files with thousands of lines do not format.', null, '2023-11-02T02:24:35', null, null),
      ('1', '3', null, '1', '3', 'Remote ssh needs Zed', 'Remoting into Solace does not work since it needs Zed installed.', null, '2023-05-01T00:07:14', null, null),
      ('1', '7', '1', '2', '4', 'Lack of Java project menu', 'There is no Java project menu so I need to use my terminal.', null, '2023-03-19T13:43:02', '2023-03-20T13:43:02', null),
      ('1', '7', '2', '2', '1', 'Terminal cursor takes too long to change', 'When I open my terminal it starts as a block then changes to skinny.', null, '2023-09-01T08:15:38', '2023-09-22T20:37:32', null),
      ('1', '8', '3', '2', '2', 'Logged out', 'Randomly I get logged out.', null, '2023-03-14T13:50:51', null, null),
      ('1', '8', '1', '2', '3', 'Changing username', 'There is no way for me to change my username.', null, '2024-03-04T19:43:43', '2024-10-12T00:44:27', null),
      ('1', '9', '2', '2', '4', 'Vim mode page command', 'When I use ctrl u or d I want the zz command after to center the cursor.', null, '2023-02-05T23:22:18', '2023-02-06T23:22:18', null),
      ('1', '9', '3', '2', '1', 'Add Model support to inline completions', 'Copilot is mid right now so users need to be able to add thier own models for completion.', null, '2023-06-29T06:57:28', '2023-06-30T06:57:28', null),
      ('1', '10', '1', '3', '2', 'File icons in tabs', 'The icons need to be shown.', 'FIle icons now are shown', '2023-08-04T18:11:34', '2023-08-05T18:11:34', null),
      ('2', '4', null, '1', '3', 'Python extension spam', 'I am getting spammed with do I want to install Python extension.', null, '2023-10-03T11:17:12', null, null),
      ('2', '5', null, '1', '4', 'App is slow', 'Can we please do a rust rewrite', null, '2023-05-19T06:54:40', null, null),
      ('2', '6', null, '1', '1', 'We need to charge more', 'VS*ode is one update away from replacing us.', null, '2024-06-20T01:39:47', null, null),
      ('2', '7', '4', '2', '2', 'Get more VC funding', 'If we just yell a bunch of buzzwords people will give us money!', null, '2024-05-19T19:59:44', '2024-12-14T08:42:28', null),
      ('2', '7', '5', '2', '3', 'Fork Zed', 'We will call it Ced.', null, '2023-12-03T17:13:43', '2024-11-15T16:33:33', null),
      ('2', '8', '6', '2', '4', 'Funny Twitter', 'We need a funny twitter admin.', null, '2024-09-28T23:21:22', null, null),
      ('2', '8', '4', '2', '1', 'Fire engineers', 'Idk we are being replaced', null, '2024-04-23T22:44:07', '2024-04-24T22:44:07', null),
      ('2', '9', '5', '2', '2', 'Halloween Icon', 'We need a scary icon for the holiday', null, '2024-05-29T00:25:17', '2024-12-01T14:06:47', null),
      ('2', '9', '6', '2', '3', 'Cash out', 'Our time has come to get that bag', null, '2023-06-01T01:11:33', null, null),
      ('2', '10', '4', '3', '4', 'Fork VS*ode', 'Idk they did it all.', 'Yup we did it', '2023-03-24T10:03:26', '2023-03-25T20:50:45', '2023-03-26T20:50:45');
      ");

      $this->hashAllPasswords();
      $this->db->commit();
      http_response_code(200);
      echo json_encode([
        "success" => true,
        "message" => "Database seeded successfully",
      ]);
    } catch (PDOException $e) {
      $this->db->rollBack();
      http_response_code(500);
      echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
  }

  public function hashAllPasswords(): void
  {
    $sql = "SELECT id, password FROM user_details LIMIT 10";
    $stmt = $this->db->prepare($sql);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($users as $user) {
      $hashedPassword = password_hash($user["password"], PASSWORD_BCRYPT);
      $sql = "UPDATE user_details SET password = :password WHERE id = :id";
      $stmt = $this->db->prepare($sql);
      $stmt->execute(["password" => $hashedPassword, "id" => $user["id"]]);
    }
  }
}

?>

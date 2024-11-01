<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
  http_response_code(200);
  exit();
}

require_once "controller.php";
require_once "seed.php";

$controller = new Controller();
$seed = new Seed();
$requestMethod = $_SERVER["REQUEST_METHOD"];
$requestUri = $_SERVER["REQUEST_URI"];
$baseUri = "/~ctg7866/ISTE341/bug-tracker/api";

function route(string $uriPattern, string $method, callable $callback): void
{
  global $baseUri, $requestUri, $requestMethod;

  $pattern =
    "@^" .
    preg_replace("/\{[^\}]+\}/", "([^/]+)", $baseUri . $uriPattern) .
    "$@";
  if (
    preg_match($pattern, $requestUri, $matches) &&
    $requestMethod === $method
  ) {
    array_shift($matches);
    $callback(...$matches);
    exit();
  }
}

route("/", "GET", function () use ($seed) {
  $seed->init();
});

route("/login", "POST", function () use ($controller) {
  $data = json_decode(file_get_contents("php://input"), true);
  $username = $data["username"];
  $password = $data["password"];
  $controller->login($username, $password);
});

route("/logout", "POST", function () use ($controller) {
  $controller->logout();
});

route("/current-user", "GET", function () use ($controller) {
  $controller->getCurrentUser();
});

route("/bugs", "GET", function () use ($controller) {
  $controller->getBugs();
});

route("/bug", "POST", function () use ($controller) {
  $data = json_decode(file_get_contents("php://input"), true);
  $projectId = $data["projectId"];
  $ownerId = $data["ownerId"];
  $priorityId = $data["priorityId"];
  $statusId = $data["statusId"];
  $summary = $data["summary"];
  $description = $data["description"];
  $assignedToId = $data["assignedToId"] ?? null;
  $targetDate = $data["targetDate"] ?? null;
  $controller->createBug(
    (int) $projectId,
    (int) $ownerId,
    (int) $priorityId,
    (int) $statusId,
    $summary,
    $description,
    $assignedToId,
    $targetDate
  );
});

route("/bug/{id}", "PUT", function ($bugId) use ($controller) {
  $data = json_decode(file_get_contents("php://input"), true);
  $projectId = $data["projectId"];
  $priorityId = $data["priorityId"];
  $statusId = $data["statusId"];
  $summary = $data["summary"];
  $description = $data["description"];
  $assignedToId = $data["assignedToId"] ?? null;
  $targetDate = $data["targetDate"] ?? null;
  $fixDescription = $data["fixDescription"] ?? null;
  $dateClosed = $data["dateClosed"] ?? null;
  $controller->updateBug(
    (int) $bugId,
    (int) $projectId,
    (int) $priorityId,
    (int) $statusId,
    $summary,
    $description,
    $assignedToId,
    $targetDate,
    $fixDescription,
    $dateClosed
  );
});

route("/projects", "GET", function () use ($controller) {
  $controller->getProjects();
});

route("/project", "POST", function () use ($controller) {
  $data = json_decode(file_get_contents("php://input"), true);
  $project = $data["project"];
  $controller->createProject($project);
});

route("/roles", "GET", function () use ($controller) {
  $controller->getRoles();
});

route("/priorities", "GET", function () use ($controller) {
  $controller->getPriorities();
});

route("/assign", "POST", function () use ($controller) {
  $data = json_decode(file_get_contents("php://input"), true);
  $bugId = $data["bugId"];
  $assignedToId = $data["assignedToId"];
  $controller->assign((int) $bugId, (int) $assignedToId);
});

route("/close", "POST", function () use ($controller) {
  $data = json_decode(file_get_contents("php://input"), true);
  $bugId = $data["bugId"];
  $fixDescription = $data["fixDescription"];
  $controller->close((int) $bugId, $fixDescription);
});

route("/users", "GET", function () use ($controller) {
  $controller->getUsers();
});

route("/users/project/{projectId}", "GET", function ($projectId) use (
  $controller
) {
  $controller->getUsersByProjectId((int) $projectId);
});

route("/user/{id}", "GET", function ($userId) use ($controller) {
  $controller->getUserById((int) $userId);
});

route("/user", "POST", function () use ($controller) {
  $data = json_decode(file_get_contents("php://input"), true);
  $username = $data["username"];
  $roleId = $data["roleId"];
  $projectId = $data["projectId"] ?? null;
  $password = $data["password"];
  $name = $data["name"];
  $controller->createUser($username, $roleId, $projectId, $password, $name);
});

route("/user/{id}", "PUT", function ($userId) use ($controller) {
  $data = json_decode(file_get_contents("php://input"), true);
  $username = $data["Username"];
  $roleId = $data["RoleID"];
  $projectId = $data["ProjectId"] ?? null;
  $password = $data["Password"];
  $name = $data["Name"];
  $controller->updateUser(
    (int) $userId,
    $username,
    $roleId,
    $projectId,
    $password,
    $name
  );
});

// RIT Solace Server does not support DELETE method
route("/user/delete/{id}", "GET", function ($userId) use ($controller) {
  $controller->deleteUser((int) $userId);
});

http_response_code(404);
echo json_encode(["message" => "Endpoint not found"]);
?>

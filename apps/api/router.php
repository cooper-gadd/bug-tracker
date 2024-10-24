<?php
require_once "controller.php";

$controller = new Controller();
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
  $controller->createUser($_POST);
});

route("/user/{id}", "DELETE", function ($userId) use ($controller) {
  $controller->deleteUser((int) $userId);
});

http_response_code(404);
echo json_encode(["message" => "Endpoint not found"]);
?>

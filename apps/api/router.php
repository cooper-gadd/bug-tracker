<?php
require_once "controllers/users.php";

$requestMethod = $_SERVER["REQUEST_METHOD"];
$requestUri = $_SERVER["REQUEST_URI"];

$usersController = new UsersController();

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

route("/users", "GET", function () use ($usersController) {
  $usersController->getUsers();
});

route("/users", "POST", function () use ($usersController) {
  $usersController->createUser($_POST);
});

route("/users/{id}", "GET", function ($userId) use ($usersController) {
  $usersController->getUser((int) $userId);
});

route("/users/{id}", "DELETE", function ($userId) use ($usersController) {
  $usersController->deleteUser((int) $userId);
});

http_response_code(404);
echo json_encode(["message" => "Endpoint not found"]);
?>

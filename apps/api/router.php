<?php
require_once "controllers/users.php";

$requestMethod = $_SERVER["REQUEST_METHOD"];
$requestUri = $_SERVER["REQUEST_URI"];

$usersController = new UsersController();

if (
  $requestUri === "/~ctg7866/ISTE341/bug-tracker/api/users" &&
  $requestMethod === "GET"
) {
  $usersController->getUsers();
} elseif (
  $requestUri === "/~ctg7866/ISTE341/bug-tracker/api/users" &&
  $requestMethod === "POST"
) {
  $usersController->createUser($_POST);
} elseif (
  preg_match(
    "/\/~ctg7866\/ISTE341\/bug-tracker\/api\/users\/(\d+)/",
    $requestUri,
    $matches
  ) &&
  $requestMethod === "GET"
) {
  $userId = $matches[1];
  $usersController->getUser($userId);
} elseif (
  preg_match(
    "/\/~ctg7866\/ISTE341\/bug-tracker\/api\/users\/(\d+)/",
    $requestUri,
    $matches
  ) &&
  $requestMethod === "DELETE"
) {
  $userId = $matches[1];
  $usersController->deleteUser($userId);
} else {
  http_response_code(404);
  echo json_encode(["message" => "Endpoint not found"]);
}
?>

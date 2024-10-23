<?php

require_once "controllers/users.php";

$requestMethod = $_SERVER["REQUEST_METHOD"];
$uri = $_SERVER["REQUEST_URI"];

if ($requestMethod === "GET" && $uri === "/users") {
  UsersController::getUsers();
}

if ($requestMethod === "GET" && preg_match("/\/users\/\d+/", $uri)) {
  $id = explode("/", $uri)[2];
  UsersController::getUser($id);
}

if ($requestMethod === "POST" && $uri === "/users") {
  $data = json_decode(file_get_contents("php://input"), true);
  UsersController::createUser($data);
}

if ($requestMethod === "DELETE" && preg_match("/\/users\/\d+/", $uri)) {
  $id = explode("/", $uri)[2];
  UsersController::deleteUser($id);
}
?>

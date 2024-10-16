<?php
require_once __DIR__ . "/../db/db.php";

class UserDetailsModel
{
  public $id;
  public $username;
  public $roleId;
  public $projectId;
  public $password;
  public $name;

  private static $table = "user_details";

  public function __construct(
    int $id,
    string $username,
    int $roleId,
    ?int $projectId,
    string $password,
    string $name
  ) {
    $this->id = $id;
    $this->username = $username;
    $this->roleId = $roleId;
    $this->projectId = $projectId;
    $this->password = $password;
    $this->name = $name;
  }

  public static function list(): array
  {
    return DB::list(self::$table);
  }

  public static function retrieve(int $id): array|false
  {
    return DB::retrieve(self::$table, $id);
  }

  /**
   * @param array<int,mixed> $data
   */
  public static function insert(array $data): int
  {
    return DB::insert(self::$table, $data);
  }

  /**
   * @param array<int,mixed> $data
   */
  public static function update(int $id, array $data): bool
  {
    return DB::update(self::$table, $id, $data);
  }

  public static function delete(int $id): bool
  {
    return DB::delete(self::$table, $id);
  }
}
?>

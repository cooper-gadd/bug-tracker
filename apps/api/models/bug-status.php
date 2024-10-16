<?php
require_once __DIR__ . "/../db/db.php";

class BugStatusModel
{
  public $id;
  public $status;

  private static $table = "bug_status";

  public function __construct(int $id, string $status)
  {
    $this->id = $id;
    $this->status = $status;
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

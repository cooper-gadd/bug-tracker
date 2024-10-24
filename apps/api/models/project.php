<?php
require_once __DIR__ . "/../db/db.php";

class ProjectModel
{
  public $id;
  public $project;

  private static $table = "project";

  public function __construct(int $id, string $project)
  {
    $this->id = $id;
    $this->project = $project;
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

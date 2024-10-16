<?php
require_once __DIR__ . "/../db/db.php";

class BugModel
{
  public $id;
  public $projectId;
  public $ownerId;
  public $assignedToId;
  public $statusId;
  public $priorityId;
  public $summary;
  public $description;
  public $fixDescription;
  public $dateRaised;
  public $targetDate;
  public $dateClosed;

  private static $table = "bugs";

  public function __construct(
    int $id,
    int $projectId,
    int $ownerId,
    ?int $assignedToId,
    int $statusId,
    int $priorityId,
    string $summary,
    string $description,
    ?string $fixDescription,
    DateTime $dateRaised,
    ?DateTime $targetDate,
    ?DateTime $dateClosed
  ) {
    $this->id = $id;
    $this->projectId = $projectId;
    $this->ownerId = $ownerId;
    $this->assignedToId = $assignedToId;
    $this->statusId = $statusId;
    $this->priorityId = $priorityId;
    $this->summary = $summary;
    $this->description = $description;
    $this->fixDescription = $fixDescription;
    $this->dateRaised = $dateRaised;
    $this->targetDate = $targetDate;
    $this->dateClosed = $dateClosed;
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

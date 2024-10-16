<?php

class Bug
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

  // Add CRUD methods here
}

?>

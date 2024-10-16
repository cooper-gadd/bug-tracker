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
    $id = null,
    $projectId = null,
    $ownerId = null,
    $assignedToId = null,
    $statusId = null,
    $priorityId = null,
    $summary = "",
    $description = "",
    $fixDescription = null,
    $dateRaised = null,
    $targetDate = null,
    $dateClosed = null
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

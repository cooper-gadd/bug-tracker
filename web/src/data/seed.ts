import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";

import { Project, Role, UserDetails, BugStatus, Priority, Bug } from "./schema";

const randomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

const projects: Project[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  project: faker.company.name(),
}));

const roles: Role[] = [
  { id: 1, role: "Admin" },
  { id: 2, role: "Manager" },
  { id: 3, role: "User" },
];

const userDetails: UserDetails[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  username: faker.internet.userName(),
  roleId: faker.helpers.arrayElement([1, 2, 3]),
  projectId: faker.helpers.arrayElement([...projects.map((p) => p.id), null]),
  password: faker.internet.password(), // TODO: hash
  name: faker.person.fullName(),
}));

const bugStatuses: BugStatus[] = [
  { id: 1, status: "Unassigned" },
  { id: 2, status: "Assigned" },
  { id: 3, status: "Closed" },
];

const priorities: Priority[] = [
  { id: 1, priority: "Low" },
  { id: 2, priority: "Medium" },
  { id: 3, priority: "High" },
  { id: 4, priority: "Urgent" },
];

const bugs: Bug[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  projectId: faker.helpers.arrayElement(projects).id,
  ownerId: faker.helpers.arrayElement(userDetails).id,
  assignedToId: faker.helpers.arrayElement([
    ...userDetails.map((u) => u.id),
    null,
  ]),
  statusId: faker.helpers.arrayElement(bugStatuses).id,
  priorityId: faker.helpers.arrayElement(priorities).id,
  summary: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  fixDescription: faker.datatype.boolean() ? faker.lorem.paragraph() : null,
  dateRaised: randomDate(new Date(2023, 0, 1), new Date()),
  targetDate: faker.datatype.boolean()
    ? randomDate(new Date(), new Date(2024, 11, 31))
    : null,
  dateClosed: faker.datatype.boolean()
    ? randomDate(new Date(2023, 0, 1), new Date())
    : null,
}));

const dataDir = path.join(__dirname, "seedData");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

fs.writeFileSync(
  path.join(dataDir, "projects.json"),
  JSON.stringify(projects, null, 2),
);
fs.writeFileSync(
  path.join(dataDir, "roles.json"),
  JSON.stringify(roles, null, 2),
);
fs.writeFileSync(
  path.join(dataDir, "userDetails.json"),
  JSON.stringify(userDetails, null, 2),
);
fs.writeFileSync(
  path.join(dataDir, "bugStatuses.json"),
  JSON.stringify(bugStatuses, null, 2),
);
fs.writeFileSync(
  path.join(dataDir, "priorities.json"),
  JSON.stringify(priorities, null, 2),
);
fs.writeFileSync(
  path.join(dataDir, "bugs.json"),
  JSON.stringify(bugs, null, 2),
);

console.log("✅ Seed data generated successfully.");

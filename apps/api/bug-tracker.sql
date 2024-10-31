-- Create databases on Solace, only tables
USE ctg7866;

DROP TABLE IF EXISTS bugs;
DROP TABLE IF EXISTS user_details;
DROP TABLE IF EXISTS bug_status;
DROP TABLE IF EXISTS priority;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS project;

CREATE TABLE project
(
 Id INT NOT NULL AUTO_INCREMENT,
 Project CHAR(50) NOT NULL,
 PRIMARY KEY(Id)
) ENGINE=InnoDB;
INSERT INTO project (Project) values ('Zed'),('Cursor');

CREATE TABLE role
(
 Id INT NOT NULL AUTO_INCREMENT,
 Role VARCHAR(50) NOT NULL,
 PRIMARY KEY(Id)
) ENGINE=InnoDB;
INSERT INTO role (Role) values ('Admin'),('Manager'),('User');

CREATE TABLE user_details
(
 Id INT NOT NULL AUTO_INCREMENT,
 Username CHAR(50) NOT NULL,
 RoleID INT NOT NULL,
 ProjectId INT NULL, -- manager and admin are null
 Password VARCHAR(100), -- must be hashed
 Name VARCHAR(250) NOT NULL,
 PRIMARY KEY(Id),
 KEY `fk_role` (`RoleId`),
 KEY `fk_project_assigned` (`ProjectId`),
 CONSTRAINT `fk_role` FOREIGN KEY (`RoleId`) REFERENCES `role` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
 CONSTRAINT `fk_project_assigned` FOREIGN KEY (`ProjectId`) REFERENCES `project` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB;
INSERT INTO user_details (Username, RoleID, ProjectId, Password, Name) VALUES
('Steve.Jobs', 3, 1, 'password', 'Steve Jobs'),
('Elon.Musk', 3, 1, 'password', 'Elon Musk'),
('Bill.Gates', 3, 1, 'password', 'Bill Gates'),
('Mark.Zuckerberg', 3, 2, 'password', 'Mark Zuckerberg'),
('Jeff.Bezos', 3, 2, 'password', 'Jeff Bezos'),
('Larry.Page', 3, 2, 'password', 'Larry Page'),
('Marissa.Mayer', 2, NULL, 'password', 'Marissa Mayer'),
('Meg.Whitman', 2, NULL, 'password', 'Meg Whitman'),
('Michael.Dell', 2, NULL, 'password', 'Michael Dell'),
('Sam.Altman', 1, NULL, 'password', 'Sam Altman');

CREATE TABLE bug_status
(
 Id INT NOT NULL AUTO_INCREMENT,
 Status CHAR(50) NOT NULL,
 PRIMARY KEY(Id)
);
INSERT INTO bug_status (Status) VALUES ('Unassigned'), ('Assigned'), ('Closed');

CREATE TABLE priority
(
 Id INT NOT NULL AUTO_INCREMENT,
 Priority VARCHAR(10) NOT NULL,
 PRIMARY KEY(Id)
);
INSERT INTO priority (Priority) VALUES ('Low'), ('Medium'), ('High'),('Urgent');

CREATE TABLE `bugs` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `projectId` INT NOT NULL,
 `ownerId` INT NOT NULL,
 `assignedToId` INT NULL,
 `statusId` INT NOT NULL,
 `priorityId` INT NOT NULL,
 `summary` VARCHAR(250) NOT NULL,
 `description` VARCHAR(2500) NOT NULL,
 `fixDescription` VARCHAR(2500) DEFAULT NULL,
 `dateRaised` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 `targetDate` timestamp NULL DEFAULT NULL,
 `dateClosed` timestamp NULL DEFAULT NULL,
 PRIMARY KEY (`id`),
 KEY `fk_project` (`projectId`),
 KEY `fk_owner` (`ownerId`),
 KEY `fk_assigned` (`assignedToId`),
 KEY `fk_status` (`statusId`),
 KEY `fk_priority` (`priorityId`),
 CONSTRAINT `fk_project` FOREIGN KEY (`projectId`) REFERENCES `project` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
 CONSTRAINT `fk_owner` FOREIGN KEY (`ownerId`) REFERENCES `user_details` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
 CONSTRAINT `fk_assigned` FOREIGN KEY (`assignedToId`) REFERENCES `user_details` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
 CONSTRAINT `fk_status` FOREIGN KEY (`statusId`) REFERENCES `bug_status` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
 CONSTRAINT `fk_priority` FOREIGN KEY (`priorityId`) REFERENCES `priority` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO bugs (projectId, ownerId, assignedToId, statusId, priorityId, summary, description, fixDescription, dateRaised, targetDate, dateClosed) VALUES
('1', '1', null, '1', '1', 'SQL Format', 'Formatting fails with default prettier instance.', null, '2023-10-30T07:01:07', null, null),
('1', '2', null, '1', '2', 'Formatting Large Files', 'Massive files with thousands of lines do not format.', null, '2023-11-02T02:24:35', null, null),
('1', '3', null, '1', '3', 'Remote ssh needs Zed', 'Remoting into Solace does not work since it needs Zed installed.', null, '2023-05-01T00:07:14', null, null),
('1', '7', '1', '2', '4', 'Lack of Java project menu', 'There is no Java project menu so I need to use my terminal.', null, '2023-03-19T13:43:02', '2023-03-20T13:43:02', null),
('1', '7', '2', '2', '1', 'Terminal cursor takes too long to change', 'When I open my terminal it starts as a block then changes to skinny.', null, '2023-09-01T08:15:38', '2023-06-22T20:37:32', null),
('1', '8', '3', '2', '2', 'Logged out', 'Randomly I get logged out.', null, '2023-03-14T13:50:51', null, null),
('1', '8', '1', '2', '3', 'Changing username', 'There is no way for me to change my username.', null, '2024-03-04T19:43:43', '2024-10-12T00:44:27', null),
('1', '9', '2', '2', '4', 'Vim mode page command', 'When I use ctrl u or d I want the zz command after to center the cursor.', null, '2023-02-05T23:22:18', '2023-02-06T23:22:18', null),
('1', '9', '3', '2', '1', 'Add Model support to inline completions', 'Copilot is mid right now so users need to be able to add thier own models for completion.', null, '2023-06-29T06:57:28', '2023-06-30T06:57:28', null),
('1', '10', '1', '3', '2', 'File icons in tabs', 'The icons need to be shown.', 'FIle icons now are shown', '2023-08-04T18:11:34', '2023-08-05T18:11:34', null),
('2', '4', null, '1', '3', 'Python extension spam', 'I am getting spammed with do I want to install Python extension.', null, '2023-10-03T11:17:12', '2023-10-04T11:17:12', null),
('2', '5', null, '1', '4', 'App is slow', 'Can we please do a rust rewrite', null, '2023-05-19T06:54:40', null, null),
('2', '6', null, '1', '1', 'We need to charge more', 'VS*ode is one update away from replacing us.', null, '2024-06-20T01:39:47', null, null),
('2', '7', '4', '2', '2', 'Get more VC funding', 'If we just yell a bunch of buzzwords people will give us money!', null, '2024-05-19T19:59:44', '2024-12-14T08:42:28', null),
('2', '7', '5', '2', '3', 'Fork Zed', 'We will call it Ced.', null, '2023-12-03T17:13:43', '2024-11-15T16:33:33', null),
('2', '8', '6', '2', '4', 'Funny Twitter', 'We need a funny twitter admin.', null, '2024-09-28T23:21:22', '2024-09-29T23:21:22', null),
('2', '8', '4', '2', '1', 'Fire engineers', 'Idk we are being replaced', null, '2024-04-23T22:44:07', '2024-04-24T22:44:07', null),
('2', '9', '5', '2', '2', 'Halloween Icon', 'We need a scary icon for the holiday', null, '2024-05-29T00:25:17', '2024-12-01T14:06:47', null),
('2', '9', '6', '2', '3', 'Cash out', 'Our time has come to get that bag', null, '2023-06-01T01:11:33', '2023-06-02T01:11:33', null),
('2', '10', '4', '3', '4', 'Fork VS*ode', 'Idk they did it all.', 'Yup we did it', '2023-03-24T10:03:26', '2023-03-25T20:50:45', '2023-03-26T20:50:45');

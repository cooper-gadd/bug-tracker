import { z } from "zod";

//database schema

export const projectSchema = z.object({
  id: z.number().int().positive(),
  project: z.string().max(50),
});

export const roleSchema = z.object({
  id: z.number().int().positive(),
  role: z.enum(["Admin", "Manager", "User"]),
});

export const userDetailsSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().max(50),
  roleId: z.number().int().positive(),
  projectId: z.number().int().positive().nullable(),
  password: z.string().max(100), // hashed
  name: z.string().max(250),
});

export const bugStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(["Unassigned", "Assigned", "Closed"]),
});

export const prioritySchema = z.object({
  id: z.number().int().positive(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
});

export const bugSchema = z.object({
  id: z.number().int().positive(),
  projectId: z.number().int().positive(),
  ownerId: z.number().int().positive(),
  assignedToId: z.number().int().positive().nullable(),
  statusId: z.number().int().positive(),
  priorityId: z.number().int().positive(),
  summary: z.string().max(250),
  description: z.string().max(2500),
  fixDescription: z.string().max(2500).nullable(),
  dateRaised: z.date(),
  targetDate: z.date().nullable(),
  dateClosed: z.date().nullable(),
});

//api schema

export const bugTableSchema = z.object({
  id: bugSchema.shape.id,
  project: projectSchema.shape.project,
  owner: userDetailsSchema.shape.name,
  assignedTo: userDetailsSchema.shape.name.nullable(),
  status: bugStatusSchema.shape.status,
  priority: prioritySchema.shape.priority,
  summary: bugSchema.shape.summary,
  description: bugSchema.shape.description,
  fixedDescription: bugSchema.shape.fixDescription,
  dateRaised: bugSchema.shape.dateRaised,
  targetDate: bugSchema.shape.targetDate,
  dateClosed: bugSchema.shape.dateClosed,
});

export const userDetailsTableSchema = z.object({
  id: userDetailsSchema.shape.id,
  username: userDetailsSchema.shape.username,
  role: roleSchema.shape.role,
  project: projectSchema.shape.project.nullable(),
  name: userDetailsSchema.shape.name,
});

export type Project = z.infer<typeof projectSchema>;
export type Role = z.infer<typeof roleSchema>;
export type UserDetails = z.infer<typeof userDetailsSchema>;
export type BugStatus = z.infer<typeof bugStatusSchema>;
export type Priority = z.infer<typeof prioritySchema>;
export type Bug = z.infer<typeof bugSchema>;
export type BugTable = z.infer<typeof bugTableSchema>;
export type UserDetailsTable = z.infer<typeof userDetailsTableSchema>;

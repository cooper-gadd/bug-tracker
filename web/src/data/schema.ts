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
  project: projectSchema,
  owner: userDetailsSchema.pick({ id: true, name: true }),
  assignedTo: userDetailsSchema.pick({ id: true, name: true }).nullable(),
  status: bugStatusSchema,
  priority: prioritySchema,
  summary: bugSchema.shape.summary,
  description: bugSchema.shape.description,
  fixedDescription: bugSchema.shape.fixDescription,
  dateRaised: bugSchema.shape.dateRaised,
  targetDate: bugSchema.shape.targetDate,
  dateClosed: bugSchema.shape.dateClosed,
});

export type Project = z.infer<typeof projectSchema>;
export type Role = z.infer<typeof roleSchema>;
export type UserDetails = z.infer<typeof userDetailsSchema>;
export type BugStatus = z.infer<typeof bugStatusSchema>;
export type Priority = z.infer<typeof prioritySchema>;
export type Bug = z.infer<typeof bugSchema>;
export type BugTable = z.infer<typeof bugTableSchema>;

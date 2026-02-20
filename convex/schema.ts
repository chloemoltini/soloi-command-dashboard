import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    status: v.string(),
    assignedTo: v.string(),
    createdAt: v.number(),
  }),
  pipeline: defineTable({
    title: v.string(),
    idea: v.string(),
    script: v.string(),
    thumbnail: v.string(),
    stage: v.string(),
    createdAt: v.number(),
  }),
  calendar: defineTable({
    title: v.string(),
    description: v.string(),
    scheduledAt: v.number(),
    createdAt: v.number(),
  }),
  memory: defineTable({
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    createdAt: v.number(),
  }),
  team: defineTable({
    name: v.string(),
    role: v.string(),
    type: v.string(),
    status: v.string(),
    avatar: v.optional(v.string()),
    description: v.optional(v.string()),
    createdAt: v.number(),
  }),
});

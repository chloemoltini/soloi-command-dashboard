import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("team").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    type: v.string(),
    avatar: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("team", {
      ...args,
      status: "inactive",
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("team"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const remove = mutation({
  args: { id: v.id("team") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

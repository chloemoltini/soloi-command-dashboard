import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("calendar").collect();
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    scheduledAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("calendar", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("calendar") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

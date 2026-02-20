import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pipeline").collect();
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    idea: v.string(),
    script: v.string(),
    thumbnail: v.string(),
    stage: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("pipeline", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("pipeline"),
    stage: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { stage: args.stage });
  },
});

export const remove = mutation({
  args: { id: v.id("pipeline") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

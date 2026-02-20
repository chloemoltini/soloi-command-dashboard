import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("memory").collect();
  },
});

export const search = query({
  args: { search: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("memory").collect();
    if (!args.search) return all;
    const q = args.search.toLowerCase();
    return all.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.content.toLowerCase().includes(q) ||
        (m.tags && m.tags.some((t) => t.toLowerCase().includes(q)))
    );
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("memory", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("memory") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing team
    const existing = await ctx.db.query("team").collect();
    for (const t of existing) {
      await ctx.db.delete(t._id);
    }

    // Seed team members
    const team = [
      { name: "Chloe", role: "sovereign", type: "agent", avatar: "/avatars/chloe.png", description: "Queen of the Castle - Your personal AI assistant" },
      { name: "Joe", role: "writer", type: "agent", avatar: "/avatars/joe.png", description: "Merchant Voyager - Creative writer & storyteller" },
      { name: "Leo", role: "researcher", type: "agent", avatar: "/avatars/leo.png", description: "Insight Hunter - Research & analysis" },
      { name: "Max", role: "developer", type: "agent", avatar: "/avatars/max.png", description: "Fitness Champion - Developer & builder" },
      { name: "Supriye", role: "designer", type: "agent", avatar: "/avatars/supriye.png", description: "Digital Guardian - Designer & visual artist" },
    ];

    for (const member of team) {
      await ctx.db.insert("team", {
        ...member,
        status: "active",
        createdAt: Date.now(),
      });
    }
  },
});

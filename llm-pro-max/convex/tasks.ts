import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addItem = mutation({
  args: { from: v.string(), isText: v.boolean(), text: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("chats", { ...args });
  },
});
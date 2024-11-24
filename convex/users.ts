import { query, mutation } from "../convex/_generated/server";
import { v } from "convex/values";

export const current = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.eq(q.field("email"), args.email),
        )
      )
      .first();

    if (currentUser) {
      return currentUser;
    }
  },
});

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // check if user email exists 
    const existingUser = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.eq(q.field("email"), args.email),
        )
      )
      .first();

    if (existingUser) {
      return existingUser;
    }

    const newUser = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
    });

    return newUser;
  },
});
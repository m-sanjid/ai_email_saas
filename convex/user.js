import { v } from "convex/values";
import { mutation } from "./_generated/server.js";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("CreateUser mutation called with:", args);

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!user) {
      const result = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        picture: args.picture,
        credits: 3,
      });

      console.log("User successfully created with ID:", result);
      return result;
    }

    console.log("User already exists:", user);
    return user;
  },
});

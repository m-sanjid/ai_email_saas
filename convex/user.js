import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server.js";
import { compare, hash } from "bcryptjs";

export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
  },
});

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    password: v.optional(v.string()),
    credits: v.optional(v.number()),
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
        picture: args.picture || "",
        password: args.password,
        credits: args.credits || 3,
      });
      console.log("User successfully created with ID:", result);
      return result;
    }
    console.log("User already exists:", user);
    return user;
  },
});

export const CreateUserWithPassword = action({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    console.log(
      "CreateUserWithPassword action called with name and email",
      args.name,
      args.email,
    );

    const user = await ctx.runQuery("user:getUserByEmail", {
      email: args.email,
    });

    if (user) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await hash(args.password, 12);

    const result = await ctx.runMutation("user:CreateUser", {
      name: args.name,
      email: args.email,
      password: hashedPassword,
      picture: "",
      credits: 3,
    });

    console.log("User created with Id:", result);
    return { id: result };
  },
});

export const verifyUserCredentials = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery("user:getUserByEmail", {
      email: args.email,
    });

    if (!user) {
      throw new Error("No user found with this email");
    }

    if (!user.password) {
      throw new Error("This account doesn't use password authentication");
    }

    const isValid = await compare(args.password, user.password);

    if (!isValid) {
      throw new Error("Invalid password");
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture || null,
    };
  },
});

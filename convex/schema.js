import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()),
    picture: v.optional(v.string()),
    credits: v.number(),
  }),
  emailTemplates: defineTable({
    tid: v.string(),
    design: v.any(),
    description: v.any(),
    email: v.string(),
    isFavorite: v.optional(v.boolean()),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  }),
});

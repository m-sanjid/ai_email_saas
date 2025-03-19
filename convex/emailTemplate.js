import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const SaveTemplate = mutation({
  args: {
    tid: v.string(),
    design: v.any(),
    description: v.any(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const timestamp = new Date().toISOString();
    const { tid, design, description, email } = args;

    if (!tid || !email) {
      return { success: false, error: "Template ID and email are required" };
    }

    // Validate design structure
    if (!design || !Array.isArray(design)) {
      return { success: false, error: "Invalid template design structure" };
    }

    try {
      const existingTemplate = await ctx.db
        .query("emailTemplates")
        .filter((q) => q.eq(q.field("tid"), tid))
        .first();

      if (existingTemplate) {
        await ctx.db.patch(existingTemplate._id, {
          design,
          description,
          email,
          updatedAt: timestamp,
        });
        return { success: true };
      } else {
        await ctx.db.insert("emailTemplates", {
          tid,
          design,
          description,
          email,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
        return { success: true };
      }
    } catch (error) {
      console.error("Failed to save template:", error);
      return { success: false, error: error.message || "Failed to save template" };
    }
  },
});

// Query to retrieve a specific template by tid and email
export const GetTemplateDesign = query({
  args: {
    tid: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const { tid, email } = args;
    
    if (!tid || !email) {
      throw new Error("Template ID and email are required");
    }

    try {
      const template = await ctx.db
        .query("emailTemplates")
        .filter(q => q.eq(q.field("tid"), tid))
        .filter(q => q.eq(q.field("email"), email))
        .first();
      
      return template || null;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch template");
    }
  },
});

// Query to retrieve all templates for a user
export const GetAllUserTemplate = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const { email } = args;

    if (!email) {
      throw new Error("Email is required");
    }

    try {
      return await ctx.db
        .query("emailTemplates")
        .filter(q => q.eq(q.field("email"), email))
        .collect();
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user templates");
    }
  },
});

export const DeleteTemplate = mutation({
  args: {
    tid: v.string(),
  },
  handler: async (ctx, args) => {
    const { tid } = args;

    if (!tid) {
      throw new Error("Template ID is required");
    }

    try {
      const template = await ctx.db
        .query("emailTemplates")
        .filter(q => q.eq(q.field("tid"), tid))
        .first();

      if (!template) {
        throw new Error("Template not found");
      }

      await ctx.db.delete(template._id);
      return { success: true };
    } catch (error) {
      throw new Error(error.message || "Failed to delete template");
    }
  },
});

export const DeleteAllUserTemplates = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const { email } = args;

    if (!email) {
      throw new Error("Email is required");
    }

    try {
      const templates = await ctx.db
        .query("emailTemplates")
        .filter(q => q.eq(q.field("email"), email))
        .collect();

      await Promise.all(templates.map(template => ctx.db.delete(template._id)));
      return { success: true, count: templates.length };
    } catch (error) {
      throw new Error(error.message || "Failed to delete templates");
    }
  },
});

export const ToggleFavorite = mutation({
  args: { tid: v.string() },
  handler: async (ctx, args) => {
    const template = await ctx.db
      .query("emailTemplates")
      .filter(q => q.eq(q.field("tid"), args.tid))
      .first();
    
    if (!template) {
      throw new Error("Template not found");
    }
    
    await ctx.db.patch(template._id, {
      isFavorite: !template.isFavorite
    });
    return { success: true };
  },
});
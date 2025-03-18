import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    try {
      const result = await convex.action("user:CreateUserWithPassword", {
        name,
        email,
        password,
      });

      return NextResponse.json(
        {
          success: true,
          message: "User registered successfully",
          user: {
            id: result.id,
            name,
            email,
          },
        },
        {
          status: 201,
        },
      );
    } catch (error) {
      console.error("Convex error:", error);

      if (error.message.includes("already exists")) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 },
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// CREATE user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // TODO: no hashing, add auth later
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: password || null,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "User with that email or username already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

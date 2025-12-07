import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET user by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParams } = await params;
    const id = Number(idParams);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "User ID must be a number" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        routines: true,
        logs: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/user/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// UPDATE user
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParams } = await params;
    const id = Number(idParams);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "User ID must be a number" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { username, email, password } = body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username: username ?? undefined,
        email: email ?? undefined,
        passwordHash: password ?? undefined, // real auth later
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("PUT /api/user/[id] error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email or username already in use" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE user
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } // params is a Promise
) {
  try {
    const { id: idStr } = await context.params; // await first
    const id = Number(idStr);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "User ID must be a number" },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findUnique({ where: { id } });
    if (!exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/user/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

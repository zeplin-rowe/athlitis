import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";
import { hashPassword } from "@/utils/auth";

// GET user by ID (protected, only self)
async function getUser(req: NextRequest, idStr: string) {
  const userId = (req as any).userId;
  const id = Number(idStr);

  if (isNaN(id))
    return NextResponse.json(
      { error: "User ID must be a number" },
      { status: 400 }
    );
  if (id !== userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}

// UPDATE user (protected, only self)
async function updateUser(req: NextRequest, idStr: string) {
  const userId = (req as any).userId;
  const id = Number(idStr);
  if (isNaN(id))
    return NextResponse.json(
      { error: "User ID must be a number" },
      { status: 400 }
    );
  if (id !== userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { username, email, password } = body;

  let data: any = {};
  if (username) data.username = username;
  if (email) data.email = email;
  if (password) data.passwordHash = await hashPassword(password);

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, username: true, email: true, createdAt: true },
    });
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("PUT /api/users/[id] error:", error);
    if (error.code === "P2002")
      return NextResponse.json(
        { error: "Email or username already in use" },
        { status: 409 }
      );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE user (protected, only self)
async function deleteUser(req: NextRequest, idStr: string) {
  const userId = (req as any).userId;
  const id = Number(idStr);
  if (isNaN(id))
    return NextResponse.json(
      { error: "User ID must be a number" },
      { status: 400 }
    );
  if (id !== userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ message: "User deleted successfully" });
}

// Wrappers for App Router
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return authMiddleware(req, (r: NextRequest) => getUser(r, params.id));
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return authMiddleware(req, (r: NextRequest) => updateUser(r, params.id));
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return authMiddleware(req, (r: NextRequest) => deleteUser(r, params.id));
}

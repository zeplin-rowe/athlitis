import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/utils/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, username } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 400 }
    );

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash: hashedPassword,
    },
  });

  const token = generateToken(user.id);

  return NextResponse.json(
    {
      token,
      user: { id: user.id, email: user.email, username: user.username },
    },
    { status: 201 }
  );
}

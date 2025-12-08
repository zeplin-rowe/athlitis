import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../utils/auth";

export async function authMiddleware(req: NextRequest, handler: Function) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    (req as any).userId = payload.userId;
    return handler(req);
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

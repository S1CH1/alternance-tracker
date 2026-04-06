import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const todos = await prisma.todo.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(todos);
}

export async function POST(request: NextRequest) {
  const { texte } = await request.json();
  if (!texte?.trim()) {
    return NextResponse.json({ error: "Texte requis" }, { status: 400 });
  }
  const todo = await prisma.todo.create({ data: { texte: texte.trim() } });
  return NextResponse.json(todo, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { fait } = await request.json();
  const todo = await prisma.todo.update({
    where: { id: parseInt(id) },
    data: { fait },
  });
  return NextResponse.json(todo);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.todo.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}

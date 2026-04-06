import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { titre, contenu } = body;

    const data: Record<string, string | null> = {};
    if (titre !== undefined) data.titre = titre || null;
    if (contenu !== undefined) data.contenu = contenu;

    const note = await prisma.note.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la note" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.note.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la note" },
      { status: 500 }
    );
  }
}

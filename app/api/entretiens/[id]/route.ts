import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { resultat, notes, date, type } = body;

    const data: Record<string, unknown> = {};
    if (resultat !== undefined) data.resultat = resultat;
    if (notes !== undefined) data.notes = notes;
    if (date !== undefined) data.date = new Date(date);
    if (type !== undefined) data.type = type;

    const entretien = await prisma.entretien.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(entretien);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.entretien.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

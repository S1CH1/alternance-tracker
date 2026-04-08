import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const entretiens = await prisma.entretien.findMany({
      where: { candidatureId: parseInt(id) },
      orderBy: { date: "asc" },
    });
    return NextResponse.json(entretiens);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { date, type, notes } = body;

    const entretien = await prisma.entretien.create({
      data: {
        candidatureId: parseInt(id),
        date: new Date(date),
        type,
        notes: notes || null,
        resultat: "En attente",
      },
    });

    // Passer le statut de la candidature à "Entretien" si pas déjà le cas
    const candidature = await prisma.candidature.findUnique({
      where: { id: parseInt(id) },
      select: { statut: true },
    });
    if (candidature && !["Entretien", "Acceptée", "Refusée"].includes(candidature.statut)) {
      await prisma.candidature.update({
        where: { id: parseInt(id) },
        data: { statut: "Entretien" },
      });
    }

    return NextResponse.json(entretien, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

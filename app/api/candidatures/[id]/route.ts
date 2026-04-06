import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const candidature = await prisma.candidature.findUnique({
      where: { id: parseInt(id) },
    });

    if (!candidature) {
      return NextResponse.json(
        { error: "Candidature introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(candidature);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { statut, notes, ville, entreprise, poste, lienOffre, dateEnvoi } = body;

    const data: Record<string, string> = {};
    if (statut !== undefined) data.statut = statut;
    if (notes !== undefined) data.notes = notes;
    if (ville !== undefined) data.ville = ville;
    if (entreprise !== undefined) data.entreprise = entreprise;
    if (poste !== undefined) data.poste = poste;
    if (lienOffre !== undefined) data.lienOffre = lienOffre;
    if (dateEnvoi !== undefined) data.dateEnvoi = dateEnvoi;

    const candidature = await prisma.candidature.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(candidature);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
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
    await prisma.candidature.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}

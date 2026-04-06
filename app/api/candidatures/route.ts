import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const candidatures = await prisma.candidature.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(candidatures);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des candidatures" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entreprise, poste, ville, dateEnvoi, lienOffre, notes, cvPath, lmPath, offrePdfPath } = body;

    if (!entreprise || !poste) {
      return NextResponse.json(
        { error: "L'entreprise et le poste sont requis" },
        { status: 400 }
      );
    }

    const candidature = await prisma.candidature.create({
      data: {
        entreprise,
        poste,
        ville: ville || null,
        dateEnvoi: dateEnvoi ? new Date(dateEnvoi) : new Date(),
        lienOffre: lienOffre || null,
        notes: notes || null,
        cvPath: cvPath || null,
        lmPath: lmPath || null,
        offrePdfPath: offrePdfPath || null,
      },
    });

    return NextResponse.json(candidature, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la candidature" },
      { status: 500 }
    );
  }
}

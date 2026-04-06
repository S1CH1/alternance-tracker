import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(notes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titre, contenu } = body;

    if (!contenu && contenu !== "") {
      return NextResponse.json(
        { error: "Le contenu est requis" },
        { status: 400 }
      );
    }

    const note = await prisma.note.create({
      data: {
        titre: titre || null,
        contenu: contenu || "",
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la note" },
      { status: 500 }
    );
  }
}

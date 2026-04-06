import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    const rappels = await prisma.rappel.findMany({
      where: all ? undefined : { fait: false },
      orderBy: { date: "asc" },
    });
    return NextResponse.json(rappels);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des rappels" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, date } = body;

    if (!message || !date) {
      return NextResponse.json(
        { error: "Le message et la date sont requis" },
        { status: 400 }
      );
    }

    const rappel = await prisma.rappel.create({
      data: {
        message,
        date: new Date(date),
      },
    });

    return NextResponse.json(rappel, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création du rappel" },
      { status: 500 }
    );
  }
}

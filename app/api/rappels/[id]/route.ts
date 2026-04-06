import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { fait, message, date } = body;

    const data: Record<string, boolean | string | Date> = {};
    if (fait !== undefined) data.fait = fait;
    if (message !== undefined) data.message = message;
    if (date !== undefined) data.date = new Date(date);

    const rappel = await prisma.rappel.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(rappel);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du rappel" },
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
    await prisma.rappel.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du rappel" },
      { status: 500 }
    );
  }
}

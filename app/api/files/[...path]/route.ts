import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const filename = pathSegments.join("/");

    // Sécurité : empêcher la traversée de répertoire
    const safeFilename = path.basename(filename);
    const filepath = path.join(process.cwd(), "uploads", safeFilename);

    // Vérification que le fichier est bien dans le dossier uploads
    const uploadsDir = path.resolve(process.cwd(), "uploads");
    const resolvedPath = path.resolve(filepath);
    if (!resolvedPath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const file = await readFile(resolvedPath);

    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }
}

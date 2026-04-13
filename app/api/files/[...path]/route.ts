import { NextRequest, NextResponse } from "next/server";
import { stat } from "fs/promises";
import { createReadStream } from "fs";
import path from "path";
import { Readable } from "stream";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const filename = pathSegments.join("/");

    // Sécurité : empêcher la traversée de répertoire
    const safeFilename = path.basename(filename);
    const uploadsDir = path.resolve(process.cwd(), "uploads");
    const resolvedPath = path.resolve(path.join(uploadsDir, safeFilename));

    if (!resolvedPath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const fileStat = await stat(resolvedPath);

    // Vérifier si le client a déjà la version en cache (ETag)
    const etag = `"${fileStat.mtime.getTime()}-${fileStat.size}"`;
    if (request.headers.get("if-none-match") === etag) {
      return new NextResponse(null, { status: 304 });
    }

    const stream = createReadStream(resolvedPath);
    const webStream = Readable.toWeb(stream) as ReadableStream;

    return new NextResponse(webStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Content-Length": String(fileStat.size),
        "Cache-Control": "private, max-age=86400",
        "ETag": etag,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }
}

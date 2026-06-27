import { NextResponse, type NextRequest } from "next/server";
import {
  handleUpload,
  type HandleUploadBody,
} from "@vercel/blob/client";

/**
 * Client-upload handler for vehicle photos (public quote form).
 *
 * The browser uploads each file directly to Vercel Blob using a short-lived
 * token minted here — this bypasses the ~4.5 MB serverless request-body limit,
 * which matters because phone photos run several MB each (up to 12 per lead).
 *
 * No auth: this is a public lead form. We constrain abuse by allowing only
 * image content-types, capping each file's size, and scoping every object
 * under the `leads/` prefix with a random suffix.
 */
export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB per photo

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Fotoğraf yükleme şu anda yapılandırılmamış." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/heic",
          "image/heif",
        ],
        maximumSizeInBytes: MAX_BYTES,
        addRandomSuffix: true,
        // Quote photos are not long-lived assets; expire the upload token fast.
        validUntil: Date.now() + 60 * 60 * 1000, // 1 hour
      }),
      // Fires only with a publicly reachable URL (production), not on localhost.
      // The lead persists the returned URLs from the client, so this is a no-op
      // hook kept for completeness / future bookkeeping.
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Yükleme başarısız." },
      { status: 400 },
    );
  }
}

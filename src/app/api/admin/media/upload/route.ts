import { NextResponse, type NextRequest } from "next/server";
import {
  handleUpload,
  type HandleUploadBody,
} from "@vercel/blob/client";
import { getSessionUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/guard";

/**
 * Admin Media library — client-upload token handler.
 *
 * The browser uploads files directly to Vercel Blob (bypassing the serverless
 * body limit); we only mint a short-lived, permission-checked token here. The
 * resulting URL is persisted by the `registerUploadedMedia` server action, so
 * `onUploadCompleted` (which has no admin session) stays a no-op.
 */
export const runtime = "nodejs";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB per asset

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Vercel Blob yapılandırılmamış (BLOB_READ_WRITE_TOKEN)." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // The token-generation request carries the admin's session cookie.
        const user = await getSessionUser();
        if (!user || !can(user, "media.write")) {
          throw new Error("Bu işlem için yetkiniz yok.");
        }
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
            "image/gif",
            "image/svg+xml",
          ],
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
        };
      },
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

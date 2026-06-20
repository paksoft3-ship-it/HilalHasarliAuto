import { type NextRequest } from "next/server";
import { isDbConfigured, requireDb } from "@/db";
import { auditLogs } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import { getLeadsForExport, type QuickView } from "@/db/repo/crm-queries";

function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  if (!isDbConfigured) return new Response("Database not configured", { status: 503 });

  const user = await getSessionUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  if (!user.permissions.has("export.data")) return new Response("Forbidden", { status: 403 });

  const sp = req.nextUrl.searchParams;
  const rows = await getLeadsForExport({
    stage: sp.get("stage") ?? undefined,
    q: sp.get("q") ?? undefined,
    view: (sp.get("view") as QuickView) ?? undefined,
    currentUserId: user.id,
  });

  const header = [
    "No", "Ad Soyad", "Telefon", "E-posta", "Asama", "Kaynak",
    "Oncelik", "Il", "Ilce", "Skor", "Olusturma",
  ];
  const lines = [header.map(csvCell).join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.leadNumber, r.fullName, r.phone, r.email ?? "", r.stage, r.source,
        r.priority, r.city ?? "", r.district ?? "", r.score,
        r.createdAt.toISOString(),
      ].map(csvCell).join(","),
    );
  }
  // BOM for Excel UTF-8.
  const csv = "﻿" + lines.join("\r\n");

  const db = requireDb();
  await db.insert(auditLogs).values({
    actorUserId: user.id,
    action: "export",
    entityType: "lead",
    summary: `csv:${rows.length}`,
  });

  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

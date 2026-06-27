"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { UploadCloud, Loader2, Check, AlertCircle } from "lucide-react";
import { registerUploadedMedia } from "@/lib/admin/media-actions";

const MAX_BYTES = 25 * 1024 * 1024;

type Item = { id: string; name: string; status: "uploading" | "done" | "error"; error?: string };

export function MediaUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [folder, setFolder] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const files = Array.from(input.files ?? []);
    input.value = "";
    if (files.length === 0) return;

    setBusy(true);
    const queued: Item[] = files.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      status: f.type.startsWith("image/") && f.size <= MAX_BYTES ? "uploading" : "error",
      error: !f.type.startsWith("image/")
        ? "Yalnızca görsel"
        : f.size > MAX_BYTES
          ? "25 MB üstü"
          : undefined,
    }));
    setItems((prev) => [...queued, ...prev]);

    let anyDone = false;
    await Promise.all(
      files.map(async (file, i) => {
        const it = queued[i];
        if (it.status === "error") return;
        try {
          const blob = await upload(`media/${file.name}`, file, {
            access: "public",
            handleUploadUrl: "/api/admin/media/upload",
            contentType: file.type,
          });
          const res = await registerUploadedMedia({
            url: blob.url,
            filename: file.name,
            mime: file.type,
            size: file.size,
            folder: folder.trim() || undefined,
          });
          if (!res.ok) throw new Error(res.error);
          anyDone = true;
          setItems((prev) => prev.map((p) => (p.id === it.id ? { ...p, status: "done" } : p)));
        } catch (err) {
          setItems((prev) =>
            prev.map((p) =>
              p.id === it.id
                ? { ...p, status: "error", error: err instanceof Error ? err.message : "Hata" }
                : p,
            ),
          );
        }
      }),
    );
    setBusy(false);
    if (anyDone) router.refresh();
  }

  return (
    <div className="mb-5 rounded-[14px] border border-line bg-white p-4">
      <div className="flex flex-wrap items-end gap-2">
        <input
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          placeholder="Klasör (opsiyonel)"
          className="h-10 w-40 rounded-md border border-line px-3 text-sm focus:border-burgundy-700 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-burgundy-700 px-5 text-sm font-semibold text-white hover:bg-burgundy-800 disabled:opacity-70"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
          Dosya yükle
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onPick}
          className="hidden"
        />
        <span className="text-xs text-ink-muted">JPG / PNG / WEBP / SVG · maks. 25 MB</span>
      </div>

      {items.length > 0 && (
        <ul className="mt-3 space-y-1">
          {items.map((it) => (
            <li key={it.id} className="flex items-center gap-2 text-xs">
              {it.status === "uploading" && <Loader2 size={13} className="animate-spin text-ink-muted" />}
              {it.status === "done" && <Check size={13} className="text-success" />}
              {it.status === "error" && <AlertCircle size={13} className="text-error" />}
              <span className="truncate text-ink">{it.name}</span>
              {it.error && <span className="text-error">— {it.error}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { saveContent } from "@/lib/admin/content-actions";
import { blocksToText } from "@/lib/cms/blocks";
import { faqsToText } from "@/lib/cms/faqs";
import type { Block } from "@/config/blog";
import type { FaqItem } from "@/config/faq";

interface ContentData {
  id: string;
  type: string;
  slug: string;
  title: string;
  internalTitle: string | null;
  excerpt: string | null;
  category: string | null;
  body: Block[];
  imageUrl: string | null;
  imageAlt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonical: string | null;
  robots: string | null;
  ogImage: string | null;
  faqs: FaqItem[] | null;
}

const field = "h-10 w-full rounded-md border border-line px-3 text-sm focus:border-burgundy-700 focus:outline-none";
const labelText = "mb-1 block text-xs font-semibold text-ink-muted";

export function ContentForm({
  item,
  labels,
}: {
  item?: ContentData;
  labels: { type: string; excerpt: string; body: string; seo: string; save: string };
}) {
  return (
    <form action={saveContent} className="space-y-4 rounded-[14px] border border-line bg-white p-6">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelText}>{labels.type}</span>
          <select name="type" defaultValue={item?.type ?? "blog_post"} className={field} disabled={!!item}>
            <option value="blog_post">Blog Yazısı</option>
            <option value="guide">Rehber</option>
            <option value="page">Sayfa</option>
            <option value="service">Hizmet</option>
            <option value="faq">SSS</option>
          </select>
          {item && <input type="hidden" name="type" value={item.type} />}
        </label>
        <label className="block">
          <span className={labelText}>Kategori</span>
          <input name="category" defaultValue={item?.category ?? ""} className={field} />
        </label>
        <label className="block">
          <span className={labelText}>Başlık</span>
          <input name="title" required defaultValue={item?.title ?? ""} className={field} />
        </label>
        <label className="block">
          <span className={labelText}>Slug (boş = otomatik)</span>
          <input name="slug" defaultValue={item?.slug ?? ""} className={field} />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelText}>Dahili başlık (yalnızca yönetim panelinde görünür)</span>
          <input name="internalTitle" defaultValue={item?.internalTitle ?? ""} className={field} />
        </label>
        <label className="block">
          <span className={labelText}>Görsel URL</span>
          <input name="imageUrl" defaultValue={item?.imageUrl ?? ""} className={field} />
        </label>
        <label className="block">
          <span className={labelText}>Görsel Alt</span>
          <input name="imageAlt" defaultValue={item?.imageAlt ?? ""} className={field} />
        </label>
      </div>

      <label className="block">
        <span className={labelText}>{labels.excerpt}</span>
        <textarea name="excerpt" rows={2} defaultValue={item?.excerpt ?? ""} className="w-full rounded-md border border-line p-2.5 text-sm focus:border-burgundy-700 focus:outline-none" />
      </label>

      <label className="block">
        <span className={labelText}>{labels.body}</span>
        <textarea
          name="bodyText"
          rows={14}
          defaultValue={item ? blocksToText(item.body) : ""}
          placeholder={"## Başlık\nParagraf metni...\n\n- Madde 1\n- Madde 2\n\n> Bilgi notu"}
          className="w-full rounded-md border border-line p-3 font-mono text-[13px] focus:border-burgundy-700 focus:outline-none"
        />
        <span className="mt-1 block text-xs text-ink-muted">## başlık · ### alt başlık · - liste · 1. sıralı · &gt; not</span>
      </label>

      <label className="block">
        <span className={labelText}>Sık Sorulan Sorular (FAQPage şeması)</span>
        <textarea
          name="faqsText"
          rows={6}
          defaultValue={item?.faqs ? faqsToText(item.faqs) : ""}
          placeholder={"Soru | Cevap\nHasarlı aracı ekspertizsiz satabilir miyim? | Evet, ekspertiz zorunlu değildir."}
          className="w-full rounded-md border border-line p-3 font-mono text-[13px] focus:border-burgundy-700 focus:outline-none"
        />
        <span className="mt-1 block text-xs text-ink-muted">Her satır bir SSS: <code>Soru | Cevap</code>. Sayfada açılır akordeon ve zengin sonuç (rich snippet) olarak görünür.</span>
      </label>

      <fieldset className="rounded-md border border-line p-4">
        <legend className="px-1 text-xs font-bold uppercase tracking-wide text-ink-muted">{labels.seo}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelText}>SEO başlığı</span>
            <input name="seoTitle" placeholder="Boş = sayfa başlığı" defaultValue={item?.seoTitle ?? ""} className={field} />
          </label>
          <label className="block">
            <span className={labelText}>SEO anahtar kelimeler</span>
            <input name="seoKeywords" placeholder="virgülle ayrılmış" defaultValue={item?.seoKeywords ?? ""} className={field} />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelText}>SEO açıklaması (meta description)</span>
            <textarea name="seoDescription" rows={2} defaultValue={item?.seoDescription ?? ""} className="w-full rounded-md border border-line p-2.5 text-sm focus:border-burgundy-700 focus:outline-none" />
          </label>
          <label className="block">
            <span className={labelText}>OG görseli (paylaşım görseli)</span>
            <input name="ogImage" placeholder="Boş = ana görsel" defaultValue={item?.ogImage ?? ""} className={field} />
          </label>
          <label className="block">
            <span className={labelText}>Canonical URL (boş = otomatik)</span>
            <input name="canonical" defaultValue={item?.canonical ?? ""} className={field} />
          </label>
          <label className="block">
            <span className={labelText}>Robots</span>
            <select name="robots" defaultValue={item?.robots ?? ""} className={field}>
              <option value="">index, follow (varsayılan)</option>
              <option value="noindex, follow">noindex, follow</option>
              <option value="noindex, nofollow">noindex, nofollow</option>
            </select>
          </label>
        </div>
      </fieldset>

      <button type="submit" className="rounded-md bg-burgundy-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-burgundy-800">
        {labels.save}
      </button>
    </form>
  );
}

/**
 * IndexNow submitter — pushes all sitemap URLs to Bing/Yandex/etc. via the
 * shared IndexNow endpoint. Google does not support IndexNow, but Bing's
 * index feeds ChatGPT search, so fast Bing indexing matters for AI visibility.
 *
 * Usage:  node scripts/indexnow.mjs            (submits every sitemap URL)
 *         node scripts/indexnow.mjs /blog/foo  (submits specific paths)
 *
 * The key file public/<key>.txt must be deployed (it is committed).
 */
const HOST = "hasarliaracalan.com";
const KEY = "1c470b8c9ecc45fe8a9b3becb7fe25fa";
const BASE = `https://${HOST}`;

async function sitemapUrls() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const args = process.argv.slice(2);
const urlList = args.length
  ? args.map((p) => (p.startsWith("http") ? p : `${BASE}${p}`))
  : await sitemapUrls();

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${BASE}/${KEY}.txt`,
    urlList,
  }),
});

console.log(`IndexNow: submitted ${urlList.length} URLs → HTTP ${res.status}`);
if (!res.ok) console.error(await res.text());

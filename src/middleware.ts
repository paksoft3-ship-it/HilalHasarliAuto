import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";

const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid"] as const;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
const ADV_COOKIE = "adv_sid";

/**
 * - /admin: cheap auth gate (cookie presence; full validation server-side).
 * - public ad landings (a Google click id is in the URL): tag the request with
 *   an `adv_sid` cookie and records the landing server-side in the background
 *   (POST /api/track/ad-landing via waitUntil), so pages themselves stay cacheable.
 */
export function middleware(req: NextRequest, event: NextFetchEvent) {
  const { pathname, searchParams } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isLogin = pathname === "/admin/login";
    const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);
    if (!isLogin && !hasSession) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  const hasClickId = CLICK_ID_KEYS.some((k) => searchParams.get(k));
  if (!hasClickId) return NextResponse.next();

  let sid = req.cookies.get(ADV_COOKIE)?.value;
  const fresh = !sid;
  if (!sid) sid = crypto.randomUUID();

  // First-touch capture runs in the background (does not delay the page) and
  // lets the pages stay cached — see app/api/track/ad-landing.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const xff = req.headers.get("x-forwarded-for");
    const payload: Record<string, string | null> = {
      sessionId: sid,
      ip: xff ? xff.split(",")[0]!.trim() : req.headers.get("x-real-ip"),
      userAgent: req.headers.get("user-agent"),
      referrer: req.headers.get("referer"),
      landingPage: pathname,
    };
    for (const k of CLICK_ID_KEYS) payload[k] = searchParams.get(k);
    for (const u of UTM_KEYS) payload[u] = searchParams.get(u);
    event.waitUntil(
      fetch(new URL("/api/track/ad-landing", req.url), {
        method: "POST",
        headers: { "content-type": "application/json", "x-capture-secret": secret },
        body: JSON.stringify(payload),
      }).catch(() => undefined),
    );
  }

  const res = NextResponse.next();
  if (fresh) {
    res.cookies.set(ADV_COOKIE, sid, {
      path: "/",
      maxAge: 60 * 30, // 30 min — long enough to link the landing session
      sameSite: "lax",
      httpOnly: false, // the client tracker reads this to share the session id
      secure: process.env.NODE_ENV === "production",
    });
  }
  return res;
}

export const config = {
  // Run on admin + public page routes; skip api, _next, and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)"],
};

import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";

const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid"] as const;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
const ADV_COOKIE = "adv_sid";

/**
 * - /admin: cheap auth gate (cookie presence; full validation server-side).
 * - public ad landings (a Google click id is in the URL): tag the request with
 *   x-adv-* headers + an `adv_sid` cookie so the server-side capture component
 *   and the client tracker share one session id. Organic traffic is untouched.
 */
export function middleware(req: NextRequest) {
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

  const headers = new Headers(req.headers);
  headers.set("x-adv-capture", "1");
  headers.set("x-adv-sid", sid);
  headers.set("x-adv-landing", pathname);
  for (const k of CLICK_ID_KEYS) {
    const v = searchParams.get(k);
    if (v) headers.set(`x-adv-${k}`, v);
  }
  for (const u of UTM_KEYS) {
    const v = searchParams.get(u);
    if (v) headers.set(`x-adv-${u}`, v);
  }

  const res = NextResponse.next({ request: { headers } });
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

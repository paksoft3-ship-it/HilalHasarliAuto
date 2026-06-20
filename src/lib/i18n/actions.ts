"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ADMIN_LOCALE_COOKIE, type AdminLocale } from "./admin";

export async function setAdminLocale(locale: AdminLocale): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_LOCALE_COOKIE, locale === "en" ? "en" : "tr", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/admin", "layout");
}

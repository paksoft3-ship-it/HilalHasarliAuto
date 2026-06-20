/**
 * Human-readable application reference, separate from the immutable DB id.
 * Format: ON-YYMMDD-XXXX (brand prefix · date · random base32).
 */
export function generateReference(prefix = "ON"): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let rand = "";
  for (let i = 0; i < 4; i++) {
    rand += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}-${yy}${mm}${dd}-${rand}`;
}

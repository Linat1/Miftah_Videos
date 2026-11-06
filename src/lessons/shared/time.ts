// Helpers for clock times. Times are stored as minutes since midnight.
export const t = (h: number, m = 0) => h * 60 + m;

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
export const arDigits = (s: string) => s.replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);

/** "7:05" (12-hour) or "19:05" with `h24`. Two-digit hours with `pad`. */
export const fmt = (mins: number, h24 = false, pad = false) => {
  const m = Math.round(mins);
  let h = Math.floor(m / 60) % 24;
  if (!h24) h = h % 12 || 12;
  const hh = pad ? String(h).padStart(2, "0") : String(h);
  return `${hh}:${String(m % 60).padStart(2, "0")}`;
};

import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ARABIC_FONT, LATIN_FONT } from "../../../fonts";
import { CAST } from "../Character";
import type { LineTiming } from "./types";

const OUTLINE = "0 3px 0 #10202f, 3px 0 0 #10202f, -3px 0 0 #10202f, 0 -3px 0 #10202f, 3px 3px 0 #10202f, -3px -3px 0 #10202f, 3px -3px 0 #10202f, -3px 3px 0 #10202f, 0 8px 18px rgba(0,0,0,0.5)";
const THIN = "0 2px 0 #10202f, 2px 0 0 #10202f, -2px 0 0 #10202f, 0 -2px 0 #10202f, 0 4px 12px rgba(0,0,0,0.6)";
const SPEAKER_COLOURS: Record<string, string> = {
  yusuf: "#e0b872", maryam: "#b7a6d8", waiter: "#9fbfa2", aisha: "#5fb8b0", noor: "#e6c9a0", narrator: "#f5c451",
};

/** Big outlined captions: Arabic with the current word lit up, English underneath. */
export const StoryCaption: React.FC<{ timing: LineTiming[] }> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cur = timing.find((t) => frame >= t.start && frame < t.start + t.dur + 6);
  if (!cur) return null;
  const { line } = cur;
  const local = frame - cur.start;
  const appear = interpolate(local, [0, 5], [0, 1], { extrapolateRight: "clamp" });
  const words = line.ar ? line.ar.split(" ") : [];
  // spread the highlight across the line (weighted by word length)
  const weights = words.map((w) => w.length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  const progress = (local / cur.dur) * total;
  let acc = 0;
  const activeIdx = words.findIndex((_, i) => {
    acc += weights[i];
    return progress < acc;
  });
  const name = line.who === "narrator" ? "Miftah" : CAST[line.who].nameEn;
  const nameAr = line.who === "narrator" ? "" : CAST[line.who].nameAr;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", flexDirection: "column", alignItems: "center", opacity: appear, transform: `translateY(${(1 - appear) * 12}px)` }}>
      <div style={{ background: SPEAKER_COLOURS[line.who] ?? "#fff", color: "#10202f", fontFamily: LATIN_FONT, fontWeight: 700, fontSize: 24, padding: "2px 16px", borderRadius: 12, marginBottom: 2, display: "flex", gap: 10, alignItems: "center" }}>
        <span>{name}</span>
        {nameAr ? <span style={{ fontFamily: ARABIC_FONT, fontSize: 24 }}>{nameAr}</span> : null}
      </div>
      {line.ar ? (
        <div dir="rtl" style={{ fontFamily: ARABIC_FONT, fontWeight: 700, fontSize: 66, lineHeight: 1.65, color: "#fff", textShadow: OUTLINE, maxWidth: 1700, textAlign: "center" }}>
          {words.map((w, i) => (
            <span key={i} style={{ color: i === activeIdx || (activeIdx === -1 && i === words.length - 1 && local < cur.dur) ? "#ffd23f" : "#fff" }}>
              {w}{i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </div>
      ) : null}
      <div style={{ fontFamily: LATIN_FONT, fontWeight: 700, fontSize: line.ar ? 34 : 50, color: line.ar ? "#ffe9a8" : "#fff", textShadow: THIN, maxWidth: 1600, textAlign: "center", lineHeight: 1.3 }}>
        {line.en}
      </div>
    </div>
  );
};

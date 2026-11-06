// Writes the play script + recording checklist for the D1-L02 story episode.
//   npm run script:d1-l02-story   →  docs/D1-L02-story-script.md
import { writeFileSync } from "node:fs";
import { CAST } from "../src/lessons/shared/Character";
import { SETS } from "../src/lessons/shared/sets";
import { TIMELINE } from "../src/lessons/d1-l02-story/Episode";
import { EPISODE } from "../src/lessons/d1-l02-story/story";
import { lineFrames, FPS } from "../src/lessons/shared/story/timeline";
import type { StoryEvent, StoryLine } from "../src/lessons/shared/story/types";

const name = (w: string) => (w === "narrator" ? "NARRATOR" : CAST[w as keyof typeof CAST].nameEn.toUpperCase());
const ts = (f: number) => `${Math.floor(f / FPS / 60)}:${String(Math.floor((f / FPS) % 60)).padStart(2, "0")}`;
const EMOTE: Record<string, string> = { "!": "is shocked", "?": "is confused", "?!": "can't believe it", zz: "is still half asleep", sweat: "is flustered" };

const direction = (e: StoryEvent): string | null => {
  if (e.do === "sfx") return null;
  const who = CAST[e.who].nameEn;
  if (e.do === "enter") return `${who} ${e.run ? "rushes" : "walks"} in from the ${e.from}.`;
  if (e.do === "exit") return `${who} dashes off to the ${e.to}.`;
  if (e.do === "faint") return `${who} faints!`;
  if (e.do === "hop") return `${who} does a happy little jump.`;
  if (e.do === "emote") return `${who} ${EMOTE[e.type]}.`;
  return null;
};

const lineBlock = (l: StoryLine) => {
  const before = (l.events ?? []).filter((e) => e.when !== "end").map(direction).filter(Boolean);
  const after = (l.events ?? []).filter((e) => e.when === "end").map(direction).filter(Boolean);
  let s = "";
  if (before.length) s += `*(${before.join(" ")})*\n\n`;
  s += `**${name(l.who)}**${l.tone ? ` *(${l.tone})*` : ""} · \`${l.id}\`\n\n`;
  if (l.ar) s += `> <span dir="rtl">${l.ar}</span>\n>\n> *${l.en}*\n\n`;
  else s += `> ${l.en}\n\n`;
  if (after.length) s += `*(${after.join(" ")})*\n\n`;
  return s;
};

let md = `# ${EPISODE.titleAr} · ${EPISODE.titleEn}\n\n`;
md += `**${EPISODE.lesson}** · Miftah Arabic · story episode script\n\n`;
md += `**Cast:** Yusuf (a student, always late) · Maryam (his big sister) · Aisha (his classmate) · Noor (the teacher) · the waiter · a narrator (English, for the tips)\n\n`;
md += `**Running time:** about ${ts(TIMELINE.total)} (it adjusts to your recordings)\n\n---\n\n`;

let scene = 0;
const all: { l: StoryLine; at: number }[] = [];
for (const { seg, from, timing } of TIMELINE.placed) {
  timing.forEach((t) => all.push({ l: t.line, at: from + t.start }));
  if (seg.kind === "scene") {
    scene++;
    const onStage = seg.cast.filter((c) => !seg.lines.some((l) => (l.events ?? []).some((e) => e.do === "enter" && e.who === c.who)));
    md += `## Scene ${scene} · ${SETS[seg.set].label}, ${seg.timeLabel.en} <span dir="rtl">(${seg.timeLabel.ar})</span>\n\n`;
    md += `*${seg.alarm ? "An alarm clock rings. " : ""}${onStage.length ? `On stage: ${onStage.map((c) => CAST[c.who].nameEn).join(", ")}.` : ""} The wall clock shows ${seg.timeLabel.en.replace(/\.$/, "")}.*\n\n`;
    seg.lines.forEach((l) => (md += lineBlock(l)));
  } else if (seg.kind === "tip") {
    md += `### 💡 Miftah tip\n\n*3D clock cut-away. On screen: ${seg.title.replace(/[{}]/g, "")}.*\n\n${lineBlock(seg.line)}`;
  } else if (seg.kind === "quiz") {
    md += `### ❓ Quiz ${seg.number} · ${seg.question}\n\n*Noor stands by the chalkboard.${seg.clock !== undefined ? " A clock is drawn on the board." : ""}*\n\n${lineBlock(seg.line)}`;
    md += `Options on the board: ${seg.options.map((o, i) => `${["أ", "ب", "ج"][i]}) <span dir="rtl">${o}</span>${i === seg.correct ? " ✅" : ""}`).join(" · ")}\n\n`;
    md += `*(4-second countdown, then the answer is revealed.)*\n\n`;
  } else if (seg.id === "title") {
    md += `### Title card\n\n*<span dir="rtl">${EPISODE.titleAr}</span>: ${EPISODE.titleEn}*\n\n`;
  } else {
    md += `### The end\n\n*The whole cast lines up and hops. On screen: <span dir="rtl">النِّهَايَةُ</span>, the next lesson, and <span dir="rtl">بِالْعِلْمِ نَفْتَحُ الْأَبْوَابَ</span>.*\n\n`;
    timing.forEach((t) => (md += lineBlock(t.line)));
  }
}

md += `---\n\n## Recording checklist\n\n`;
md += `Record **one file per line** (a phone voice recorder is fine), named after the **File** column, e.g. \`s1-01.m4a\`.\n`;
md += `Put the files in \`recordings/d1-l02/\` and run \`npm run voices:d1-l02\`. Silence is trimmed and the video re-times itself.\n\n`;
md += `| ✓ | File | Speaker | Line | How to say it | Approx. |\n|---|---|---|---|---|---|\n`;
for (const { l } of all) {
  md += `| ☐ | \`${l.id}\` | ${name(l.who)} | ${l.ar ? `<span dir="rtl">${l.ar}</span>` : l.en} | ${l.tone ?? ""} | ${(lineFrames(l, {}) / FPS).toFixed(1)} s |\n`;
}
md += `\n**Lines per speaker:** ${Object.entries(all.reduce<Record<string, number>>((a, { l }) => ((a[name(l.who)] = (a[name(l.who)] ?? 0) + 1), a), {})).map(([k, v]) => `${k} ${v}`).join(" · ")}\n`;
writeFileSync("docs/D1-L02-story-script.md", md);
console.log("✅ docs/D1-L02-story-script.md");

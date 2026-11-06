// Writes the voice-recording script for the D1-L02 story episode.
//   npm run script:d1-l02-story
import { writeFileSync } from "node:fs";
import { CAST } from "../src/lessons/shared/Character";
import { TIMELINE } from "../src/lessons/d1-l02-story/Episode";
import { lineFrames, FPS } from "../src/lessons/shared/story/timeline";

const ts = (f: number) => `${Math.floor(f / FPS / 60)}:${String(Math.floor((f / FPS) % 60)).padStart(2, "0")}`;
let md = `# D1-L02 story · "Yusuf's Busy Wednesday": voice recording script\n\n`;
md += `Running time with estimated timings: **${ts(TIMELINE.total)}** (it adjusts to your recordings).\n\n`;
md += `## How to record\n\n`;
md += `1. Record **one file per line**, e.g. with your phone's voice recorder. Leave a second of silence before and after; it's trimmed automatically.\n`;
md += `2. Name each file after its **File** column below (e.g. \`s1-01.m4a\`). Any of m4a, mp3, wav, ogg works.\n`;
md += `3. Put the files in the folder \`recordings/d1-l02/\`.\n`;
md += `4. Run \`npm run voices:d1-l02\`. The video re-times itself to your recordings.\n`;
md += `5. Preview with \`npm run dev\` (choose **D1-L02-Story**), then render with \`npm run render:d1-l02-story\`.\n\n`;
md += `You don't need to record everything at once: lines without a recording keep the music and captions.\n`;
md += `Tip: give each character a slightly different voice. Students can play the parts!\n\n`;
for (const { seg, from, timing } of TIMELINE.placed) {
  if (!timing.length) continue;
  const title =
    seg.kind === "scene" ? `Scene · ${seg.id} (${seg.timeLabel.en})` : seg.kind === "tip" ? "Miftah tip (narrator, English)" : seg.kind === "quiz" ? `Quiz ${seg.number}` : "Ending";
  md += `## ${title}\n\n| File | Speaker | Arabic | English | Approx. |\n|---|---|---|---|---|\n`;
  for (const t of timing) {
    const who = t.line.who === "narrator" ? "Narrator" : CAST[t.line.who].nameEn;
    const secs = (lineFrames(t.line, {}) / FPS).toFixed(1);
    md += `| \`${t.line.id}\` | ${who} | ${t.line.ar ?? ""} | ${t.line.en} | ${secs} s · at ${ts(from + t.start)} |\n`;
  }
  md += `\n`;
}
writeFileSync("docs/D1-L02-story-voice-script.md", md);
console.log("✅ docs/D1-L02-story-voice-script.md");

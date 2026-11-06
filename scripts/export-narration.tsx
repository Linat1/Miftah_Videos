// Writes docs/D1-L02-narration-script.md from the scene data, so the
// voice-over script always matches the video timings.
//   npm run script:d1-l02
import { writeFileSync } from "node:fs";
import { FPS, SCENES, STARTS, TOTAL_FRAMES } from "../src/lessons/d1-l02/TellingTheTime";

const ts = (sec: number) => `${Math.floor(sec / 60)}:${(sec % 60).toFixed(1).padStart(4, "0")}`;
let md = `# D1-L02 · Telling the Time — voice-over script\n\n`;
md += `Total length: **${ts(TOTAL_FRAMES / FPS)}**. Each line shows the moment it should start.\n\n`;
md += `**How to record:** record one continuous take while watching the video in \`npm run dev\` (muted),\n`;
md += `reading each line when its time appears. Save it as \`public/audio/d1-l02-narration.mp3\`, then in the\n`;
md += `Studio set **narrationFile** to \`audio/d1-l02-narration.mp3\`. For exactly matching captions, run\n`;
md += `\`npm run captions -- public/audio/d1-l02-narration.mp3\` and set **captionsFile** to the JSON it makes.\n\n`;
md += `Narrator lines are in English. Character lines are in Arabic, so you can voice them yourself or with\n`;
md += `students playing the roles.\n\n`;
md += `| Start | Scene | Speaker | Line |\n|---|---|---|---|\n`;
SCENES.forEach((s, i) => {
  const rows = [
    ...s.narration.map((l) => ({ at: l.at, who: "Narrator", text: l.text })),
    ...(s.dialogue ?? []).map((d) => ({ at: d.at, who: d.who, text: `${d.ar}<br>*${d.en}*` })),
  ].sort((a, b) => a.at - b.at);
  rows.forEach((r) => {
    md += `| ${ts(STARTS[i] / FPS + r.at)} | ${s.id} | ${r.who} | ${r.text} |\n`;
  });
});
console.log(SCENES.map((s, i) => `${s.id}@${STARTS[i]}`).join("  "));
writeFileSync("docs/D1-L02-narration-script.md", md);
console.log("✅ docs/D1-L02-narration-script.md");

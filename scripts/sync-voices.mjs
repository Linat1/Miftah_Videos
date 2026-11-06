// Prepares your voice recordings for a story episode and re-times the video to them.
//
//   npm run voices:d1-l02
//
// 1. Put one recording per line in recordings/<episode>/, named after the line id:
//      recordings/d1-l02/s1-01.m4a, s1-02.m4a, ...   (any of: m4a mp3 wav ogg aac webm)
// 2. Run the command. For each file it trims silence at both ends, evens out the
//    volume, saves public/voices/<episode>/<id>.mp3 and measures its length.
// 3. Lines are re-timed to your recordings (written to voice-timing.json).
//    Lines you haven't recorded keep their estimated timing.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const episode = process.argv[2] ?? "d1-l02";
const timingFile = process.argv[3] ?? `src/lessons/${episode}-story/voice-timing.json`;
const inDir = path.join("recordings", episode);
const outDir = path.join("public", "voices", episode);
const EXT = /\.(m4a|mp3|wav|ogg|aac|webm)$/i;

// Uses the FFmpeg that ships with Remotion, so nothing extra needs installing.
const run = (tool, args, binary = false) => {
  const r = spawnSync("npx", ["remotion", tool, ...args], {
    encoding: binary ? "buffer" : "utf8",
    maxBuffer: 1024 * 1024 * 512,
    shell: process.platform === "win32",
  });
  if (r.status !== 0) throw new Error(`${tool} failed: ${r.stderr?.toString() || r.stdout?.toString()}`);
  return r.stdout;
};

/** Finds where speech starts and ends (skips silence at both ends). */
const speechBounds = (file) => {
  const SR = 16000;
  const wav = run("ffmpeg", ["-loglevel", "error", "-i", file, "-ac", "1", "-ar", String(SR), "-c:a", "pcm_s16le", "-f", "wav", "-"], true);
  // skip the WAV header: find the "data" chunk
  const at = wav.indexOf("data");
  const pcm = wav.subarray(at + 8);
  const n = Math.floor(pcm.length / 2);
  const win = SR / 50; // 20 ms windows
  const loud = [];
  let peak = 0;
  for (let i = 0; i + win <= n; i += win) {
    let sum = 0;
    for (let j = 0; j < win; j++) {
      const v = pcm.readInt16LE((i + j) * 2) / 32768;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / win);
    peak = Math.max(peak, rms);
    loud.push(rms);
  }
  const threshold = Math.max(0.006, peak * 0.06); // about −45 dB, or 6% of the loudest part
  const first = loud.findIndex((r) => r > threshold);
  const last = loud.length - 1 - [...loud].reverse().findIndex((r) => r > threshold);
  const total = n / SR;
  if (first < 0) return { start: 0, end: total };
  return { start: Math.max(0, first * 0.02 - 0.08), end: Math.min(total, (last + 1) * 0.02 + 0.15) };
};

if (!existsSync(inDir)) {
  mkdirSync(inDir, { recursive: true });
  console.log(`Created ${inDir}/. Put your recordings there (e.g. s1-01.m4a) and run this again.`);
  process.exit(0);
}
mkdirSync(outDir, { recursive: true });

const files = readdirSync(inDir).filter((f) => EXT.test(f)).sort();
if (!files.length) {
  console.log(`No recordings found in ${inDir}/ yet.`);
}
const timing = {};
for (const f of files) {
  const id = f.replace(EXT, "");
  const out = path.join(outDir, `${id}.mp3`);
  const src = path.join(inDir, f);
  const { start, end } = speechBounds(src);
  run("ffmpeg", [
    "-y", "-loglevel", "error", "-i", src,
    "-af", `atrim=start=${start.toFixed(3)}:end=${end.toFixed(3)},asetpts=PTS-STARTPTS,loudnorm=I=-16:TP=-1.5:LRA=11`,
    "-ar", "44100", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "128k", out,
  ]);
  const seconds = parseFloat(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out]));
  timing[id] = { file: `${id}.mp3`, seconds: Math.round(seconds * 100) / 100 };
  console.log(`  ✓ ${id.padEnd(8)} ${timing[id].seconds.toFixed(2)} s`);
}
writeFileSync(timingFile, JSON.stringify(timing, null, 2) + "\n");
console.log(`\n✅ ${files.length} recording(s) ready. Timings saved to ${timingFile}.`);
console.log("   Preview with `npm run dev`, then render with `npm run render:d1-l02-story`.");

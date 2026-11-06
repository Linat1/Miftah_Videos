// Turn a narration audio file into word-by-word captions for Remotion.
//
//   npm run captions -- public/audio/my-narration.mp3
//   npm run captions -- public/audio/my-narration.mp3 ar      (Arabic)
//
// Output: public/captions/<audio-name>.json  (use it as "captionsFile")
//
// First run downloads whisper.cpp and a speech model (~500 MB) into ./whisper.cpp.
// Everything runs on your own computer: no account or API key needed.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import {
  installWhisperCpp,
  downloadWhisperModel,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";

const [input, language = "en"] = process.argv.slice(2);
if (!input) {
  console.error("Usage: npm run captions -- <audio-or-video-file> [language: en|ar|...]");
  process.exit(1);
}

const WHISPER_PATH = path.resolve("whisper.cpp");
const WHISPER_VERSION = "1.7.6";
// "small" handles Arabic well and is fast. Use "medium" or "large-v3-turbo" for better accuracy.
const MODEL = process.env.WHISPER_MODEL ?? "small";

await installWhisperCpp({ to: WHISPER_PATH, version: WHISPER_VERSION });
await downloadWhisperModel({ model: MODEL, folder: WHISPER_PATH });

// Whisper needs 16 kHz mono WAV.
mkdirSync("out", { recursive: true });
const wav = path.resolve("out", "_whisper-input.wav");
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", input, "-ar", "16000", "-ac", "1", wav]);

const whisperCppOutput = await transcribe({
  inputPath: wav,
  whisperPath: WHISPER_PATH,
  whisperCppVersion: WHISPER_VERSION,
  model: MODEL,
  language,
  tokenLevelTimestamps: true,
  splitOnWord: true,
});
rmSync(wav, { force: true });

const { captions } = toCaptions({ whisperCppOutput });
const outFile = path.join("public", "captions", `${path.parse(input).name}.json`);
mkdirSync(path.dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(captions, null, 2));
console.log(`\n✅ ${captions.length} caption words written to ${outFile}`);
console.log(`   Set captionsFile to "captions/${path.parse(input).name}.json" in the Studio.`);

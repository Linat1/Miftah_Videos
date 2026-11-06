// Generates the royalty-free music bed and sound effects used by lesson videos.
// Everything is synthesised from code, so there are no licensing concerns.
//
//   node scripts/make-lesson-audio.mjs
//
// Output: public/audio/lesson-music.mp3 and public/audio/sfx/*.mp3
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const SR = 44100;
const TMP = path.resolve("out", "_audio");
mkdirSync(TMP, { recursive: true });
mkdirSync("public/audio/sfx", { recursive: true });

const writeWav = (file, samples) => {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + samples.length * 2, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((s, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), 44 + i * 2));
  writeFileSync(file, buf);
};
const toMp3 = (name, samples, outDir) => {
  const wav = path.join(TMP, `${name}.wav`);
  writeWav(wav, samples);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wav, "-b:a", "128k", path.join(outDir, `${name}.mp3`)]);
};
const normalize = (s, peak) => {
  const m = s.reduce((a, v) => Math.max(a, Math.abs(v)), 0) || 1;
  return s.map((v) => (v / m) * peak);
};
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
// Deterministic pseudo-random noise
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

// ---------- Music bed: calm pad + soft plucked arpeggio, 100 bpm ----------
const DURATION = 170; // seconds (longer than the video; it fades out by frame)
const n = DURATION * SR;
const music = new Float32Array(n);
const CHORD_LEN = 4.8; // two bars at 100 bpm
// Fmaj7, Am7, Dm9, Csus2/G  (MIDI notes)
const chords = [
  [53, 57, 60, 64], [57, 60, 64, 67], [50, 57, 62, 65], [55, 60, 62, 67],
];
for (let i = 0; i < n; i++) {
  const t = i / SR;
  const ci = Math.floor(t / CHORD_LEN);
  const local = t - ci * CHORD_LEN;
  const chord = chords[ci % chords.length];
  // smooth crossfade envelope for the pad
  const env = Math.min(1, local / 0.8) * Math.min(1, (CHORD_LEN - local) / 0.8 + 0.25);
  let v = 0;
  for (const note of chord) {
    const f = hz(note);
    v += Math.sin(2 * Math.PI * f * t) * 0.5 + Math.sin(2 * Math.PI * f * 1.003 * t) * 0.35 +
      Math.sin(2 * Math.PI * f * 2 * t) * 0.06;
  }
  music[i] += v * env * 0.08;
}
// Plucked arpeggio on eighth notes (0.3 s)
const STEP = 0.3;
for (let k = 0; k * STEP < DURATION; k++) {
  const start = k * STEP;
  const chord = chords[Math.floor(start / CHORD_LEN) % chords.length];
  const pattern = [0, 2, 3, 1, 2, 3, 1, 2];
  const note = chord[pattern[k % pattern.length]] + 12;
  const f = hz(note);
  const accent = k % 4 === 0 ? 1 : 0.65;
  const s0 = Math.floor(start * SR);
  for (let j = 0; j < SR * 1.2 && s0 + j < n; j++) {
    const t = j / SR;
    const e = Math.exp(-t * 5) * Math.min(1, t / 0.004);
    music[s0 + j] += (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2 * t)) * e * 0.07 * accent;
  }
}
// Simple stereo-less echo for space
const d = Math.floor(0.45 * SR);
for (let i = d; i < n; i++) music[i] += music[i - d] * 0.28;
toMp3("lesson-music", normalize(Array.from(music), 0.7), "public/audio");

// ---------- Sound effects ----------
const make = (secs, fn) => Array.from({ length: Math.floor(secs * SR) }, (_, i) => fn(i / SR));
const sfx = {
  // soft bell for new information
  chime: make(1.6, (t) => (Math.sin(2 * Math.PI * 1046.5 * t) + 0.6 * Math.sin(2 * Math.PI * 1568 * t) +
    0.25 * Math.sin(2 * Math.PI * 2093 * t)) * Math.exp(-t * 3.2) * Math.min(1, t / 0.003)),
  // clock tick
  tick: make(0.08, (t) => (rnd() * 0.5 + Math.sin(2 * Math.PI * 2400 * t)) * Math.exp(-t * 120)),
  // rising three-note "correct"
  correct: make(1.2, (t) => {
    const notes = [72, 76, 79, 84];
    let v = 0;
    notes.forEach((m, k) => {
      const tt = t - k * 0.09;
      if (tt > 0) v += Math.sin(2 * Math.PI * hz(m) * tt) * Math.exp(-tt * 4) * Math.min(1, tt / 0.004);
    });
    return v;
  }),
  // gentle low "uh-oh" for mistakes
  wrong: make(0.7, (t) => {
    const f = t < 0.18 ? hz(55) : hz(51);
    const tt = t < 0.18 ? t : t - 0.18;
    return (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 3 * t)) * Math.exp(-tt * 6) * Math.min(1, tt / 0.01);
  }),
  // alarm-clock bell ring (fast hammer on two bells)
  alarm: make(2.2, (t) => {
    const hammer = Math.floor(t * 22) % 2 === 0 ? 1 : 0.55;
    const env = Math.min(1, t / 0.01) * Math.min(1, (2.2 - t) / 0.3);
    return (Math.sin(2 * Math.PI * 2350 * t) + 0.7 * Math.sin(2 * Math.PI * 3120 * t) + 0.3 * Math.sin(2 * Math.PI * 1180 * t)) *
      hammer * env * (0.75 + 0.25 * Math.sin(2 * Math.PI * 22 * t));
  }),
  // cartoon pop for reactions (!, ?)
  pop: make(0.25, (t) => Math.sin(2 * Math.PI * (300 + 900 * Math.min(1, t / 0.06)) * t) * Math.exp(-t * 18) * Math.min(1, t / 0.003)),
  // airy whoosh for transitions
  whoosh: (() => {
    let lp = 0;
    return make(0.8, (t) => {
      const a = 0.02 + 0.25 * Math.sin(Math.PI * Math.min(1, t / 0.8));
      lp += a * (rnd() - lp);
      return lp * Math.sin(Math.PI * Math.min(1, t / 0.8));
    });
  })(),
};
for (const [name, s] of Object.entries(sfx)) toMp3(name, normalize(s, name === "tick" ? 0.5 : 0.6), "public/audio/sfx");
rmSync(TMP, { recursive: true, force: true });
console.log("✅ Music and sound effects written to public/audio/");

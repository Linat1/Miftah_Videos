import type { LineTiming, Segment, StoryLine, VoiceTiming } from "./types";

export const FPS = 30;
export const GAP = 10; // frames of breathing room after each line
export const PRE = 36; // establishing shot before the first line of a scene
export const POST = 24;
export const XFADE = 8; // segments overlap by this many frames

/** How long a line takes: the recording if there is one, otherwise a reading-speed estimate. */
export const lineFrames = (line: StoryLine, voices: VoiceTiming) => {
  const v = voices[line.id];
  if (v) return Math.round(v.seconds * FPS);
  const arWords = line.ar ? line.ar.split(/\s+/).length : 0;
  const enWords = line.en.split(/\s+/).length;
  const secs = Math.max(1.7, 0.7 + arWords * 0.55, 0.8 + enWords * 0.32);
  return Math.round(Math.min(6.5, secs) * FPS);
};

export const placeLines = (lines: StoryLine[], voices: VoiceTiming, offset: number): LineTiming[] => {
  let t = offset;
  return lines.map((line) => {
    const dur = lineFrames(line, voices);
    const lt: LineTiming = { line, start: t, dur, voiced: !!voices[line.id], file: voices[line.id]?.file };
    t += dur + GAP;
    return lt;
  });
};

export const QUIZ_COUNT = 4 * FPS;
export const QUIZ_REVEAL = 75;

export type PlacedSegment = { seg: Segment; from: number; duration: number; timing: LineTiming[] };

export const buildTimeline = (segments: Segment[], voices: VoiceTiming) => {
  const placed: PlacedSegment[] = [];
  let at = 0;
  for (const seg of segments) {
    let timing: LineTiming[] = [];
    let duration = 0;
    if (seg.kind === "scene") {
      timing = placeLines(seg.lines, voices, PRE);
      const last = timing[timing.length - 1];
      duration = last.start + last.dur + POST + (seg.tail ?? 0);
    } else if (seg.kind === "tip") {
      timing = placeLines([seg.line], voices, 25);
      duration = Math.max(7 * FPS, timing[0].start + timing[0].dur + 2 * FPS);
    } else if (seg.kind === "quiz") {
      timing = placeLines([seg.line], voices, 15);
      duration = timing[0].start + timing[0].dur + QUIZ_COUNT + QUIZ_REVEAL;
    } else {
      timing = placeLines(seg.lines ?? [], voices, 20);
      duration = seg.seconds * FPS;
    }
    placed.push({ seg, from: at, duration, timing });
    at += duration - XFADE;
  }
  return { placed, total: at + XFADE };
};

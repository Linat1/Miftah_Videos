import type { CastName, Emote } from "../Character";
import type { SetName } from "../sets";
import type { SfxName } from "../Sfx";
import type { StageState } from "../Stage3D";

/** Camera framing for a line. */
export type Shot = "wide" | "close" | "clock" | "two";

/** Things that happen at the start or end of a line. */
export type StoryEvent = { when?: "start" | "end" } & (
  | { do: "emote"; who: CastName; type: Emote }
  | { do: "exit"; who: CastName; to: "left" | "right" }
  | { do: "faint"; who: CastName }
  | { do: "hop"; who: CastName }
  | { do: "enter"; who: CastName; from: "left" | "right"; run?: boolean }
  | { do: "sfx"; name: SfxName }
);

/** One spoken line. `id` is also the voice file name: public/voices/<episode>/<id>.mp3 */
export type StoryLine = {
  id: string;
  who: CastName | "narrator";
  ar?: string;
  en: string;
  shot?: Shot;
  focus?: CastName[]; // characters in a "two" shot
  events?: StoryEvent[];
};

export type CastSpot = {
  who: CastName;
  x: number;
  face: "left" | "right";
  height?: number;
  /** Characters listed here are on stage from the start unless an "enter" event brings them in. */
};

export type SceneSeg = {
  kind: "scene";
  id: string;
  set: SetName;
  time: number; // clock time (minutes since midnight)
  timeLabel: { en: string; ar: string };
  cast: CastSpot[];
  lines: StoryLine[];
  alarm?: boolean;
  tail?: number; // extra frames after the last line (e.g. to let a faint land)
};

export type TipSeg = {
  kind: "tip";
  id: string;
  line: StoryLine; // narrator line
  stage: (frame: number) => Partial<StageState>;
  title: string; // Mixed text, Arabic in {braces}
  example: { hour: string; part: string; color: "past" | "to" | "gold"; wrong?: string };
  rule: string; // Mixed text
};

export type QuizSeg = {
  kind: "quiz";
  id: string;
  number: number;
  line: StoryLine; // Noor asks
  question: string; // English, on the board
  clock?: number;
  options: string[];
  correct: number;
};

export type CustomSeg = {
  kind: "custom";
  id: string;
  seconds: number;
  lines?: StoryLine[];
  Component: React.FC<{ timing: LineTiming[] }>;
};

export type Segment = SceneSeg | TipSeg | QuizSeg | CustomSeg;

/** A line placed on the timeline (frames relative to its segment). */
export type LineTiming = { line: StoryLine; start: number; dur: number; voiced: boolean; file?: string };

/** Measured voice recordings: id → file + seconds (written by `npm run voices`). */
export type VoiceTiming = Record<string, { file: string; seconds: number }>;

import type React from "react";
import type { StageState } from "./Stage3D";

/**
 * One scene of a lesson video.
 * - `Panel` draws the 2D content (frame 0 = start of this scene).
 * - `stage` says where the 3D clock is and what time it shows, per frame.
 * - `narration` lines become captions (and are the voice-over script).
 */
export type SceneDef = {
  id: string;
  duration: number; // frames
  Panel: React.FC;
  stage: (frame: number) => Partial<StageState>;
  narration: { at: number; text: string }[]; // `at` in seconds from scene start
  /** Character lines (for the voice-over script). `at` in seconds. */
  dialogue?: { at: number; who: string; ar: string; en: string }[];
};

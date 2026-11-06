import { Easing, interpolate, spring } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 over `dur` frames, starting at `start`. */
export const ramp = (frame: number, start: number, dur = 15) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

/** Springy 0 → 1 that starts at `start`. */
export const pop = (frame: number, fps: number, start: number, damping = 14) =>
  spring({ frame: frame - start, fps, config: { damping, mass: 0.7 } });

/**
 * Animate a value through keyframes: starts at `initial`, and at each `at`
 * frame it eases to `to` over `move` frames.
 */
export const stepValue = (
  frame: number,
  initial: number,
  keys: { at: number; to: number }[],
  move = 20,
) => {
  let v = initial;
  for (const k of keys) {
    if (frame < k.at) break;
    v = interpolate(frame, [k.at, k.at + move], [v, k.to], {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    });
  }
  return v;
};

/** Index of the last key whose `at` has passed (-1 if none). */
export const activeIndex = (frame: number, ats: number[]) => {
  let idx = -1;
  ats.forEach((a, i) => {
    if (frame >= a) idx = i;
  });
  return idx;
};

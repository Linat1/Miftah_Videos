import React from "react";
import { Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";

export type SfxName = "chime" | "tick" | "correct" | "wrong" | "whoosh" | "alarm" | "pop";

/** Plays a short sound effect at a given frame (relative to the scene). */
export const Sfx: React.FC<{ at: number; name: SfxName; volume?: number }> = ({
  at,
  name,
  volume = 0.5,
}) => (
  <Sequence from={at} durationInFrames={60} layout="none">
    <Audio src={staticFile(`audio/sfx/${name}.mp3`)} volume={volume} />
  </Sequence>
);

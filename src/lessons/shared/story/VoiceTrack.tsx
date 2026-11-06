import React from "react";
import { Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import type { LineTiming } from "./types";

/** Plays each recorded voice line at its place on the timeline. */
export const VoiceTrack: React.FC<{ timing: LineTiming[]; folder: string }> = ({ timing, folder }) => (
  <>
    {timing.map((t) =>
      t.voiced && t.file ? (
        <Sequence key={t.line.id} from={t.start} durationInFrames={t.dur + 15} layout="none">
          <Audio src={staticFile(`${folder}/${t.file}`)} />
        </Sequence>
      ) : null,
    )}
  </>
);

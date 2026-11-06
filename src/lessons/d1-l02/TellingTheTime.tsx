import React, { useMemo } from "react";
import { z } from "zod";
import { AbsoluteFill, Easing, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import type { Caption } from "@remotion/captions";
import { CaptionLayer } from "../../captions/CaptionLayer";
import { STAGE_DEFAULT, Stage3D, blendStage, type StageState } from "../shared/Stage3D";
import { SceneFade, En } from "../shared/ui";
import type { SceneDef } from "../shared/scene";
import { C } from "../shared/theme";
import { intro, objectives } from "./scenes/opening";
import { askTime, cafe, training, goodbye } from "./scenes/characters";
import { minutesPast, minutesTo, rulePast, ruleTo, mistake } from "./scenes/clockwork";
import { h24, schedule, quiz, outro } from "./scenes/practice";
import { LESSON } from "./content";

export const FPS = 30;
const FADE = 15; // frames that neighbouring scenes overlap

export const SCENES: SceneDef[] = [
  intro, objectives, askTime,
  minutesPast, minutesTo, rulePast, ruleTo, mistake,
  h24, schedule, cafe, training,
  ...quiz,
  outro, goodbye,
];

// When each scene starts (scenes overlap by FADE frames for smooth transitions)
export const STARTS = SCENES.reduce<number[]>(
  (acc, s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].duration - FADE],
  [],
);
export const TOTAL_FRAMES = STARTS[STARTS.length - 1] + SCENES[SCENES.length - 1].duration;

const stageAt = (i: number, frame: number): StageState => ({
  ...STAGE_DEFAULT,
  ...SCENES[i].stage(frame - STARTS[i]),
});

/** Where the clock is at a global frame, blending across scene overlaps. */
const stageForFrame = (frame: number): StageState => {
  let i = 0;
  STARTS.forEach((s, k) => {
    if (frame >= s) i = k;
  });
  const local = frame - STARTS[i];
  if (i > 0 && local < FADE) {
    const p = Easing.inOut(Easing.cubic)(local / FADE);
    return blendStage(stageAt(i - 1, frame), stageAt(i, frame), p);
  }
  return stageAt(i, frame);
};

/** Turns the narration script into timed, word-by-word captions. */
export const narrationCaptions = (): Caption[] => {
  const out: Caption[] = [];
  SCENES.forEach((scene, i) => {
    scene.narration.forEach((line) => {
      let ms = (STARTS[i] / FPS + line.at) * 1000;
      const words = line.text.split(" ");
      words.forEach((w, k) => {
        const dur = Math.min(800, Math.max(260, 180 + w.length * 45));
        out.push({
          text: (k === 0 ? "" : " ") + w,
          startMs: Math.round(ms),
          endMs: Math.round(ms + dur),
          timestampMs: Math.round(ms + dur / 2),
          confidence: 1,
          ...(k === words.length - 1 ? { pageBreakAfter: true } : {}),
        });
        ms += dur;
      });
    });
  });
  return out;
};

export const tellingTheTimeSchema = z.object({
  narrationFile: z.string().describe("Your recorded voice-over in /public (empty = music only)"),
  captionsFile: z.string().describe("Captions JSON from `npm run captions` (empty = use the script)"),
  showCaptions: z.boolean(),
  musicVolume: z.number().min(0).max(1),
});

export const TellingTheTime: React.FC<z.infer<typeof tellingTheTimeSchema>> = ({
  narrationFile,
  captionsFile,
  showCaptions,
  musicVolume,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const stage = stageForFrame(frame);
  const scriptCaptions = useMemo(narrationCaptions, []);
  // Music sits lower when there is a voice-over
  const bed = narrationFile ? musicVolume * 0.45 : musicVolume;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 25% 45%, ${C.bg2} 0%, ${C.bg} 65%)` }}>
      <Stage3D state={stage} />

      {SCENES.map((s, i) => (
        <Sequence key={s.id} from={STARTS[i]} durationInFrames={s.duration} name={s.id}>
          <SceneFade duration={s.duration} fade={FADE}>
            <s.Panel />
          </SceneFade>
        </Sequence>
      ))}

      {/* Lesson tag, top-left */}
      <div style={{ position: "absolute", left: 60, top: 40, opacity: interpolate(frame, [200, 230], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <En size={24} color={C.gold}>{LESSON.code}</En>
        <En size={24} color={C.muted}> · Miftah Arabic</En>
      </div>

      {showCaptions ? (
        captionsFile ? (
          <CaptionLayer file={captionsFile} fontScale={0.6} combineMs={8000} />
        ) : (
          <CaptionLayer captions={scriptCaptions} fontScale={0.6} combineMs={8000} />
        )
      ) : null}

      <Audio
        src={staticFile("audio/lesson-music.mp3")}
        volume={(f) =>
          interpolate(f, [0, 30, durationInFrames - 60, durationInFrames], [0, bed, bed, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      {narrationFile ? <Audio src={staticFile(narrationFile)} /> : null}
    </AbsoluteFill>
  );
};

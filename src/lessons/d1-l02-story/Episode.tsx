import React from "react";
import { z } from "zod";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { StoryScene } from "../shared/story/StoryScene";
import { TipView, QuizView } from "../shared/story/segments";
import { buildTimeline, XFADE } from "../shared/story/timeline";
import { StoryCaption } from "../shared/story/StoryCaption";
import { VoiceTrack } from "../shared/story/VoiceTrack";
import type { CustomSeg, LineTiming, Segment, VoiceTiming } from "../shared/story/types";
import { Character, type CastName } from "../shared/Character";
import { Floor } from "../shared/Dialogue";
import { SETS } from "../shared/sets";
import { Sfx } from "../shared/Sfx";
import { Ar, En } from "../shared/ui";
import { C } from "../shared/theme";
import { pop } from "../shared/anim";
import voiceTiming from "./voice-timing.json";
import { ENDING, EPISODE, QUIZ, S1, S2, S3, S4, S5, TIP1, TIP2, TIP3 } from "./story";

// ---------- Title card ----------
const Title: React.FC<{ timing: LineTiming[] }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, 8, 11);
  const Back = SETS.bedroom.Back;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, filter: "blur(6px) brightness(0.55)", transform: "scale(1.05)" }}><Back /></div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 6 }}>
        <div style={{ transform: `scale(${0.6 + 0.4 * p})`, opacity: Math.min(1, p * 1.4), textAlign: "center" }}>
          <Ar size={150} color={C.goldSoft} title style={{ textShadow: "0 8px 30px rgba(0,0,0,0.6)" }}>{EPISODE.titleAr}</Ar>
        </div>
        <div style={{ opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textAlign: "center" }}>
          <En size={64} style={{ textShadow: "0 6px 20px rgba(0,0,0,0.6)" }}>{EPISODE.titleEn}</En>
          <div><En size={32} color={C.gold}>{EPISODE.lesson} · Miftah Arabic</En></div>
        </div>
      </AbsoluteFill>
      <Sfx at={0} name="whoosh" volume={0.4} />
      <Sfx at={10} name="chime" volume={0.4} />
    </AbsoluteFill>
  );
};

// ---------- The end: whole cast ----------
const ORDER: CastName[] = ["yusuf", "maryam", "noor", "aisha", "waiter"];
const End: React.FC<{ timing: LineTiming[] }> = ({ timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, 10, 11);
  const said = timing[0];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, ${C.bg2} 0%, ${C.bg} 70%)` }}>
      <Floor />
      <div style={{ position: "absolute", top: 50, left: 0, right: 0, textAlign: "center", opacity: Math.min(1, p * 1.4), transform: `scale(${0.7 + 0.3 * p})` }}>
        <Ar size={110} color={C.goldSoft} title>{ENDING.theEnd}</Ar>
        <div><En size={36}>The End · {ENDING.next}</En></div>
        <div><Ar size={52} color={C.gold} title>{ENDING.motto}</Ar></div>
      </div>
      {ORDER.map((who, i) => (
        <Character key={who} who={who} x={300 + i * 330} floor={1030} height={540} face={i < 2 ? "right" : "left"}
          enterAt={i * 5} enterFrom={i < 2 ? "left" : "right"} hops={[60 + i * 7, 110 + i * 7]}
          talking={who === "noor" && said ? [[said.start, said.start + said.dur]] : []} />
      ))}
      <StoryCaption timing={timing} />
      <Sfx at={60} name="correct" volume={0.3} />
    </AbsoluteFill>
  );
};

const TITLE: CustomSeg = { kind: "custom", id: "title", seconds: 4.5, Component: Title };
const ENDSEG: CustomSeg = { kind: "custom", id: "end", seconds: 7, lines: [ENDING.line], Component: End };

export const SEGMENTS: Segment[] = [TITLE, S1, TIP1, S2, TIP2, S3, TIP3, S4, S5, ...QUIZ, ENDSEG];
export const TIMELINE = buildTimeline(SEGMENTS, voiceTiming as VoiceTiming);

export const episodeSchema = z.object({
  musicVolume: z.number().min(0).max(1),
});

export const Episode: React.FC<z.infer<typeof episodeSchema>> = ({ musicVolume }) => {
  const { durationInFrames } = useVideoConfig();
  const folder = EPISODE.voiceFolder;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {TIMELINE.placed.map(({ seg, from, duration, timing }) => (
        <Sequence key={seg.id} from={from} durationInFrames={duration} name={seg.id}>
          <Fade duration={duration}>
            {seg.kind === "scene" ? <StoryScene scene={seg} timing={timing} duration={duration} voiceFolder={folder} /> : null}
            {seg.kind === "tip" ? <TipView tip={seg} timing={timing} voiceFolder={folder} /> : null}
            {seg.kind === "quiz" ? <QuizView quiz={seg} timing={timing} voiceFolder={folder} /> : null}
            {seg.kind === "custom" ? (
              <>
                <seg.Component timing={timing} />
                <VoiceTrack timing={timing} folder={folder} />
                {seg.id === "end" ? null : <StoryCaption timing={timing} />}
              </>
            ) : null}
          </Fade>
        </Sequence>
      ))}
      <Audio
        src={staticFile("audio/lesson-music.mp3")}
        volume={(f) =>
          interpolate(f, [0, 30, durationInFrames - 60, durationInFrames], [0, musicVolume, musicVolume, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    </AbsoluteFill>
  );
};

const Fade: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const o = Math.min(
    interpolate(frame, [0, XFADE], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [duration - XFADE, duration], [1, 0], { extrapolateLeft: "clamp" }),
  );
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

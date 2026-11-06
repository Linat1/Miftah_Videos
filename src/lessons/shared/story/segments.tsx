import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage3D, STAGE_DEFAULT } from "../Stage3D";
import { Character } from "../Character";
import { Clock2D } from "../Clock2D";
import { SETS } from "../sets";
import { Sfx } from "../Sfx";
import { Ar, En, Mixed, Reveal } from "../ui";
import { C } from "../theme";
import { pop } from "../anim";
import { StoryCaption } from "./StoryCaption";
import { VoiceTrack } from "./VoiceTrack";
import { QUIZ_COUNT } from "./timeline";
import type { LineTiming, QuizSeg, TipSeg } from "./types";

// ---------- Miftah tip: a 3D cut-away ----------
export const TipView: React.FC<{ tip: TipSeg; timing: LineTiming[]; voiceFolder: string }> = ({ tip, timing, voiceFolder }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flash = interpolate(frame, [0, 6], [0.8, 0], { extrapolateRight: "clamp" });
  const banner = pop(frame, fps, 4, 12);
  const color = tip.example.color === "past" ? C.past : tip.example.color === "to" ? C.to : C.goldSoft;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 25% 45%, ${C.bg2} 0%, ${C.bg} 65%)` }}>
      <Stage3D state={{ ...STAGE_DEFAULT, x: -3.6, y: 0.45, ...tip.stage(frame) }} />
      <div style={{ position: "absolute", left: 860, top: 110, width: 990, display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ transform: `scale(${banner})`, transformOrigin: "left center", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: C.gold, borderRadius: 14, padding: "6px 22px" }}>
            <En size={34} color={C.bg} style={{ letterSpacing: 3 }}>MIFTAH TIP</En>
          </div>
          <Ar size={44} color={C.goldSoft} title>فَائِدَةٌ</Ar>
        </div>
        <Reveal at={14}><Mixed text={tip.title} size={42} arColor={color} /></Reveal>
        {tip.example.wrong ? (
          <Reveal at={26}>
            <div style={{ textAlign: "right", opacity: 0.6 }}>
              <En size={44} color={C.wrong}>✗ </En>
              <Ar size={52} style={{ textDecoration: "line-through", textDecorationColor: C.wrong }}>{tip.example.wrong}</Ar>
            </div>
          </Reveal>
        ) : null}
        <Reveal at={tip.example.wrong ? 50 : 30}>
          <div style={{ textAlign: "right", background: "rgba(255,255,255,0.07)", border: `3px solid ${color}`, borderRadius: 24, padding: "4px 30px" }}>
            {tip.example.wrong ? <En size={44} color={C.past}>✓ </En> : null}
            <Ar size={64}>{tip.example.hour} <span style={{ color }}>{tip.example.part}</span></Ar>
          </div>
        </Reveal>
        <Reveal at={70}><Mixed text={tip.rule} size={32} color={C.muted} arColor={color} /></Reveal>
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <StoryCaption timing={timing} />
      <VoiceTrack timing={timing} folder={voiceFolder} />
      <Sfx at={0} name="whoosh" volume={0.4} />
      <Sfx at={6} name="chime" volume={0.35} />
    </AbsoluteFill>
  );
};

// ---------- Quiz: Noor asks at the chalkboard ----------
const LETTERS = ["أ", "ب", "ج"];

export const QuizView: React.FC<{ quiz: QuizSeg; timing: LineTiming[]; voiceFolder: string }> = ({ quiz, timing, voiceFolder }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ask = timing[0];
  const countFrom = ask.start + ask.dur + 10;
  const reveal = countFrom + QUIZ_COUNT;
  const revealed = frame >= reveal;
  const ring = interpolate(frame, [countFrom, reveal], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const remaining = Math.ceil(ring * (QUIZ_COUNT / fps));
  const ok = pop(frame, fps, reveal, 10);
  const Set = SETS.classroom;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Set.Back blank />
      {/* board content */}
      <div style={{ position: "absolute", left: 560, top: 150, width: 930, height: 430, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <En size={34} color="#f5c451">QUIZ {quiz.number} / 3</En>
          <En size={34} color="#f2f2ea">{quiz.question}</En>
          {frame >= countFrom && !revealed ? (
            <div style={{ position: "relative", width: 70, height: 70 }}>
              <svg width={70} height={70} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
                <circle cx={35} cy={35} r={30} stroke="rgba(255,255,255,0.2)" strokeWidth={7} fill="none" />
                <circle cx={35} cy={35} r={30} stroke="#f5c451" strokeWidth={7} fill="none" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 30} strokeDashoffset={2 * Math.PI * 30 * (1 - ring)} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <En size={34}>{remaining}</En>
              </div>
            </div>
          ) : <div style={{ width: 70 }} />}
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center", flex: 1 }}>
          {quiz.clock !== undefined ? (
            <Reveal at={ask.start}>
              <Clock2D minutes={quiz.clock} r={130} wedge={revealed} />
            </Reveal>
          ) : null}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            {quiz.options.map((o, i) => {
              const right = i === quiz.correct;
              return (
                <Reveal key={o} at={ask.start + 10 + i * 8} dy={16}>
                  <div dir="rtl" style={{
                    display: "flex", alignItems: "center", gap: 16, padding: "0 18px", borderRadius: 18,
                    border: `3px solid ${revealed && right ? C.past : "rgba(255,255,255,0.35)"}`,
                    background: revealed && right ? "rgba(60,207,145,0.18)" : "rgba(255,255,255,0.05)",
                    opacity: revealed && !right ? 0.35 : 1, transform: revealed && right ? `scale(${1 + 0.03 * ok})` : undefined,
                  }}>
                    <Ar size={34} color="#f5c451">{LETTERS[i]}</Ar>
                    <Ar size={46} color="#f2f2ea" style={{ flex: 1 }}>{o}</Ar>
                    {revealed && right ? <En size={44} color={C.past} style={{ opacity: ok }}>✓</En> : null}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
      <Character who="noor" x={300} face="right" floor={1010} height={700}
        talking={[[ask.start, ask.start + ask.dur]]} hops={[reveal + 4]} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,10,0,0.35) 100%)" }} />
      {frame < countFrom ? <StoryCaption timing={timing} /> : (
        <div style={{ position: "absolute", bottom: 50, left: 0, right: 0, textAlign: "center" }}>
          <En size={36} color="#fff" style={{ textShadow: "0 3px 0 #10202f, 0 0 12px #000" }}>
            {revealed ? "Well done if you got it!" : "Pause the video if you need more time."}
          </En>
        </div>
      )}
      <VoiceTrack timing={timing} folder={voiceFolder} />
      {Array.from({ length: QUIZ_COUNT / fps }, (_, s) => <Sfx key={s} at={countFrom + s * fps} name="tick" volume={0.4} />)}
      <Sfx at={reveal} name="correct" volume={0.4} />
    </AbsoluteFill>
  );
};

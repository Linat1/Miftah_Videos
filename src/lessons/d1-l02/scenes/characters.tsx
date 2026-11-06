import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { SceneDef } from "../../shared/scene";
import { Dialogue, Floor, type Line } from "../../shared/Dialogue";
import { Character, CAST, type CastName } from "../../shared/Character";
import { Ar, En } from "../../shared/ui";
import { Sfx } from "../../shared/Sfx";
import { C } from "../../shared/theme";
import { pop, ramp } from "../../shared/anim";
import { t } from "../../shared/time";
import { useVideoConfig } from "remotion";
import { CAFE_BOARD, DIALOGUE_ASK, DIALOGUE_CAFE, DIALOGUE_TRAINING, GOODBYE } from "../content";

// The clock hangs on the "wall" between the two speakers.
const WALL_CLOCK = { x: 0, y: 2.05, scale: 0.42, spin: -0.3 };
const LEFT_X = 430;
const RIGHT_X = 1490;

const toScript = (lines: Line[]) =>
  lines.map((l) => ({ at: l.at / 30, who: CAST[l.who].nameEn, ar: l.ar, en: l.en }));

// ---------- كَمِ السَّاعَةُ؟ (Yusuf asks Noor) ----------
export const askTime: SceneDef = {
  id: "ask-the-time",
  duration: 220,
  Panel: () => (
    <>
      <Floor />
      <Dialogue
        lines={DIALOGUE_ASK}
        cast={[
          { who: "yusuf", x: LEFT_X, face: "right", enterAt: 0, enterFrom: "left" },
          { who: "noor", x: RIGHT_X, face: "left", enterAt: 8, enterFrom: "right", hops: [140] },
        ]}
      />
    </>
  ),
  stage: () => ({ ...WALL_CLOCK, minutes: t(8, 0) }),
  narration: [],
  dialogue: toScript(DIALOGUE_ASK),
};

// ---------- Café: begins / ends / now ----------
const CafeSet: React.FC = () => (
  <>
    <Floor color="#1a1208" />
    {/* menu board under the clock */}
    <div
      style={{
        position: "absolute", left: 785, top: 425, width: 350, padding: "8px 0 14px",
        background: "#1f2a22", border: `8px solid #7a5a36`, borderRadius: 14, textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      <Ar size={30} color={C.goldSoft} title style={{ lineHeight: 1.5 }}>{CAFE_BOARD.name}</Ar>
      <div><Ar size={46} color="#f3efe4" style={{ lineHeight: 1.5 }}>{CAFE_BOARD.item}</Ar></div>
      <div><Ar size={40} color="#f3efe4" style={{ lineHeight: 1.3 }}>{CAFE_BOARD.hours}</Ar></div>
      <En size={20} color="#b9c4b5">{CAFE_BOARD.en}</En>
    </div>
  </>
);

const Counter: React.FC = () => (
  <div style={{ position: "absolute", left: 1180, right: 0, top: 790, bottom: 0 }}>
    <div style={{ height: 26, background: "linear-gradient(#c79a62, #9b7244)", borderRadius: "10px 0 0 0" }} />
    <div style={{ position: "absolute", top: 26, left: 0, right: 0, bottom: 0, background: "linear-gradient(#7a5634, #4c3420)" }} />
    {/* a cup on the counter */}
    <div style={{ position: "absolute", left: 60, top: -46, width: 50, height: 46, background: "#f6efe2", borderRadius: "0 0 14px 14px" }} />
    <div style={{ position: "absolute", left: 104, top: -38, width: 18, height: 24, border: "6px solid #f6efe2", borderLeft: "none", borderRadius: "0 12px 12px 0" }} />
  </div>
);

export const cafe: SceneDef = {
  id: "cafe",
  duration: 485,
  Panel: () => (
    <>
      <CafeSet />
      <Dialogue
        lines={DIALOGUE_CAFE}
        cast={[
          { who: "maryam", x: LEFT_X, face: "right", enterAt: 0, enterFrom: "left", hops: [432] },
          { who: "waiter", x: RIGHT_X, face: "left", enterAt: 0, enterFrom: "right" },
        ]}
      />
      <Counter />
      <Sfx at={432} name="correct" volume={0.25} />
    </>
  ),
  stage: (f) => ({ ...WALL_CLOCK, minutes: t(10, 15), wedgeMode: "auto", wedgeOpacity: ramp(f, 340, 20) }),
  narration: [],
  dialogue: toScript(DIALOGUE_CAFE),
};

// ---------- Model exchange: training (from the lesson) ----------
const TRAIN_FROM = 175;
const TRAIN_TO = 285;

const TrainingPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const label = interpolate(frame, [TRAIN_FROM, TRAIN_TO], [0, 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Floor />
      <Dialogue
        lines={DIALOGUE_TRAINING}
        cast={[
          { who: "aisha", x: LEFT_X, face: "right", enterAt: 0, enterFrom: "left" },
          { who: "yusuf", x: RIGHT_X, face: "left", enterAt: 8, enterFrom: "right" },
        ]}
      />
      {/* duration counter under the clock */}
      {frame >= TRAIN_FROM - 5 ? (
        <div style={{ position: "absolute", left: 760, width: 400, top: 380, textAlign: "center", opacity: ramp(frame, TRAIN_FROM - 5, 10) }}>
          <En size={44} color={C.goldSoft}>{Math.round(label)} min</En>
          <div><Ar size={34} color={C.muted}>مُدَّةَ سَاعَةٍ وَالنِّصْفِ</Ar></div>
        </div>
      ) : null}
    </>
  );
};

export const training: SceneDef = {
  id: "model-exchange",
  duration: 455,
  Panel: TrainingPanel,
  stage: (f) => ({
    ...WALL_CLOCK,
    minutes: interpolate(f, [TRAIN_FROM, TRAIN_TO], [t(5, 45), t(7, 15)], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    wedgeMode: f < TRAIN_FROM ? "auto" : "elapsed",
    wedgeFrom: t(5, 45),
    wedgeOpacity: 1,
  }),
  narration: [],
  dialogue: toScript(DIALOGUE_TRAINING),
};

// ---------- Goodbye: the whole cast ----------
const ORDER: CastName[] = ["yusuf", "maryam", "noor", "aisha", "waiter"];

const GoodbyePanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, 30, 11);
  return (
    <>
      <Floor />
      <div style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center", opacity: Math.min(1, p * 1.4), transform: `scale(${0.7 + 0.3 * p})` }}>
        <Ar size={120} color={C.goldSoft} title>{GOODBYE.ar}</Ar>
        <div><En size={40}>{GOODBYE.en}</En></div>
      </div>
      {ORDER.map((who, i) => (
        <Character
          key={who}
          who={who}
          x={300 + i * 330}
          floor={1030}
          height={560}
          face={i < 2 ? "right" : "left"}
          enterAt={i * 5}
          enterFrom={i < 2 ? "left" : "right"}
          hops={[70 + i * 7, 120 + i * 7]}
        />
      ))}
      <Sfx at={30} name="chime" volume={0.35} />
      <Sfx at={70} name="correct" volume={0.3} />
    </>
  );
};

export const goodbye: SceneDef = {
  id: "goodbye",
  duration: 200,
  Panel: GoodbyePanel,
  stage: () => ({ ...WALL_CLOCK, scale: 0, minutes: t(11, 30) }),
  narration: [],
};

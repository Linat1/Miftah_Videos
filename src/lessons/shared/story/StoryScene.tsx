import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Character, type CastName, type CharacterProps, type Emote } from "../Character";
import { Clock2D } from "../Clock2D";
import { SETS } from "../sets";
import { Sfx } from "../Sfx";
import { ARABIC_FONT, LATIN_FONT } from "../../../fonts";
import { StoryCaption } from "./StoryCaption";
import { VoiceTrack } from "./VoiceTrack";
import type { LineTiming, SceneSeg, Shot } from "./types";

const W = 1920;
const H = 1080;
const FLOOR_Y = 1010;
const DEFAULT_HEIGHT = 690;

type Cam = { s: number; fx: number; fy: number };

/** Works out the per-character animation cues from the line events. */
const castProps = (scene: SceneSeg, timing: LineTiming[]) => {
  const props: Record<string, Partial<CharacterProps> & { emotes: { at: number; type: Emote }[]; hops: number[]; talking: [number, number][] }> = {};
  scene.cast.forEach((c) => (props[c.who] = { enterAt: -200, emotes: [], hops: [], talking: [] }));
  timing.forEach((t) => {
    if (t.line.who !== "narrator") props[t.line.who]?.talking.push([t.start, t.start + t.dur]);
    (t.line.events ?? []).forEach((e) => {
      const at = e.when === "end" ? t.start + t.dur : t.start;
      if (e.do === "sfx") return;
      const p = props[e.who];
      if (!p) return;
      if (e.do === "emote") p.emotes.push({ at, type: e.type });
      if (e.do === "hop") p.hops.push(at);
      if (e.do === "exit") Object.assign(p, { exitAt: at, exitTo: e.to });
      if (e.do === "faint") p.faintAt = at;
      if (e.do === "enter") Object.assign(p, { enterAt: at - 22, enterFrom: e.from, run: e.run });
    });
  });
  return props;
};

const camFor = (shot: Shot, scene: SceneSeg, who: string, focus?: CastName[]): Cam => {
  const spot = (n: string) => scene.cast.find((c) => c.who === n);
  if (shot === "clock") {
    const c = SETS[scene.set].clock;
    return { s: 2.3, fx: c.x, fy: c.y + 40 };
  }
  if (shot === "close" && spot(who)) {
    const c = spot(who)!;
    const h = c.height ?? DEFAULT_HEIGHT;
    return { s: 1.6, fx: c.x, fy: FLOOR_Y - h * 0.68 };
  }
  if (shot === "two" && focus && focus.length) {
    const xs = focus.map((n) => spot(n)?.x ?? W / 2);
    return { s: 1.3, fx: (Math.min(...xs) + Math.max(...xs)) / 2, fy: 560 };
  }
  return { s: 1, fx: W / 2, fy: H / 2 };
};

/** Turns a camera (zoom + focus point) into a CSS transform that never shows past the set's edges. */
const camTransform = ({ s, fx, fy }: Cam) => {
  const tx = Math.min(0, Math.max(W - W * s, W / 2 - fx * s));
  const ty = Math.min(0, Math.max(H - H * s, H * 0.44 - fy * s));
  return `translate(${tx}px, ${ty}px) scale(${s})`;
};

export const StoryScene: React.FC<{ scene: SceneSeg; timing: LineTiming[]; duration: number; voiceFolder: string }> = ({
  scene,
  timing,
  duration,
  voiceFolder,
}) => {
  const frame = useCurrentFrame();
  const set = SETS[scene.set];
  const props = castProps(scene, timing);

  // Choose the shot: explicit, else wide → close-ups, with a wide every third line.
  const shots = timing.map((t, i) => t.line.shot ?? (i === 0 ? "wide" : t.line.who === "narrator" ? "wide" : i % 3 === 2 ? "wide" : "close"));
  let idx = -1;
  timing.forEach((t, i) => {
    if (frame >= t.start - 2) idx = i;
  });
  const shotStart = idx >= 0 ? timing[idx].start - 2 : 0;
  const shotEnd = idx >= 0 ? (timing[idx + 1]?.start ?? duration) : timing[0]?.start ?? duration;
  const base = idx >= 0 ? camFor(shots[idx], scene, timing[idx].line.who, timing[idx].line.focus) : camFor("wide", scene, "");
  const push = interpolate(frame, [shotStart, shotEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const cam = { ...base, s: base.s * (1 + 0.04 * push) };

  const alarmShake = scene.alarm ? interpolate(frame, [0, 60, 75], [1, 1, 0], { extrapolateRight: "clamp" }) : 0;
  const labelIn = interpolate(frame, [6, 18, 80, 95], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: camTransform(cam) }}>
        <set.Back />
        <div style={{ position: "absolute", left: set.clock.x - set.clock.r * 1.15, top: set.clock.y - set.clock.r * 1.15 }}>
          <Clock2D minutes={scene.time} r={set.clock.r} shake={alarmShake} frame={frame} wedge={shots[idx] === "clock"} />
        </div>
        {scene.cast.map((c) => {
          const p = props[c.who];
          return (
            <Character key={c.who} who={c.who} x={c.x} face={c.face} floor={FLOOR_Y} height={c.height ?? DEFAULT_HEIGHT}
              enterAt={p.enterAt} enterFrom={p.enterFrom} run={p.run} talking={p.talking} hops={p.hops}
              emotes={p.emotes} exitAt={p.exitAt} exitTo={p.exitTo} faintAt={p.faintAt} />
          );
        })}
        {set.Front ? <set.Front /> : null}
      </AbsoluteFill>

      {/* painterly finish: warm vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,10,0,0.35) 100%)", pointerEvents: "none" }} />

      {/* place + time label */}
      <div style={{ position: "absolute", left: 40, top: 34, opacity: labelIn, background: "rgba(16,32,47,0.85)", borderRadius: 16, padding: "6px 20px", display: "flex", gap: 16, alignItems: "center", border: "3px solid #d4a64a" }}>
        <span style={{ fontFamily: LATIN_FONT, fontWeight: 700, fontSize: 28, color: "#fff" }}>{set.label} · {scene.timeLabel.en}</span>
        <span dir="rtl" style={{ fontFamily: ARABIC_FONT, fontWeight: 700, fontSize: 30, color: "#f5c451" }}>{scene.timeLabel.ar}</span>
      </div>

      <StoryCaption timing={timing} />
      <VoiceTrack timing={timing} folder={voiceFolder} />

      {scene.alarm ? <Sfx at={0} name="alarm" volume={0.35} /> : null}
      {timing.flatMap((t) =>
        (t.line.events ?? []).map((e, i) => {
          const at = e.when === "end" ? t.start + t.dur : t.start;
          if (e.do === "sfx") return <Sfx key={`${t.line.id}-${i}`} at={at} name={e.name} volume={0.4} />;
          if (e.do === "emote") return <Sfx key={`${t.line.id}-${i}`} at={at} name="pop" volume={0.35} />;
          if (e.do === "exit" || e.do === "enter") return <Sfx key={`${t.line.id}-${i}`} at={e.do === "enter" ? at - 22 : at} name="whoosh" volume={0.45} />;
          if (e.do === "faint") return <Sfx key={`${t.line.id}-${i}`} at={at + 12} name="wrong" volume={0.35} />;
          return null;
        }),
      )}
    </AbsoluteFill>
  );
};

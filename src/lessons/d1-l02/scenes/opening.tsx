import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import type { SceneDef } from "../../shared/scene";
import { Ar, En, Kicker, Mixed, Panel, Reveal, Card } from "../../shared/ui";
import { Sfx } from "../../shared/Sfx";
import { C } from "../../shared/theme";
import { pop } from "../../shared/anim";
import { t } from "../../shared/time";
import { LESSON, OBJECTIVES, QUESTION } from "../content";

// ---------- 1. Title ----------
const IntroPanel: React.FC = () => (
  <Panel style={{ justifyContent: "center", gap: 18 }}>
    <Sfx at={0} name="whoosh" volume={0.4} />
    <Sfx at={55} name="chime" volume={0.35} />
    <Reveal at={10}>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ background: C.gold, borderRadius: 14, padding: "6px 18px" }}>
          <En size={30} color={C.bg}>{LESSON.code}</En>
        </div>
        <En size={26} color={C.muted}>{LESSON.unit}</En>
      </div>
    </Reveal>
    <Reveal at={25}>
      <div style={{ textAlign: "right" }}>
        <Ar size={96} color={C.goldSoft} title>{LESSON.titleAr}</Ar>
      </div>
    </Reveal>
    <Reveal at={45}>
      <En size={52}>{LESSON.titleEn}</En>
    </Reveal>
    <Reveal at={70}>
      <div style={{ height: 4, width: 220, background: C.gold, borderRadius: 2 }} />
    </Reveal>
    <Reveal at={80}>
      <En size={30} color={C.muted}>
        Read, ask for and communicate exact clock times, start and finish times, and duration.
      </En>
    </Reveal>
  </Panel>
);

export const intro: SceneDef = {
  id: "intro",
  duration: 210,
  Panel: IntroPanel,
  stage: (f) => ({
    // hands wind forward to 8:00 while the clock springs in
    minutes: interpolate(f, [0, 90], [t(0, 0), t(8, 0)], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
    scale: pop(f, 30, 0, 12),
    spin: interpolate(f, [0, 60], [-1.4, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
  }),
  narration: [{ at: 1.3, text: "Welcome to Miftah! Today: telling the time in Arabic." }],
};

// ---------- 2. Objectives ----------
const ObjectivesPanel: React.FC = () => {
  const starts = [25, 75, 125, 175];
  return (
    <Panel style={{ gap: 26 }}>
      <Kicker en="Today you will" />
      {starts.map((a) => <Sfx key={a} at={a} name="tick" volume={0.35} />)}
      {OBJECTIVES.map((o, i) => (
        <Reveal key={o} at={starts[i]}>
          <Card style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div
              style={{
                width: 56, height: 56, borderRadius: 28, background: C.gold, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <En size={30} color={C.bg}>{i + 1}</En>
            </div>
            <Mixed text={o} size={34} />
          </Card>
        </Reveal>
      ))}
    </Panel>
  );
};

export const objectives: SceneDef = {
  id: "objectives",
  duration: 300,
  Panel: ObjectivesPanel,
  stage: () => ({ minutes: t(8, 0) }),
  narration: [
    { at: 0.8, text: "By the end of this lesson, you will tell the time to five minutes," },
    { at: 5, text: "and read start times, end times and durations." },
  ],
};

// ---------- 3. The key question ----------
const QuestionPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, 5, 10);
  return (
    <Panel style={{ justifyContent: "center", alignItems: "center", gap: 10 }}>
      <Sfx at={5} name="chime" volume={0.35} />
      <div style={{ transform: `scale(${0.6 + 0.4 * p})`, opacity: Math.min(1, p * 1.4), textAlign: "center" }}>
        <Ar size={150} color={C.goldSoft} title>{QUESTION.ask}</Ar>
      </div>
      <Reveal at={25}>
        <En size={48}>{QUESTION.askEn}</En>
      </Reveal>
      <Reveal at={75} style={{ marginTop: 30 }}>
        <Card active style={{ textAlign: "center", padding: "10px 50px" }}>
          <Ar size={70}>{QUESTION.answer}</Ar>
          <div><En size={30} color={C.muted}>{QUESTION.answerEn}</En></div>
        </Card>
      </Reveal>
    </Panel>
  );
};

export const question: SceneDef = {
  id: "question",
  duration: 165,
  Panel: QuestionPanel,
  stage: () => ({ minutes: t(8, 0) }),
  narration: [
    { at: 0.6, text: "To ask the time, say: kam as-saa'a? What time is it?" },
  ],
};

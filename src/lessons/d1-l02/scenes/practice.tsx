import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { SceneDef } from "../../shared/scene";
import { Ar, Card, DigitalTime, En, Kicker, Mixed, Panel, Reveal } from "../../shared/ui";
import { Sfx } from "../../shared/Sfx";
import { C } from "../../shared/theme";
import { activeIndex, pop, ramp, stepValue } from "../../shared/anim";
import { arDigits, fmt, t } from "../../shared/time";
import { DAYPARTS, H24_ROWS, LESSON, QUIZ, RECAP, SCHEDULE } from "../content";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- 9. 24-hour time ----------
const H24_ATS = [40, 150, 260];
const DAYPART_AT = 340;

const H24Panel: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = activeIndex(frame, H24_ATS);
  const head = (s: string, w: number, right = false) => (
    <div style={{ width: w, textAlign: right ? "right" : "left" }}>
      <En size={22} color={C.muted} style={{ textTransform: "uppercase", letterSpacing: 2 }}>{s}</En>
    </div>
  );
  return (
    <Panel style={{ gap: 14 }}>
      <Kicker en="24-hour time" ar="التَّوْقِيتُ" />
      <Reveal at={10}>
        <div style={{ display: "flex", gap: 16, padding: "0 24px" }}>
          {head("Digital", 150)}
          {head("Conversational", 370, true)}
          {head("24-hour form", 380, true)}
        </div>
      </Reveal>
      {H24_ROWS.map((r, i) => (
        <Reveal key={r.digital} at={H24_ATS[i]} dy={20}>
          <Card active={i === idx} style={{ display: "flex", alignItems: "center", gap: 16, padding: "6px 24px" }}>
            <div style={{ width: 150 }}>
              <En size={40}>{r.digital}</En>
            </div>
            <div style={{ width: 370, textAlign: "right" }}>
              <Ar size={36}>{r.chat}</Ar>
            </div>
            <div style={{ width: 380, textAlign: "right" }}>
              <Ar size={31} color={C.goldSoft}>{r.h24}</Ar>
            </div>
          </Card>
        </Reveal>
      ))}
      <div style={{ display: "flex", gap: 20, marginTop: 6 }}>
        {DAYPARTS.map((d, i) => (
          <Reveal key={d.ar} at={DAYPART_AT + i * 15} style={{ flex: 1 }}>
            <Card active accent={i === 0 ? "#ffc845" : "#8aa4c8"} style={{ textAlign: "center", padding: "4px 16px" }}>
              <Ar size={46} color={i === 0 ? "#ffc845" : "#c9d8ee"}>{d.ar}</Ar>
              <div><En size={24} color={C.muted}>{d.en}</En></div>
            </Card>
          </Reveal>
        ))}
      </div>
      {H24_ATS.map((a) => <Sfx key={a} at={a} name="chime" volume={0.22} />)}
      <Sfx at={DAYPART_AT} name="tick" volume={0.35} />
    </Panel>
  );
};

export const h24: SceneDef = {
  id: "24-hour",
  duration: 420,
  Panel: H24Panel,
  stage: (f) => {
    const idx = activeIndex(f, H24_ATS.map((a) => a + 10));
    const sky = idx >= 0 ? H24_ROWS[idx].sky : null;
    const fade = ramp(f, idx >= 0 ? H24_ATS[idx] : 0, 20);
    return {
      minutes: stepValue(f, t(8, 55), H24_ROWS.map((r, i) => ({ at: H24_ATS[i] - 10, to: r.time })), 28),
      wedgeMode: "auto",
      wedgeOpacity: 0.7,
      sun: sky === "sun" ? 1 : sky === "moon" ? 1 - fade : 0,
      moon: sky === "moon" ? fade : 0,
    };
  },
  narration: [
    { at: 0.5, text: "Timetables often use 24-hour time, like fourteen thirty or eighteen fifteen." },
    { at: 8.6, text: "In conversation, add sabaahan for morning, or masaa'an for evening." },
  ],
};

// ---------- 10. Schedule verbs: begins, ends, lasts ----------
const VERB_ATS = [15, 45, 75];
const RUN_FROM = 150;
const RUN_TO = 290;
const SENT_ATS = [140, 300, 345];

const SchedulePanel: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [RUN_FROM, RUN_TO], [0, 1], clamp);
  const now = SCHEDULE.start + progress * (SCHEDULE.end - SCHEDULE.start);
  const sentIdx = activeIndex(frame, SENT_ATS);
  return (
    <Panel style={{ gap: 18 }}>
      <Kicker en="Start · finish · duration" ar="مُدَّةٌ" />
      <div dir="rtl" style={{ display: "flex", gap: 16 }}>
        {SCHEDULE.verbs.map((v, i) => (
          <Reveal key={v.ar} at={VERB_ATS[i]} style={{ flex: 1 }}>
            <Card active={sentIdx === i} style={{ textAlign: "center", padding: "2px 10px" }}>
              <Ar size={54} color={C.goldSoft}>{v.ar}</Ar>
              <div><En size={24} color={C.muted}>{v.en}</En></div>
            </Card>
          </Reveal>
        ))}
      </div>
      {/* Timeline bar */}
      <Reveal at={120}>
        <div style={{ padding: "6px 4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <En size={28}>{fmt(SCHEDULE.start)}</En>
            <En size={28} color={C.goldSoft}>{fmt(now)}</En>
            <En size={28}>{fmt(SCHEDULE.end)}</En>
          </div>
          <div style={{ height: 22, borderRadius: 11, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress * 100}%`, background: `linear-gradient(90deg, ${C.gold}, ${C.goldSoft})`, borderRadius: 11 }} />
          </div>
        </div>
      </Reveal>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SCHEDULE.sentences.map((s, i) => (
          <Reveal key={s.ar} at={SENT_ATS[i]} dy={20}>
            <Card active={sentIdx === i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "2px 24px" }}>
              <En size={24} color={C.muted} style={{ width: 340 }}>{s.en}</En>
              <div style={{ flex: 1, textAlign: "right" }}>
                <Ar size={42}>{s.ar}</Ar>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
      {VERB_ATS.map((a) => <Sfx key={a} at={a} name="tick" volume={0.35} />)}
      {SENT_ATS.map((a) => <Sfx key={a} at={a} name="chime" volume={0.22} />)}
    </Panel>
  );
};

export const schedule: SceneDef = {
  id: "schedule",
  duration: 450,
  Panel: SchedulePanel,
  stage: (f) => ({
    minutes: interpolate(f, [0, 20, RUN_FROM, RUN_TO], [t(18, 15), SCHEDULE.start, SCHEDULE.start, SCHEDULE.end], clamp),
    wedgeMode: "elapsed",
    wedgeFrom: SCHEDULE.start,
    wedgeOpacity: ramp(f, RUN_FROM, 10),
  }),
  narration: [
    { at: 0.5, text: "Three key verbs: yabda'u, begins. Yantahee, ends." },
    { at: 4.4, text: "Yastamirru, lasts, with muddata for the duration." },
    { at: 11.6, text: "This lesson lasts forty-five minutes." },
  ],
};

// ---------- 11. Quiz ----------
const Q_OPTS = 40;
const Q_COUNT_FROM = 85;
const Q_SECONDS = 5;
const Q_REVEAL = Q_COUNT_FROM + Q_SECONDS * 30;
const LETTERS = ["أ", "ب", "ج"];

const makeQuizPanel = (qi: number): React.FC => () => {
  const q = QUIZ[qi];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const revealed = frame >= Q_REVEAL;
  const remaining = Math.ceil(interpolate(frame, [Q_COUNT_FROM, Q_REVEAL], [Q_SECONDS, 0], clamp));
  const ring = interpolate(frame, [Q_COUNT_FROM, Q_REVEAL], [1, 0], clamp);
  const ok = pop(frame, fps, Q_REVEAL, 10);
  return (
    <Panel style={{ gap: 18 }}>
      <Kicker en={`Quiz · ${qi + 1} / ${QUIZ.length}`} ar="كَمِ السَّاعَةُ؟" />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Reveal at={8}>
          <DigitalTime en={fmt(q.time)} ar={arDigits(fmt(q.time))} size={88} color={C.goldSoft} />
        </Reveal>
        {/* Countdown ring */}
        {frame >= Q_COUNT_FROM && !revealed ? (
          <div style={{ position: "relative", width: 120, height: 120 }}>
            <svg width={120} height={120} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
              <circle cx={60} cy={60} r={52} stroke="rgba(255,255,255,0.15)" strokeWidth={10} fill="none" />
              <circle cx={60} cy={60} r={52} stroke={C.gold} strokeWidth={10} fill="none" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52} strokeDashoffset={2 * Math.PI * 52 * (1 - ring)} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <En size={52}>{remaining}</En>
            </div>
          </div>
        ) : null}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {q.options.map((o, i) => {
          const isRight = i === q.correct;
          return (
            <Reveal key={o} at={Q_OPTS + i * 12} dy={20}>
              <Card
                active={revealed && isRight}
                accent={C.past}
                style={{
                  display: "flex", alignItems: "center", gap: 20, padding: "2px 26px",
                  opacity: revealed && !isRight ? 0.35 : 1,
                  transform: revealed && isRight ? `scale(${1 + 0.03 * ok})` : undefined,
                }}
              >
                <En size={50} color={C.past} style={{ width: 50, opacity: revealed && isRight ? ok : 0 }}>✓</En>
                <div style={{ flex: 1, textAlign: "right" }}>
                  <Ar size={50}>{o}</Ar>
                </div>
                <div style={{ width: 58, height: 58, borderRadius: 29, border: `2px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Ar size={34} color={C.gold} style={{ lineHeight: 1 }}>{LETTERS[i]}</Ar>
                </div>
              </Card>
            </Reveal>
          );
        })}
      </div>
      {revealed ? (
        <Reveal at={Q_REVEAL + 12}>
          <Mixed text={q.why} size={32} arColor={C.past} />
        </Reveal>
      ) : frame >= Q_COUNT_FROM ? (
        <En size={28} color={C.muted}>Pause the video if you need more time.</En>
      ) : null}
      {Array.from({ length: Q_SECONDS }, (_, s) => (
        <Sfx key={s} at={Q_COUNT_FROM + s * 30} name="tick" volume={0.4} />
      ))}
      <Sfx at={Q_REVEAL} name="correct" volume={0.35} />
    </Panel>
  );
};

const quizNarration: SceneDef["narration"][] = [
  [{ at: 0.4, text: "Question one: what is six thirty? Choose the right Arabic." }, { at: 8.2, text: "Six thirty: as-saadisatu wan-nisf!" }],
  [{ at: 0.4, text: "Question two: three forty-five." }, { at: 8.2, text: "Four, except a quarter." }],
  [{ at: 0.4, text: "Question three: two forty." }, { at: 8.2, text: "Three, except a third." }],
  [{ at: 0.4, text: "Last one: ten fifty. Watch the hour!" }, { at: 8.2, text: "Eleven, except ten minutes!" }],
];

export const quiz: SceneDef[] = QUIZ.map((q, i) => ({
  id: `quiz-${i + 1}`,
  duration: 330,
  Panel: makeQuizPanel(i),
  stage: (f) => ({
    minutes: q.time,
    wedgeMode: "auto",
    wedgeOpacity: ramp(f, Q_REVEAL, 15), // hide the colour hint until the answer
  }),
  narration: quizNarration[i],
}));

// ---------- 12. Closing ----------
const OutroPanel: React.FC = () => (
  <Panel style={{ gap: 18 }}>
    <Kicker en="Remember" ar="أَحْسَنْتُمْ" />
    {RECAP.map((r, i) => {
      const color = r.color === "past" ? C.past : r.color === "to" ? C.to : C.goldSoft;
      return (
        <Reveal key={r.ar} at={20 + i * 25}>
          <Card style={{ display: "flex", alignItems: "center", gap: 20, padding: "0 24px" }}>
            <En size={30} style={{ flex: 1 }}>{r.en}</En>
            <Ar size={48} color={color}>{r.ar}</Ar>
          </Card>
        </Reveal>
      );
    })}
    <Reveal at={110}>
      <En size={26} color={C.muted}>Next lesson → {LESSON.next}</En>
    </Reveal>
    <Reveal at={150} style={{ marginTop: 10, textAlign: "center" }}>
      <Ar size={72} color={C.goldSoft} title>{LESSON.motto}</Ar>
      <div><En size={28} color={C.muted}>{LESSON.mottoEn}</En></div>
    </Reveal>
    <Sfx at={140} name="chime" volume={0.35} />
  </Panel>
);

export const outro: SceneDef = {
  id: "outro",
  duration: 330,
  Panel: OutroPanel,
  stage: (f) => ({
    minutes: t(11, 0) + f / 4,
    key: interpolate(f, [120, 160], [0, 1], { ...clamp }),
  }),
  narration: [
    { at: 0.8, text: "Well done! Wa for minutes past, illaa for minutes to." },
    { at: 5.6, text: "Next lesson: how often? See you there!" },
  ],
};

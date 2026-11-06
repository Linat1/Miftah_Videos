import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { SceneDef } from "../../shared/scene";
import { Ar, Card, DigitalTime, En, Kicker, Mixed, Panel, Reveal } from "../../shared/ui";
import { Sfx } from "../../shared/Sfx";
import { C } from "../../shared/theme";
import { activeIndex, pop, ramp, stepValue } from "../../shared/anim";
import { arDigits, fmt, t } from "../../shared/time";
import { H7, H8, MISTAKE, PAST_STOPS, RULE_PAST, RULE_TO, TO_STOPS, type Example } from "../content";

/** Big "hour + part" phrase that pops whenever it changes. */
const Phrase: React.FC<{ hour: string; part?: string; color: string; changedAt: number }> = ({
  hour,
  part,
  color,
  changedAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, changedAt, 12);
  return (
    <div style={{ textAlign: "right", transform: `scale(${0.92 + 0.08 * p})`, transformOrigin: "right center" }}>
      <Ar size={78}>
        {hour}
        {part ? <span style={{ color }}> {part}</span> : null}
      </Ar>
    </div>
  );
};

/** A grid of collected vocabulary chips. */
const Chips: React.FC<{
  items: { part: string; en: string; m: number }[];
  revealAt: number[];
  active: number;
  color: string;
}> = ({ items, revealAt, active, color }) => (
  <div dir="rtl" style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
    {items.map((s, i) => (
      <Reveal key={s.part} at={revealAt[i] + 18} dy={20}>
        <Card active={i === active} accent={color} style={{ padding: "6px 22px", textAlign: "center", minWidth: 220 }}>
          <Ar size={40} color={color}>{s.part}</Ar>
          <div dir="ltr">
            <En size={24} color={C.muted}>:{String(s.m).padStart(2, "0")} · {s.en}</En>
          </div>
        </Card>
      </Reveal>
    ))}
  </div>
);

// ---------- 4. Minutes past (وَ) ----------
const PAST_START = 45;
const PAST_STEP = 80;
const pastAts = PAST_STOPS.map((_, i) => PAST_START + i * PAST_STEP);

const PastPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = activeIndex(frame, pastAts.map((a) => a + 18));
  const stop = idx >= 0 ? PAST_STOPS[idx] : null;
  const shown = t(7, stop ? stop.m : 0);
  return (
    <Panel>
      <Kicker en="Minutes past · and" ar="وَ" color={C.past} />
      <Reveal at={8}>
        <Mixed text="Keep the SAME hour, then add {وَ} + the minutes." size={32} arColor={C.past} />
      </Reveal>
      <Reveal at={20}>
        <DigitalTime en={fmt(shown)} ar={arDigits(fmt(shown))} />
      </Reveal>
      <Reveal at={20}>
        <Phrase hour={stop ? H7 : "السَّاعَةُ السَّابِعَةُ"} part={stop?.part} color={C.past} changedAt={idx >= 0 ? pastAts[idx] + 18 : 20} />
      </Reveal>
      <Chips items={PAST_STOPS} revealAt={pastAts} active={idx} color={C.past} />
      {pastAts.map((a) => <Sfx key={a} at={a + 18} name="chime" volume={0.25} />)}
      {idx === 3 ? (
        <Reveal at={pastAts[3] + 30}>
          <Mixed text="Tip: {الثُّلُثُ} = a third of an hour = 20 minutes" size={28} color={C.muted} arColor={C.past} />
        </Reveal>
      ) : null}
    </Panel>
  );
};

export const minutesPast: SceneDef = {
  id: "minutes-past",
  duration: 480,
  Panel: PastPanel,
  stage: (f) => ({
    minutes: stepValue(f, t(7, 0), PAST_STOPS.map((s, i) => ({ at: pastAts[i], to: t(7, s.m) })), 22),
    wedgeMode: "auto",
    wedgeOpacity: ramp(f, 30, 20),
  }),
  narration: [
    { at: 0.5, text: "Minutes past the hour: keep the same hour and add wa, meaning and." },
    { at: 9.8, text: "Twenty past is 'and a third': a third of an hour!" },
  ],
};

// ---------- 5. Minutes to (إِلَّا) ----------
const TO_START = 70;
const TO_STEP = 82;
const toAts = TO_STOPS.map((_, i) => TO_START + i * TO_STEP);
const EIGHT_AT = TO_START + TO_STOPS.length * TO_STEP; // 8:00

const ToPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = activeIndex(frame, toAts.map((a) => a + 18));
  const stop = idx >= 0 ? TO_STOPS[idx] : null;
  const atEight = frame >= EIGHT_AT + 18;
  const shown = atEight ? t(8, 0) : t(7, stop ? stop.m : 30);
  const switchP = ramp(frame, 30, 20); // hour switch animation
  return (
    <Panel>
      <Kicker en="Minutes to · except" ar="إِلَّا" color={C.to} />
      <Reveal at={8}>
        <Mixed text="After half past, jump to the NEXT hour, then {إِلَّا} + minutes left." size={32} arColor={C.to} />
      </Reveal>
      <Reveal at={15}>
        <DigitalTime en={fmt(shown)} ar={arDigits(fmt(shown))} />
      </Reveal>
      {idx < 0 ? (
        // The hour switch: السَّابِعَةُ → الثَّامِنَةُ
        <Reveal at={15}>
          <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <Ar size={78} style={{ opacity: 1 - switchP * 0.6, textDecoration: switchP > 0.5 ? "line-through" : "none", textDecorationColor: C.to }}>
              {H7}
            </Ar>
            <En size={60} color={C.to} style={{ opacity: switchP }}>←</En>
            <Ar size={78} color={C.to} style={{ opacity: switchP, transform: `scale(${0.7 + 0.3 * switchP})` }}>
              {H8}
            </Ar>
            <En size={30} color={C.muted} style={{ opacity: switchP }}>next hour!</En>
          </div>
        </Reveal>
      ) : atEight ? (
        <Phrase hour="السَّاعَةُ الثَّامِنَةُ" color={C.to} changedAt={EIGHT_AT + 18} />
      ) : (
        <Phrase hour={H8} part={stop?.part} color={C.to} changedAt={toAts[idx] + 18} />
      )}
      <Chips items={TO_STOPS} revealAt={toAts} active={atEight ? -1 : idx} color={C.to} />
      <Sfx at={30} name="whoosh" volume={0.3} />
      {toAts.map((a) => <Sfx key={a} at={a + 18} name="chime" volume={0.25} />)}
      <Sfx at={EIGHT_AT + 18} name="correct" volume={0.3} />
    </Panel>
  );
};

export const minutesTo: SceneDef = {
  id: "minutes-to",
  duration: 480,
  Panel: ToPanel,
  stage: (f) => ({
    minutes: stepValue(
      f,
      t(7, 30),
      [...TO_STOPS.map((s, i) => ({ at: toAts[i], to: t(7, s.m) })), { at: EIGHT_AT, to: t(8, 0) }],
      22,
    ),
    wedgeMode: "auto",
    wedgeOpacity: 1,
  }),
  narration: [
    { at: 0.4, text: "After half past, jump to the next hour and use illaa, meaning except." },
    { at: 7.8, text: "Count the minutes left until the next hour." },
  ],
};

// ---------- 6 & 7. The two rules with lesson examples ----------
const RULE_ATS = [70, 160, 250];

const RulePanel: React.FC<{
  n: number;
  rule: { title: string; formula: string; explain: string; examples: Example[] };
  color: string;
}> = ({ n, rule, color }) => {
  const frame = useCurrentFrame();
  const idx = activeIndex(frame, RULE_ATS);
  return (
    <Panel style={{ gap: 18 }}>
      <Kicker en={`Rule ${n}`} color={color} />
      {RULE_ATS.map((a) => <Sfx key={a} at={a} name="chime" volume={0.22} />)}
      <Reveal at={5}>
        <Mixed text={rule.title} size={40} arColor={color} />
      </Reveal>
      <Reveal at={18}>
        <Card accent={color} active style={{ textAlign: "center", padding: "4px 20px" }}>
          <Ar size={42} color={color}>{rule.formula}</Ar>
        </Card>
      </Reveal>
      <Reveal at={32}>
        <Mixed text={rule.explain} size={27} color={C.muted} arColor={color} />
      </Reveal>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rule.examples.map((ex, i) => (
          <Reveal key={ex.time} at={RULE_ATS[i]} dy={20}>
            <Card active={i === idx} accent={color} style={{ display: "flex", alignItems: "center", gap: 24, padding: "4px 24px" }}>
              <div style={{ width: 210, flexShrink: 0 }}>
                <En size={34}>{fmt(ex.time)}</En>
                <En size={26} color={C.muted}> · </En>
                <Ar size={34} color={C.muted} style={{ lineHeight: 1.2 }}>{arDigits(fmt(ex.time))}</Ar>
              </div>
              <div style={{ flex: 1, textAlign: "right" }}>
                <Ar size={44}>
                  {ex.hour} <span style={{ color }}>{ex.part}</span>
                </Ar>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Panel>
  );
};

const ruleStage = (examples: Example[], first: number) => (f: number) => ({
  minutes: stepValue(f, first, examples.map((e, i) => ({ at: RULE_ATS[i] - 10, to: e.time })), 25),
  wedgeMode: "auto" as const,
  wedgeOpacity: 1,
});

export const rulePast: SceneDef = {
  id: "rule-past",
  duration: 345,
  Panel: () => <RulePanel n={1} rule={RULE_PAST} color={C.past} />,
  stage: ruleStage(RULE_PAST.examples, t(8, 0)),
  narration: [
    { at: 0.5, text: "Rule one: the hour, then wa, then the minutes." },
  ],
};

export const ruleTo: SceneDef = {
  id: "rule-to",
  duration: 345,
  Panel: () => <RulePanel n={2} rule={RULE_TO} color={C.to} />,
  stage: ruleStage(RULE_TO.examples, t(11, 30)),
  narration: [
    { at: 0.5, text: "Rule two: the next hour, then illaa, then the minutes still to go." },
  ],
};

// ---------- 8. Common mistake ----------
const MistakePanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stamp = pop(frame, fps, 85, 9);
  return (
    <Panel style={{ gap: 22 }}>
      <Kicker en="Common mistake to avoid" color={C.wrong} />
      <Reveal at={10}>
        <DigitalTime en={fmt(MISTAKE.time)} ar={arDigits(fmt(MISTAKE.time))} size={80} />
      </Reveal>
      <Reveal at={35}>
        <Card accent={C.wrong} active={frame >= 85} style={{ position: "relative", display: "flex", alignItems: "center", gap: 20 }}>
          <En size={60} color={C.wrong} style={{ opacity: stamp, transform: `scale(${0.5 + stamp * 0.5})` }}>✗</En>
          <div style={{ flex: 1, textAlign: "right" }}>
            <Ar size={52} style={{ opacity: frame >= 85 ? 0.55 : 1, textDecoration: frame >= 85 ? "line-through" : "none", textDecorationColor: C.wrong }}>
              {MISTAKE.wrong}
            </Ar>
          </div>
        </Card>
      </Reveal>
      <Reveal at={140}>
        <Card accent={C.past} active style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <En size={60} color={C.past}>✓</En>
          <div style={{ flex: 1, textAlign: "right" }}>
            <Ar size={52}>{MISTAKE.right}</Ar>
          </div>
        </Card>
      </Reveal>
      <Reveal at={190}>
        <Mixed text={MISTAKE.tip} size={36} arColor={C.to} />
      </Reveal>
      <Sfx at={85} name="wrong" volume={0.35} />
      <Sfx at={140} name="correct" volume={0.3} />
    </Panel>
  );
};

export const mistake: SceneDef = {
  id: "mistake",
  duration: 300,
  Panel: MistakePanel,
  stage: (f) => ({
    minutes: MISTAKE.time,
    wedgeMode: "auto",
    wedgeOpacity: interpolate(f, [120, 150], [0.35, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  }),
  narration: [
    { at: 0.5, text: "Careful! At five forty-five, don't say 'five except a quarter'." },
    { at: 5, text: "Say 'six except a quarter'. Always name the next hour." },
  ],
};

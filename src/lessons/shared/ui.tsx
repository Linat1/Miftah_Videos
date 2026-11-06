import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ARABIC_FONT, LATIN_FONT, TITLE_FONT } from "../../fonts";
import { C, PANEL } from "./theme";
import { pop } from "./anim";

/** Arabic text: right-to-left, proper Arabic font, room for ḥarakāt. */
export const Ar: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  title?: boolean;
  style?: React.CSSProperties;
}> = ({ children, size = 44, color = C.text, title = false, style }) => (
  <span
    dir="rtl"
    style={{
      fontFamily: title ? TITLE_FONT : ARABIC_FONT,
      fontSize: size,
      color,
      fontWeight: 700,
      lineHeight: 1.75,
      unicodeBidi: "isolate",
      ...style,
    }}
  >
    {children}
  </span>
);

/** English text in the Latin font. */
export const En: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 30, color = C.text, style }) => (
  <span dir="ltr" style={{ fontFamily: LATIN_FONT, fontSize: size, color, fontWeight: 700, lineHeight: 1.35, unicodeBidi: "isolate", ...style }}>
    {children}
  </span>
);

/** English sentence with Arabic in {curly braces}: "Use {وَ} and {إِلَّا}". */
export const Mixed: React.FC<{ text: string; size?: number; color?: string; arColor?: string }> = ({
  text,
  size = 30,
  color = C.text,
  arColor = C.goldSoft,
}) => (
  <En size={size} color={color}>
    {text.split(/(\{[^}]+\})/).map((part, i) =>
      part.startsWith("{") ? (
        <Ar key={i} size={size * 1.25} color={arColor} style={{ lineHeight: 1 }}>
          {part.slice(1, -1)}
        </Ar>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    )}
  </En>
);

/** Springs its children in (fade + slide) starting at frame `at`. */
export const Reveal: React.FC<{
  at: number;
  children: React.ReactNode;
  dy?: number;
  style?: React.CSSProperties;
}> = ({ at, children, dy = 30, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, at, 18);
  if (frame < at) return null;
  return (
    <div style={{ opacity: Math.min(1, p * 1.3), transform: `translateY(${(1 - p) * dy}px)`, ...style }}>
      {children}
    </div>
  );
};

/** The right-hand content area of the 16:9 layout. */
export const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <AbsoluteFill>
    <div
      style={{
        position: "absolute",
        left: PANEL.left,
        top: PANEL.top,
        width: PANEL.width,
        height: PANEL.height,
        display: "flex",
        flexDirection: "column",
        gap: 22,
        ...style,
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

/** Small coloured label + optional Arabic heading at the top of a panel. */
export const Kicker: React.FC<{ en: string; ar?: string; color?: string }> = ({
  en,
  ar,
  color = C.gold,
}) => (
  <Reveal at={0} dy={15}>
    <div style={{ display: "flex", alignItems: "center", gap: 20, borderBottom: `2px solid ${C.border}`, paddingBottom: 8 }}>
      <En size={26} color={color} style={{ letterSpacing: 3, textTransform: "uppercase" }}>
        {en}
      </En>
      <div style={{ flex: 1 }} />
      {ar ? <Ar size={40} color={color} title>{ar}</Ar> : null}
    </div>
  </Reveal>
);

/** Rounded card. */
export const Card: React.FC<{
  children: React.ReactNode;
  accent?: string;
  active?: boolean;
  style?: React.CSSProperties;
}> = ({ children, accent = C.gold, active = false, style }) => (
  <div
    style={{
      background: active ? "rgba(255,255,255,0.11)" : C.card,
      border: `2px solid ${active ? accent : C.border}`,
      borderRadius: 22,
      padding: "14px 26px",
      boxShadow: active ? `0 0 34px ${accent}55` : "none",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Digital time shown in Arabic-Indic and Western digits: ٧:٠٥ · 7:05 */
export const DigitalTime: React.FC<{ ar: string; en: string; size?: number; color?: string }> = ({
  ar,
  en,
  size = 64,
  color = C.text,
}) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
    <En size={size} color={color} style={{ fontVariantNumeric: "tabular-nums" }}>{en}</En>
    <En size={size * 0.5} color={C.muted}>·</En>
    <Ar size={size * 0.95} color={color} style={{ lineHeight: 1.2 }}>{ar}</Ar>
  </div>
);

/** Fades a whole scene in and out at its edges. */
export const SceneFade: React.FC<{ duration: number; fade: number; children: React.ReactNode }> = ({
  duration,
  fade,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(
    interpolate(frame, [0, fade], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [duration - fade, duration], [1, 0], { extrapolateLeft: "clamp" }),
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

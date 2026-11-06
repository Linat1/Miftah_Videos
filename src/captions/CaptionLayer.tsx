import React, { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  createTikTokStyleCaptions,
  type Caption,
  type TikTokPage,
} from "@remotion/captions";
import { ARABIC_FONT, LATIN_FONT } from "../fonts";

// How many ms of words to group onto one caption "page".
const COMBINE_MS = 1200;
const HIGHLIGHT = "#f5c451";

const hasArabic = (s: string) => /[؀-ۿ]/.test(s);

const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const timeMs = (frame / fps) * 1000 + page.startMs; // absolute time in the video

  const pop = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 8 });
  const rtl = hasArabic(page.text);
  const fontSize = Math.round(Math.min(width, height) * (rtl ? 0.075 : 0.06));

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: height * (height > width ? 0.2 : 0.1),
      }}
    >
      <div
        dir={rtl ? "rtl" : "ltr"}
        style={{
          fontFamily: rtl ? ARABIC_FONT : LATIN_FONT,
          fontSize,
          fontWeight: 700,
          lineHeight: rtl ? 1.8 : 1.3,
          color: "white",
          textAlign: "center",
          maxWidth: width * 0.85,
          padding: "0.2em 0.6em",
          borderRadius: 24,
          background: "rgba(0,0,0,0.45)",
          textShadow: "0 4px 18px rgba(0,0,0,0.6)",
          transform: `scale(${interpolate(pop, [0, 1], [0.85, 1])})`,
          opacity: pop,
          whiteSpace: "pre-wrap",
        }}
      >
        {page.tokens.map((t) => {
          const active = t.fromMs <= timeMs && t.toMs > timeMs;
          return (
            <span
              key={t.fromMs}
              style={{ color: active ? HIGHLIGHT : "white" }}
            >
              {t.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Loads a caption JSON file from /public and shows word-by-word captions.
export const CaptionLayer: React.FC<{ file: string }> = ({ file }) => {
  const { fps } = useVideoConfig();
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const [handle] = useState(() => delayRender(`Loading captions ${file}`));

  useEffect(() => {
    fetch(staticFile(file))
      .then((r) => r.json())
      .then((data: Caption[]) => {
        setCaptions(data);
        continueRender(handle);
      })
      .catch((e) => {
        console.error(e);
        continueRender(handle);
      });
  }, [file, handle]);

  const pages = useMemo(
    () =>
      captions
        ? createTikTokStyleCaptions({
            captions,
            combineTokensWithinMilliseconds: COMBINE_MS,
          }).pages
        : [],
    [captions],
  );

  return (
    <AbsoluteFill>
      {pages.map((page, i) => {
        const next = pages[i + 1];
        const from = Math.round((page.startMs / 1000) * fps);
        const endMs = next ? next.startMs : page.startMs + page.durationMs;
        const duration = Math.max(1, Math.round(((endMs - page.startMs) / 1000) * fps));
        return (
          <Sequence key={i} from={from} durationInFrames={duration} layout="none">
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

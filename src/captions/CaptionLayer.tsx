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

const CaptionPage: React.FC<{ page: TikTokPage; fontScale: number }> = ({
  page,
  fontScale,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const timeMs = (frame / fps) * 1000 + page.startMs; // absolute time in the video

  const pop = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 8 });
  const rtl = hasArabic(page.text);
  const fontSize = Math.round(Math.min(width, height) * (rtl ? 0.075 : 0.06) * fontScale);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: height * (height > width ? 0.2 : fontScale < 1 ? 0.06 : 0.1),
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
          borderRadius: fontSize * 0.4,
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

type CaptionLayerProps = {
  /** JSON file inside /public (e.g. made by `npm run captions`). */
  file?: string;
  /** Or pass captions directly (e.g. generated from a narration script). */
  captions?: Caption[];
  /** How many ms of words to group onto one caption "page". */
  combineMs?: number;
  /** 1 = big social-media captions, ~0.6 = subtitle size. */
  fontScale?: number;
  /** Hide a caption this long after its last word, if nothing follows. */
  holdMs?: number;
};

// Shows word-by-word captions, from a JSON file or from a captions array.
export const CaptionLayer: React.FC<CaptionLayerProps> = ({
  file,
  captions: captionsProp,
  combineMs = COMBINE_MS,
  fontScale = 1,
  holdMs = 1500,
}) => {
  const { fps } = useVideoConfig();
  const [loaded, setLoaded] = useState<Caption[] | null>(null);
  const [handle] = useState(() =>
    file && !captionsProp ? delayRender(`Loading captions ${file}`) : null,
  );

  useEffect(() => {
    if (handle === null || !file) return;
    fetch(staticFile(file))
      .then((r) => r.json())
      .then((data: Caption[]) => {
        setLoaded(data);
        continueRender(handle);
      })
      .catch((e) => {
        console.error(e);
        continueRender(handle);
      });
  }, [file, handle]);

  const captions = captionsProp ?? loaded;
  const pages = useMemo(
    () =>
      captions
        ? createTikTokStyleCaptions({
            captions,
            combineTokensWithinMilliseconds: combineMs,
          }).pages
        : [],
    [captions, combineMs],
  );

  return (
    <AbsoluteFill>
      {pages.map((page, i) => {
        const next = pages[i + 1];
        const from = Math.round((page.startMs / 1000) * fps);
        // durationMs can stretch to the next caption, so end at the last word instead
        const lastWordEnd = page.tokens.length ? page.tokens[page.tokens.length - 1].toMs : page.startMs + page.durationMs;
        const ownEnd = lastWordEnd + holdMs;
        const endMs = next ? Math.min(next.startMs, ownEnd) : ownEnd;
        const duration = Math.max(1, Math.round(((endMs - page.startMs) / 1000) * fps));
        return (
          <Sequence key={i} from={from} durationInFrames={duration} layout="none">
            <CaptionPage page={page} fontScale={fontScale} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

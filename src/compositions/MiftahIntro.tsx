import React from "react";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { KeyScene } from "../three/KeyScene";
import { CaptionLayer } from "../captions/CaptionLayer";
import { TITLE_FONT as titleFont } from "../fonts";

// The schema makes every prop editable in the Studio's right-hand panel.
export const miftahIntroSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  captionsFile: z.string().describe("JSON file inside /public, or empty for none"),
  audioFile: z.string().describe("Audio file inside /public, or empty for none"),
  keyColor: zColor(),
  background: zColor(),
});

type Props = z.infer<typeof miftahIntroSchema>;

export const MiftahIntro: React.FC<Props> = ({
  title,
  subtitle,
  captionsFile,
  audioFile,
  keyColor,
  background,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  // Title fades in after the key arrives, and everything fades out at the end.
  const titleIn = interpolate(frame, [25, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const unit = Math.min(width, height);

  return (
    <AbsoluteFill style={{ backgroundColor: background, opacity: fadeOut }}>
      {/* Layer 1: 3D scene (three.js) */}
      <KeyScene keyColor={keyColor} background={background} />

      {/* Layer 2: 2D title (normal HTML/CSS on top of the 3D) */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: height * (height > width ? 0.12 : 0.07),
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0, 1], [30, 0])}px)`,
        }}
      >
        <div dir="rtl" style={{ fontFamily: titleFont, fontSize: unit * 0.16, color: keyColor, lineHeight: 1.4 }}>
          {title}
        </div>
        <div style={{ fontFamily: titleFont, fontSize: unit * 0.045, color: "white", opacity: 0.85 }}>
          {subtitle}
        </div>
      </AbsoluteFill>

      {/* Layer 3: captions */}
      {captionsFile ? <CaptionLayer file={captionsFile} /> : null}

      {/* Audio: music and/or narration. Volume fades in/out by frame. */}
      {audioFile ? (
        <Audio
          src={staticFile(audioFile)}
          volume={(f) =>
            interpolate(f, [0, 15, durationInFrames - 30, durationInFrames], [0, 0.8, 0.8, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};

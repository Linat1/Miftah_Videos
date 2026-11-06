import React from "react";
import { Composition } from "remotion";
import { MiftahIntro, miftahIntroSchema } from "./compositions/MiftahIntro";
import {
  FPS as D1L02_FPS,
  TOTAL_FRAMES as D1L02_FRAMES,
  TellingTheTime,
  tellingTheTimeSchema,
} from "./lessons/d1-l02/TellingTheTime";

// Every <Composition> here shows up in the Studio sidebar and can be rendered.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Landscape 16:9 — YouTube, slides, classroom screens */}
      <Composition
        id="MiftahIntro"
        component={MiftahIntro}
        durationInFrames={300} // 10 seconds at 30 fps
        fps={30}
        width={1920}
        height={1080}
        schema={miftahIntroSchema}
        defaultProps={{
          title: "مِفْتَاح",
          subtitle: "Miftah — the key to Arabic",
          captionsFile: "captions/intro-en.json",
          audioFile: "audio/demo-music.mp3",
          keyColor: "#d4a64a",
          background: "#0b1d2e",
        }}
      />

      {/* Vertical 9:16 — Instagram Reels, TikTok, YouTube Shorts */}
      <Composition
        id="MiftahIntroVertical"
        component={MiftahIntro}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={miftahIntroSchema}
        defaultProps={{
          title: "مِفْتَاح",
          subtitle: "Miftah — the key to Arabic",
          captionsFile: "captions/intro-ar.json",
          audioFile: "audio/demo-music.mp3",
          keyColor: "#d4a64a",
          background: "#0b1d2e",
        }}
      />

      {/* Lesson D1-L02 · Telling the Time (16:9 explainer) */}
      <Composition
        id="D1-L02-TellingTheTime"
        component={TellingTheTime}
        durationInFrames={D1L02_FRAMES}
        fps={D1L02_FPS}
        width={1920}
        height={1080}
        schema={tellingTheTimeSchema}
        defaultProps={{
          narrationFile: "",
          captionsFile: "",
          showCaptions: true,
          musicVolume: 0.35,
        }}
      />
    </>
  );
};

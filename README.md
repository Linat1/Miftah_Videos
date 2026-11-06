# Miftah Videos — 3D animated videos with three.js + Remotion

This project makes **3D animated videos in code**:

| Tool | What it does here |
|---|---|
| **three.js** (via React Three Fiber) | The 3D scene: models, lights, camera, materials |
| **Remotion** | The timeline: animation timing, 2D text, **captions**, **audio**, and **rendering to MP4** |
| **@remotion/three** | Connects the two, so every 3D frame is synced to the video timeline |
| **@remotion/captions** | Word-by-word highlighted captions (English and Arabic, right-to-left) |
| **@remotion/media** | Music and narration audio |
| **Whisper** (optional) | Generates captions automatically from your narration recording |

A starter video is included: a golden 3D key (مِفْتَاح) with a title, captions and music, in
**landscape 16:9** and **vertical 9:16** (Reels / Shorts / TikTok).

---

## 1. One-time setup on your computer

You need:

1. **Node.js 20 or newer**: download the LTS version from <https://nodejs.org>.
2. This project on your computer: clone it with Git or GitHub Desktop.

Then open a terminal **in the project folder** and install everything:

```bash
npm install
```

That's it. FFmpeg comes bundled with Remotion, and the browser it renders with is downloaded automatically the first time you render.

---

## Where are my videos?

Videos are **made from the code**. They aren't stored as files until you render them:

- **Finished videos** I render for you are in the [`videos/`](videos/) folder of this repository.
  Open one on GitHub and click **Download raw file**.
- **To make one yourself**, run a render command (below). It's saved in the `out/` folder on your computer.
  (`out/` is not uploaded to GitHub, which keeps the repository small.)

## 2. Everyday workflow

### Preview and edit (Remotion Studio)

```bash
npm run dev
```

This opens the **Studio** in your browser (usually <http://localhost:3000>). There you can:

- press play and scrub the timeline,
- pick `MiftahIntro` (landscape) or `MiftahIntroVertical` (vertical) on the left,
- change the **title, subtitle, colours, captions file and audio file** in the right-hand panel, with no code needed.

When you save a code file, the preview updates instantly.

### Render the final video

```bash
npm run render
```

```bash
npm run render:vertical
```

Videos are saved in the `out/` folder. You can also click **Render** inside the Studio.

### Make a thumbnail image

```bash
npm run still
```

---

## 3. Adding your own audio

1. Put your file (MP3, WAV, M4A…) into `public/audio/`, for example `public/audio/lesson1-narration.mp3`.
2. In the Studio's right-hand panel, set **audioFile** to `audio/lesson1-narration.mp3`.
3. Make the video length match the audio: change `durationInFrames` in `src/Root.tsx`
   (seconds × 30. For example, a 45-second narration = `1350`).

`public/audio/demo-music.mp3` is just a simple placeholder tone. Replace it with your own music or voice.

---

## 4. Captions

Captions are JSON files in `public/captions/`. Each word has a start and end time in milliseconds:

```json
[
  { "text": "Welcome", "startMs": 2000, "endMs": 2400, "timestampMs": 2200, "confidence": 1 },
  { "text": " to",     "startMs": 2400, "endMs": 2600, "timestampMs": 2500, "confidence": 1 }
]
```

> **Tip:** every word after the first starts with a **space** (`" to"`). That's how words get separated.

Arabic is detected automatically and shown right-to-left in Noto Naskh Arabic, with full
ḥarakāt (see `public/captions/intro-ar.json`).

### Option A: generate captions automatically from your narration (recommended)

```bash
npm run captions -- public/audio/lesson1-narration.mp3
```

For an Arabic narration, add `ar`:

```bash
npm run captions -- public/audio/lesson1-narration.mp3 ar
```

This creates `public/captions/lesson1-narration.json`. Set **captionsFile** to
`captions/lesson1-narration.json` in the Studio.

- The first run downloads the free Whisper speech model (~500 MB). It runs on **your computer**, so no account or API key is needed.
- Always **check Arabic captions**: speech recognition often drops or changes ḥarakāt. Edit the JSON text to fix any words.
- For higher accuracy, use a bigger model (slower):

  ```bash
  WHISPER_MODEL=large-v3-turbo npm run captions -- public/audio/lesson1-narration.mp3 ar
  ```

### Option B: write them by hand

Copy `public/captions/intro-en.json`, change the words and timings, and point **captionsFile** at it.
Leave **captionsFile** empty for no captions.

---

## 5. How the project is organised

```
public/                 ← files used by the video (served as-is)
  audio/                  music & narration
  captions/               caption JSON files
  fonts/                  Amiri, Noto Naskh Arabic, Poppins (bundled so renders work offline)
src/
  index.ts                entry point (don't need to touch)
  Root.tsx                list of videos: size, length, fps, default settings
  fonts.ts                font loading
  compositions/
    MiftahIntro.tsx       the video: stacks 3D scene + title + captions + audio
  three/
    KeyScene.tsx          the 3D scene: camera, lights, animation
    KeyModel.tsx          the 3D key, built from simple shapes
  captions/
    CaptionLayer.tsx      word-by-word caption display
  three/Clock3D.tsx       3D clock with Arabic-Indic numerals and past/to wedge
  lessons/
    shared/               reusable pieces (3D stage, characters, sets, story engine, sfx)
    d1-l02/               D1-L02 Telling the Time explainer (content.ts + scenes/)
    d1-l02-story/         D1-L02 story episode (story.ts, voice-timing.json)
scripts/
  transcribe.mjs          narration → captions (Whisper)
  make-lesson-audio.mjs   synthesises music + sound effects
  export-narration.tsx    writes the voice-over script for D1-L02
recordings/d1-l02/       put your voice recordings here
docs/
  D1-L02-narration-script.md        voice-over script for the explainer
  D1-L02-story-script.md      line-by-line recording script for the story
remotion.config.ts       render settings
```

---

## 6. The golden rule of animating 3D in Remotion

**Animate everything from the frame number.** Never use timers, `Date.now()`, `Math.random()`
or three.js's `useFrame()` for motion: the render would come out jumpy or different each time.

```tsx
const frame = useCurrentFrame();             // 0, 1, 2, … 299
const rotation = frame * 0.02;               // steady spin
const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" }); // fade in over 1 second
```

Useful helpers from `remotion`: `interpolate`, `spring`, `Easing`, `<Sequence>` (to start something later).

---

## 7. Using your own 3D models

Free models (`.glb` files) are available from sites like Sketchfab or Poly Pizza (check each model's licence).

1. Put the file in `public/models/`, e.g. `public/models/lantern.glb`.
2. Use it in a scene:

```tsx
import { useGLTF } from "@react-three/drei";
import { staticFile } from "remotion";

const Lantern = () => {
  const { scene } = useGLTF(staticFile("models/lantern.glb"));
  return <primitive object={scene} scale={1.5} />;
};
```

3. Place `<Lantern />` inside the `<ThreeCanvas>` in a scene file, and animate its
   `position` / `rotation` with `useCurrentFrame()`.

`@react-three/drei` (already installed) also has handy extras: 3D text, environments, outlines, etc.

---

## 8. Making a new video

1. Copy `src/compositions/MiftahIntro.tsx` to e.g. `src/compositions/Lesson1.tsx` and edit it.
2. Register it in `src/Root.tsx` with another `<Composition id="Lesson1" … />`.
3. Render it:

```bash
npx remotion render Lesson1 out/lesson1.mp4
```

---

## 9. Lesson videos: D1-L02 · Telling the Time

A 3:22 explainer built from the
[D1-L02 lesson page](https://miftaharabiclessons.inkandpixels.uk/lessons/development/d1/lesson-02-telling-the-time.php).
In the Studio it's called **`D1-L02-TellingTheTime`**.

| Time | Scene | What happens |
|---|---|---|
| 0:00 | Title | 3D clock winds to 8:00; Arabic + English title |
| 0:06 | Objectives | The four "Today you will…" goals |
| 0:16 | كَمِ السَّاعَةُ؟ | **Yusuf** asks **Noor** the time, under a wall clock |
| 0:23 | Minutes past (وَ) | Minute hand sweeps 7:05 → 7:30; a **green** wedge fills; vocabulary chips build up |
| 0:38 | Minutes to (إِلَّا) | السَّابِعَةُ → الثَّامِنَةُ "next hour!" switch; 7:40 → 8:00 with an **orange** wedge |
| 0:54 | Rule 1 & Rule 2 | Lesson formulas and examples (7:05, 9:15, 11:30 / 2:40, 5:45, 8:55) |
| 1:16 | Common mistake | 5:45 ✗ الخَامِسَةُ إِلَّا الرُّبْعَ → ✓ السَّادِسَةُ إِلَّا الرُّبْعَ |
| 1:25 | 24-hour time | Digital / conversational / 24-hour table, sun and moon, صَبَاحًا / مَسَاءً |
| 1:38 | Start · finish · duration | يَبْدَأُ · يَنْتَهِي · يَسْتَمِرُّ مُدَّةَ with a timeline, 8:00–8:45 |
| 1:53 | Café | **Maryam** asks the **waiter** when breakfast begins and ends, and the time now |
| 2:09 | Model exchange | **Aisha** asks مَتَى يَبْدَأُ التَّمْرِينُ؟; **Yusuf** answers (the clock runs 90 minutes) |
| 2:24 | Quiz × 4 | 6:30, 3:45, 2:40, 10:50: three options, 5-second countdown, then the answer |
| 3:06 | Close | Recap, next lesson, بِالْعِلْمِ نَفْتَحُ الْأَبْوَابَ with the golden key |
| 3:16 | Goodbye | The whole cast hops and waves: مَعَ السَّلَامَةِ |

Render it:

```bash
npm run render:d1-l02
```

### Editing the words

All on-screen Arabic and English is in **one file**: `src/lessons/d1-l02/content.ts`.
Change it there and every scene updates. The narration/caption lines are at the bottom of each scene
in `src/lessons/d1-l02/scenes/`.

### Adding your own voice

The video works as-is with music + on-screen captions. To add your voice:

1. Open the script, `docs/D1-L02-narration-script.md`. It lists every line with its start time.
2. Record yourself reading it (one take, following the times). Save it as `public/audio/d1-l02-narration.mp3`.
3. In the Studio, set **narrationFile** to `audio/d1-l02-narration.mp3` (the music automatically gets quieter).
4. Optional, for captions that match your voice exactly:

   ```bash
   npm run captions -- public/audio/d1-l02-narration.mp3
   ```

   Then set **captionsFile** to `captions/d1-l02-narration.json`.

If you change any narration lines, regenerate the script:

```bash
npm run script:d1-l02
```

### The characters

Your five illustrated characters live in `public/characters/` (transparent PNGs):

| File | Name in the video | Natural facing |
|---|---|---|
| `yusuf.png` | Yusuf · يُوسُفُ | right |
| `maryam.png` | Maryam · مَرْيَمُ | left |
| `waiter.png` | Waiter · النَّادِلُ | left |
| `aisha.png` | Aisha · عَائِشَةُ | right |
| `noor.png` | Noor · نُورُ | right |

To rename them, edit `CAST` in `src/lessons/shared/Character.tsx`. They're animated puppet-style: they walk in,
breathe, bounce while they talk, hop when happy, and flip to face each other. To add a new character, drop a
transparent PNG into `public/characters/` and add a line to `CAST`.

Dialogue lines (who speaks, when, Arabic + English) are in `content.ts` under **Character dialogues**.
Each `at` is a frame number (30 frames = 1 second).

### Making the next lesson video

Copy the folder `src/lessons/d1-l02` to e.g. `src/lessons/d1-l03`, edit `content.ts` and the scenes,
and register it in `src/Root.tsx` like D1-L02. Everything in `src/lessons/shared/` (3D clock stage,
cards, Arabic text, sound effects, captions) is reusable. Music and sound effects are synthesised by
`npm run audio:lesson`, so they're royalty-free.

---

## 10. Story episode: D1-L02 · "Yusuf's Busy Wednesday"

A cartoon-style story episode (16:9, ~2:45 before voices) where your characters **act out the lesson**.
It's built on the lesson's Wednesday listening script, its model exchange and its common mistake.
In the Studio it's called **`D1-L02-Story`**.

| Part | Where | What happens |
|---|---|---|
| Title | | يَوْمُ الأَرْبِعَاءِ · Yusuf's Busy Wednesday |
| Scene 1 | Bedroom, 7:30 a.m. | Maryam wakes Yusuf: school starts at 7:50, "Only twenty minutes!" He dashes off |
| Tip 1 | 3D clock | Minutes past: keep the hour + وَ |
| Scene 2 | School corridor, 7:45 | Yusuf says السَّابِعَةُ إِلَّا الرُّبْعَ (the common mistake!). Aisha corrects him |
| Tip 2 | 3D clock | Minutes to: name the NEXT hour + إِلَّا |
| Scene 3 | Classroom, 8:00 | Noor's Wednesday timetable: when the lesson ends, and how long the break lasts |
| Tip 3 | 3D clock | يَبْدَأُ · يَنْتَهِي · يَسْتَمِرُّ مُدَّةَ |
| Scene 4 | Café, 5:55 p.m. | The lesson's model exchange about training. It's already 5:55, and he's late again! |
| Scene 5 | Home, 8:00 p.m. | "A long day!" Then "Tomorrow school starts at 7:30!" Yusuf faints |
| Quiz × 3 | Classroom | Noor asks; 4-second countdown; the answer is revealed |
| The end | | The whole cast, أَحْسَنْتُمْ! |

Render it:

```bash
npm run render:d1-l02-story
```

### Recording the voices

1. Open **`docs/D1-L02-story-script.md`**. It lists every line with its file name (e.g. `s1-01`),
   speaker, Arabic, English and rough length.
2. Record **one file per line** (your phone's voice recorder is fine). Name each file after its line id,
   e.g. `s1-01.m4a`, and put them all in **`recordings/d1-l02/`**.
3. Run:

   ```bash
   npm run voices:d1-l02
   ```

   This trims the silence, evens out the volume, saves the voices into the project, and **re-times the whole
   episode to your recordings**. Lines you haven't recorded yet keep the estimated timing.
4. Preview in `npm run dev` (choose **D1-L02-Story**), then render.

### Changing the story

Everything is in **`src/lessons/d1-l02-story/story.ts`**: scenes, who stands where, every line
(Arabic + English), the camera shot for each line (`wide`, `close`, `clock`, `two`), and reactions:

- `emote`: `!`, `?`, `?!`, `zz` (sleepy) or `sweat`
- `enter` / `exit`: walk or run on and off stage
- `hop`: a happy jump · `faint`: a comedy fall
- `sfx`: a sound effect

The rooms are drawn in code in `src/lessons/shared/sets.tsx` (bedroom, corridor, classroom, café, living room),
and the story engine in `src/lessons/shared/story/` works for any future episode.

If you change any lines, regenerate the recording script:

```bash
npm run script:d1-l02-story
```

---

## 11. Troubleshooting

| Problem | Fix |
|---|---|
| Render is black or shows a **"WebGL context"** error | Open `remotion.config.ts` and change `"angle"` to `"swangle"` (needed on computers/servers without a graphics card; slower but reliable). |
| Render is slow | Normal for 3D. Preview at half size with `--scale=0.5`, then do the final render at full size. |
| Arabic letters look disconnected or plain | Make sure the text uses one of the bundled fonts (see `src/fonts.ts`). |
| Captions are out of sync | Check the `startMs`/`endMs` values; they're in **milliseconds** (1 second = 1000). |
| Want the latest Remotion version | `npm run upgrade` |

---

## Licences

- **Remotion** is free for individuals and companies with up to 3 employees; larger organisations need a
  company licence. See <https://www.remotion.dev/license>.
- three.js, React Three Fiber and drei are MIT-licensed.
- The bundled fonts (Amiri, Noto Naskh Arabic, Poppins) are under the SIL Open Font Licence.

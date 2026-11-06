// "Yusuf's Busy Wednesday": a story episode for D1-L02 · Telling the Time.
// Built on the lesson's Wednesday listening script, model exchange and common mistake.
// Every line `id` is the name of its voice file: public/voices/d1-l02/<id>.mp3
import { t } from "../shared/time";
import type { QuizSeg, SceneSeg, TipSeg } from "../shared/story/types";

export const EPISODE = {
  titleAr: "يَوْمُ الأَرْبِعَاءِ",
  titleEn: "Yusuf's Busy Wednesday",
  lesson: "D1-L02 · Telling the Time",
  voiceFolder: "voices/d1-l02",
};

// ---------- Scene 1 · Bedroom, 7:30 a.m. ----------
export const S1: SceneSeg = {
  kind: "scene",
  id: "bedroom",
  set: "bedroom",
  time: t(7, 30),
  timeLabel: { en: "7:30 a.m.", ar: "٧:٣٠ صَبَاحًا" },
  alarm: true,
  cast: [
    { who: "yusuf", x: 560, face: "right" },
    { who: "maryam", x: 1400, face: "left" },
  ],
  lines: [
    { id: "s1-01", tone: "calling loudly from the doorway", who: "maryam", ar: "يُوسُفُ! اِسْتَيْقِظْ!", en: "Yusuf! Wake up!", shot: "wide",
      events: [{ do: "enter", who: "maryam", from: "right", run: true }, { do: "emote", who: "yusuf", type: "zz" }] },
    { id: "s1-02", tone: "sleepy, yawning", who: "yusuf", ar: "كَمِ السَّاعَةُ؟", en: "What time is it?", shot: "close",
      events: [{ do: "emote", who: "yusuf", type: "?" }] },
    { id: "s1-03", tone: "matter-of-fact", who: "maryam", ar: "السَّاعَةُ السَّابِعَةُ وَالنِّصْفُ.", en: "It's half past seven.", shot: "clock" },
    { id: "s1-04", tone: "urgent", who: "maryam", ar: "يَبْدَأُ الدَّوَامُ فِي الثَّامِنَةِ إِلَّا عَشْرَ دَقَائِقَ!", en: "School starts at ten to eight!", shot: "close" },
    { id: "s1-05", tone: "panicking", who: "yusuf", ar: "مَاذَا؟! عِشْرُونَ دَقِيقَةً فَقَطْ!", en: "What?! Only twenty minutes!", shot: "wide",
      events: [{ do: "emote", who: "yusuf", type: "!" }, { do: "exit", who: "yusuf", to: "left", when: "end" }] },
  ],
  tail: 10,
};

// ---------- Scene 2 · School corridor, 7:45 a.m. ----------
export const S2: SceneSeg = {
  kind: "scene",
  id: "corridor",
  set: "corridor",
  time: t(7, 45),
  timeLabel: { en: "7:45 a.m.", ar: "٧:٤٥ صَبَاحًا" },
  cast: [
    { who: "yusuf", x: 520, face: "right" },
    { who: "aisha", x: 1380, face: "left" },
  ],
  lines: [
    { id: "s2-01", tone: "cheerful", who: "aisha", ar: "صَبَاحَ الخَيْرِ يَا يُوسُفُ!", en: "Good morning, Yusuf!", shot: "wide",
      events: [{ do: "enter", who: "yusuf", from: "left", run: true }, { do: "emote", who: "yusuf", type: "sweat" }] },
    { id: "s2-02", tone: "out of breath", who: "yusuf", ar: "صَبَاحَ النُّورِ! كَمِ السَّاعَةُ الآنَ؟", en: "Good morning! What time is it now?", shot: "close" },
    { id: "s2-03", tone: "pointing, amused", who: "aisha", ar: "اُنْظُرْ إِلَى السَّاعَةِ!", en: "Look at the clock!", shot: "close" },
    { id: "s2-04", tone: "slowly, reading the clock (wrongly!)", who: "yusuf", ar: "السَّاعَةُ السَّابِعَةُ إِلَّا الرُّبْعَ...", en: "It's quarter to seven...", shot: "clock" },
    { id: "s2-05", tone: "relieved, relaxed", who: "yusuf", ar: "عِنْدِي وَقْتٌ كَثِيرٌ!", en: "I've got lots of time!", shot: "close",
      events: [{ do: "hop", who: "yusuf" }] },
    { id: "s2-06", tone: "laughing, correcting him", who: "aisha", ar: "لَا، لَا! السَّاعَةُ الثَّامِنَةُ إِلَّا الرُّبْعَ!", en: "No, no! It's quarter to EIGHT!", shot: "close",
      events: [{ do: "sfx", name: "wrong" }, { do: "emote", who: "aisha", type: "!" }] },
    { id: "s2-07", tone: "horrified", who: "yusuf", ar: "خَمْسُ دَقَائِقَ فَقَطْ؟!", en: "Only five minutes?!", shot: "wide",
      events: [{ do: "emote", who: "yusuf", type: "?!" }, { do: "exit", who: "yusuf", to: "right", when: "end" }] },
  ],
  tail: 10,
};

// ---------- Scene 3 · Classroom, 8:00 a.m. ----------
export const S3: SceneSeg = {
  kind: "scene",
  id: "classroom",
  set: "classroom",
  time: t(8, 0),
  timeLabel: { en: "8:00 a.m.", ar: "٨:٠٠ صَبَاحًا" },
  cast: [
    { who: "noor", x: 430, face: "right" },
    { who: "yusuf", x: 1620, face: "left" },
  ],
  lines: [
    { id: "s3-01", tone: "warm, teacherly", who: "noor", ar: "صَبَاحَ الخَيْرِ! يَبْدَأُ الدَّرْسُ الآنَ.", en: "Good morning! The lesson begins now.", shot: "wide",
      events: [{ do: "enter", who: "yusuf", from: "right", run: true, when: "end" }] },
    { id: "s3-02", tone: "still out of breath", who: "yusuf", ar: "مَتَى يَنْتَهِي الدَّرْسُ؟", en: "When does the lesson end?", shot: "close",
      events: [{ do: "emote", who: "yusuf", type: "sweat" }] },
    { id: "s3-03", tone: "clear, pointing to the board", who: "noor", ar: "يَنْتَهِي فِي التَّاسِعَةِ إِلَّا الرُّبْعَ.", en: "It ends at quarter to nine.", shot: "wide" },
    { id: "s3-04", tone: "hopeful", who: "yusuf", ar: "وَمَتَى تَبْدَأُ الاِسْتِرَاحَةُ؟", en: "And when does the break begin?", shot: "close" },
    { id: "s3-05", tone: "kind but firm", who: "noor", ar: "بَعْدَ الدَّرْسِ، وَتَسْتَمِرُّ عِشْرِينَ دَقِيقَةً.", en: "After the lesson. It lasts twenty minutes.", shot: "close" },
    { id: "s3-06", tone: "disappointed", who: "yusuf", ar: "عِشْرُونَ دَقِيقَةً فَقَطْ؟!", en: "Only twenty minutes?!", shot: "wide",
      events: [{ do: "emote", who: "yusuf", type: "?!" }, { do: "emote", who: "noor", type: "sweat", when: "end" }] },
  ],
  tail: 20,
};

// ---------- Scene 4 · Café, 5:55 p.m. ----------
export const S4: SceneSeg = {
  kind: "scene",
  id: "cafe",
  set: "cafe",
  time: t(17, 55),
  timeLabel: { en: "5:55 p.m.", ar: "٥:٥٥ مَسَاءً" },
  cast: [
    { who: "aisha", x: 330, face: "right" },
    { who: "yusuf", x: 790, face: "left" },
    { who: "waiter", x: 1570, face: "left" },
  ],
  lines: [
    { id: "s4-01", tone: "friendly, polite", who: "waiter", ar: "تَفَضَّلَا!", en: "Here you are!", shot: "wide" },
    { id: "s4-02", tone: "curious", who: "aisha", ar: "مَتَى يَبْدَأُ التَّمْرِينُ؟", en: "When does training begin?", shot: "close" },
    { id: "s4-03", tone: "proud, confident", who: "yusuf", ar: "يَبْدَأُ فِي السَّادِسَةِ إِلَّا الرُّبْعَ وَيَسْتَمِرُّ مُدَّةَ سَاعَةٍ وَالنِّصْفِ.", en: "It begins at quarter to six and lasts an hour and a half.", shot: "close" },
    { id: "s4-04", tone: "casual", who: "aisha", ar: "كَمِ السَّاعَةُ الآنَ؟", en: "What time is it now?", shot: "two", focus: ["aisha", "yusuf"] },
    { id: "s4-05", tone: "helpful", who: "waiter", ar: "السَّاعَةُ السَّادِسَةُ إِلَّا خَمْسَ دَقَائِقَ.", en: "It's five to six.", shot: "clock" },
    { id: "s4-06", tone: "shocked", who: "yusuf", ar: "مَاذَا؟!", en: "What?! (Training started ten minutes ago!)", shot: "wide",
      events: [{ do: "emote", who: "yusuf", type: "!" }, { do: "exit", who: "yusuf", to: "left", when: "end" }, { do: "emote", who: "aisha", type: "sweat", when: "end" }] },
  ],
  tail: 20,
};

// ---------- Scene 5 · Home, 8:00 p.m. ----------
export const S5: SceneSeg = {
  kind: "scene",
  id: "home",
  set: "living",
  time: t(20, 0),
  timeLabel: { en: "8:00 p.m.", ar: "٨:٠٠ مَسَاءً" },
  cast: [
    { who: "maryam", x: 520, face: "right" },
    { who: "yusuf", x: 1350, face: "left" },
  ],
  lines: [
    { id: "s5-01", tone: "welcoming", who: "maryam", ar: "أَهْلًا يَا يُوسُفُ! كَمِ السَّاعَةُ؟", en: "Hi Yusuf! What time is it?", shot: "wide",
      events: [{ do: "enter", who: "yusuf", from: "right" }] },
    { id: "s5-02", tone: "exhausted, sighing", who: "yusuf", ar: "الثَّامِنَةُ مَسَاءً... يَوْمٌ طَوِيلٌ!", en: "Eight in the evening... what a long day!", shot: "close",
      events: [{ do: "emote", who: "yusuf", type: "sweat" }] },
    { id: "s5-03", tone: "teasing, cheerful", who: "maryam", ar: "وَغَدًا يَبْدَأُ الدَّوَامُ فِي السَّابِعَةِ وَالنِّصْفِ!", en: "And tomorrow school starts at half past seven!", shot: "close" },
    { id: "s5-04", tone: "disbelief, then he faints", who: "yusuf", ar: "مَاذَا؟!", en: "What?!", shot: "wide",
      events: [{ do: "emote", who: "yusuf", type: "!" }, { do: "faint", who: "yusuf", when: "end" }, { do: "emote", who: "maryam", type: "sweat", when: "end" }] },
  ],
  tail: 45,
};

// ---------- Miftah tips (3D clock cut-aways) ----------
export const TIP1: TipSeg = {
  kind: "tip",
  id: "tip-past",
  line: { id: "tip-1", tone: "clear, friendly narrator", who: "narrator", en: "Up to half past, keep the same hour and add wa." },
  stage: (f) => ({ minutes: t(7, 0) + Math.min(30, f / 2), wedgeMode: "auto", wedgeOpacity: 1 }),
  title: "Minutes past: keep the hour + {وَ}",
  example: { hour: "السَّاعَةُ السَّابِعَةُ", part: "وَالنِّصْفُ", color: "past" },
  rule: "7:30 · up to :30, the hour stays the same.",
};

export const TIP2: TipSeg = {
  kind: "tip",
  id: "tip-to",
  line: { id: "tip-2", tone: "clear, friendly narrator", who: "narrator", en: "After half past, name the next hour, then illaa." },
  stage: () => ({ minutes: t(7, 45), wedgeMode: "auto", wedgeOpacity: 1 }),
  title: "Minutes to: the NEXT hour + {إِلَّا}",
  example: { hour: "السَّاعَةُ الثَّامِنَةُ", part: "إِلَّا الرُّبْعَ", color: "to", wrong: "السَّاعَةُ السَّابِعَةُ إِلَّا الرُّبْعَ" },
  rule: "7:45 · Yusuf's mistake: with {إِلَّا}, name the next hour!",
};

export const TIP3: TipSeg = {
  kind: "tip",
  id: "tip-duration",
  line: { id: "tip-3", tone: "clear, friendly narrator", who: "narrator", en: "Begins, ends, lasts: yabda'u, yantahee, yastamirru." },
  stage: (f) => ({
    minutes: t(8, 0) + Math.min(45, Math.max(0, (f - 40) / 2.5)),
    wedgeMode: "elapsed",
    wedgeFrom: t(8, 0),
    wedgeOpacity: 1,
  }),
  title: "{يَبْدَأُ} begins · {يَنْتَهِي} ends · {يَسْتَمِرُّ} lasts",
  example: { hour: "يَسْتَمِرُّ الدَّرْسُ", part: "مُدَّةَ خَمْسٍ وَأَرْبَعِينَ دَقِيقَةً.", color: "gold" },
  rule: "8:00 → 8:45 · use {مُدَّةَ} for how long something lasts.",
};

// ---------- Quiz (Noor asks) ----------
export const QUIZ: QuizSeg[] = [
  {
    kind: "quiz", id: "quiz-1", number: 1,
    line: { id: "q-1", tone: "teacherly, inviting", who: "noor", ar: "كَمِ السَّاعَةُ؟", en: "Yusuf got this one wrong. What time is it?" },
    question: "What time is it?",
    clock: t(7, 45),
    options: ["السَّابِعَةُ إِلَّا الرُّبْعَ", "الثَّامِنَةُ إِلَّا الرُّبْعَ", "السَّابِعَةُ وَالرُّبْعُ"],
    correct: 1,
  },
  {
    kind: "quiz", id: "quiz-2", number: 2,
    line: { id: "q-2", tone: "teacherly, inviting", who: "noor", ar: "كَمْ تَسْتَمِرُّ الاِسْتِرَاحَةُ؟", en: "How long does the break last?" },
    question: "How long does the break last?",
    options: ["عِشْرِينَ دَقِيقَةً", "سَاعَةً", "خَمْسَ دَقَائِقَ"],
    correct: 0,
  },
  {
    kind: "quiz", id: "quiz-3", number: 3,
    line: { id: "q-3", tone: "teacherly, inviting", who: "noor", ar: "كَمِ السَّاعَةُ؟", en: "And at the café: what time is it?" },
    question: "What time is it?",
    clock: t(17, 55),
    options: ["الخَامِسَةُ وَخَمْسُ دَقَائِقَ", "الخَامِسَةُ إِلَّا خَمْسَ دَقَائِقَ", "السَّادِسَةُ إِلَّا خَمْسَ دَقَائِقَ"],
    correct: 2,
  },
];

export const ENDING = {
  line: { id: "end-1", tone: "proud, happy", who: "noor" as const, ar: "أَحْسَنْتُمْ!", en: "Well done, everyone!" },
  theEnd: "النِّهَايَةُ",
  next: "Next: D1-L03 · How Often?",
  motto: "بِالْعِلْمِ نَفْتَحُ الْأَبْوَابَ",
};

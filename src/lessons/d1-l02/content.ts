// D1-L02 · Telling the Time — all on-screen text in one place.
// Arabic is copied from the lesson page (miftaharabiclessons.inkandpixels.uk).
// Edit wording here; the scenes pick it up automatically.
import { t } from "../shared/time";

export const LESSON = {
  code: "D1-L02",
  unit: "Development · D1 · Daily Routine and Time",
  titleAr: "قِرَاءَةُ الوَقْتِ — كَمِ السَّاعَةُ؟",
  titleEn: "Telling the Time — What Time Is It?",
  next: "D1-L03 · How Often? — Frequency Adverbs in My Routine",
  motto: "بِالْعِلْمِ نَفْتَحُ الْأَبْوَابَ",
  mottoEn: "With knowledge, we open doors.",
};

export const OBJECTIVES = [
  "Tell time to five-minute precision.",
  "Use {وَ} and {إِلَّا} with the correct hour.",
  "Interpret selected 24-hour times.",
  "Extract start, finish and duration from a timetable.",
];

export const QUESTION = {
  ask: "كَمِ السَّاعَةُ؟",
  askEn: "What time is it?",
  answer: "السَّاعَةُ الثَّامِنَةُ.",
  answerEn: "It is eight o'clock.",
};

export const H7 = "السَّابِعَةُ";
export const H8 = "الثَّامِنَةُ";

// Minutes past: keep the hour, add وَ
export const PAST_STOPS = [
  { m: 5, part: "وَخَمْسُ دَقَائِقَ", en: "five past" },
  { m: 10, part: "وَعَشْرُ دَقَائِقَ", en: "ten past" },
  { m: 15, part: "وَالرُّبْعُ", en: "quarter past" },
  { m: 20, part: "وَالثُّلُثُ", en: "twenty past" },
  { m: 30, part: "وَالنِّصْفُ", en: "half past" },
];

// Minutes to: next hour, add إِلَّا
export const TO_STOPS = [
  { m: 40, part: "إِلَّا الثُّلُثَ", en: "twenty to" },
  { m: 45, part: "إِلَّا الرُّبْعَ", en: "quarter to" },
  { m: 50, part: "إِلَّا عَشْرَ دَقَائِقَ", en: "ten to" },
  { m: 55, part: "إِلَّا خَمْسَ دَقَائِقَ", en: "five to" },
];

export type Example = { time: number; hour: string; part: string };

export const RULE_PAST = {
  title: "Use {وَ} for minutes after the hour",
  formula: "السَّاعَةُ + العَدَدُ التَّرْتِيبِيُّ + وَ + الدَّقَائِقُ",
  explain: "For 1–30 minutes past, keep the current hour and add {وَ} followed by the minutes.",
  examples: [
    { time: t(7, 5), hour: "السَّاعَةُ السَّابِعَةُ", part: "وَخَمْسُ دَقَائِقَ." },
    { time: t(9, 15), hour: "السَّاعَةُ التَّاسِعَةُ", part: "وَالرُّبْعُ." },
    { time: t(11, 30), hour: "السَّاعَةُ الحَادِيَةَ عَشْرَةَ", part: "وَالنِّصْفُ." },
  ] as Example[],
};

export const RULE_TO = {
  title: "Use {إِلَّا} for minutes before the next hour",
  formula: "السَّاعَةُ + السَّاعَةُ التَّالِيَةُ + إِلَّا + الدَّقَائِقَ",
  explain: "After the half hour, move to the next hour and subtract the remaining minutes.",
  examples: [
    { time: t(2, 40), hour: "السَّاعَةُ الثَّالِثَةُ", part: "إِلَّا الثُّلُثَ." },
    { time: t(5, 45), hour: "السَّاعَةُ السَّادِسَةُ", part: "إِلَّا الرُّبْعَ." },
    { time: t(8, 55), hour: "السَّاعَةُ التَّاسِعَةُ", part: "إِلَّا خَمْسَ دَقَائِقَ." },
  ] as Example[],
};

export const MISTAKE = {
  time: t(5, 45),
  wrong: "السَّاعَةُ الخَامِسَةُ إِلَّا الرُّبْعَ.",
  right: "السَّاعَةُ السَّادِسَةُ إِلَّا الرُّبْعَ.",
  tip: "With {إِلَّا}, move to the next hour.",
};

export const H24_ROWS = [
  { time: t(7, 15), digital: "07:15", chat: "السَّابِعَةُ وَالرُّبْعُ", h24: "السَّابِعَةُ وَخَمْسَ عَشْرَةَ دَقِيقَةً", sky: "sun" as const },
  { time: t(14, 30), digital: "14:30", chat: "الثَّانِيَةُ وَالنِّصْفُ مَسَاءً", h24: "الرَّابِعَةَ عَشْرَةَ وَالنِّصْفُ", sky: "sun" as const },
  { time: t(18, 15), digital: "18:15", chat: "السَّادِسَةُ وَالرُّبْعُ مَسَاءً", h24: "الثَّامِنَةَ عَشْرَةَ وَخَمْسَ عَشْرَةَ دَقِيقَةً", sky: "moon" as const },
];

export const DAYPARTS = [
  { ar: "صَبَاحًا", en: "a.m. / in the morning" },
  { ar: "مَسَاءً", en: "p.m. / in the evening" },
];

export const SCHEDULE = {
  verbs: [
    { ar: "يَبْدَأُ", en: "begins" },
    { ar: "يَنْتَهِي", en: "ends" },
    { ar: "يَسْتَمِرُّ", en: "continues / lasts" },
  ],
  start: t(8, 0),
  end: t(8, 45),
  sentences: [
    { ar: "يَبْدَأُ الدَّرْسُ فِي الثَّامِنَةِ.", en: "The lesson begins at 8:00." },
    { ar: "يَنْتَهِي فِي التَّاسِعَةِ إِلَّا الرُّبْعَ.", en: "It ends at 8:45." },
    { ar: "يَسْتَمِرُّ مُدَّةَ خَمْسٍ وَأَرْبَعِينَ دَقِيقَةً.", en: "It lasts 45 minutes." },
  ],
};

export const QUIZ = [
  {
    time: t(6, 30),
    options: ["السَّابِعَةُ إِلَّا النِّصْفَ", "السَّادِسَةُ وَالرُّبْعُ", "السَّادِسَةُ وَالنِّصْفُ"],
    correct: 2,
    why: "Half past: keep the hour and add {وَالنِّصْفُ}.",
  },
  {
    time: t(3, 45),
    options: ["الثَّالِثَةُ وَالرُّبْعُ", "الرَّابِعَةُ إِلَّا الرُّبْعَ", "الثَّالِثَةُ وَالنِّصْفُ"],
    correct: 1,
    why: "After :30, name the next hour: {الرَّابِعَةُ} + {إِلَّا الرُّبْعَ}.",
  },
  {
    time: t(2, 40),
    options: ["الثَّالِثَةُ إِلَّا الثُّلُثَ", "الثَّالِثَةُ وَالثُّلُثُ", "الثَّانِيَةُ وَالثُّلُثُ"],
    correct: 0,
    why: "20 minutes before three: {إِلَّا الثُّلُثَ}.",
  },
  {
    time: t(10, 50),
    options: ["العَاشِرَةُ إِلَّا عَشْرَ دَقَائِقَ", "العَاشِرَةُ وَعَشْرُ دَقَائِقَ", "الحَادِيَةَ عَشْرَةَ إِلَّا عَشْرَ دَقَائِقَ"],
    correct: 2,
    why: "The next hour is eleven: {الحَادِيَةَ عَشْرَةَ}.",
  },
];

export const RECAP = [
  { ar: "وَ", en: "minutes past: keep the hour (up to :30)", color: "past" as const },
  { ar: "إِلَّا", en: "minutes to: name the next hour", color: "to" as const },
  { ar: "يَبْدَأُ · يَنْتَهِي · يَسْتَمِرُّ مُدَّةَ", en: "begins · ends · lasts for", color: "gold" as const },
];

// ---------- Character dialogues ----------
// (Line timings are in frames at 30 fps, relative to the scene start.)
import type { Line } from "../shared/Dialogue";

export const DIALOGUE_ASK: Line[] = [
  { who: "yusuf", at: 50, dur: 72, ar: "كَمِ السَّاعَةُ؟", en: "What time is it?" },
  { who: "noor", at: 128, dur: 80, ar: "السَّاعَةُ الثَّامِنَةُ.", en: "It is eight o'clock." },
];

// Café dialogue (new for the video, using the lesson's structures)
export const CAFE_BOARD = { name: "مَقْهَى مِفْتَاح", item: "الفُطُورُ", hours: "٧:٣٠ – ١٠:٣٠", en: "Breakfast 7:30 – 10:30" };
export const DIALOGUE_CAFE: Line[] = [
  { who: "maryam", at: 45, dur: 85, ar: "مَتَى يَبْدَأُ الفُطُورُ؟", en: "When does breakfast begin?" },
  { who: "waiter", at: 135, dur: 115, ar: "يَبْدَأُ فِي السَّابِعَةِ وَالنِّصْفِ، وَيَنْتَهِي فِي العَاشِرَةِ وَالنِّصْفِ.", en: "It begins at 7:30 and ends at 10:30." },
  { who: "maryam", at: 255, dur: 80, ar: "كَمِ السَّاعَةُ الآنَ؟", en: "What time is it now?" },
  { who: "waiter", at: 340, dur: 85, ar: "السَّاعَةُ العَاشِرَةُ وَالرُّبْعُ.", en: "It is quarter past ten." },
  { who: "maryam", at: 430, dur: 45, ar: "شُكْرًا!", en: "Thank you!" },
];

// Model exchange (from the lesson's speaking section)
export const DIALOGUE_TRAINING: Line[] = [
  { who: "aisha", at: 40, dur: 85, ar: "مَتَى يَبْدَأُ التَّمْرِينُ؟", en: "When does training begin?" },
  { who: "yusuf", at: 130, dur: 150, ar: "يَبْدَأُ فِي السَّادِسَةِ إِلَّا الرُّبْعَ وَيَسْتَمِرُّ مُدَّةَ سَاعَةٍ وَالنِّصْفِ.", en: "It begins at quarter to six and lasts an hour and a half." },
  { who: "yusuf", at: 285, dur: 150, ar: "أُفَضِّلُ هٰذَا الوَقْتَ لِأَنَّنِي أُنْهِي وَاجِبِي قَبْلَهُ.", en: "I prefer this time because I finish my homework before it." },
];

export const GOODBYE = { ar: "مَعَ السَّلَامَةِ", en: "Goodbye! See you in the next lesson." };

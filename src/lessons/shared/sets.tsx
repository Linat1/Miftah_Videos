// Illustrated backgrounds ("sets") drawn in code, 1920×1080.
// Each set has a Back layer (behind characters), an optional Front layer
// (in front of characters, e.g. a café counter) and a wall-clock position.
import React from "react";
import { ARABIC_FONT, TITLE_FONT } from "../../fonts";

export type SetName = "bedroom" | "corridor" | "classroom" | "cafe" | "living";

const W = 1920;
const H = 1080;
const FLOOR = 840;

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);

const WoodFloor: React.FC<{ id: string; top?: string; bottom?: string; line?: string }> = ({
  id,
  top = "#b07a4a",
  bottom = "#7d5130",
  line = "rgba(60,30,10,0.25)",
}) => (
  <g>
    <defs>
      <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={top} />
        <stop offset="1" stopColor={bottom} />
      </linearGradient>
    </defs>
    <rect x={0} y={FLOOR} width={W} height={H - FLOOR} fill={`url(#${id}-floor)`} />
    {[890, 950, 1020].map((y, i) => (
      <g key={y}>
        <line x1={0} x2={W} y1={y} y2={y} stroke={line} strokeWidth={3} />
        {Array.from({ length: 8 }, (_, k) => (
          <line key={k} x1={k * 260 + (i % 2) * 130} x2={k * 260 + (i % 2) * 130} y1={y - (i === 0 ? 50 : i === 1 ? 60 : 70)} y2={y}
            stroke={line} strokeWidth={3} />
        ))}
      </g>
    ))}
  </g>
);

/** Soft shadow where wall meets floor (makes rooms feel painted, not flat). */
const WallShadow: React.FC<{ id: string }> = ({ id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}-ao`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor="#000" stopOpacity={0.22} />
      </linearGradient>
    </defs>
    <rect x={0} y={FLOOR - 90} width={W} height={90} fill={`url(#${id}-ao)`} />
  </g>
);

// ---------------- Bedroom (morning) ----------------
const BedroomBack: React.FC = () => (
  <Svg>
    <defs>
      <linearGradient id="bd-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f6e8cf" />
        <stop offset="1" stopColor="#e8cfa6" />
      </linearGradient>
      <linearGradient id="bd-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7cc0ea" />
        <stop offset="1" stopColor="#d8efff" />
      </linearGradient>
      <radialGradient id="bd-sun">
        <stop offset="0" stopColor="#fff6c8" />
        <stop offset="0.4" stopColor="#ffd36a" />
        <stop offset="1" stopColor="#ffd36a" stopOpacity={0} />
      </radialGradient>
      <radialGradient id="bd-light" cx="0.7" cy="0.3" r="0.6">
        <stop offset="0" stopColor="#fff3d0" stopOpacity={0.55} />
        <stop offset="1" stopColor="#fff3d0" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={W} height={FLOOR} fill="url(#bd-wall)" />
    {Array.from({ length: 24 }, (_, i) => (
      <rect key={i} x={i * 80} y={0} width={36} height={FLOOR} fill="#ffffff" opacity={0.08} />
    ))}
    {/* window */}
    <rect x={1180} y={150} width={420} height={400} rx={10} fill="#fffaf2" />
    <rect x={1200} y={170} width={380} height={360} fill="url(#bd-sky)" />
    <circle cx={1480} cy={260} r={110} fill="url(#bd-sun)" />
    <circle cx={1480} cy={260} r={42} fill="#ffe27a" />
    <ellipse cx={1290} cy={330} rx={70} ry={24} fill="#fff" opacity={0.9} />
    <ellipse cx={1330} cy={315} rx={45} ry={22} fill="#fff" opacity={0.9} />
    <ellipse cx={1520} cy={420} rx={60} ry={18} fill="#fff" opacity={0.8} />
    <rect x={1386} y={170} width={8} height={360} fill="#fffaf2" />
    <rect x={1200} y={346} width={380} height={8} fill="#fffaf2" />
    <rect x={1160} y={548} width={460} height={24} rx={6} fill="#f3e6d2" />
    {/* curtains */}
    <path d="M1110 130 Q1150 340 1120 600 L1215 600 Q1190 340 1225 130 Z" fill="#e59a8f" />
    <path d="M1555 130 Q1590 340 1565 600 L1660 600 Q1630 340 1670 130 Z" fill="#e59a8f" />
    <rect x={1090} y={118} width={600} height={16} rx={8} fill="#8a5a34" />
    {/* framed picture with a key */}
    <rect x={300} y={190} width={220} height={160} rx={6} fill="#7a5a36" />
    <rect x={316} y={206} width={188} height={128} fill="#f9eed6" />
    <circle cx={370} cy={270} r={24} fill="none" stroke="#c8963e" strokeWidth={9} />
    <rect x={392} y={265} width={80} height={10} fill="#c8963e" />
    <rect x={448} y={275} width={9} height={18} fill="#c8963e" />
    <rect x={430} y={275} width={9} height={13} fill="#c8963e" />
    {/* sunlight wash */}
    <rect width={W} height={FLOOR} fill="url(#bd-light)" />
    <WallShadow id="bd" />
    <rect x={0} y={FLOOR - 22} width={W} height={22} fill="#fbf3e4" />
    <WoodFloor id="bd" />
    {/* rug */}
    <ellipse cx={1000} cy={1000} rx={560} ry={70} fill="#5f8fb3" />
    <ellipse cx={1000} cy={1000} rx={520} ry={56} fill="none" stroke="#f4e3c3" strokeWidth={6} strokeDasharray="18 12" />
    {/* bed */}
    <ellipse cx={360} cy={872} rx={330} ry={22} fill="#000" opacity={0.18} />
    <rect x={30} y={430} width={46} height={440} rx={12} fill="#8a5a34" />
    <rect x={40} y={700} width={620} height={150} rx={18} fill="#9b6a3f" />
    <rect x={60} y={640} width={590} height={80} rx={20} fill="#fffaf2" />
    <path d="M230 630 Q420 600 660 640 L660 760 Q440 790 230 760 Z" fill="#4f7cac" />
    <path d="M230 630 Q420 600 660 640 L660 660 Q440 625 230 652 Z" fill="#6b97c6" />
    <ellipse cx={150} cy={642} rx={86} ry={34} fill="#fdf6ec" />
    <rect x={60} y={845} width={26} height={30} fill="#6b4426" />
    <rect x={620} y={845} width={26} height={30} fill="#6b4426" />
    {/* bedside table + lamp */}
    <rect x={690} y={700} width={140} height={150} rx={8} fill="#b07a4a" />
    <rect x={704} y={740} width={112} height={8} fill="#8a5a34" />
    <rect x={752} y={640} width={16} height={60} fill="#7a5a36" />
    <path d="M715 640 L805 640 L790 590 L730 590 Z" fill="#f2c46d" />
  </Svg>
);

// ---------------- School corridor ----------------
const CorridorBack: React.FC = () => (
  <Svg>
    <defs>
      <linearGradient id="co-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#eef5ef" />
        <stop offset="1" stopColor="#dbe9df" />
      </linearGradient>
    </defs>
    <rect width={W} height={FLOOR} fill="url(#co-wall)" />
    <rect x={0} y={520} width={W} height={FLOOR - 520} fill="#3f8f86" />
    <rect x={0} y={508} width={W} height={16} fill="#2f6f68" />
    {/* noticeboard */}
    <rect x={130} y={200} width={430} height={280} rx={8} fill="#7a5a36" />
    <rect x={146} y={216} width={398} height={248} fill="#c99a63" />
    <rect x={170} y={240} width={120} height={90} fill="#fff7d6" transform="rotate(-4 230 285)" />
    <rect x={320} y={236} width={190} height={120} fill="#ffffff" transform="rotate(3 415 296)" />
    <rect x={190} y={350} width={150} height={95} fill="#cde8ff" transform="rotate(2 265 397)" />
    <rect x={370} y={372} width={140} height={80} fill="#ffd9d9" transform="rotate(-3 440 412)" />
    {[[230, 245], [415, 240], [265, 352], [440, 376]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={7} fill="#d64a33" />
    ))}
    <text x={415} y={290} textAnchor="middle" direction="rtl" fontFamily={ARABIC_FONT} fontWeight={700} fontSize={26} fill="#1d2b3a">يَوْمُ الأَرْبِعَاءِ</text>
    <text x={415} y={330} textAnchor="middle" fontFamily={ARABIC_FONT} fontWeight={700} fontSize={24} fill="#3f8f86">٧:٥٠</text>
    {/* classroom door */}
    <rect x={640} y={250} width={270} height={FLOOR - 250} rx={6} fill="#8a5a34" />
    <rect x={656} y={266} width={238} height={FLOOR - 266} fill="#b07a4a" />
    <rect x={700} y={310} width={150} height={150} rx={6} fill="#cfe9f5" stroke="#7a5a36" strokeWidth={6} />
    <circle cx={865} cy={560} r={11} fill="#e8c27a" />
    {/* lockers */}
    {Array.from({ length: 7 }, (_, i) => {
      const x = 1090 + i * 118;
      return (
        <g key={i}>
          <rect x={x} y={300} width={112} height={FLOOR - 300} fill={i % 2 ? "#4a78b5" : "#5584c0"} stroke="#2f5487" strokeWidth={4} />
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={x + 26} y={330 + k * 16} width={60} height={6} rx={3} fill="#2f5487" />
          ))}
          <rect x={x + 86} y={540} width={10} height={44} rx={4} fill="#d8dee8" />
        </g>
      );
    })}
    <WallShadow id="co" />
    {/* tiled floor */}
    <rect x={0} y={FLOOR} width={W} height={H - FLOOR} fill="#d6d2c8" />
    {Array.from({ length: 16 }, (_, i) =>
      [0, 1].map((r) => (
        <rect key={`${i}-${r}`} x={i * 120 + (r ? 60 : 0)} y={FLOOR + r * 120} width={60} height={120}
          fill="#c9c4b8" opacity={0.7} />
      )),
    )}
  </Svg>
);

// ---------------- Classroom ----------------
const ClassroomBack: React.FC<{ blank?: boolean }> = ({ blank = false }) => (
  <>
    <Svg>
      <defs>
        <linearGradient id="cl-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7eedc" />
          <stop offset="1" stopColor="#ecdcbc" />
        </linearGradient>
        <linearGradient id="cl-board" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#35594a" />
          <stop offset="1" stopColor="#264538" />
        </linearGradient>
        <linearGradient id="cl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8ccbf0" />
          <stop offset="1" stopColor="#e0f3ff" />
        </linearGradient>
      </defs>
      <rect width={W} height={FLOOR} fill="url(#cl-wall)" />
      <rect x={0} y={620} width={W} height={FLOOR - 620} fill="#d6bf96" />
      <rect x={0} y={610} width={W} height={12} fill="#b89a6a" />
      {/* chalkboard */}
      <rect x={520} y={120} width={1010} height={490} rx={12} fill="#7a5a36" />
      <rect x={540} y={140} width={970} height={450} fill="url(#cl-board)" />
      <ellipse cx={800} cy={480} rx={160} ry={40} fill="#fff" opacity={0.04} />
      <ellipse cx={1250} cy={260} rx={200} ry={50} fill="#fff" opacity={0.04} />
      <rect x={530} y={600} width={990} height={16} rx={4} fill="#8a5a34" />
      <rect x={700} y={592} width={40} height={10} rx={3} fill="#fff" />
      <rect x={760} y={593} width={30} height={9} rx={3} fill="#ffd36a" />
      {/* window */}
      <rect x={1610} y={170} width={250} height={380} rx={8} fill="#fffaf2" />
      <rect x={1628} y={188} width={214} height={344} fill="url(#cl-sky)" />
      <rect x={1731} y={188} width={8} height={344} fill="#fffaf2" />
      <circle cx={1790} cy={250} r={30} fill="#ffe27a" />
      {/* plant */}
      <path d="M1840 700 Q1800 600 1830 540 Q1850 620 1860 700 Z" fill="#4f9a5c" />
      <path d="M1860 700 Q1880 590 1920 560 Q1900 640 1880 700 Z" fill="#3f8a4c" />
      <rect x={1810} y={690} width={90} height={120} rx={10} fill="#d47a4a" />
      <WallShadow id="cl" />
      <WoodFloor id="cl" top="#c08a58" bottom="#8a5a34" />
    </Svg>
    {/* chalk timetable (HTML for proper Arabic shaping) */}
    {blank ? null : <div dir="rtl" style={{ position: "absolute", left: 560, top: 150, width: 930, color: "#f2f2ea", fontFamily: ARABIC_FONT, fontWeight: 700, textAlign: "center" }}>
      <div style={{ fontFamily: TITLE_FONT, fontSize: 54, lineHeight: 1.6 }}>يَوْمُ الأَرْبِعَاءِ</div>
      {[
        ["الحِصَّةُ الأُولَى", "٨:٠٠ – ٨:٤٥"],
        ["الاِسْتِرَاحَةُ", "٨:٤٥ – ٩:٠٥"],
        ["العُلُومُ", "٩:٠٥ – ١٠:٤٥"],
      ].map(([a, b]) => (
        <div key={a} style={{ display: "flex", justifyContent: "space-between", padding: "0 70px", fontSize: 46, lineHeight: 1.75, borderBottom: "2px dashed rgba(255,255,255,0.25)" }}>
          <span>{a}</span>
          <span>{b}</span>
        </div>
      ))}
    </div>}
  </>
);

// ---------------- Café (dusk) ----------------
const CafeBack: React.FC = () => (
  <>
    <Svg>
      <defs>
        <linearGradient id="cf-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6f5aa8" />
          <stop offset="0.6" stopColor="#f08a5d" />
          <stop offset="1" stopColor="#ffc46b" />
        </linearGradient>
        <radialGradient id="cf-glow">
          <stop offset="0" stopColor="#ffdf9a" stopOpacity={0.75} />
          <stop offset="1" stopColor="#ffdf9a" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={W} height={FLOOR} fill="#a95a3a" />
      {Array.from({ length: 14 }, (_, r) =>
        Array.from({ length: 17 }, (_, c) => (
          <rect key={`${r}-${c}`} x={c * 120 + (r % 2) * 60 - 60} y={r * 40} width={112} height={34} rx={4}
            fill={(r * 7 + c * 3) % 5 === 0 ? "#b86a48" : "#a35536"} />
        )),
      )}
      <rect x={0} y={560} width={W} height={FLOOR - 560} fill="#6b4426" />
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={i} x={i * 80} y={560} width={6} height={FLOOR - 560} fill="#553419" />
      ))}
      <rect x={0} y={550} width={W} height={14} fill="#8a5a34" />
      {/* window with sunset */}
      <rect x={120} y={140} width={420} height={360} rx={10} fill="#4c3420" />
      <rect x={140} y={160} width={380} height={320} fill="url(#cf-sky)" />
      <circle cx={330} cy={430} r={50} fill="#ffe29a" />
      <rect x={140} y={410} width={380} height={70} fill="#5a3c6e" opacity={0.65} />
      <rect x={326} y={160} width={8} height={320} fill="#4c3420" />
      {/* pendant lamps */}
      {[930, 1200].map((x) => (
        <g key={x}>
          <circle cx={x} cy={180} r={170} fill="url(#cf-glow)" />
          <line x1={x} x2={x} y1={0} y2={120} stroke="#2a2a2a" strokeWidth={4} />
          <path d={`M${x - 55} 180 L${x + 55} 180 L${x + 25} 120 L${x - 25} 120 Z`} fill="#2f3b3a" />
          <ellipse cx={x} cy={182} rx={30} ry={10} fill="#fff1c2" />
        </g>
      ))}
      {/* menu board */}
      <rect x={1540} y={110} width={330} height={210} rx={10} fill="#7a5a36" />
      <rect x={1554} y={124} width={302} height={182} fill="#22302a" />
      <text x={1705} y={180} textAnchor="middle" direction="rtl" fontFamily={TITLE_FONT} fontWeight={700} fontSize={40} fill="#f5c451">مَقْهَى مِفْتَاح</text>
      <text x={1705} y={240} textAnchor="middle" direction="rtl" fontFamily={ARABIC_FONT} fontWeight={700} fontSize={28} fill="#f3efe4">شَايٌ · قَهْوَةٌ · كَعْكٌ</text>
      <text x={1705} y={285} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={18} fill="#b9c4b5">tea · coffee · cake</text>
      <WallShadow id="cf" />
      <WoodFloor id="cf" top="#7a4e2c" bottom="#4c2f18" />
      {/* plant */}
      <path d="M60 820 Q20 700 50 620 Q80 720 90 820 Z" fill="#4f9a5c" />
      <path d="M90 820 Q120 680 170 640 Q140 740 120 820 Z" fill="#3f8a4c" />
      <rect x={30} y={800} width={110} height={120} rx={12} fill="#2f6f68" />
    </Svg>
  </>
);

const CafeFront: React.FC = () => (
  <div style={{ position: "absolute", left: 1220, right: 0, top: 770, bottom: 0 }}>
    <div style={{ height: 30, background: "linear-gradient(#d0a26a, #a77a48)", borderRadius: "12px 0 0 0", boxShadow: "0 6px 0 rgba(0,0,0,0.2)" }} />
    <div style={{ position: "absolute", top: 30, left: 0, right: 0, bottom: 0, background: "repeating-linear-gradient(90deg, #6b4426 0 70px, #5a371d 70px 76px)" }} />
    {/* two cups and a cake */}
    {[70, 190].map((x) => (
      <div key={x}>
        <div style={{ position: "absolute", left: x, top: -50, width: 54, height: 50, background: "#f6efe2", borderRadius: "0 0 16px 16px" }} />
        <div style={{ position: "absolute", left: x + 48, top: -42, width: 18, height: 26, border: "6px solid #f6efe2", borderLeft: "none", borderRadius: "0 12px 12px 0" }} />
      </div>
    ))}
    <div style={{ position: "absolute", left: 320, top: -46, width: 90, height: 46, background: "linear-gradient(#f7d7e4 40%, #c47a4a 40%)", borderRadius: "10px 10px 4px 4px" }} />
  </div>
);

// ---------------- Living room (night) ----------------
const LivingBack: React.FC = () => (
  <Svg>
    <defs>
      <linearGradient id="lv-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5b5183" />
        <stop offset="1" stopColor="#40385f" />
      </linearGradient>
      <radialGradient id="lv-lamp">
        <stop offset="0" stopColor="#ffd98a" stopOpacity={0.7} />
        <stop offset="1" stopColor="#ffd98a" stopOpacity={0} />
      </radialGradient>
      <linearGradient id="lv-night" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#101a3d" />
        <stop offset="1" stopColor="#2b3a72" />
      </linearGradient>
    </defs>
    <rect width={W} height={FLOOR} fill="url(#lv-wall)" />
    {/* window with moon */}
    <rect x={1240} y={150} width={430} height={380} rx={10} fill="#d9cfe8" />
    <rect x={1260} y={170} width={390} height={340} fill="url(#lv-night)" />
    <circle cx={1550} cy={250} r={46} fill="#f3efd9" />
    <circle cx={1568} cy={238} r={42} fill="#1d2a55" />
    {[[1300, 210], [1360, 300], [1430, 230], [1610, 420], [1330, 450], [1480, 400]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={3} fill="#fff" opacity={0.85} />
    ))}
    <rect x={1451} y={170} width={8} height={340} fill="#d9cfe8" />
    <path d="M1190 130 Q1230 340 1200 580 L1285 580 Q1265 340 1300 130 Z" fill="#c75c6a" />
    <path d="M1615 130 Q1650 340 1625 580 L1710 580 Q1690 340 1725 130 Z" fill="#c75c6a" />
    <rect x={1170} y={118} width={580} height={16} rx={8} fill="#2c2440" />
    {/* lamp glow + floor lamp */}
    <circle cx={800} cy={420} r={420} fill="url(#lv-lamp)" />
    <rect x={792} y={420} width={12} height={420} fill="#2c2440" />
    <path d="M730 420 L870 420 L840 330 L760 330 Z" fill="#f2c46d" />
    <ellipse cx={798} cy={842} rx={60} ry={12} fill="#2c2440" />
    {/* bookshelf */}
    <rect x={1730} y={260} width={190} height={580} fill="#6b4426" />
    {[0, 1, 2, 3].map((r) => (
      <g key={r}>
        <rect x={1740} y={280 + r * 140} width={170} height={10} fill="#4c2f18" transform={`translate(0 ${120})`} />
        {Array.from({ length: 6 }, (_, k) => (
          <rect key={k} x={1748 + k * 27} y={300 + r * 140} width={22} height={100 - (k % 3) * 12}
            fill={["#d64a33", "#3f8f86", "#f2c21a", "#4a78b5", "#8a5ad6", "#e59a8f"][(k + r) % 6]} transform={`translate(0 ${(k % 3) * 12})`} />
        ))}
      </g>
    ))}
    <WallShadow id="lv" />
    <WoodFloor id="lv" top="#6b4a3a" bottom="#3f2a20" />
    {/* rug + sofa */}
    <ellipse cx={980} cy={1000} rx={600} ry={70} fill="#8a3f52" />
    <ellipse cx={390} cy={872} rx={340} ry={22} fill="#000" opacity={0.25} />
    <rect x={70} y={560} width={640} height={200} rx={40} fill="#2f7a80" />
    <rect x={40} y={660} width={700} height={200} rx={36} fill="#3a8d93" />
    <rect x={30} y={620} width={90} height={240} rx={34} fill="#2f7a80" />
    <rect x={660} y={620} width={90} height={240} rx={34} fill="#2f7a80" />
    <rect x={150} y={600} width={150} height={110} rx={26} fill="#f2c46d" transform="rotate(-8 225 655)" />
  </Svg>
);

export const SETS: Record<
  SetName,
  { Back: React.FC<{ blank?: boolean }>; Front?: React.FC; clock: { x: number; y: number; r: number }; label: string }
> = {
  bedroom: { Back: BedroomBack, clock: { x: 960, y: 300, r: 95 }, label: "Bedroom" },
  corridor: { Back: CorridorBack, clock: { x: 775, y: 150, r: 80 }, label: "School corridor" },
  classroom: { Back: ClassroomBack, clock: { x: 300, y: 250, r: 95 }, label: "Classroom" },
  cafe: { Back: CafeBack, Front: CafeFront, clock: { x: 680, y: 270, r: 90 }, label: "Café" },
  living: { Back: LivingBack, clock: { x: 980, y: 230, r: 90 }, label: "Home" },
};

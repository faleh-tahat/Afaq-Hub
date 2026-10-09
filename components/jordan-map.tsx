"use client";

/**
 * JordanMap — خريطة الأردن التقنية لقسم «من نحن» في موقع فريق آفاق التكنولوجيا.
 *
 * - React فقط، بدون أي مكتبات إضافية. يشتغل مع Next.js (App Router أو Pages Router).
 * - حدود الأردن: World Borders Dataset (thematicmapping.org، عبر mledoze/countries، ODbL)
 *   بـ152 نقطة: نهر الأردن، اليرموك، خط منتصف البحر الميت، وادي عربة، ساحل العقبة،
 *   وخطوط الحدود مع سوريا والعراق والسعودية. مطابقة لـ Natural Earth عند نقاط الحدود الرئيسية،
 *   والمساحة الناتجة 89,284 كم² (الرسمية ≈ 89,342 كم²). الإسقاط Mercator على viewBox بحجم 400×500.
 * - نقطة كل محافظة هي الإحداثيات الرسمية لمركزها (المدينة الرئيسية).
 *
 * الاستخدام:
 *   <JordanMap />                                   // كل المحافظات الـ12
 *   <JordanMap activeIds={["amman", "irbid"]} />    // بس المحافظات اللي فيها أعضاء
 */

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

export type GovernorateId =
  | "irbid"
  | "ajloun"
  | "jerash"
  | "mafraq"
  | "balqa"
  | "zarqa"
  | "amman"
  | "madaba"
  | "karak"
  | "tafilah"
  | "maan"
  | "aqaba";

export type JordanMapProps = {
  className?: string;
  style?: CSSProperties;
  /** المحافظات اللي فيها أعضاء (الافتراضي: كل المحافظات الـ12). */
  activeIds?: GovernorateId[];
  /** الوقت بين تنقّل التحديد تلقائياً بالملي ثانية. 0 يوقف التنقّل. */
  interval?: number;
  /** لون التمييز (الافتراضي: السماوي تبع الموقع). */
  accent?: string;
  /** خلفية البطاقة. */
  background?: string;
  /** السطر الثاني من العنوان. */
  tagline?: string;
  /** السطر الصغير تحت العنوان. */
  caption?: string;
};

type Governorate = {
  id: GovernorateId;
  name: string;
  lat: number;
  lon: number;
  x: number;
  y: number;
};

const W = 400;
const H = 500;

/** Jordan's border in viewBox units (Mercator, north up), clockwise from the Saudi border at the Gulf of Aqaba. */
const OUTLINE: ReadonlyArray<readonly [number, number]> = [
  [22.1, 434.9], [22, 434.2], [22, 433.3], [22.1, 431.6], [22.6, 426.6], [23.1, 424.5],
  [23.4, 423.9], [24.4, 422.7], [25.5, 420], [25.7, 419.3], [25.6, 418.7], [25.5, 418.5],
  [23.6, 417.5], [23.4, 415.2], [23.2, 414.5], [25.9, 408.5], [31.5, 387.9], [31.5, 386.2],
  [31.3, 385.4], [31.2, 384.2], [31.2, 382], [31.3, 378.9], [33.6, 370.4], [33.8, 369.7],
  [34.1, 369.2], [34.5, 368.6], [35.6, 367.2], [37.1, 365.6], [38.2, 364.2], [38.6, 363.3],
  [38.8, 362.6], [39, 360.2], [38.5, 344.3], [38.1, 335.1], [38.3, 332.4], [42.2, 318.1],
  [43.3, 315.5], [46.2, 309.8], [49.3, 302.4], [49.9, 299.3], [53, 290.2], [54.4, 287.2],
  [54.9, 286.6], [55.5, 286.2], [57.3, 284.9], [57.8, 284.4], [58.3, 283.6], [62.6, 269.8],
  [63.2, 267.8], [63.2, 265.1], [63, 264.2], [62.5, 263], [60.8, 260.2], [59, 257.8],
  [62.4, 245.7], [63.9, 240.9], [64.1, 239.9], [64.3, 238.4], [64.5, 236.3], [64.5, 231.7],
  [64.6, 228.6], [64.9, 225.4], [65.4, 221.4], [66.1, 217.8], [68.4, 211], [69.5, 208.8],
  [70.8, 206.2], [70.9, 205.8], [70.3, 199.8], [69.2, 190], [68.4, 183.6], [68.2, 183.5],
  [68.2, 183.3], [68.1, 183.1], [67.6, 179.2], [71.1, 163.5], [71.9, 162.7], [72.2, 161.7],
  [72.3, 161.4], [71.4, 147.4], [71.2, 146], [71, 145.6], [70.6, 145], [70.1, 143.9],
  [72.2, 120.5], [75.3, 117.6], [75.8, 117.2], [76.8, 116.6], [77.1, 116.5], [78.5, 116.7],
  [81.1, 114.5], [81.3, 114.4], [82.5, 113.7], [87.9, 110.5], [90.4, 110.9], [101.5, 113.1],
  [101.8, 113.4], [107.6, 118.8], [109.4, 123.7], [113.8, 130.5], [117.6, 132], [120.9, 132.9],
  [123.5, 131.5], [133.1, 138.6], [135.7, 141.2], [140.1, 146.2], [147.2, 146.8], [147.4, 146.8],
  [149.6, 148], [160, 149.4], [166.7, 150.6], [176, 152.8], [178.3, 150.1], [201.9, 134.7],
  [229.8, 116.5], [229.9, 116.3], [230.2, 116.2], [240.5, 109.6], [267.9, 92.1], [297.5, 73.4],
  [315.1, 62.3], [328.5, 53.9], [336.5, 49], [360.4, 134.6], [352.2, 136.9], [356.9, 153.7],
  [374.6, 148.7], [378, 160.3], [369.4, 168.2], [359.2, 177.6], [353.7, 182.7], [311.3, 194.9],
  [270.2, 206.9], [268.3, 207.5], [247.5, 213.6], [228, 219.4], [205.9, 226], [189.7, 230.9],
  [213.5, 258.6], [229.5, 277.2], [235.3, 284.1], [271.4, 326.7], [244, 342.6], [230.5, 374.3],
  [222.9, 375.9], [192.1, 382.3], [168.3, 387.4], [148.3, 421.5], [129.7, 437.2], [113, 451],
  [69.7, 443.2], [40.6, 438.1],
];
const OUTLINE_D = `M${OUTLINE.map(([x, y]) => `${x} ${y}`).join("L")}Z`;

/** Ordered north → south. */
const GOVERNORATES: ReadonlyArray<Governorate> = [
  { id: "irbid", name: "إربد", lat: 32.5556, lon: 35.85, x: 95, y: 129.3 },
  { id: "ajloun", name: "عجلون", lat: 32.3326, lon: 35.7517, x: 86.9, y: 151 },
  { id: "jerash", name: "جرش", lat: 32.2803, lon: 35.8993, x: 99, y: 156 },
  { id: "mafraq", name: "المفرق", lat: 32.3406, lon: 36.2081, x: 124.4, y: 150.2 },
  { id: "balqa", name: "البلقاء", lat: 32.0392, lon: 35.7272, x: 84.9, y: 179.4 },
  { id: "zarqa", name: "الزرقاء", lat: 32.0728, lon: 36.088, x: 114.5, y: 176.1 },
  { id: "amman", name: "عمّان", lat: 31.9497, lon: 35.9328, x: 101.8, y: 188.1 },
  { id: "madaba", name: "مادبا", lat: 31.7167, lon: 35.8, x: 90.9, y: 210.5 },
  { id: "karak", name: "الكرك", lat: 31.1853, lon: 35.7047, x: 83.1, y: 261.6 },
  { id: "tafilah", name: "الطفيلة", lat: 30.8375, lon: 35.6044, x: 74.8, y: 294.9 },
  { id: "maan", name: "معان", lat: 30.1962, lon: 35.7341, x: 85.5, y: 356 },
  { id: "aqaba", name: "العقبة", lat: 29.5319, lon: 35.0078, x: 25.9, y: 418.8 },
];
const BY_ID = new Map(GOVERNORATES.map((g) => [g.id, g]));

const LINKS: ReadonlyArray<readonly [GovernorateId, GovernorateId]> = [
  ["irbid", "ajloun"], ["irbid", "jerash"], ["irbid", "mafraq"],
  ["ajloun", "jerash"], ["ajloun", "balqa"], ["jerash", "mafraq"],
  ["jerash", "zarqa"], ["jerash", "amman"], ["mafraq", "zarqa"],
  ["balqa", "amman"], ["zarqa", "amman"], ["balqa", "madaba"],
  ["amman", "madaba"], ["madaba", "karak"], ["karak", "tafilah"],
  ["karak", "maan"], ["tafilah", "maan"], ["tafilah", "aqaba"],
  ["maan", "aqaba"],
];

/** Graticule (every 1°) in viewBox units. */
const LON_LINES = [25.3, 107.3, 189.3, 271.3, 353.3];
const LAT_LINES = [374.6, 279.4, 183.2, 86];

/* ---------------------------- dot matrix ---------------------------- */

const GAP = 8;
const ROW = (GAP * Math.sqrt(3)) / 2;
const BAND = 9; // wave band width (viewBox units)
const BAND_DELAY = 0.035; // seconds per band → wave speed

const r1 = (n: number) => Math.round(n * 10) / 10;

function inside(x: number, y: number): boolean {
  let hit = false;
  for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
    const [xi, yi] = OUTLINE[i];
    const [xj, yj] = OUTLINE[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

const DOTS: ReadonlyArray<readonly [number, number]> = (() => {
  const out: [number, number][] = [];
  for (let row = 0; ; row++) {
    const y = r1(46 + row * ROW);
    if (y > 456) break;
    const offset = (row % 2) * (GAP / 2);
    for (let x = 22 + offset; x <= 378; x += GAP) {
      if (inside(x, y)) out.push([r1(x), y]);
    }
  }
  return out;
})();
const DOTS_D = DOTS.map(([x, y]) => `M${x} ${y}h0`).join("");

/** Dots grouped into rings by distance from a governorate, for the ripple. */
function wavesFrom(g: Governorate): string[] {
  const bands: string[] = [];
  for (const [x, y] of DOTS) {
    const k = Math.floor(Math.hypot(x - g.x, y - g.y) / BAND);
    bands[k] = (bands[k] ?? "") + `M${x} ${y}h0`;
  }
  return Array.from(bands, (d) => d ?? "");
}

function governoratesLabel(n: number): string {
  if (n === 1) return "محافظة واحدة";
  if (n === 2) return "محافظتان";
  if (n <= 10) return `${n} محافظات`;
  return `${n} محافظة`;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/* ------------------------------- styles ------------------------------- */

const CSS = `
.afaqmap{position:relative;width:100%;aspect-ratio:4/5;border-radius:28px;overflow:hidden;background:var(--afaq-bg);border:1px solid rgba(255,255,255,.06);isolation:isolate;-webkit-tap-highlight-color:transparent;user-select:none}
.afaqmap svg{display:block;width:100%;height:100%}
.afaqmap .am-grat{fill:none;stroke:var(--afaq-accent);stroke-opacity:.09;stroke-width:.6;stroke-dasharray:2 5}
.afaqmap .am-outline-glow{fill:none;stroke:var(--afaq-accent);stroke-opacity:.07;stroke-width:8;stroke-linejoin:round}
.afaqmap .am-outline{fill:var(--afaq-accent);fill-opacity:.03;stroke:var(--afaq-accent);stroke-opacity:.55;stroke-width:1;stroke-linejoin:round}
.afaqmap .am-dots{fill:none;stroke:var(--afaq-accent);stroke-opacity:.24;stroke-width:2.5;stroke-linecap:round}
.afaqmap .am-wave{fill:none;stroke:var(--afaq-accent);stroke-width:2.9;stroke-linecap:round;opacity:0;animation:afaqmap-wave .9s ease-out both}
.afaqmap .am-ping{fill:none;stroke:var(--afaq-accent);stroke-width:1.2;vector-effect:non-scaling-stroke;transform-box:fill-box;transform-origin:center;opacity:0;animation:afaqmap-ping var(--ping-dur,1.9s) linear both}
.afaqmap .am-link{fill:none;stroke:var(--afaq-accent);stroke-opacity:.38;stroke-width:.8}
.afaqmap .am-link--off{stroke-opacity:.14;stroke-dasharray:2 3}
.afaqmap .am-packet{fill:none;stroke:#e6fdff;stroke-width:1.7;stroke-linecap:round;stroke-dasharray:4 1000;stroke-dashoffset:4px;animation:afaqmap-packet linear infinite}
.afaqmap .am-glow{fill:var(--afaq-accent);fill-opacity:.13;transition:fill-opacity .4s}
.afaqmap .am-core{fill:var(--afaq-accent)}
.afaqmap .am-led{fill:#f0feff}
.afaqmap .am-ring{fill:none;stroke:var(--afaq-accent);stroke-width:1;transform-box:fill-box;transform-origin:center;opacity:0;animation:afaqmap-ring 3s ease-out infinite}
.afaqmap .am-node--current .am-glow{fill-opacity:.32}
.afaqmap .am-node--off .am-core{fill:var(--afaq-bg);stroke:var(--afaq-accent);stroke-opacity:.45;stroke-width:1}
.afaqmap .am-node--off .am-glow,.afaqmap .am-node--off .am-led,.afaqmap .am-node--off .am-ring{display:none}
.afaqmap .am-reticle{transition:transform .75s cubic-bezier(.2,.8,.2,1)}
.afaqmap .am-bracket{fill:none;stroke:var(--afaq-accent);stroke-width:1.4;stroke-linecap:round}
.afaqmap .am-spin{fill:none;stroke:var(--afaq-accent);stroke-opacity:.65;stroke-width:.8;stroke-dasharray:3 4;transform-box:fill-box;transform-origin:center;animation:afaqmap-spin 9s linear infinite}
.afaqmap .am-drop{stroke:var(--afaq-accent);stroke-opacity:.4;stroke-width:.7;stroke-dasharray:1.5 3}
.afaqmap .am-panel{fill:var(--afaq-bg);fill-opacity:.86;stroke:var(--afaq-accent);stroke-opacity:.22;stroke-width:.8}
.afaqmap .am-deco{fill:none;stroke:var(--afaq-accent);stroke-opacity:.55;stroke-width:1.3;stroke-linecap:round}
.afaqmap .am-scale{fill:none;stroke:var(--afaq-accent);stroke-opacity:.5;stroke-width:1}
.afaqmap .am-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;letter-spacing:.06em}
.afaqmap .am-text{fill:#f1f5f9}
.afaqmap .am-muted{fill:#7d8ba6}
.afaqmap .am-accent{fill:var(--afaq-accent)}
.afaqmap .am-swap{animation:afaqmap-in .45s ease-out both}
.afaqmap .am-blink{animation:afaqmap-blink 1.6s steps(1) infinite}
.afaqmap .am-seg{fill:var(--afaq-accent);fill-opacity:.38;transition:fill-opacity .3s}
.afaqmap .am-seg--on{fill-opacity:1}
.afaqmap .am-seg--off{fill-opacity:.1}
.afaqmap .am-hit{fill:transparent;cursor:pointer;outline:none}
.afaqmap--paused *{animation-play-state:paused!important}
@keyframes afaqmap-wave{0%{opacity:0}18%{opacity:1}100%{opacity:0}}
@keyframes afaqmap-ping{0%{transform:scale(1);opacity:.75}100%{transform:scale(110);opacity:0}}
@keyframes afaqmap-packet{from{stroke-dashoffset:4px}to{stroke-dashoffset:calc((var(--len) + 40) * -1px)}}
@keyframes afaqmap-ring{0%{transform:scale(1);opacity:.75}100%{transform:scale(3.6);opacity:0}}
@keyframes afaqmap-spin{to{transform:rotate(360deg)}}
@keyframes afaqmap-in{from{opacity:0;transform:translateY(3px)}}
@keyframes afaqmap-blink{50%{opacity:.15}}
@media (prefers-reduced-motion:reduce){.afaqmap *{animation:none!important;transition:none!important}}
`;

/* ------------------------------ component ------------------------------ */

export default function JordanMap({
  className,
  style,
  activeIds,
  interval = 3000,
  accent = "#22d3ee",
  background = "#0b1220",
  tagline = "فريق واحد",
  caption = "من إربد إلى العقبة",
}: JordanMapProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rootRef = useRef<HTMLDivElement>(null);

  const activeKey = (activeIds ?? []).join(",");
  const active = useMemo(
    () =>
      new Set<GovernorateId>(
        activeIds && activeIds.length ? activeIds : GOVERNORATES.map((g) => g.id),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeKey],
  );
  const cycle = useMemo(() => GOVERNORATES.filter((g) => active.has(g.id)), [active]);

  const [current, setCurrent] = useState<GovernorateId>(() =>
    active.has("amman") ? "amman" : (cycle[0]?.id ?? "amman"),
  );
  const [pulse, setPulse] = useState(0);
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  // Keep the selection valid if activeIds changes.
  useEffect(() => {
    if (!active.has(current) && cycle[0]) setCurrent(cycle[0].id);
  }, [active, cycle, current]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Pause everything while the map is off-screen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.1,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-cycle through the governorates.
  useEffect(() => {
    if (!interval || reduced || held || !visible || cycle.length < 2) return;
    const timer = window.setInterval(() => {
      setCurrent((prev) => {
        const i = cycle.findIndex((g) => g.id === prev);
        return cycle[(i + 1) % cycle.length].id;
      });
      setPulse((p) => p + 1);
    }, interval);
    return () => window.clearInterval(timer);
  }, [interval, reduced, held, visible, cycle]);

  const select = (id: GovernorateId) => {
    if (!active.has(id)) return;
    setCurrent(id);
    setPulse((p) => p + 1);
  };

  const gov = BY_ID.get(current) ?? GOVERNORATES[6];
  const waves = useMemo(() => wavesFrom(gov), [gov]);
  const order = cycle.findIndex((g) => g.id === gov.id);
  const count = cycle.length;

  const links = useMemo(
    () =>
      LINKS.map(([a, b], i) => {
        const A = BY_ID.get(a)!;
        const B = BY_ID.get(b)!;
        const reverse = i % 2 === 1;
        const [p, q] = reverse ? [B, A] : [A, B];
        const len = r1(Math.hypot(q.x - p.x, q.y - p.y));
        return {
          key: `${a}-${b}`,
          d: `M${p.x} ${p.y}L${q.x} ${q.y}`,
          len,
          on: active.has(a) && active.has(b),
          delay: -r1((i * 0.73) % 3),
          duration: r1((len + 44) / 26),
        };
      }),
    [active],
  );

  const vars = {
    "--afaq-accent": accent,
    "--afaq-bg": background,
    ...style,
  } as CSSProperties;

  const ariaLabel = `خريطة الأردن: فريق آفاق حاضر في ${governoratesLabel(count)}، ${caption}`;

  return (
    <div
      ref={rootRef}
      dir="rtl"
      className={["afaqmap", visible ? "" : "afaqmap--paused", className ?? ""]
        .filter(Boolean)
        .join(" ")}
      style={vars}
    >
      <style>{CSS}</style>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
        <defs>
          <clipPath id={`${uid}-jo`}>
            <path d={OUTLINE_D} />
          </clipPath>
        </defs>

        {/* graticule — every 1° of latitude / longitude */}
        <g className="am-grat">
          {LON_LINES.map((x) => (
            <line key={`lon${x}`} x1={x} y1={0} x2={x} y2={H} />
          ))}
          {LAT_LINES.map((y) => (
            <line key={`lat${y}`} x1={0} y1={y} x2={W} y2={y} />
          ))}
        </g>

        {/* the country */}
        <path className="am-outline-glow" d={OUTLINE_D} />
        <path className="am-outline" d={OUTLINE_D} />
        <path className="am-dots" d={DOTS_D} />

        {/* ripple from the selected governorate across the whole map */}
        <g key={`wave-${pulse}-${gov.id}`}>
          <g clipPath={`url(#${uid}-jo)`}>
            <circle
              className="am-ping"
              cx={gov.x}
              cy={gov.y}
              r={4}
              style={{ ["--ping-dur" as string]: `${r1((440 / BAND) * BAND_DELAY)}s` }}
            />
          </g>
          {waves.map((d, k) =>
            d ? (
              <path
                key={k}
                className="am-wave"
                d={d}
                style={{ animationDelay: `${r1(k * BAND_DELAY * 100) / 100}s` }}
              />
            ) : null,
          )}
        </g>

        {/* network between governorates */}
        <g>
          {links.map((l) => (
            <path key={l.key} className={l.on ? "am-link" : "am-link am-link--off"} d={l.d} />
          ))}
          {links
            .filter((l) => l.on)
            .map((l) => (
              <path
                key={`p-${l.key}`}
                className="am-packet"
                d={l.d}
                style={
                  {
                    "--len": l.len,
                    animationDuration: `${l.duration}s`,
                    animationDelay: `${l.delay}s`,
                  } as CSSProperties
                }
              />
            ))}
        </g>

        {/* crosshair + reticle on the selected governorate */}
        <g
          className="am-reticle"
          style={{ transform: `translate(${gov.x}px, ${gov.y}px)` }}
          aria-hidden="true"
        >
          <line className="am-drop" x1={-16} y1={0} x2={-600} y2={0} />
          <line className="am-drop" x1={0} y1={16} x2={0} y2={600} />
          <circle className="am-spin" r={14} />
          <path
            className="am-bracket"
            d="M-11 -6V-11H-6M6 -11H11V-6M11 6V11H6M-6 11H-11V6"
          />
        </g>

        {/* governorate nodes */}
        {GOVERNORATES.map((g, i) => {
          const on = active.has(g.id);
          const cls = [
            "am-node",
            on ? "" : "am-node--off",
            g.id === gov.id ? "am-node--current" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <g key={g.id} className={cls}>
              <circle className="am-glow" cx={g.x} cy={g.y} r={8.5} />
              <circle
                className="am-ring"
                cx={g.x}
                cy={g.y}
                r={3.4}
                style={{ animationDelay: `${-r1((i * 0.61) % 3)}s` }}
              />
              <circle className="am-core" cx={g.x} cy={g.y} r={3.4} />
              <circle className="am-led" cx={g.x} cy={g.y} r={1.2} />
            </g>
          );
        })}

        {/* readout — selected governorate (top-left, outside the border) */}
        <g aria-hidden="true">
          <rect className="am-panel" x={20} y={20} width={168} height={82} rx={10} />
          <circle className="am-accent am-blink" cx={34} cy={37} r={2.4} />
          <text
            className="am-mono am-muted"
            x={176}
            y={40}
            fontSize={8.5}
            direction="ltr"
            textAnchor="end"
          >
            {order >= 0 ? `NODE ${pad2(order + 1)}/${pad2(count)}` : "NODE --"}
          </text>
          <g key={`name-${gov.id}`} className="am-swap">
            <text
              className="am-text"
              x={176}
              y={70}
              fontSize={22}
              fontWeight={700}
              direction="rtl"
              textAnchor="start"
            >
              {gov.name}
            </text>
            <text
              className="am-mono am-accent"
              x={176}
              y={89}
              fontSize={9.5}
              direction="ltr"
              textAnchor="end"
            >
              {`${gov.lat.toFixed(2)}°N · ${gov.lon.toFixed(2)}°E`}
            </text>
          </g>
        </g>

        {/* headline (bottom-right, in the empty desert corner outside the border) */}
        <g aria-hidden="true">
          <text
            className="am-mono am-muted"
            x={372}
            y={378}
            fontSize={8.5}
            direction="ltr"
            textAnchor="end"
          >
            AFAQ NETWORK · JO
          </text>
          <text
            className="am-text"
            x={372}
            y={408}
            fontSize={24}
            fontWeight={700}
            direction="rtl"
            textAnchor="start"
          >
            {governoratesLabel(count)}
          </text>
          <text
            className="am-accent"
            x={372}
            y={436}
            fontSize={24}
            fontWeight={700}
            direction="rtl"
            textAnchor="start"
          >
            {tagline}
          </text>
          <text
            className="am-muted"
            x={372}
            y={454}
            fontSize={11.5}
            direction="rtl"
            textAnchor="start"
          >
            {caption}
          </text>
          {GOVERNORATES.map((g, i) => {
            const on = active.has(g.id);
            const isCurrent = g.id === gov.id;
            const w = 6.6;
            const x = 372 - (i + 1) * w - i * 2.2;
            return (
              <rect
                key={g.id}
                className={
                  !on ? "am-seg am-seg--off" : isCurrent ? "am-seg am-seg--on" : "am-seg"
                }
                x={r1(x)}
                y={isCurrent ? 461 : 462.5}
                width={w}
                height={isCurrent ? 6 : 3}
                rx={1}
              />
            );
          })}
        </g>

        {/* scale bar: 100 km */}
        <g aria-hidden="true">
          <path className="am-scale" d="M30 474v5h86.3v-5M73.2 476v3" />
          <text
            className="am-mono am-muted"
            x={73.2}
            y={491}
            fontSize={8}
            direction="ltr"
            textAnchor="middle"
          >
            100 KM
          </text>
        </g>

        {/* frame corners */}
        <path
          className="am-deco"
          aria-hidden="true"
          d="M10 26V10H26M374 10H390V26M390 474V490H374M26 490H10V474"
        />

        {/* hover / tap targets */}
        {GOVERNORATES.filter((g) => active.has(g.id)).map((g) => (
          <circle
            key={`hit-${g.id}`}
            className="am-hit"
            cx={g.x}
            cy={g.y}
            r={9}
            onMouseEnter={() => {
              setHeld(true);
              if (g.id !== current) select(g.id);
            }}
            onMouseLeave={() => setHeld(false)}
            onClick={() => select(g.id)}
          >
            <title>{g.name}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

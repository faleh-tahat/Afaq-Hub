"use client";

/**
 * JordanMap — خريطة الأردن التقنية لقسم «من نحن» في موقع فريق آفاق التكنولوجيا.
 *
 * - React فقط، بدون أي مكتبات إضافية. يشتغل مع Next.js (App Router أو Pages Router).
 * - حدود الأردن: Natural Earth بدقة 1:110m (ملكية عامة)، مع تصحيحات بسيطة عند
 *   ملتقى اليرموك وخط منتصف البحر الميت ورأس خليج العقبة، ومُسقطة على viewBox بحجم 400×500.
 * - نقطة كل محافظة هي الإحداثيات الحقيقية لمركزها (المدينة الرئيسية).
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

/** Jordan outline in viewBox units (Mercator, north up). */
const OUTLINE: ReadonlyArray<readonly [number, number]> = [
  [71.5, 143], [73.7, 118.5], [86.1, 111.6], [179.7, 151], [344.1, 44.5],
  [378, 166.1], [362, 181], [193.8, 230.6], [277.5, 328.6], [249.7, 345.1],
  [235.9, 377.6], [171.9, 391.1], [151.8, 425.9], [115.5, 455.5], [22, 440.2],
  [23.7, 421.9], [61, 270.7], [65.8, 232.5], [71.5, 203.6],
];
const OUTLINE_D = `M${OUTLINE.map(([x, y]) => `${x} ${y}`).join("L")}Z`;

/** Ordered north → south. */
const GOVERNORATES: ReadonlyArray<Governorate> = [
  { id: "irbid", name: "إربد", lat: 32.5556, lon: 35.85, x: 97.1, y: 126.9 },
  { id: "ajloun", name: "عجلون", lat: 32.3326, lon: 35.7517, x: 88.8, y: 149.1 },
  { id: "jerash", name: "جرش", lat: 32.2803, lon: 35.8993, x: 101.2, y: 154.3 },
  { id: "mafraq", name: "المفرق", lat: 32.3406, lon: 36.2081, x: 127.1, y: 148.3 },
  { id: "balqa", name: "البلقاء", lat: 32.0392, lon: 35.7272, x: 86.8, y: 178.2 },
  { id: "zarqa", name: "الزرقاء", lat: 32.0728, lon: 36.088, x: 117.1, y: 174.8 },
  { id: "amman", name: "عمّان", lat: 31.9539, lon: 35.9106, x: 102.2, y: 186.6 },
  { id: "madaba", name: "مادبا", lat: 31.7167, lon: 35.8, x: 92.9, y: 210.1 },
  { id: "karak", name: "الكرك", lat: 31.1853, lon: 35.7047, x: 84.9, y: 262.4 },
  { id: "tafilah", name: "الطفيلة", lat: 30.8375, lon: 35.6044, x: 76.4, y: 296.5 },
  { id: "maan", name: "معان", lat: 30.1962, lon: 35.7341, x: 87.3, y: 359 },
  { id: "aqaba", name: "العقبة", lat: 29.5267, lon: 35.0078, x: 26.3, y: 423.8 },
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
const LON_LINES = [25.7, 109.7, 193.6, 277.6, 361.6];
const LAT_LINES = [82.5, 182.1, 280.5, 378];

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
          <path className="am-scale" d="M30 474v5h88.5v-5M74.3 476v3" />
          <text
            className="am-mono am-muted"
            x={74.3}
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

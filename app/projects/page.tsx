import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, AudioLines, Coffee, ShieldCheck } from 'lucide-react';
import { translation } from '@/lib/i18n';
import s from './projects.module.css';

// «ننتج» — the parent project for AFAQ's AI projects. Rendered on the server;
// all motion is CSS (keyframes + scroll-driven animations with fallbacks).

const cx = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');
const vars = (v: Record<string, string | number>) => v as CSSProperties;

/* ───────────── deterministic decoration data (same on every render) ───────────── */

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

function starField(seed: number, count: number, minR: number, maxR: number) {
  const rand = rng(seed);
  return Array.from({ length: count }, () => ({
    x: r2(rand() * 1440),
    y: r2(rand() * 900),
    r: r2(minR + rand() * (maxR - minR)),
    tw: r2(2.5 + rand() * 4),
    td: r2(-rand() * 6),
    o: r2(0.35 + rand() * 0.65),
  }));
}

const HERO_STARS_FAR = starField(11, 150, 0.5, 1.1);
const HERO_STARS_NEAR = starField(23, 40, 1.2, 2.1);
const WHY_STARS = starField(37, 80, 0.5, 1.4);
const DAWN_STARS = starField(53, 60, 0.5, 1.3);

const NETWORK = (() => {
  const rand = rng(71);
  const nodes = Array.from({ length: 54 }, () => ({ x: r2(rand() * 1200), y: r2(rand() * 900) }));
  const lines: [number, number, number, number][] = [];
  nodes.forEach((a, i) =>
    nodes.slice(i + 1).forEach((b) => {
      if (Math.hypot(a.x - b.x, a.y - b.y) < 175) lines.push([a.x, a.y, b.x, b.y]);
    })
  );
  // Four pulsing nodes, one near each corner (where the network is clearest).
  const pulses = [
    { x: 150, y: 170 },
    { x: 1050, y: 140 },
    { x: 110, y: 720 },
    { x: 1080, y: 760 },
  ];
  return { nodes, lines, pulses };
})();

function wavePath(base: number, amp: number, phase: number) {
  // Period 400 divides the 1200-unit half track, so the loop is seamless.
  let d = '';
  for (let x = 0; x <= 2400; x += 20) {
    const y = base + amp * Math.sin((2 * Math.PI * x) / 400 + phase);
    d += `${x === 0 ? 'M' : 'L'}${x} ${r2(y)}`;
  }
  return d;
}

const WAVES = [
  { d: wavePath(150, 26, 0), o: 0.18 },
  { d: wavePath(230, 40, 1.2), o: 0.12 },
  { d: wavePath(320, 22, 2.4), o: 0.2 },
  { d: wavePath(400, 46, 3.3), o: 0.1 },
  { d: wavePath(480, 30, 4.6), o: 0.16 },
];

const EMBERS = (() => {
  const rand = rng(97);
  return Array.from({ length: 18 }, () => ({
    left: r2(4 + rand() * 92),
    size: r2(2.5 + rand() * 3.5),
    dur: r2(7 + rand() * 6),
    delay: r2(-rand() * 12),
    drift: Math.round(-40 + rand() * 80),
  }));
})();

/* ───────────── small building blocks ───────────── */

function Stars({ stars, twinkle }: { stars: ReturnType<typeof starField>; twinkle?: boolean }) {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      {stars.map((st, i) => (
        <circle
          key={i}
          className={cx(s.star, twinkle && s.twinkle)}
          cx={st.x}
          cy={st.y}
          r={st.r}
          opacity={st.o}
          style={twinkle ? vars({ '--tw': `${st.tw}s`, '--td': `${st.td}s` }) : undefined}
        />
      ))}
    </svg>
  );
}

type ThreadProps = {
  id: string;
  from: string;
  to: string;
  side?: 'left' | 'right';
  /** The hero only drops a short vertical line from its bottom center. */
  stub?: boolean;
};

function Thread({ id, from, to, side = 'left', stub }: ThreadProps) {
  const x = side === 'left' ? 12 : 88;
  const d = stub ? 'M50 80 L50 100' : `M50 0 C50 22 ${x} 26 ${x} 50 C${x} 74 50 78 50 100`;
  const stroke = `url(#${id})`;
  return (
    <>
      <div className={s.thread} aria-hidden>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          <defs>
            <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1={stub ? 80 : 0} x2="0" y2="100">
              <stop offset="0" stopColor={from} />
              <stop offset="1" stopColor={to} />
            </linearGradient>
          </defs>
          <path className={s.threadGlow} d={d} stroke={stroke} vectorEffect="non-scaling-stroke" />
          <path className={s.threadLine} d={d} stroke={stroke} vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <span className={s.joint} style={vars({ '--joint': to })} aria-hidden />
    </>
  );
}

function Arrow() {
  return <ArrowLeft size={18} strokeWidth={2} aria-hidden />;
}

const ICONS = {
  bayyina: ShieldCheck,
  mutarannim: AudioLines,
  mihbash: Coffee,
} as const;

type ProjectKey = keyof typeof ICONS;

function ProjectIcon({ project, size = 24 }: { project: ProjectKey; size?: number }) {
  const Icon = ICONS[project];
  return <Icon size={size} strokeWidth={1.75} aria-hidden />;
}

function Quoted({ children }: { children: ReactNode }) {
  return (
    <>
      <span className={s.quote}>«</span>
      {children}
      <span className={s.quote}>»</span>
    </>
  );
}

type ProjectTextProps = {
  id: ProjectKey;
  kicker: string;
  badge: string;
  name: string;
  slogan: string;
  description: string;
  tags: string[];
};

function ProjectText({ id, kicker, badge, name, slogan, description, tags }: ProjectTextProps) {
  return (
    <div className={s.textCol}>
      <div className={s.kicker}>
        <span className={s.kickerValue}>{kicker}</span>
        <span className={s.badge}>{badge}</span>
      </div>
      <h2 id={`${id}-title`} className={cx(s.projectName, s.display)}>
        {name}
      </h2>
      <p className={cx(s.slogan, s.poetry)}>
        <Quoted>{slogan}</Quoted>
      </p>
      <p className={s.desc}>{description}</p>
      <ul className={s.tags}>
        {tags.map((tag) => (
          <li key={tag} className={s.tag}>
            {tag}
          </li>
        ))}
      </ul>
      <a href={`#${id}-demo`} className={cx(s.btn, s.btnProject)}>
        عرض تفاصيل المشروع
        <Arrow />
      </a>
    </div>
  );
}

function DemoHead({ project, title, sub, badge }: { project: ProjectKey; title: string; sub: string; badge: ReactNode }) {
  return (
    <div className={s.demoHead}>
      <span className={s.demoIcon}>
        <ProjectIcon project={project} size={20} />
      </span>
      <div>
        <div className={s.demoTitle}>{title}</div>
        <div className={s.demoSub}>{sub}</div>
      </div>
      <span className={cx(s.badge, s.demoBadge)}>{badge}</span>
    </div>
  );
}

/* ───────────── Mutarannim scansion data ───────────── */

type Foot = { seg: string; name: string; sym: string };

const SADR: Foot[] = [
  { seg: 'أَلْخَيْلُ وَلْ', name: 'مُسْتَفْعِلُن', sym: '/٥/٥//٥' },
  { seg: 'لَيْلُ وَلْ', name: 'فَاعِلُن', sym: '/٥//٥' },
  { seg: 'بَيْدَاءُ تَعْ', name: 'مُسْتَفْعِلُن', sym: '/٥/٥//٥' },
  { seg: 'رِفُنِي', name: 'فَعِلُن', sym: '///٥' },
];

const AJUZ: Foot[] = [
  { seg: 'وَسْسَيْفُ وَرْ', name: 'مُسْتَفْعِلُن', sym: '/٥/٥//٥' },
  { seg: 'رُمْحُ وَلْ', name: 'فَاعِلُن', sym: '/٥//٥' },
  { seg: 'قِرْطَاسُ وَلْ', name: 'مُسْتَفْعِلُن', sym: '/٥/٥//٥' },
  { seg: 'قَلَمُو', name: 'فَعِلُن', sym: '///٥' },
];

/** "/٥" is a long syllable, a lone "/" a short one. */
const syllables = (sym: string) => sym.match(/\/٥|\//g)?.map((t) => (t === '/' ? 'short' : 'long')) ?? [];

const BEAT = 0.22; // seconds per syllable
const TOTAL_BEATS = [...SADR, ...AJUZ].reduce((n, f) => n + syllables(f.sym).length, 0);
const CYCLE = `${r2(TOTAL_BEATS * BEAT + 1.4)}s`;

function Feet({ feet, startBeat }: { feet: Foot[]; startBeat: number }) {
  let beat = startBeat;
  return (
    <div className={s.feet}>
      {feet.map((f) => {
        const sy = syllables(f.sym);
        const first = beat;
        beat += sy.length;
        return (
          <div key={f.seg} className={s.foot} style={vars({ '--cycle': CYCLE, '--i': `${r2(first * BEAT)}s` })}>
            <span className={cx(s.footSeg, s.poetry)}>{f.seg}</span>
            <span className={s.footName}>{f.name}</span>
            <span className={s.footSym}>{f.sym}</span>
            <span className={s.bars} aria-hidden>
              {sy.map((kind, k) => (
                <span
                  key={k}
                  className={cx(s.bar, kind === 'short' ? s.barShort : s.barLong)}
                  style={vars({ '--cycle': CYCLE, '--i': `${r2((first + k) * BEAT)}s` })}
                />
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const SADR_BEATS = SADR.reduce((n, f) => n + syllables(f.sym).length, 0);

/* ───────────── Mihbash illustration ───────────── */

function MihbashArt() {
  return (
    <svg viewBox="0 0 220 200" aria-hidden focusable="false">
      <defs>
        <linearGradient id="mihbash-wood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4a2a12" />
          <stop offset="0.45" stopColor="#8a5428" />
          <stop offset="1" stopColor="#3a200e" />
        </linearGradient>
        <linearGradient id="mihbash-pestle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9a6331" />
          <stop offset="1" stopColor="#5a3418" />
        </linearGradient>
      </defs>

      {/* sound rings: one per strike */}
      <ellipse className={cx(s.soundRing, s.ringA)} cx="110" cy="72" rx="58" ry="22" />
      <ellipse className={cx(s.soundRing, s.ringB)} cx="110" cy="72" rx="58" ry="22" />
      <ellipse className={cx(s.soundRing, s.ringC)} cx="110" cy="72" rx="58" ry="22" />

      {/* body */}
      <path d="M64 72 C64 112 86 122 93 142 L89 174 L131 174 L127 142 C134 122 156 112 156 72 Z" fill="url(#mihbash-wood)" />
      {/* carved bands */}
      <path d="M68 92 L76 84 L84 92 L92 84 L100 92 L108 84 L116 92 L124 84 L132 92 L140 84 L148 92 L152 88" fill="none" stroke="#f4b740" strokeWidth="2" strokeLinejoin="round" />
      <path d="M78 110 L142 110" stroke="#e0414b" strokeWidth="2.5" />
      <path d="M84 118 L90 124 L96 118 L102 124 L108 118 L114 124 L120 118 L126 124 L132 118 L136 121" fill="none" stroke="#f4b740" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M94 150 L126 150" stroke="#e0414b" strokeWidth="2" />
      {/* foot */}
      <rect x="80" y="172" width="60" height="10" rx="3" fill="#3a200e" />
      <rect x="86" y="182" width="48" height="5" rx="2" fill="#2a170a" />
      {/* rim */}
      <ellipse cx="110" cy="72" rx="46" ry="10" fill="#5e3618" />
      <ellipse cx="110" cy="73" rx="38" ry="6.5" fill="#1d1006" />

      {/* pestle (the «يد»): three strikes, then a pause */}
      <g className={s.pestle}>
        <line x1="122" y1="60" x2="176" y2="10" stroke="url(#mihbash-pestle)" strokeWidth="9" strokeLinecap="round" />
        <circle cx="180" cy="7" r="8" fill="#7a4a23" />
        <path d="M150 34 L156 28" stroke="#f4b740" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function StitchStrip() {
  return (
    <div className={s.stitch} aria-hidden>
      <svg preserveAspectRatio="none" viewBox="0 0 280 14">
        <defs>
          <pattern id="stitch" width="14" height="14" patternUnits="userSpaceOnUse">
            <rect width="14" height="14" fill="#7a1a20" />
            <path d="M7 1 L13 7 L7 13 L1 7 Z" fill="#e0414b" />
            <path d="M7 4 L10 7 L7 10 L4 7 Z" fill="#f4b740" />
          </pattern>
        </defs>
        <rect width="280" height="14" fill="url(#stitch)" />
      </svg>
    </div>
  );
}

/* ───────────── page ───────────── */

export default function ProjectsPage() {
  const t = translation;

  return (
    <div className={s.page}>
      {/* ═════════ 1. Hero — night ═════════ */}
      <section className={cx(s.section, s.hero)} aria-labelledby="nuntij-title">
        <div className={s.decor} aria-hidden>
          <div className={cx(s.layer, s.parallax)}>
            <Stars stars={HERO_STARS_FAR} />
          </div>
          <div className={cx(s.layer, s.parallax)}>
            <Stars stars={HERO_STARS_NEAR} twinkle />
          </div>
          <div className={s.planetArc} />
        </div>
        <Thread id="thread-hero" from="#29C5F6" to="#29C5F6" stub />

        <div className={cx(s.container, s.heroGrid)}>
          <div>
            <p className={s.eyebrow}>
              <span className={s.eyebrowLatin} lang="en">
                AFAQ
              </span>
              <span className={s.rule} aria-hidden />
              <span>المشروع الأم</span>
            </p>
            <h1 id="nuntij-title" className={cx(s.h1, s.display)}>
              ننتج
            </h1>
            <div className={s.dashes} aria-hidden>
              <span />
              <span />
              <span />
            </div>
            <p className={cx(s.heroLine, s.display)}>
              لا نستهلك المستقبل.. <span className={s.accentAfaq}>ننتجه.</span>
            </p>
            <p className={s.heroText}>
              البيت الأم لمشاريع فريق آفاق في الذكاء الاصطناعي.. مشاريع تشبهنا؛ تعرف قانوننا، وتتذوّق شعرنا، وتحفظ حكايتنا.
            </p>
            <div className={s.btnRow}>
              <a href="#projects" className={cx(s.btn, s.btnFilled)}>
                استكشف المشاريع
                <Arrow />
              </a>
              <a href="#join" className={cx(s.btn, s.btnOutline)}>
                انضم إلى الفريق
              </a>
            </div>
          </div>

          <div className={s.orbitCol}>
            <div className={s.orbit}>
              <span className={s.halo} style={vars({ '--hd': '0s' })} aria-hidden />
              <span className={s.halo} style={vars({ '--hd': '1.2s' })} aria-hidden />
              <span className={s.halo} style={vars({ '--hd': '2.4s' })} aria-hidden />

              {(
                [
                  { key: 'bayyina', name: 'بيّنة', ring: s.ringInner, period: '32s', offset: '-5s', c: 'var(--nt-bayyina)' },
                  { key: 'mutarannim', name: 'مترنّم', ring: s.ringMid, period: '48s', offset: '-30s', c: 'var(--nt-mutarannim)' },
                  { key: 'mihbash', name: 'مهباش', ring: s.ringOuter, period: '70s', offset: '-52s', c: 'var(--nt-mihbash)' },
                ] as const
              ).map((p) => (
                <div
                  key={p.key}
                  className={cx(s.ring, p.ring)}
                  style={vars({ '--period': p.period, '--offset': p.offset, '--c': p.c })}
                >
                  <div className={s.rotor}>
                    <a href={`#${p.key}`} className={s.planet}>
                      <span className={s.planetBody}>
                        <span className={s.planetDot}>
                          <ProjectIcon project={p.key} size={26} />
                        </span>
                        <span className={s.planetName}>{p.name}</span>
                      </span>
                    </a>
                  </div>
                </div>
              ))}

              <div className={s.core}>
                <span className={s.coreName}>ننتج</span>
                <span className={s.coreSub}>المشروع الأم</span>
              </div>
            </div>
            <p className={s.orbitCaption}>ثلاثة مشاريع تدور حول فكرة واحدة</p>
          </div>
        </div>
      </section>

      {/* ═════════ 2. Why ═════════ */}
      <section id="projects" className={cx(s.section, s.why)} aria-labelledby="why-title">
        <div className={s.decor} aria-hidden>
          <div className={cx(s.layer, s.parallax, s.starsFade)}>
            <Stars stars={WHY_STARS} twinkle />
          </div>
        </div>
        <Thread id="thread-why" from="#29C5F6" to="#4FE3B5" side="left" />

        <div className={s.container}>
          <div className={s.whyHead}>
            <p className={s.eyebrow}>لماذا ننتج؟</p>
            <h2 id="why-title" className={cx(s.h2, s.display)}>
              العالم كله يبني ذكاءً اصطناعياً.. لكن من يبني ذكاءً <span className={s.accentAfaq}>يعرفنا نحن؟</span>
            </h2>
          </div>

          <div className={s.cards}>
            {(
              [
                { key: 'bayyina', num: '٠١', word: 'الحق', line: 'بيّنة · تعرف قانوننا', c: 'var(--nt-bayyina)' },
                { key: 'mutarannim', num: '٠٢', word: 'الجمال', line: 'مترنّم · يتذوّق شعرنا', c: 'var(--nt-mutarannim)' },
                { key: 'mihbash', num: '٠٣', word: 'الذاكرة', line: 'مهباش · يحفظ حكايتنا', c: 'var(--nt-mihbash)' },
              ] as const
            ).map((card) => (
              <a key={card.key} href={`#${card.key}`} className={cx(s.card, s.glass)} style={vars({ '--c': card.c })}>
                <span className={s.cardTop}>
                  <span className={s.cardNum}>{card.num}</span>
                  <span className={s.cardIcon}>
                    <ProjectIcon project={card.key} />
                  </span>
                </span>
                <span className={cx(s.cardWord, s.display)}>{card.word}</span>
                <span className={s.cardLine}>{card.line}</span>
                <span className={s.cardMore}>
                  اكتشف المشروع
                  <Arrow />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ 3. Bayyina — the truth ═════════ */}
      <section id="bayyina" className={cx(s.section, s.sBayyina)} aria-labelledby="bayyina-title">
        <div className={s.decor} aria-hidden>
          <div className={cx(s.layer, s.parallax, s.network)}>
            <svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice">
              {NETWORK.lines.map(([x1, y1, x2, y2], i) => (
                <line key={i} className={s.netLine} x1={x1} y1={y1} x2={x2} y2={y2} />
              ))}
              {NETWORK.nodes.map((n, i) => (
                <circle key={i} className={s.netNode} cx={n.x} cy={n.y} r={2.6} />
              ))}
              {NETWORK.pulses.map((n, i) => (
                <circle
                  key={i}
                  className={s.netPulse}
                  cx={n.x}
                  cy={n.y}
                  r={5}
                  style={{ animationDelay: `${i * 0.8}s` }}
                />
              ))}
            </svg>
          </div>
        </div>
        <Thread id="thread-bayyina" from="#4FE3B5" to="#C9A2FF" side="right" />

        <div className={s.container}>
          <div className={cx(s.panel, s.glass)}>
            <span className={cx(s.watermark, s.display)} aria-hidden>
              الحق
            </span>
            <div className={s.panelGrid}>
              <ProjectText
                id="bayyina"
                kicker="٠١ — الحق"
                badge="قانون × ذكاء اصطناعي"
                name="بيّنة"
                slogan="الجريمة صارت رقمية.. فلتكن العدالة أذكى."
                description="ذكاء اصطناعي قانوني متخصص في الجرائم الإلكترونية، يربط نصوص القانون بواقع العالم الرقمي.. ليجعل الحق بيّناً."
                tags={['الجرائم الإلكترونية', 'التشريعات', 'التوعية القانونية']}
              />

              <div id="bayyina-demo" className={s.demo}>
                <span className={s.scan} aria-hidden />
                <DemoHead
                  project="bayyina"
                  title="بيّنة"
                  sub="مساعد قانوني · الجرائم الإلكترونية"
                  badge={
                    <>
                      <span className={s.liveDot} aria-hidden />
                      تحليل فوري
                    </>
                  }
                />
                <div className={s.demoBody}>
                  <p className={s.ask}>تعرّضت لابتزاز إلكتروني على مواقع التواصل.. شو أعمل؟</p>
                  <div className={s.answer}>
                    <div className={s.answerHead}>
                      <span className={s.answerLabel}>تحليل بيّنة</span>
                      <span className={s.badge}>التصنيف: ابتزاز إلكتروني</span>
                    </div>
                    <p style={{ margin: 0 }}>خطوات أولى تحمي حقك:</p>
                    <ol className={s.steps}>
                      <li>
                        <span className={s.stepNum}>١.</span>
                        <span>لا تحذف المحادثات، واحفظ صور الشاشة بالتاريخ والوقت.</span>
                      </li>
                      <li>
                        <span className={s.stepNum}>٢.</span>
                        <span>لا تدفع أي مبلغ، ولا تتفاوض مع المبتز.</span>
                      </li>
                      <li>
                        <span className={s.stepNum}>٣.</span>
                        <span>قدّم بلاغاً إلى وحدة الجرائم الإلكترونية.</span>
                      </li>
                    </ol>
                  </div>
                  <p className={s.note}>إجابة توعوية عامة، ولا تُغني عن استشارة محامٍ مختص.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ 4. Mutarannim — beauty (mirrored) ═════════ */}
      <section id="mutarannim" className={cx(s.section, s.sMutarannim)} aria-labelledby="mutarannim-title">
        <div className={s.decor} aria-hidden>
          <div className={cx(s.layer, s.parallax, s.waves)}>
            <div className={s.waveTrack} style={{ position: 'absolute', top: 0, left: 0, height: '100%' }}>
              <svg viewBox="0 0 2400 600" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '100%' }}>
                {WAVES.map((w, i) => (
                  <path key={i} d={w.d} strokeOpacity={w.o} vectorEffect="non-scaling-stroke" />
                ))}
              </svg>
            </div>
          </div>
        </div>
        <Thread id="thread-mutarannim" from="#C9A2FF" to="#DEAC9F" side="left" />

        <div className={s.container}>
          <div className={cx(s.panel, s.glass, s.reverse)}>
            <span className={cx(s.watermark, s.display)} aria-hidden>
              الجمال
            </span>
            <div className={s.panelGrid}>
              <ProjectText
                id="mutarannim"
                kicker="٠٢ — الجمال"
                badge="شعر × ذكاء اصطناعي"
                name="مترنّم"
                slogan="من بحور الخليل.. إلى بحور البيانات."
                description="ذكاء اصطناعي يفهم القصيدة العربية وزناً وقافيةً ومعنى، ويفتح «ديوان العرب» على المستقبل."
                tags={['الشعر العربي', 'العَروض والبحور', 'تذوّق القصيدة']}
              />

              <div id="mutarannim-demo" className={s.demo}>
                <DemoHead project="mutarannim" title="مترنّم" sub="يقرأ البيت ويكشف بحره" badge="البحر: البسيط" />
                <div className={s.demoBody}>
                  <p className={cx(s.verse, s.poetry)} style={{ margin: 0 }}>
                    <span>الخيلُ والليلُ والبيداءُ تعرفُني</span>
                    <span>والسيفُ والرمحُ والقرطاسُ والقلمُ</span>
                  </p>
                  <div>
                    <p className={s.hemiLabel}>الصدر</p>
                    <Feet feet={SADR} startBeat={0} />
                  </div>
                  <div>
                    <p className={s.hemiLabel}>العجز</p>
                    <Feet feet={AJUZ} startBeat={SADR_BEATS} />
                  </div>
                  <p className={s.legend}>/ متحرك · ٥ ساكن</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ 5. Mihbash — memory ═════════ */}
      <section id="mihbash" className={cx(s.section, s.sMihbash)} aria-labelledby="mihbash-title">
        <div className={s.decor} aria-hidden>
          <div className={cx(s.layer, s.parallax, s.embroidery)}>
            <svg width="100%" height="100%">
              <defs>
                <pattern id="tatreez" width="56" height="56" patternUnits="userSpaceOnUse">
                  <path d="M28 4 L52 28 L28 52 L4 28 Z" fill="none" stroke="#e0414b" strokeWidth="2" />
                  <path d="M28 16 L40 28 L28 40 L16 28 Z" fill="#f4b740" />
                  <path d="M28 23 L33 28 L28 33 L23 28 Z" fill="#e0414b" />
                  <path d="M0 0 L6 6 M56 0 L50 6 M0 56 L6 50 M56 56 L50 50" stroke="#f4b740" strokeWidth="2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#tatreez)" />
            </svg>
          </div>
          {EMBERS.map((e, i) => (
            <span
              key={i}
              className={s.ember}
              style={vars({
                left: `${e.left}%`,
                width: `${e.size}px`,
                height: `${e.size}px`,
                '--dur': `${e.dur}s`,
                '--delay': `${e.delay}s`,
                '--drift': `${e.drift}px`,
              })}
            />
          ))}
        </div>
        <Thread id="thread-mihbash" from="#DEAC9F" to="#F4B740" side="right" />

        <div className={s.container}>
          <div className={cx(s.panel, s.glass)}>
            <span className={cx(s.watermark, s.display)} aria-hidden>
              الذاكرة
            </span>
            <div className={s.panelGrid}>
              <ProjectText
                id="mihbash"
                kicker="٠٣ — الذاكرة"
                badge="موروث × ذكاء اصطناعي"
                name="مهباش"
                slogan="كان صوت المهباش يعزم الناس على القهوة والسالفة.. واليوم يعزم العالم على حكاية الأردن."
                description="نموذج ذكاء اصطناعي يحفظ السردية الأردنية بتاريخها وعاداتها وموروثها، ويرويها للجيل الجديد بلغته."
                tags={['السردية الأردنية', 'الذاكرة الشعبية', 'الحكاية']}
              />

              <div id="mihbash-demo" className={s.demo}>
                <StitchStrip />
                <DemoHead project="mihbash" title="مهباش" sub="راوي الحكاية الأردنية" badge="سالفة من الديوان" />
                <div className={s.demoBody}>
                  <div className={s.mihbashArt}>
                    <MihbashArt />
                  </div>
                  <p className={s.ask}>يا مهباش، ليش كانوا يدقّوا القهوة بإيقاع؟</p>
                  <div className={s.answer}>
                    <div className={s.answerHead}>
                      <span className={s.answerLabel}>مهباش يحكي</span>
                    </div>
                    <p style={{ margin: 0 }}>
                      صوت المهباش كان عزيمة مفتوحة: أوّل ما يسمعه الجيران بيعرفوا إنّه في قهوة عم تنعمل وضيف بالمضافة، فبيلبّوا العزيمة. ومن هون صار الدقّ نفسه فنّ، إله إيقاع ونَغَم.
                    </p>
                    <ul className={s.miniTags}>
                      <li>القصص التاريخية</li>
                      <li>العادات والتقاليد</li>
                      <li>الإرث والموروث</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ 6. Join — dawn ═════════ */}
      <section id="join" className={cx(s.section, s.join)} aria-labelledby="join-title">
        <div className={s.decor} aria-hidden>
          <div className={cx(s.layer, s.starsTop)}>
            <Stars stars={DAWN_STARS} twinkle />
          </div>
          <div className={cx(s.sunWrap, s.sunRise)}>
            <div className={s.rays} />
            <div className={s.sun} />
          </div>
          <div className={s.dunes}>
            <svg viewBox="0 0 1440 340" preserveAspectRatio="none">
              <defs>
                <linearGradient id="dune-front" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1a0f08" />
                  <stop offset="1" stopColor="#0a0806" />
                </linearGradient>
              </defs>
              <path d="M0 120 C200 70 360 60 560 100 C760 140 900 60 1100 70 C1260 78 1360 110 1440 100 L1440 340 L0 340 Z" fill="#5a2c12" />
              <path d="M0 190 C180 150 340 130 520 170 C700 210 880 140 1060 150 C1220 160 1340 190 1440 180 L1440 340 L0 340 Z" fill="#2c170b" />
              <path d="M0 250 C220 215 420 210 640 240 C860 270 1060 220 1240 230 C1340 236 1400 250 1440 248 L1440 340 L0 340 Z" fill="url(#dune-front)" />
            </svg>
          </div>
        </div>
        <Thread id="thread-join" from="#F4B740" to="#FFE3A3" side="left" />

        <div className={cx(s.container, s.joinInner)}>
          <p className={cx(s.eyebrow, s.eyebrowSun)}>
            <span className={s.rule} aria-hidden />
            انضم إلينا
            <span className={s.rule} aria-hidden />
          </p>
          <h2 id="join-title" className={cx(s.h2, s.display)}>
            ثلاثة مشاريع.. ورسالة واحدة: <span className={s.sunText}>ذكاءٌ يشبهنا.</span>
          </h2>
          <p className={s.joinText}>
            سواء كنت مبرمجاً أو قانونياً أو شاعراً أو حافظاً للحكاية، في «ننتج» مكانٌ لك.
          </p>
          <div className={cx(s.dashes, s.dashesCenter)} aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <div className={cx(s.btnRow, s.btnRowCenter)}>
            <a href={t.joinFormUrl} target="_blank" rel="noopener noreferrer" className={cx(s.btn, s.btnSun)}>
              انضم إلى الفريق
              <Arrow />
            </a>
            <Link href="/contact" className={cx(s.btn, s.btnOutline)}>
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      {/* ═════════ 7. Ground — the page's sign-off ═════════ */}
      <div className={s.ground}>
        <div className={s.container}>
          <div className={s.groundRow}>
            <div className={s.groundBrand}>
              <Image src="/afaq-logo-full.png" alt={t.logoAlt} width={1705} height={646} className="h-10 w-auto" />
              <p>«ننتج» مشروع من فريق آفاق التقني.</p>
            </div>
            <ul className={s.groundLinks}>
              <li>
                <a href="#bayyina">بيّنة</a>
              </li>
              <li>
                <a href="#mutarannim">مترنّم</a>
              </li>
              <li>
                <a href="#mihbash">مهباش</a>
              </li>
              <li>
                <Link href="/contact">تواصل</Link>
              </li>
            </ul>
            <p className={s.copy} dir="ltr">
              © 2026 AFAQ Tech Team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

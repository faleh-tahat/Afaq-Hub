'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpLeft, Check, Copy } from 'lucide-react';
import JordanMap from '@/components/jordan-map';
import { useTranslation } from '@/components/language-provider';
import { cn } from '@/lib/utils';
import s from './about.module.css';

// Geometry of the «مسيرتنا» horizon. Computed for exactly 4 milestones:
// column centers 87.5 / 62.5 / 37.5 / 12.5 % (RTL grid, 2023 on the right)
// line up with the curve's x = 875 / 625 / 375 / 125 in a 1000×260 viewBox.
const HORIZON = {
  viewBox: '0 0 1000 260',
  solidPath:
    'M1000,240 C958.3,236 937.5,235 875,228 C812.5,221 708.3,213 625,198 C541.7,183 458.3,165 375,138 C291.7,111 187.5,59 125,36',
  tailPath: 'M125,36 C62.5,13 41.7,12 0,0',
  gradient: { x1: 1000, x2: 125 },
  desktop: {
    tailDash: '0.5 9',
    itemPaddingTop: [258, 228, 168, 66],
    nodeTop: [221, 191, 131, 27],
  },
  map: {
    tailDash: '0.5 8',
    xPercent: [87.5, 62.5, 37.5, 12.5],
    dotTop: [138, 121, 87, 26],
    labelTop: [162, 144, 110, 51],
    dotRadius: 5,
    currentDotRadius: 7,
  },
} as const;

function HorizonCurve({ className, tailDash }: { className: string; tailDash: string }) {
  const gradientId = `horizon-${useId().replace(/:/g, '')}`;
  return (
    <svg className={className} viewBox={HORIZON.viewBox} preserveAspectRatio="none" aria-hidden focusable="false">
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={HORIZON.gradient.x1}
          y1={0}
          x2={HORIZON.gradient.x2}
          y2={0}
        >
          <stop offset="0" style={{ stopColor: 'var(--afaq-accent)', stopOpacity: 0.1 }} />
          <stop offset="1" style={{ stopColor: 'var(--afaq-accent)', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d={HORIZON.solidPath}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={HORIZON.tailPath}
        fill="none"
        style={{ stroke: 'var(--afaq-accent)' }}
        strokeOpacity={0.6}
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={tailDash}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function Eyebrow({ children }: { children: string }) {
  return <p className={s.eyebrow}>{children}</p>;
}

/** Wraps each run of dots in a span so only the dots take the accent color. */
function Slogan({ text }: { text: string }) {
  return (
    <p className={s.slogan}>
      {text.split(/(\.+)/).map((part, i) => (/^\.+$/.test(part) ? <span key={i}>{part}</span> : part))}
    </p>
  );
}

function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Clipboard API unavailable (e.g. insecure context): legacy fallback.
      const field = document.createElement('textarea');
      field.value = email;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      const ok = document.execCommand('copy');
      field.remove();
      if (!ok) return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button type="button" className={s.copyButton} onClick={copy} aria-label="نسخ البريد الإلكتروني">
        {copied ? <Check size={18} aria-hidden /> : <Copy size={18} aria-hidden />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'تم النسخ' : ''}
      </span>
    </>
  );
}

export default function AboutPage() {
  const t = useTranslation();
  const about = t.about;
  const milestones = about.journey.timeline;
  const currentIndex = milestones.length - 1;
  const [intro1, intro2, intro3, intro4] = about.intro;
  const joinParagraphs = about.joinUs.paragraphs.slice(0, -1);
  const joinStatement = about.joinUs.paragraphs[about.joinUs.paragraphs.length - 1];

  useEffect(() => {
    if (window.location.hash === '#join') {
      const timer = setTimeout(() => {
        document.getElementById('join')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className={s.page}>
      {/* Hero */}
      <section className={s.hero} aria-labelledby="about-title">
        <div className={s.container}>
          <Eyebrow>{about.kicker}</Eyebrow>
          <h1 id="about-title" className={s.h1}>
            {about.heading}
          </h1>

          <div className={s.heroGrid}>
            <div className={s.heroText}>
              <p className={s.lead}>{intro1}</p>
              <p className={cn(s.statement, s.heroStatement)}>{intro2}</p>
              <p className={cn(s.body, s.heroBody)}>{intro3}</p>
              <p className={s.heroTagline}>{intro4}</p>
            </div>
            <div className={s.heroMedia}>
              {/* Fills the wrapper, which keeps the size, radius and frame the
                  photo had (4/5 on desktop, 16/10 below 1024px). */}
              <JordanMap style={{ aspectRatio: 'auto', height: '100%', borderRadius: 27, border: 'none' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Slogan band */}
      <div className={s.band}>
        <div className={s.container}>
          <Slogan text={about.motto} />
        </div>
      </div>

      {/* Journey */}
      <section className={s.journey} aria-labelledby="journey-title">
        <div className={s.container}>
          <h2 id="journey-title" className={cn(s.h2, s.h2Solo)}>
            {about.journey.kicker}
          </h2>

          {/* < 1024px: decorative horizon map above the list */}
          <div className={s.map} aria-hidden>
            <div className={s.mapGlow} />
            <HorizonCurve className={s.mapCurve} tailDash={HORIZON.map.tailDash} />
            {milestones.map((m, i) => {
              const current = i === currentIndex;
              const r = current ? HORIZON.map.currentDotRadius : HORIZON.map.dotRadius;
              return (
                <span key={`dot-${m.year}`}>
                  <span
                    className={cn(s.mapDot, current && s.mapDotCurrent)}
                    style={{ left: `calc(${HORIZON.map.xPercent[i]}% - ${r}px)`, top: HORIZON.map.dotTop[i] }}
                  />
                  <span
                    className={cn(s.mapLabel, current && s.mapLabelCurrent)}
                    style={{ left: `${HORIZON.map.xPercent[i]}%`, top: HORIZON.map.labelTop[i] }}
                  >
                    {m.year}
                  </span>
                </span>
              );
            })}
          </div>

          <div className={s.horizon}>
            <div className={s.glow} aria-hidden />
            <HorizonCurve className={s.curve} tailDash={HORIZON.desktop.tailDash} />
            <ol className={s.list}>
              {milestones.map((m, i) => (
                <li
                  key={m.year}
                  className={s.item}
                  aria-current={i === currentIndex ? 'step' : undefined}
                  style={
                    {
                      '--item-pt': `${HORIZON.desktop.itemPaddingTop[i]}px`,
                      '--node-top': `${HORIZON.desktop.nodeTop[i]}px`,
                    } as CSSProperties
                  }
                >
                  <span className={s.node} aria-hidden />
                  <time className={s.time} dateTime={m.year}>
                    {m.year}
                  </time>
                  <h3 className={s.itemTitle}>{m.title}</h3>
                  <p className={s.itemDesc}>{m.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className={s.vision} aria-labelledby="vision-title">
        <div className={cn(s.container, s.split)}>
          <div className={cn(s.splitTitle, s.sticky)}>
            <Eyebrow>{about.vision.kicker}</Eyebrow>
            <h2 id="vision-title" className={s.h2}>
              {about.vision.title}
            </h2>
          </div>
          <div>
            <p className={cn(s.statement, s.visionStatement, s.measure)}>{about.vision.paragraphs[0]}</p>
            <p className={cn(s.body, s.visionBody, s.measure)}>{about.vision.paragraphs[1]}</p>
          </div>
        </div>
      </section>

      {/* Join */}
      <section id="join" className={s.join} aria-labelledby="join-title">
        <div className={s.container}>
          <div className={s.panel}>
            <div className={s.panelGlow} aria-hidden />
            <div className={s.split}>
              <div className={s.splitTitle}>
                <Eyebrow>{about.joinUs.kicker}</Eyebrow>
                <h2 id="join-title" className={s.h2}>
                  {about.joinUs.title}
                </h2>
              </div>
              <div>
                <div className={s.joinBody}>
                  {joinParagraphs.map((paragraph, i) => (
                    <p key={i} className={cn(s.body, s.measure)}>
                      {paragraph}
                    </p>
                  ))}
                </div>
                <p className={cn(s.statement, s.joinStatement, s.measure)}>{joinStatement}</p>
                <a
                  href={t.joinFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.primaryButton}
                >
                  {about.joinUs.linkLabel.replace(/:\s*$/, '')}
                  <ArrowUpLeft size={18} aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className={s.contact} aria-labelledby="contact-title">
        <div className={cn(s.container, s.split)}>
          <h2 id="contact-title" className={cn(s.h2, s.h2Solo, s.splitTitle)}>
            {about.contact.kicker}
          </h2>
          <div>
            <p className={cn(s.body, s.measure)}>{about.contact.description}</p>
            <div className={s.emailCard}>
              <div className={s.emailText}>
                <p className={s.emailLabel}>{about.contact.emailLabel}</p>
                <a href={`mailto:${about.contact.email}`} className={s.emailLink} dir="ltr">
                  {about.contact.email}
                </a>
              </div>
              <CopyEmailButton email={about.contact.email} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

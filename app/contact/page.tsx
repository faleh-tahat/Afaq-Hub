'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Send } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/components/language-provider';

export default function ContactPage() {
  const t = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div>
      <PageHeader title={t.contact.title} description={t.contact.description} />

      <Container className="py-14 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
          {/* Contact details */}
          <Reveal className="rounded-panel border border-line bg-surface p-7 sm:p-9">
            <h2 className="text-title-3 font-semibold text-ink">{t.contact.getInTouch}</h2>

            <dl className="mt-6 divide-y divide-line">
              {t.contact.details.map((detail) => (
                <div key={detail.label} className="py-4 first:pt-0">
                  <dt className="text-caption text-ink-muted">{detail.label}</dt>
                  <dd className="mt-1 text-body font-medium text-ink">{detail.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex items-center gap-3 rounded-control border border-success/20 bg-success/5 px-4 py-3">
              <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-success" />
              <p className="text-small text-ink-muted">
                {t.contact.respondsWithinLabel}{' '}
                <span className="font-medium text-ink">{t.contact.respondsWithinValue}</span>
              </p>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal
            delay={0.08}
            className="relative overflow-hidden rounded-panel border border-line bg-surface p-7 sm:p-9"
          >
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-accent-hairline" />

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                role="status"
                className="flex flex-col items-center gap-5 py-16 text-center"
              >
                <span
                  aria-hidden="true"
                  className="flex h-16 w-16 items-center justify-center rounded-panel bg-success/10 text-success ring-1 ring-inset ring-success/25"
                >
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <div>
                  <p className="text-title-3 font-semibold text-ink">
                    {t.contact.form.successTitle}
                  </p>
                  <p className="mt-2 text-body text-ink-muted">{t.contact.form.successMessage}</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="field-label">{t.contact.form.name}</span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder={t.contact.form.namePlaceholder}
                      required
                      className="field"
                    />
                  </label>
                  <label className="block">
                    <span className="field-label">{t.contact.form.email}</span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder={t.contact.form.emailPlaceholder}
                      required
                      className="field"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="field-label">{t.contact.form.message}</span>
                  <textarea
                    name="message"
                    rows={6}
                    placeholder={t.contact.form.messagePlaceholder}
                    required
                    className="field resize-y"
                  />
                </label>
                <Button type="submit" size="lg" loading={loading} className="group mt-1 w-full">
                  {!loading && (
                    <Send
                      aria-hidden="true"
                      className="h-4 w-4 -scale-x-100 transition-transform duration-200 group-hover:-translate-x-0.5"
                    />
                  )}
                  {t.contact.form.submit}
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </div>
  );
}

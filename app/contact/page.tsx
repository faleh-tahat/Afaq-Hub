'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Send } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/components/language-provider';

export default function ContactPage() {
  const t = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ غير متوقع.');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-950 text-brand-200">
      <main className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <SectionHeading
            title={t.contact.title}
            description={t.contact.description}
            size="lg"
          />
        </motion.div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">

          {/* Contact details */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-4xl border border-white/[0.08] bg-brand-900/60 p-8 shadow-card backdrop-blur-xl sm:p-10"
          >
            <p className="text-xs font-bold text-brand-500">
              {t.contact.getInTouch}
            </p>
            <div className="mt-6 space-y-5">
              {t.contact.details.map((detail) => (
                <div
                  key={detail.label}
                  className="rounded-2xl border border-white/[0.06] bg-brand-950/40 px-5 py-4"
                >
                  <p className="text-2xs font-semibold text-brand-600">
                    {detail.label}
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-brand-200">{detail.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-emerald-500/6 px-4 py-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              <p className="text-xs text-brand-500">
                {t.contact.respondsWithinLabel}{' '}
                <span className="text-brand-300">{t.contact.respondsWithinValue}</span>
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative overflow-hidden rounded-4xl border border-white/[0.08] bg-brand-900/60 p-8 shadow-card backdrop-blur-xl sm:p-10"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-5 py-16 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-emerald-500/20 bg-emerald-500/10">
                  <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-white">{t.contact.form.successTitle}</p>
                  <p className="mt-2 text-sm text-brand-500">{t.contact.form.successMessage}</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs font-medium text-brand-400">{t.contact.form.name}</span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder={t.contact.form.namePlaceholder}
                      required
                      className="input-base"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-medium text-brand-400">{t.contact.form.email}</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder={t.contact.form.emailPlaceholder}
                      required
                      className="input-base"
                    />
                  </label>
                </div>
                <label className="space-y-2">
                  <span className="text-xs font-medium text-brand-400">{t.contact.form.message}</span>
                  <textarea
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder={t.contact.form.messagePlaceholder}
                    required
                    className="input-base resize-none"
                  />
                </label>
                {error && (
                  <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </p>
                )}
                <Button type="submit" size="lg" loading={loading} className="group gap-2 w-full">
                  {!loading && <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />}
                  {t.contact.form.submit}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

'use client';

import { LegalDocument } from '@/components/legal-document';
import { useTranslation } from '@/components/language-provider';

export default function TermsPage() {
  const t = useTranslation();

  return (
    <LegalDocument
      title={t.terms.title}
      description={t.terms.description}
      sections={t.terms.sections}
    />
  );
}

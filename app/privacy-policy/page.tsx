'use client';

import { LegalDocument } from '@/components/legal-document';
import { useTranslation } from '@/components/language-provider';

export default function PrivacyPolicyPage() {
  const t = useTranslation();

  return (
    <LegalDocument
      title={t.privacyPolicy.title}
      description={t.privacyPolicy.description}
      sections={t.privacyPolicy.sections}
    />
  );
}

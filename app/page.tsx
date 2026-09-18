import { SectionHero } from '@/components/section-hero';
import { SectionGallery } from '@/components/section-gallery';

export default function HomePage() {
  return (
    <div className="bg-brand-950 text-brand-200">
      <SectionHero />
      <SectionGallery />
    </div>
  );
}

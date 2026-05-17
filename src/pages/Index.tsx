import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { TopJournalsCarousel } from '@/components/home/TopJournalsCarousel';
import { RecentlyPublished } from '@/components/home/RecentlyPublished';
import { AboutSection } from '@/components/home/AboutSection';
import { FounderQuote } from '@/components/home/FounderQuote';
import { BookCategoriesGrid } from '@/components/home/BookCategoriesGrid';
import { SearchFilterSection } from '@/components/home/SearchFilterSection';
import { StoreGallery } from '@/components/home/StoreGallery';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CallToActionFooter } from '@/components/home/CallToActionFooter';
import { MobileHome } from '@/components/mobile/MobileHome';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Mobile-first home (< md) */}
      <MobileHome />

      {/* Desktop / tablet home (≥ md) — unchanged */}
      <div className="hidden md:block">
        <HeroSection />
        <RecentlyPublished />
        <TopJournalsCarousel />
        <AboutSection />
        <FounderQuote />
        <BookCategoriesGrid />
        <SearchFilterSection />
        <StoreGallery />
        <TestimonialsSection />
        <CallToActionFooter />
      </div>
    </div>
  );
};

export default Index;

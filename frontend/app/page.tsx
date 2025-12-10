import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { TrendingProducts } from "@/components/home/TrendingProducts";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturedCategories />
      <TrendingProducts />
      <FeaturesSection />
      <NewsletterSection />
    </div>
  );
}

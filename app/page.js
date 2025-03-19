import Hero from "@/components/custom/Hero";
import Features from "@/components/custom/Features";
import Testimonials from "@/components/custom/Testimonials";
import Pricing from "@/components/custom/Pricing";
import FAQ from "@/components/custom/FAQ";
import Footer from "@/components/custom/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

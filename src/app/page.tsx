import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGallery from "@/components/ProductGallery";
import ProductFeatures from "@/components/ProductFeatures";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <ProductGallery />
        <ProductFeatures />
      </main>
      <Footer />
    </div>
  );
}

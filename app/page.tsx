import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Concept from "@/components/Concept";
import Locations from "@/components/Locations";
import Reviews from "@/components/Reviews";
import Social from "@/components/Social";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Concept />
      <Locations />
      <Reviews />
      <Social />
      <Footer />
    </main>
  );
}

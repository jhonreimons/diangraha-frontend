import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Achievement from "./components/Achievment";
import AboutUs from "./components/AboutUs";
import Brands from "./components/Brands";
import ServicesSection from "./components/Services/ServiceSection";
import ContactForm from "./components/Contact/ContactForm";
import Footer from "./components/Footer/Footer";

// Fetch data dari API
async function fetchAchievements() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/achievements`, {
      cache: 'no-store' // Untuk development, gunakan 'force-cache' untuk production
    });
    if (!res.ok) throw new Error('Failed to fetch achievements');
    return await res.json();
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
}

async function fetchBrands() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/brands`, {
      cache: 'no-store' // Untuk development, gunakan 'force-cache' untuk production
    });
    if (!res.ok) throw new Error('Failed to fetch brands');
    return await res.json();
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

export default async function Home() {
  // Fetch data secara parallel
  const [achievements, brands] = await Promise.all([
    fetchAchievements(),
    fetchBrands()
  ]);

  return (
    <main>
      <Navbar />
      <Hero />
      <Achievement awards={achievements} />
      <AboutUs />
      <Brands brands={brands} />
      <ServicesSection />
      <ContactForm />
      <Footer />
    </main>
  );
}

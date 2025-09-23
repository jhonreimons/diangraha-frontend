import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Achievement from "./components/Achievment";
import AboutUs from "./components/AboutUs";
import Brands from "./components/Brands";
import ServicesSection from "./components/Services/ServiceSection";
import ContactForm from "./components/Contact/ContactForm";
import Footer from "./components/Footer/Footer";


export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Achievement />
      <AboutUs />
      <Brands />
      <ServicesSection />
      <ContactForm />
      <Footer />
    </main>
  );
}

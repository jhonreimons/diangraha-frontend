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
      <section id="home">
        <Hero />
      </section>
      <section id="achievements">
        <Achievement />
      </section>
      <section id="about">
        <AboutUs />
      </section>
      <section id="brands">
        <Brands />
      </section>
      <section id="services">
        <ServicesSection />
      </section>
      <section id="contact">
        <ContactForm />
      </section>
      <Footer />
    </main>
  );
}

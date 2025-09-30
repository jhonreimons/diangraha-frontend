"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer/Footer";
import Image from "next/image";
import { useState } from "react";



export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const partners = [
    { id: 1, name: "Tech Solutions Inc", logo: "LOGO 1" },
    { id: 2, name: "Digital Innovations", logo: "LOGO 2" },
    { id: 3, name: "Global Enterprises", logo: "LOGO 3" },
    { id: 4, name: "Smart Systems", logo: "LOGO 4" },
    { id: 5, name: "Future Corp", logo: "LOGO 5" },
    { id: 6, name: "Innovation Hub", logo: "LOGO 6" }
  ];

  const infinitePartners = [...partners, ...partners, ...partners];

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      if (newIndex >= partners.length) {
        setTimeout(() => setCurrentIndex(0), 300);
        return newIndex;
      }
      return newIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - 1;
      if (newIndex < 0) {
        setTimeout(() => setCurrentIndex(partners.length - 1), 300);
        return newIndex;
      }
      return newIndex;
    });
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-screen">
        {/* Hero Section with Background Image */}
        <section className="relative w-full bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80")', height: '575px'}}>          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-6 py-3 rounded-lg" style={{backgroundColor: 'rgba(50, 46, 229, 0.48)'}}>
              <h1 className="font-bold" style={{fontSize: '30px'}}>About Us</h1>
            </div>
          </div>
        </section>

        {/* Company Description Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Company Description */}
              <div>
                <h2 className="font-bold text-gray-800 mb-8" style={{fontSize: '35px'}}>PT. Dian Graha Elektrika</h2>
                
                <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                  <p>
                    Sejak berdirinya pada tahun 1977, PT. Dian Graha Elektrika telah menjadi salah satu perusahaan nasional yang kokoh hingga saat ini, dengan memanfaatkan keahlian dan sumber dayanya untuk memprioritaskan penyediaan layanan berkualitas tinggi dan membina hubungan pelanggan yang berkesinambungan.
                  </p>
                  
                  <p>
                    Bisnis layanan Manajemen Sumber Daya Manusia kami dimulai pada tahun 2001 bersamaan dengan permintaan pasar akan kebutuhan penyediaan sumber daya manusia. Komitmen kami terhadap keunggulan dan didukung dengan sistem yang selalu mengikuti perubahan teknologi terkini, memastikan penyediaan tenaga kerja terampil untuk berbagai industri dan perusahaan.
                  </p>
                </div>
              </div>
              
              {/* Vision & Mission */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl shadow-lg border border-blue-200">
                {/* Vision */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-blue-800 mb-4">Visi</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Menjadi mitra terkemuka, memberikan solusi bisnis yang efisien, handal, dan berkelanjutan
                  </p>
                </div>
                
                {/* Mission */}
                <div>
                  <h3 className="text-2xl font-bold text-blue-800 mb-4">Misi</h3>
                  <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                    <p>
                      Memberikan layanan yang berkualitas, terampil, dan berkomitmen dalam berbagai bidang bisnis, seperti sumber daya manusia, keuangan, TI, dan lainnya untuk memenuhi kebutuhan klien
                    </p>
                    <p>
                      Mengoptimalkan efisiensi operasional dan produktivitas klien dengan solusi yang disesuaikan dan terkini serta berfokus pada inovasi teknologi dan proses untuk peningkatan kualitas layanan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-bold text-gray-800 mb-4" style={{fontSize: '25px'}}>Mitra</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                We're proud to work with companies of all sizes, from startups to Fortune 500 enterprises, helping them achieve their digital transformation goals.
              </p>
            </div>
            
            {/* Carousel with arrows */}
            <div className="relative">
              <button onClick={prevSlide} className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg border border-gray-200 z-10 hover:bg-gray-50">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="overflow-hidden mx-16">
                <div className="flex space-x-4 transition-transform duration-300 ease-in-out" style={{transform: `translateX(-${(currentIndex + partners.length) * 25}%)`}}>
                  {infinitePartners.map((partner, index) => (
                    <div key={`${partner.id}-${Math.floor(index / partners.length)}`} className="bg-white p-8 rounded-lg shadow-md border border-gray-200 flex-shrink-0" style={{width: 'calc(25% - 12px)'}}>
                      <div className="h-20 bg-gray-200 rounded mb-6 flex items-center justify-center">
                        <span className="text-gray-500 font-bold text-lg">{partner.logo}</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 text-center text-lg">{partner.name}</h3>
                    </div>
                  ))}
                </div>
              </div>
              
              <button onClick={nextSlide} className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg border border-gray-200 z-10 hover:bg-gray-50">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-bold text-gray-800 mb-4" style={{fontSize: '25px'}}>Core Values</h2>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-shadow duration-300 text-center border-2 border-gray-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">Integrity</h3>
                <p className="text-gray-600 text-sm">Maintaining honesty and strong moral principles in all our actions</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-shadow duration-300 text-center border-2 border-gray-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">Excellence</h3>
                <p className="text-gray-600 text-sm">Striving for the highest quality in everything we deliver</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-shadow duration-300 text-center border-2 border-gray-300">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">Collaboration</h3>
                <p className="text-gray-600 text-sm">Working together to achieve common goals and shared success</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-shadow duration-300 text-center border-2 border-gray-300">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">Innovation</h3>
                <p className="text-gray-600 text-sm">Embracing creativity and new ideas to drive continuous improvement</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      

      
      <Footer />
    </main>
  );
}
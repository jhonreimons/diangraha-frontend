"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer/Footer";
import { useState, useEffect } from "react";

export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  const partners = [
    { id: 1, name: "Tech Solutions Inc", logo: "LOGO 1" },
    { id: 2, name: "Digital Innovations", logo: "LOGO 2" },
    { id: 3, name: "Global Enterprises", logo: "LOGO 3" },
    { id: 4, name: "Smart Systems", logo: "LOGO 4" },
    { id: 5, name: "Future Corp", logo: "LOGO 5" },
    { id: 6, name: "Innovation Hub", logo: "LOGO 6" },
  ];

  const totalSlides = Math.ceil(partners.length / itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  return (
    <main>
      <Navbar />
      <div className="min-h-screen">
      <section className="relative w-full h-[420px] md:h-[520px] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="relative z-20 flex justify-center">
          <span className="inline-block px-6 py-3 rounded-md 
                          text-gray-50 text-3xl md:text-4xl font-bold 
                          bg-gradient-to-r from-indigo-500/60 to-purple-500/60 
                          backdrop-blur-sm shadow-md">
            About Us
          </span>
        </div>
      </section>

        {/* Company Description */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="font-bold text-gray-800 mb-8 text-3xl">
                  PT. Dian Graha Elektrika
                </h2>
                <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                  <p>
                    Sejak berdirinya pada tahun 1977, PT. Dian Graha Elektrika
                    telah menjadi salah satu perusahaan nasional yang kokoh
                    hingga saat ini...
                  </p>
                  <p>
                    Bisnis layanan Manajemen Sumber Daya Manusia kami dimulai
                    pada tahun 2001 bersamaan dengan permintaan pasar...
                  </p>
                </div>
              </div>

              {/* Vision & Mission */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl shadow-lg border border-blue-200">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-blue-800 mb-4">Visi</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Menjadi mitra terkemuka, memberikan solusi bisnis yang
                    efisien, handal, dan berkelanjutan
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-800 mb-4">Misi</h3>
                  <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                    <p>
                      Memberikan layanan yang berkualitas, terampil, dan
                      berkomitmen dalam berbagai bidang bisnis...
                    </p>
                    <p>
                      Mengoptimalkan efisiensi operasional dan produktivitas
                      klien dengan solusi yang disesuaikan...
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
              <h2 className="font-bold text-gray-800 mb-4 text-2xl">Mitra</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                We're proud to work with companies of all sizes, from startups
                to Fortune 500 enterprises, helping them achieve their digital
                transformation goals.
              </p>
            </div>

            <div className="relative flex items-center justify-center">
              {/* Left Button */}
              <button
                onClick={prevSlide}
                className="absolute -left-4 sm:-left-6 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100 transition z-20"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Carousel */}
              <div className="overflow-hidden w-full sm:w-4/5">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${
                      currentIndex * (100 / itemsPerView)
                    }%)`,
                  }}
                >
                  {partners.map((partner) => (
                    <div
                      key={partner.id}
                      className="p-2 flex-shrink-0"
                      style={{ width: `${100 / itemsPerView}%` }}
                    >
                      <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md mx-auto">
                        {/* Lebar card diperbesar mendekati Core Values */}
                        <div className="h-16 bg-gray-200 rounded mb-4 flex items-center justify-center">
                          <span className="text-gray-500 font-bold text-base sm:text-lg">
                            {partner.logo}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                          {partner.name}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Button */}
              <button
                onClick={nextSlide}
                className="absolute -right-4 sm:-right-6 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100 transition z-20"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-bold text-gray-800 mb-4 text-2xl">
                Core Values
              </h2>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  ✅
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">
                  Integrity
                </h3>
                <p className="text-gray-600 text-sm">
                  Maintaining honesty and strong moral principles...
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  🚀
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">
                  Excellence
                </h3>
                <p className="text-gray-600 text-sm">
                  Striving for the highest quality in everything...
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  🤝
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">
                  Collaboration
                </h3>
                <p className="text-gray-600 text-sm">
                  Working together to achieve common goals...
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  💡
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">
                  Innovation
                </h3>
                <p className="text-gray-600 text-sm">
                  Embracing creativity and new ideas...
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}

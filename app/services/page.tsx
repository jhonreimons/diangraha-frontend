"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer/Footer";

export default function ServicesPage() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 py-12 md:py-16 lg:py-20 bg-gradient-to-r from-gray-100 to-gray-200">
            {/* Left Content */}
            <div className="max-w-2xl mb-12 md:mb-0 md:mr-12">
              <h1 className="font-bold text-gray-800 mb-6 leading-tight" style={{fontSize: '30px'}}>Our Services</h1>
              <p className="text-gray-600 text-xl mb-8 leading-relaxed">
                We provide comprehensive solutions to help your business grow and succeed in today's competitive market. Our experienced team delivers quality services tailored to meet your specific needs and requirements with excellence and reliability.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300">
                Our Client
              </button>
            </div>
            
            {/* Right Image */}
            <div className="flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" 
                alt="Business Team" 
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
        </section>

        {/* Services Content */}
        <section id="services" className="py-16 bg-gray-50">
          {/* See More Link */}
          <div className="pb-8 text-center">
            <a href="#services-grid" className="text-blue-500 hover:text-blue-700 text-lg font-medium inline-flex items-center gap-2 transition-colors duration-300">
              See more our service
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </section>

        {/* Consultation Section */}
        <section 
          className="py-24 px-4"
          style={{
            background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)'
          }}
        >
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-[35px] font-bold mb-8">
              Need Expert Advice? It's Free!
            </h2>
            <p className="text-[25px] mb-8 leading-relaxed">
              We'll help you find the right strategy to achieve better results—simple, effective, and personalized.
            </p>
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl">
              Consult Now
            </button>
          </div>
        </section>

        {/* Outsourcing Section */}
        <section className="py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              {/* Left Content */}
              <div className="max-w-2xl">
                <h2 className="text-[30px] font-bold text-gray-800 mb-6">
                  Outsourcing
                </h2>
                <h3 className="text-[25px] font-semibold text-gray-700 mb-6 leading-relaxed">
                  Solusi tenaga kerja profesional untuk mendukung bisnis Anda dan mendorong pertumbuhan perusahaan.
                </h3>
                <p className="text-[20px] text-gray-600 leading-relaxed mb-8">
                  Biarkan kebutuhan HR dan tenaga kerja Anda ditangani oleh para ahli. Kurangi risiko kesalahan, hemat waktu, biaya, dan sumber daya. Serahkan operasional Anda kepada kami, sehingga Anda dapat lebih fokus pada tujuan utama bisnis.
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-2">
                  View More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Right Image */}
              <div className="flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80" 
                  alt="Outsourcing Team" 
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Digital Solutions Section */}
        <section className="py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              {/* Left Content */}
              <div className="max-w-2xl">
                <h2 className="text-[30px] font-bold text-gray-800 mb-6">
                  Digital Solutions
                </h2>
                <h3 className="text-[25px] font-semibold text-gray-700 mb-6 leading-relaxed">
                  Transformasi digital yang inovatif untuk mengoptimalkan efisiensi operasional perusahaan Anda.
                </h3>
                <p className="text-[20px] text-gray-600 leading-relaxed mb-8">
                  Manfaatkan teknologi terdepan untuk mengotomatisasi proses bisnis, meningkatkan produktivitas, dan menciptakan pengalaman pelanggan yang luar biasa. Solusi digital kami dirancang khusus untuk memenuhi kebutuhan unik industri Anda.
                </p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-2">
                  View More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Right Image */}
              <div className="flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80" 
                  alt="Digital Solutions" 
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

      </div>
      
      <Footer />
    </main>
  );
}
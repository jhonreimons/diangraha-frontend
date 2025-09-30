import Image from "next/image";

export default function AboutUsHome() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            About Us
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Membangun masa depan yang lebih baik melalui inovasi dan dedikasi
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-20">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
                PT. Dian Graha Elektrika
              </h3>
              <div className="w-16 h-1 bg-blue-600 mb-6"></div>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Sejak berdirinya pada tahun <span className="font-semibold text-blue-600">1977</span>, PT. Dian Graha Elektrika telah
                menjadi salah satu perusahaan nasional yang kokoh hingga saat ini,
                dengan memanfaatkan keahlian dan sumber dayanya untuk
                memprioritaskan penyediaan layanan berkualitas tinggi dan membina
                hubungan pelanggan yang berkesinambungan.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Bisnis layanan Manajemen Sumber Daya Manusia kami dimulai pada tahun
                <span className="font-semibold text-blue-600"> 2001</span> bersamaan dengan permintaan pasar akan kebutuhan penyediaan
                sumber daya manusia. Komitmen kami terhadap keunggulan dan didukung
                dengan sistem yang selalu mengikuti perubahan teknologi terkini,
                memastikan penyediaan tenaga kerja terampil untuk berbagai industri
                dan perusahaan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 text-lg font-medium hover:shadow-xl">
                Learn More
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 text-lg font-medium">
                Our Services
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
                alt="About Us Team"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 w-full"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100 rounded-full opacity-50 z-0"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-50 rounded-full opacity-30 z-0"></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-t border-gray-200">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">47+</div>
            <div className="text-gray-600 font-medium">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600 font-medium">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">100+</div>
            <div className="text-gray-600 font-medium">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600 font-medium">Support Available</div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-12 mt-20">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              Menjadi perusahaan terdepan dalam penyediaan solusi teknologi dan sumber daya manusia yang inovatif dan berkelanjutan.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              Memberikan layanan berkualitas tinggi dengan mengutamakan kepuasan pelanggan dan mengembangkan solusi yang berkelanjutan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
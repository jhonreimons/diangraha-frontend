"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer/Footer";

export default function OutsourcingPage() {
  return (
    <main className="bg-gray-50">
      <Navbar />

      {/* ===== Hero Section ===== */}
      <section className="py-10 px-6 md:px-12 lg:px-20 bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="max-w-xl md:flex-1 text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Outsourcing Service
            </h1>
            <p className="text-gray-700 leading-relaxed mb-4">
              Kami menyediakan layanan outsourcing yang fleksibel dan efisien
              untuk membantu perusahaan Anda fokus pada bisnis inti. Dengan
              tenaga ahli yang berpengalaman, kami memastikan kualitas kerja
              yang konsisten, biaya operasional lebih terkontrol, serta dukungan
              penuh sesuai kebutuhan Anda.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Dengan tenaga ahli yang berpengalaman, kami memastikan kualitas
              kerja yang konsisten, biaya operasional lebih terkontrol, serta
              dukungan penuh sesuai kebutuhan Anda.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium shadow-md hover:shadow-lg transition">
              Contact Us
            </button>
          </div>

          {/* Right Image */}
          <div className="md:flex-1 flex justify-end">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
              alt="Outsourcing Meeting"
              className="w-full md:w-4/5 h-64 md:h-72 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            The Features of Manpower Outsourcing
          </h2>

          <div className="space-y-10">
            {/* Card 1 */}
            <div className="rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="bg-blue-700 px-6 py-4 rounded-t-lg">
                <h3 className="text-xl font-semibold text-white">
                  Efisiensi Biaya
                </h3>
              </div>
              <div className="px-6 py-8">
                <p className="text-base text-gray-700 leading-relaxed">
                  Memungkinkan perusahaan untuk mengakses layanan ahli tanpa
                  harus menanggung biaya penuh untuk mempekerjakan sumber daya
                  internal. Ini mencakup biaya pelatihan, manajemen, dan
                  infrastruktur.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="bg-blue-700 px-6 py-4 rounded-t-lg">
                <h3 className="text-xl font-semibold text-white">
                  Fokus pada Inti Bisnis
                </h3>
              </div>
              <div className="px-6 py-8">
                <p className="text-base text-gray-700 leading-relaxed">
                  Perusahaan dapat lebih fokus pada kegiatan bisnis inti mereka
                  tanpa harus terganggu oleh fungsi-fungsi pendukung.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="bg-blue-700 px-6 py-4 rounded-t-lg">
                <h3 className="text-xl font-semibold text-white">
                  Akses ke Keahlian Khusus
                </h3>
              </div>
              <div className="px-6 py-8">
                <p className="text-base text-gray-700 leading-relaxed">
                  Memungkinkan perusahaan mengakses keahlian khusus dari
                  penyedia layanan yang memiliki pengalaman dan pengetahuan
                  mendalam dalam bidang tertentu.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="bg-blue-700 px-6 py-4 rounded-t-lg">
                <h3 className="text-xl font-semibold text-white">
                  Fleksibilitas Tenaga Kerja
                </h3>
              </div>
              <div className="px-6 py-8">
                <p className="text-base text-gray-700 leading-relaxed">
                  Perusahaan dapat dengan mudah menyesuaikan skala tenaga kerja
                  mereka sesuai dengan kebutuhan proyek atau musiman tanpa harus
                  menghadapi tantangan merekrut dan memberhentikan karyawan
                  sendiri.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

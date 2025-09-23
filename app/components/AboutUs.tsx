import Image from "next/image";

export default function AboutUs() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        {/* Text Content */}
        <div>
          <h2 className="text-2xl font-bold mb-4">About US</h2>
          <h3 className="text-xl font-semibold mb-6">
            PT. Dian Graha Elektrika
          </h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Sejak berdirinya pada tahun 1977, PT. Dian Graha Elektrika telah
            menjadi salah satu perusahaan nasional yang kokoh hingga saat ini,
            dengan memanfaatkan keahlian dan sumber dayanya untuk
            memprioritaskan penyediaan layanan berkualitas tinggi dan membina
            hubungan pelanggan yang berkesinambungan.
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Bisnis layanan Manajemen Sumber Daya Manusia kami dimulai pada tahun
            2001 bersamaan dengan permintaan pasar akan kebutuhan penyediaan
            sumber daya manusia. Komitmen kami terhadap keunggulan dan didukung
            dengan sistem yang selalu mengikuti perubahan teknologi terkini,
            memastikan penyediaan tenaga kerja terampil untuk berbagai industri
            dan perusahaan.
          </p>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            Learn More
          </button>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <Image
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
            alt="About Us Team"
            width={600}
            height={400}
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    </section>
  );
}

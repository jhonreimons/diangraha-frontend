"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer/Footer";


export default function CareerPage() {
  return (
    <main className="bg-white">
      <Navbar />
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
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

  {/* Centered Text */}
  <div className="relative z-20 flex justify-center">
    <span className="inline-block px-6 py-3 rounded-md text-white text-3xl md:text-4xl font-extrabold 
                     bg-gradient-to-r from-indigo-600 to-violet-600/90 backdrop-blur-sm shadow-lg">
      Join Us
    </span>
  </div>
</section>


      {/* ===== WHY JOIN ===== */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-[28px] md:text-[30px] font-semibold text-gray-800 mb-4">
            Why Join DGE?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            At PT DGE, we foster innovation, growth, and a collaborative
            environment. Be part of a team that’s driving real impact.
          </p>
        </div>
      </section>

      {/* ===== JOB CARDS ===== */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* LinkedIn */}
          <a
            href="#"
            className="group bg-white border border-gray-200 rounded-xl p-8 text-center flex flex-col items-center
                       shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md"
              style={{ backgroundColor: "#0A66C2" }}
            >
              in
            </div>

            <h3 className="mt-6 text-lg font-semibold text-gray-800">Linkedin</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Explore our latest job openings and connect with our team on LinkedIn
            </p>

            <span className="mt-6 text-indigo-600 group-hover:text-indigo-700 inline-flex items-center gap-1 text-sm font-medium">
              View Job
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </a>

          {/* DGE Career Hub */}
          <a
            href="#"
            className="group bg-white border border-gray-200 rounded-xl p-8 text-center flex flex-col items-center
                      shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl shadow-md bg-emerald-600">
              👤
            </div>

            <h3 className="mt-6 text-lg font-semibold text-gray-800">DGE Career Hub</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Apply directly through our dedicated portal for a seamless experience
            </p>

            <span className="mt-6 text-indigo-600 group-hover:text-indigo-700 inline-flex items-center gap-1 text-sm font-medium">
              View Job
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </a>

          {/* JobStreet */}
          <a
            href="#"
            className="group bg-white border border-gray-200 rounded-xl p-8 text-center flex flex-col items-center
                       shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl shadow-md bg-orange-500">
              🔍
            </div>

            <h3 className="mt-6 text-lg font-semibold text-gray-800">JobStreet</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Browse and apply for roles on Indonesia’s leading job platform
            </p>

            <span className="mt-6 text-indigo-600 group-hover:text-indigo-700 inline-flex items-center gap-1 text-sm font-medium">
              View Job
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}

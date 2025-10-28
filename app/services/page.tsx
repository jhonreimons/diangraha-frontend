"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer/Footer";
import { motion } from "framer-motion";
import { API_BASE_URL, getImageUrl } from "@/lib/config";

interface Service {
  id: number;
  name: string;
  longDesc: string;
  imageUrl: string;
}

function generateSummary(text: string, maxLength = 100) {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return truncated.slice(0, lastSpace) + "...";
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/services`);
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-700">
          Loading services...
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="min-h-screen">
        {/* ===== Hero Section (lebih terang, lembut, natural) ===== */}
        <section className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 py-14 md:py-16 overflow-hidden bg-gradient-to-br from-[#d9e6fb] via-[#cfe3ff] to-[#bcdcff]">
          {/* Overlay putih lembut dengan opacity tinggi */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />

          {/* Efek cahaya lembut random */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-blue-400/20 rounded-full blur-[3px]"
              animate={{
                y: [0, -10, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}

          {/* Cahaya mengikuti kursor (lebih redup agar tidak dominan) */}
          <motion.div
            className="absolute w-[250px] h-[250px] rounded-full bg-blue-300/10 blur-3xl pointer-events-none"
            style={{
              left: mousePosition.x - 125,
              top: mousePosition.y - 125,
            }}
          />

          {/* Konten kiri */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="max-w-2xl mb-10 md:mb-0 md:mr-12 relative z-10 text-center md:text-left"
          >
            <h1 className="font-bold text-gray-800 mb-5 leading-tight text-[36px] md:text-[42px]">
              Our Services
            </h1>
            <p className="text-gray-700 text-lg md:text-xl mb-6 leading-relaxed text-justify">
              We provide comprehensive solutions to help your business grow and
              succeed in today's competitive market. Our experienced team delivers
              quality services tailored to meet your specific needs and requirements
              with excellence and reliability.
            </p>
            <Link href="/about#clients" scroll={true}>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#1E3A8A",
                  boxShadow: "0px 0px 25px rgba(30, 64, 175, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold 
                          hover:bg-blue-900 transition-all duration-300 shadow-md"
              >
                Our Clients
              </motion.button>
            </Link>
          </motion.div>

          {/* Gambar kanan */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative flex-shrink-0 w-full md:w-[350px] lg:w-[400px] xl:w-[420px] aspect-square z-10"
          >
            <img
              src="/OurServices.png"
              alt="Business Team"
              className="w-full h-full object-contain rounded-3xl shadow-2xl bg-white p-6"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-3xl"></div>
          </motion.div>
        </section>

        {/* ===== Dynamic Services ===== */}
        {services.map((service, index) => {
          const isEven = index % 2 === 0;
          const buttonClass = "bg-blue-600 hover:bg-blue-700";

          return (
            <motion.section
              key={service.id}
              id={service.name.toLowerCase().replace(/\s+/g, "-")}
              className="py-12 md:py-14 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-[#f5f8ff] via-[#edf3ff] to-[#e7efff]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="max-w-7xl mx-auto">
                <div
                  className={`flex flex-col md:flex-row items-center justify-between gap-10 ${
                    !isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Teks */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="max-w-2xl"
                  >
                    <h2 className="text-[30px] font-bold text-gray-800 mb-5">
                      {service.name}
                    </h2>
                    <p className="text-[18px] text-gray-600 leading-relaxed mb-7 text-justify">
                      {generateSummary(service.longDesc, 255)}
                    </p>
                    <Link
                      href={`/service/${encodeURIComponent(
                        service.name.toLowerCase().replace(/\s+/g, "-")
                      )}`}
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`${buttonClass} text-white bg-blue-800 hover:bg-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-md inline-flex items-center gap-2`}
                      >
                        View More
                        <svg
                          className="w-5 h-5 transition-transform duration-300"
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
                      </motion.button>
                    </Link>
                  </motion.div>

                  {/* Gambar */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                    className="relative flex-shrink-0 w-full md:w-[400px] lg:w-[450px]"
                  >
                    <img
                      src={getImageUrl(service.imageUrl)}
                      alt={service.name}
                      className="w-full h-auto max-h-[380px] object-contain rounded-2xl shadow-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent rounded-2xl"></div>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          );
        })}
      </div>
      <Footer />
    </main>
  );
}

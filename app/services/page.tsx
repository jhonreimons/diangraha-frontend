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

  // Parallax light effect
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
        {/* ===== Hero Section ===== */}
        <section className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 py-20 bg-gradient-to-r from-gray-100 via-white to-gray-100 overflow-hidden">
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-white opacity-60"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 15,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            style={{ backgroundSize: "200% 200%" }}
          />

          {/* Floating lights */}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-blue-500/20 rounded-full blur-[2px]"
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
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

          {/* Light following cursor */}
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none"
            style={{
              left: mousePosition.x - 150,
              top: mousePosition.y - 150,
            }}
          />

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="max-w-2xl mb-12 md:mb-0 md:mr-12 relative z-10 text-center md:text-left"
          >
            <h1 className="font-bold text-gray-800 mb-6 leading-tight text-[36px] md:text-[42px]">
              Our Services
            </h1>
            <p className="text-gray-600 text-lg md:text-xl mb-8 leading-relaxed text-justify">
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

          {/* Right Image (Square & Proportional) */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative flex-shrink-0 w-full md:w-[350px] lg:w-[400px] xl:w-[420px] aspect-square"
          >
            <img
              src="/OurServices.png"
              alt="Business Team"
              className="w-full h-full object-contain rounded-3xl shadow-2xl bg-white p-6"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-3xl"></div>
          </motion.div>
        </section>

        {/* ===== See More Link ===== */}
        <section id="services" className="py-16 bg-gray-50">
          <div className="pb-8 text-center">
            <a
              href="#services-grid"
              className="text-blue-600 hover:text-blue-800 text-lg font-medium inline-flex items-center gap-2 transition-colors duration-300"
            >
              See more our service
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
            </a>
          </div>
        </section>

        {/* ===== Dynamic Services ===== */}
        {services.map((service, index) => {
          const isEven = index % 2 === 0;
          const bgClass = isEven
            ? "from-blue-50 to-indigo-100"
            : "from-white to-indigo-100";
          const buttonClass = "bg-blue-600 hover:bg-blue-700";

          return (
            <motion.section
              key={service.id}
              id={service.name.toLowerCase().replace(/\s+/g, "-")}
              className={`py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-br ${bgClass}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="max-w-7xl mx-auto">
                <div
                  className={`flex flex-col md:flex-row items-center justify-between gap-12 ${
                    !isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Text */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="max-w-2xl"
                  >
                    <h2 className="text-[30px] font-bold text-gray-800 mb-6">
                      {service.name}
                    </h2>
                    <p className="text-[18px] text-gray-600 leading-relaxed mb-8 text-justify">
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
                        className={`${buttonClass} text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-md inline-flex items-center gap-2`}
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

                  {/* Image */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                    className="relative flex-shrink-0 w-full md:w-[400px] lg:w-[450px]"
                  >
                    <img
                      src={getImageUrl(service.imageUrl)}
                      alt={service.name}
                      className="w-full h-auto max-h-[400px] object-contain rounded-2xl shadow-xl"
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

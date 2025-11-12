"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer/Footer";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { SERVER_BASE_URL } from "@/lib/config";

interface Client {
  id: number;
  name: string;
  imageUrl: string | null;
}

/*  Detect base64 or URL */
const resolveBase64Image = (image?: string | null) => {
  if (!image) return "/placeholder.png";

  const trimmed = image.trim();
  if (trimmed.startsWith("data:image")) return trimmed;
  if (/^[A-Za-z0-9+/=]+$/.test(trimmed)) return `data:image/jpeg;base64,${trimmed}`;
  return trimmed;
};

export default function AboutPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const totalWidthRef = useRef(0);
  const [scrollSpeed, setScrollSpeed] = useState(60);

  /*  Fetch Clients */
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch(`${SERVER_BASE_URL}/api/clients`, {
          headers: { Accept: "*/*" },
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`Failed to fetch clients: ${res.status}`);

        const data = await res.json();
        setClients(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  /*  Responsive scroll speed */
  useEffect(() => {
    const updateSpeed = () => {
      if (window.innerWidth < 640) setScrollSpeed(45);
      else if (window.innerWidth < 1024) setScrollSpeed(55);
      else setScrollSpeed(70);
    };
    updateSpeed();
    window.addEventListener("resize", updateSpeed);
    return () => window.removeEventListener("resize", updateSpeed);
  }, []);

  /*  Infinite Scroll Animation */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || clients.length < 4) return;

    const updateWidth = () => {
      totalWidthRef.current = container.scrollWidth / 2;
    };

    updateWidth();
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      positionRef.current += (scrollSpeed * delta) / 1000;

      if (positionRef.current >= totalWidthRef.current) {
        positionRef.current -= totalWidthRef.current;
      }

      container.style.transform = `translate3d(-${positionRef.current.toFixed(2)}px,0,0)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    window.addEventListener("resize", updateWidth);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", updateWidth);
    };
  }, [clients, scrollSpeed]);

  const duplicatedClients = [...clients, ...clients];

  return (
    <main>
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-[420px] md:h-[620px] flex items-center justify-center overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="/about.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="relative z-20 flex justify-center">
          <span className="inline-block px-6 py-3 rounded-md text-white text-3xl md:text-4xl font-extrabold 
                   bg-gradient-to-r from-indigo-29 to-violet-60 backdrop-blur-sm shadow-lg">
            About Us
          </span>
        </div>
      </section>

      <div className="min-h-screen">

        {/* ===== COMPANY INFO ===== */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-bold text-gray-800 mb-6 text-3xl">PT Dian Graha Elektrika</h2>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed text-justify">
                <p>
                  Established in 1977, PT Dian Graha Elektrika became one of the most solid national companies until now, by utilizing our expertise and resources to prioritize high-quality services and foster existing customer relationships.
                </p>
                <p>
                  Our human resource management services business began in 2001 in response to market demand for human resource service. Our commitment to excellence, supported by systems that stay shoulder to shoulder with the latest technological changes, ensures the services of skilled manpower for various industries and companies.
                </p>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-blue-200">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50 opacity-95"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.6),_transparent_60%)]"></div>
              <div className="relative p-8 z-10">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Vision</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-8 text-justify">
                  Becoming a leading partner and providing efficient & sustainable solutions.
                </p>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Mission</h3>
                <ul className="text-gray-700 text-lg leading-relaxed list-disc ml-5 space-y-3 text-justify">
                  <li>Providing high-quality, skilled, committed services in various industries.</li>
                  <li>Optimizing operational efficiency with technological innovation.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===== OUR CLIENTS ===== */}
        <section id="clients" className="py-16 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative">

            <div className="text-center mb-12">
              <h2 className="font-bold text-gray-800 mb-4 text-2xl">Our Clients</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Trusted by companies of all sizes to achieve growth and digital transformation.
              </p>
            </div>

            {loading ? (
              <div className="text-center text-gray-500 py-8">Loading clients...</div>
            ) : clients.length < 4 ? (
              <div className="flex justify-center gap-8 flex-wrap">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="bg-white p-6 rounded-xl shadow-md w-64 min-h-[230px] flex flex-col justify-between items-center
                    hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    style={{ border: "1px solid transparent" }}
                  >
                    <div className="h-24 flex items-center justify-center w-full mb-4">
                      <Image
                        src={resolveBase64Image(client.imageUrl)}
                        alt={client.name}
                        width={120}
                        height={120}
                        className="object-contain max-h-20"
                        unoptimized
                      />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-center text-base leading-snug break-words">
                      {client.name}
                    </h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative w-full overflow-hidden">
                <div
                  ref={containerRef}
                  className="flex gap-8 will-change-transform"
                >
                  {[...duplicatedClients].map((client, index) => (
                    <div
                      key={client.id + "-" + index}
                      className="flex-shrink-0 bg-white p-6 rounded-xl shadow-md w-64 min-h-[230px] flex flex-col justify-between items-center
                      hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
                      style={{ border: "1px solid transparent" }}
                    >
                      <div className="h-24 flex items-center justify-center w-full mb-4">
                        <Image
                          src={resolveBase64Image(client.imageUrl)}
                          alt={client.name}
                          width={120}
                          height={120}
                          className="object-contain max-h-20"
                          unoptimized
                        />
                      </div>
                      <h3 className="font-semibold text-gray-800 text-center text-base leading-snug break-words">
                        {client.name}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ===== CORE VALUES (unchanged) ===== */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-bold text-gray-800 mb-4 text-2xl">Core Values</h2>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  title: "Integrity",
                  desc: "We maintain high standards of honesty and responsibility in every decision and action.",
                  icon: "scale",
                  bg: "bg-blue-100",
                },
                {
                  title: "Innovative",
                  desc: "We continuously seek new ways to improve.",
                  icon: "light-bulb",
                  bg: "bg-yellow-100",
                },
                {
                  title: "Efficient",
                  desc: "We deliver the best results using time and resources optimally.",
                  icon: "bolt",
                  bg: "bg-green-100",
                },
                {
                  title: "Collaborative",
                  desc: "By fostering open communication and mutual respect, we build strong partnerships.",
                  icon: "users",
                  bg: "bg-purple-100",
                },
              ].map((val, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-center border border-transparent hover:border-blue-200 flex flex-col"
                >
                  <div className={`${val.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <img
                      src={`https://unpkg.com/heroicons@2.0.18/24/solid/${val.icon}.svg`}
                      alt="core value icon"
                      className="w-8 h-8"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">{val.title}</h3>
                  <p className="text-gray-600 text-sm">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

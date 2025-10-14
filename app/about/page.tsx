"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer/Footer";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Client {
  id: number;
  name: string;
  imageUrl: string;
}

export default function AboutPage() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("http://103.103.20.23:8080/api/clients");
        if (!res.ok) throw new Error("Failed to fetch clients");
        const data = await res.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setClients([]);
      }
    };
    fetchClients();
  }, []);

  // Gandakan klien agar animasi seamless
  const duplicatedClients = [...clients, ...clients];

  return (
    <main>
      <Navbar />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative w-full h-[420px] md:h-[520px] flex items-center justify-center overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src="/background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative z-20 flex justify-center">
            <span className="inline-block px-6 py-3 rounded-md 
                             text-gray-50 text-3xl md:text-4xl font-bold 
                             bg-white/20 backdrop-blur-md shadow-lg border border-white/30">
              About Us
            </span>
          </div>
        </section>

        {/* Company Info */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-bold text-gray-800 mb-8 text-3xl">
                PT. Dian Graha Elektrika
              </h2>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  Established in 1977, PT. Dian Graha Elektrika became one of the most
                  solid national companies until now, by utilizing our expertise and
                  resources to prioritize high-quality services and foster existing
                  customer relationships.
                </p>
                <p>
                  Our human resource management services business began in 2001 in
                  response to market demand for human resource service. Our commitment
                  to excellence, supported by systems that stay shoulder to shoulder
                  with the latest technological changes, ensures the services of skilled
                  manpower for various industries and companies.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl shadow-lg border border-blue-200">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Visi</h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                Becoming a leading partner and providing efficient, reliable, and sustainable business solutions.
              </p>
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Misi</h3>
              <ul className="text-gray-700 text-lg leading-relaxed list-disc ml-5 space-y-3">
                <li>
                  Providing high-quality, skilled, committed services in various industries, including HR, finance, and IT.
                </li>
                <li>
                  Optimizing operational efficiency and focusing on technological innovation to improve service quality.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Our Clients Section */}
        <section className="py-16 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center mb-12">
              <h2 className="font-bold text-gray-800 mb-4 text-2xl">Our Clients</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                We are proud to work with companies of all sizes — from startups to enterprises — helping them achieve their goals with trust and excellence.
              </p>
            </div>

            {clients.length < 4 ? (
              // Center jika data < 4
              <div className="flex justify-center gap-8 flex-wrap">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-100 w-64 min-h-[230px] flex flex-col justify-between items-center"
                  >
                    <div className="h-24 flex items-center justify-center w-full mb-4">
                      <Image
                        src={client.imageUrl}
                        alt={client.name}
                        width={120}
                        height={120}
                        className="object-contain max-h-20"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-center text-base leading-snug line-clamp-2 break-words w-full">
                      {client.name}
                    </h3>
                  </div>
                ))}
              </div>
            ) : (
              // Infinite scrolling carousel
              <div className="w-full overflow-hidden">
                <div className="flex gap-8 animate-marquee will-change-transform">
                  {duplicatedClients.map((client, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-500 border border-gray-100 hover:border-blue-200 w-64 min-h-[230px] flex flex-col justify-between items-center"
                    >
                      <div className="h-24 flex items-center justify-center w-full mb-4">
                        <Image
                          src={client.imageUrl}
                          alt={client.name}
                          width={120}
                          height={120}
                          className="object-contain max-h-20"
                        />
                      </div>
                      <h3
                        className="font-semibold text-gray-800 text-center text-base leading-snug line-clamp-2 break-words w-full"
                        title={client.name}
                      >
                        {client.name}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Core Values Section */}
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
                  desc: "We continuously seek new ways to improve, adapt, and lead in a rapidly changing environment.",
                  icon: "light-bulb",
                  bg: "bg-yellow-100",
                },
                {
                  title: "Efficient",
                  desc: "We deliver the best results using time and resources optimally, ensuring measurable value.",
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
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-center border border-gray-100 hover:border-blue-200 flex flex-col"
                >
                  <div
                    className={`${val.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <img
                      src={`https://unpkg.com/heroicons@2.0.18/24/solid/${val.icon}.svg`}
                      alt={`${val.title} Icon`}
                      className="w-8 h-8"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">
                    {val.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                    {val.desc}
                  </p>
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

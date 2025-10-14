"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer/Footer";
import { getImageUrl } from "@/lib/config";

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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://103.103.20.23:8080/api/services");
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

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div>Loading services...</div>
        </div>
        <Footer />
      </main>
    );
  }

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
              <button
                className="bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold 
                          hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 
                          hover:shadow-lg min-w-[20px] shadow-md"
              >
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
            <Link href="/contact">
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                Consult Now
              </button>
            </Link>
          </div>
        </section>

        {/* Services Sections */}
        {services.map((service, index) => {
          const isEven = index % 2 === 0;
          const bgClass = isEven ? "from-blue-50 to-indigo-100" : "from-white to-indigo-100";
          const buttonClass = isEven ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700";

          return (
            <section key={service.id} id={service.name.toLowerCase().replace(/\s+/g, '-')} className={`py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-br ${bgClass}`}>
              <div className="max-w-7xl mx-auto">
                <div className={`flex flex-col md:flex-row items-center justify-between gap-12 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                  {/* Content */}
                  <div className="max-w-2xl">
                    <h2 className="text-[30px] font-bold text-gray-800 mb-6">
                      {service.name}
                    </h2>
                    <p className="text-[20px] text-gray-600 leading-relaxed mb-8">
                      {generateSummary(service.longDesc, 255)}
                    </p>
                    <Link href={`/service/${encodeURIComponent(service.name.toLowerCase().replace(/\s+/g, '-'))}`}>
                    <button
                      className={`${buttonClass} bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold text-lg 
                                  transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md 
                                  hover:bg-blue-900 min-w-[20px] inline-flex items-center justify-center gap-2`}
                    >
                      View More
                      <svg
                        className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
                    </Link>
                  </div>

                  {/* Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={getImageUrl(service.imageUrl)}
                      alt={service.name}
                      className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </section>
          );
        })}

      </div>
      
      <Footer />
    </main>
  );
}
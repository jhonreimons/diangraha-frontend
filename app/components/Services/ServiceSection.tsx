"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/config";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Service {
  id: number;
  name: string;
  shortDesc: string;
  longDesc: string;
  imageUrl: string;
}

function generateSummary(text: string, maxLength = 100) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return truncated.slice(0, lastSpace) + "...";
}

export default function ServiceSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

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

  // Responsiveness
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(4);
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.ceil(services.length / itemsPerView) - 1;

  const next = () => setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  const prev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-bold text-gray-800 mb-4 text-[25px]">Our Services</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-8">
            Comprehensive business solutions tailored to your needs.
          </p>
          <div className="text-gray-500">Loading services...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-bold text-gray-800 mb-4 text-[25px]">Our Services</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Comprehensive business solutions tailored to your needs.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center">
          {/* Left Arrow */}
          {services.length > itemsPerView && (
            <button
              onClick={prev}
              className="absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-3 shadow-xl hover:bg-blue-50 hover:scale-105 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
          )}

          {/* Scroll Container */}
          <div className="overflow-hidden mx-8 sm:mx-16">
            <div
              className={`flex transition-transform duration-700 ease-in-out ${services.length < itemsPerView ? "justify-center" : ""
                }`}
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex-shrink-0 px-3 flex"
                  style={{
                    width: `${100 / itemsPerView}%`,
                    maxWidth: itemsPerView === 1 ? "280px" : "100%",
                  }}
                >
                  <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col justify-between h-full min-h-[340px] hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:border-blue-300 group">
                    <div>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        {service.imageUrl ? (
                          <img
                            src={getImageUrl(service.imageUrl)}
                            alt={service.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="bg-blue-600 text-white font-bold text-lg w-full h-full flex items-center justify-center">
                            {service.name?.[0] || "S"}
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-800 text-lg mb-3">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {generateSummary(service.longDesc)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          {services.length > itemsPerView && (
            <button
              onClick={next}
              className="absolute -right-6 sm:-right-8 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-3 shadow-xl hover:bg-blue-50 hover:scale-105 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          )}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-block bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold 
               hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 
               hover:shadow-lg min-w-[200px]"
          >
            View All Services
          </Link>
        </div>

      </div>
    </section>
  );
}

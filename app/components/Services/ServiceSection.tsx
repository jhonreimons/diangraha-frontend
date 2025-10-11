"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/config";

interface Service {
  id: number;
  name: string;
  shortDesc: string;
  longDesc: string;
  imageUrl: string;
}

function generateSummary(text: string, maxLength = 100) {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return truncated.slice(0, lastSpace) + "...";
}

const ServiceSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://103.103.20.23:8080/api/services");
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        // If only one service, don't duplicate; else duplicate for infinite scroll
        if (data.length === 1) {
          setServices(data);
        } else {
          setServices([...data, ...data]);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Auto scroll effect (only if multiple services)
  useEffect(() => {
    if (services.length <= 1) return;

    const interval = setInterval(() => {
      const container = document.querySelector('.services-scroll') as HTMLElement;
      if (container) {
        container.scrollLeft += 2; // Smooth scroll by 2px
        // Reset when halfway through duplicated list
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
    }, 50); // Every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [services.length]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-bold text-gray-800 mb-4" style={{fontSize: '25px'}}>Our Services</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Comprehensive business solutions tailored to your needs.
            </p>
          </div>
          <div className="text-center">Loading services...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-bold text-gray-800 mb-4" style={{fontSize: '25px'}}>Our Services</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Comprehensive business solutions tailored to your needs.
          </p>
        </div>

        <div
          className={`flex gap-8 overflow-x-auto pb-4 services-scroll cursor-grab active:cursor-grabbing ${services.length <= 4 ? 'justify-center' : ''}`}
          onMouseDown={(e) => {
            setIsDragging(true);
            setStartX(e.clientX);
            const container = e.currentTarget;
            setScrollLeft(container.scrollLeft);
          }}
          onMouseMove={(e) => {
            if (!isDragging) return;
            e.preventDefault();
            const container = e.currentTarget;
            const x = e.clientX;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            container.scrollLeft = scrollLeft - walk;
          }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          <style jsx>{`
            .services-scroll::-webkit-scrollbar {
              display: none;
            }
            .services-scroll {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          {services.map((service, index) => (
            <div key={`${service.id}_${index}`} className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 text-center border border-gray-200 hover:border-blue-300 transform hover:-translate-y-2 hover:scale-105 group flex-shrink-0 w-64">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                <img src={getImageUrl(service.imageUrl)} alt={service.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg mb-3">{service.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{generateSummary(service.longDesc)}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;

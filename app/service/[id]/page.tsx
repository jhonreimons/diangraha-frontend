"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import { getImageUrl } from "@/lib/config";

interface Feature {
  id: number;
  featureName: string;
  featureDesc: string;
}

interface Service {
  id: number;
  name: string;
  longDesc: string;
  imageUrl: string;
  features: Feature[];
}

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.id as string;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const decodedSlug = decodeURIComponent(slug);
      fetch('/api/services')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(services => {
          const found = services.find((s: Service) => s.name.toLowerCase().replace(/\s+/g, '-') === decodedSlug);
          if (found) {
            setService({
              ...found,
              features: Array.isArray(found.features) ? found.features : []
            });
          } else {
            setService(null);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching service:", err);
          setLoading(false);
        });
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="bg-gray-50">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div>Loading service...</div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!service) {
    return (
      <main className="bg-gray-50">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div>Service not found</div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-gray-50">
      <Navbar />

      {/* ===== Hero Section ===== */}
      <section className="py-10 px-6 md:px-12 lg:px-20 bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="max-w-xl md:flex-1 text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {service.name}
            </h1>
            <p className="text-gray-700 leading-relaxed mb-6" style={{ whiteSpace: 'pre-wrap' }}>
              {service.longDesc}
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium shadow-md hover:shadow-lg transition">
              Contact Us
            </button>
          </div>

          {/* Right Image */}
          <div className="md:flex-1 flex justify-end">
            <img
              src={getImageUrl(service.imageUrl)}
              alt={service.name}
              className="w-full md:w-4/5 h-64 md:h-72 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            The Features of Manpower {service.name}
          </h2>

          <div className="space-y-10">
            {service.features.map((feature) => (
              <div key={feature.id} className="rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="bg-blue-700 px-6 py-4 rounded-t-lg">
                  <h3 className="text-xl font-semibold text-white">
                    {feature.featureName}
                  </h3>
                </div>
                <div className="px-6 py-8">
                  <p className="text-base text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                    {feature.featureDesc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

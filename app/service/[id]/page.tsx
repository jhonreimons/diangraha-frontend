"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import { getImageUrl, SERVER_BASE_URL } from "@/lib/config";

interface Work {
  id: number;
  description: string;
}

interface SubService {
  id: number;
  name: string;
  description: string;
  works: Work[];
}

interface Feature {
  id: number;
  featureName: string;
  featureDesc: string;
}

interface Service {
  id: number;
  name: string;
  shortDesc: string;
  longDesc: string;
  imageUrl: string;
  features: Feature[];
  subServices: SubService[];
}

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.id as string;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchServiceData = async () => {
      try {
        setLoading(true);
        const decodedSlug = decodeURIComponent(slug);

        const res = await fetch(`${SERVER_BASE_URL}/api/services`, {
          headers: { Accept: "*/*" },
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        const found = data.find(
          (s: Service) =>
            s.name.toLowerCase().replace(/\s+/g, "-") === decodedSlug
        );

        if (found) {
          setService({
            id: found.id,
            name: found.name ?? "Unnamed Service",
            shortDesc: found.shortDesc ?? "",
            longDesc: found.longDesc ?? "",
            imageUrl: found.imageUrl ?? "",
            features: Array.isArray(found.features)
              ? found.features.map((f: Feature) => ({
                  id: f.id,
                  featureName: f.featureName ?? "Unnamed Feature",
                  featureDesc: f.featureDesc ?? "",
                }))
              : [],
            subServices: Array.isArray(found.subServices)
              ? found.subServices.map((sub: SubService) => ({
                  id: sub.id,
                  name: sub.name ?? "Unnamed Sub Service",
                  description: sub.description ?? "",
                  works: Array.isArray(sub.works)
                    ? sub.works.map((w: Work) => ({
                        id: w.id,
                        description: w.description ?? "",
                      }))
                    : [],
                }))
              : [],
          });
        } else {
          setService(null);
        }
      } catch (err) {
        console.error("Error fetching service:", err);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [slug]);

  // 🌀 Loading State
  if (loading) {
    return (
      <main className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Loading service...</p>
        </div>
        <Footer />
      </main>
    );
  }

  // ❌ Service not found
  if (!service) {
    return (
      <main className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Service not found</p>
        </div>
        <Footer />
      </main>
    );
  }

  // ✅ Main Content
  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Wrapper agar konten mendorong footer ke bawah */}
      <div className="flex-grow flex flex-col">

        {/* ===== Hero Section ===== */}
        <section className="py-12 px-6 md:px-12 lg:px-20 bg-gradient-to-r from-gray-100 to-gray-200 flex-shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="max-w-xl md:flex-1 text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {service.name}
              </h1>
                <p
                  className="text-gray-700 leading-relaxed mb-6 text-center"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {service.longDesc}
                </p>

              <button
                className="bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold text-base 
                            hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 
                            shadow-md hover:shadow-lg min-w-[200px]"
              >
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

        {/* ===== Our Sub Services Section ===== */}
        {service.subServices && service.subServices.length > 0 && (
          <section className="bg-white py-20 px-6 md:px-12 lg:px-24 flex-shrink-0">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
                Our Services
              </h2>

              <div className="space-y-16">
                {service.subServices.map((sub, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-8"
                  >
                    <h3 className="text-2xl font-semibold text-blue-900 mb-3">
                      {sub.name}
                    </h3>
                    <p className="text-gray-700 mb-6">{sub.description}</p>

                    {sub.works && sub.works.length > 0 && (
                      <>
                        <h4 className="text-xl font-semibold text-gray-800 mb-3">
                          Our Work
                        </h4>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                          {sub.works.map((work, idx) => (
                            <li key={idx}>{work.description}</li>
                          ))}
                        </ol>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== Features Section ===== */}
        {service.features && service.features.length > 0 && (
          <section className="py-20 bg-blue-50 flex-shrink-0">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
                Features of {service.name}
              </h2>

              <div className="flex flex-col gap-10">
                {service.features.map((feature) => (
                  <div
                    key={feature.id}
                    className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md bg-white transition-all duration-300"
                  >
                    <div className="bg-blue-700 px-6 py-4 rounded-t-xl">
                      <h3 className="text-xl font-semibold text-white">
                        {feature.featureName}
                      </h3>
                    </div>
                    <div className="px-6 py-6">
                      <p
                        className="text-gray-700 leading-relaxed"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {feature.featureDesc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Footer tetap di bawah */}
      <Footer />
    </main>
  );
}

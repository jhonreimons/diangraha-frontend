"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import Link from "next/link";
import { SERVER_BASE_URL } from "@/lib/config";

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
  imageUrl: string | null;
  features: Feature[];
  subServices: SubService[];
}

const resolveBase64Image = (image?: string | null) => {
  if (!image) return "/placeholder.png";
  const trimmed = image.trim();
  if (trimmed.startsWith("data:image")) return trimmed;
  if (/^[A-Za-z0-9+/=]+$/.test(trimmed)) return `data:image/jpeg;base64,${trimmed}`;
  return trimmed;
};

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceId) return;

    const fetchServiceData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${SERVER_BASE_URL}/api/services/${serviceId}`, {
          headers: { Accept: "*/*" },
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        setService({
          id: data.id,
          name: data.name ?? "Unnamed Service",
          shortDesc: data.shortDesc ?? "",
          longDesc: data.longDesc ?? "",
          imageUrl: data.imageUrl || null,
          features: Array.isArray(data.features)
            ? data.features.map((f: Feature) => ({
                id: f.id,
                featureName: f.featureName ?? "",
                featureDesc: f.featureDesc ?? "",
              }))
            : [],
          subServices: Array.isArray(data.subServices)
            ? data.subServices.map((sub: SubService) => ({
                id: sub.id,
                name: sub.name ?? "",
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
      } catch (err) {
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [serviceId]);

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

  if (!service) {
    return (
      <main className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center text-gray-600">
          Service not found
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-grow flex flex-col">

        <section className="relative py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-r from-blue-50 via-blue-100 to-indigo-100 overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 opacity-70" />

          <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
            
            <div className="max-w-xl md:flex-1 text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">{service.name}</h1>
              <p className="text-gray-700 leading-relaxed mb-6 text-justify" style={{ whiteSpace: "pre-wrap" }}>
                {service.longDesc}
              </p>

              <Link href="/contact">
                <button className="bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg min-w-[200px]">
                  Contact Us
                </button>
              </Link>
            </div>

            <div className="md:flex-1 flex justify-end">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full md:w-[90%] h-64 md:h-96">
                <img
                  src={resolveBase64Image(service.imageUrl)}
                  alt={service.name}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {service.subServices.length > 0 && (
          <section className="bg-white py-20 px-6 md:px-12 lg:px-24 flex-shrink-0">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
                Our Services
              </h2>

              <div className="space-y-5">
                {service.subServices.map((sub) => (
                  <div key={sub.id} className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-8">
                    <h3 className="text-2xl font-semibold text-blue-900 mb-3">{sub.name}</h3>
                    <p className="text-gray-700 mb-6 text-justify">{sub.description}</p>

                    {sub.works.length > 0 && (
                      <>
                        <h4 className="text-xl font-semibold text-gray-800 mb-3">Our Work</h4>
                        <ol className="list-decimal list-inside space-y-1 text-gray-700">
                          {sub.works.map((work) => (
                            <li key={work.id}>{work.description}</li>
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

        {service.features.length > 0 && (
          <section className="py-20 bg-blue-50 flex-shrink-0">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
                Features of {service.name} Service
              </h2>

              <div className="flex flex-col gap-10">
                {service.features.map((feature) => (
                  <div key={feature.id} className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md bg-white transition-all duration-300">
                    <div className="bg-blue-700 px-6 py-4 rounded-t-xl">
                      <h3 className="text-xl font-semibold text-white">{feature.featureName}</h3>
                    </div>
                    <div className="px-6 py-6">
                      <p className="text-gray-700 text-justify leading-relaxed">{feature.featureDesc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Client {
  id: number;
  name: string;
  img: string;
  description?: string;
  website?: string;
}

interface ApiClient {
  id: number;
  name: string;
  imageUrl: string;
  description?: string;
  website?: string;
}

export default function ClientsSection() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  // Ambil data client dari API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://103.103.20.23:8080/api/clients", {
          headers: { Accept: "*/*" },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        // Map ke struktur frontend
        const mappedClients: Client[] = data.map((item: ApiClient) => ({
          id: item.id,
          name: item.name,
          img: item.imageUrl,
          description: item.description,
          website: item.website,
        }));

        setClients(mappedClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Update responsif jumlah item tampil
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

  const maxIndex = Math.ceil(clients.length / itemsPerView) - 1;
  const next = () => setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  const prev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));

  return (
    <section className="py-20 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center">
        <h2 className="font-bold mb-6 text-gray-800 text-[25px]">Our Clients</h2>
        <p className="text-gray-600 py-6 mb-8 max-w-4xl mx-auto leading-relaxed text-[18px]">
          Trusted by companies of all sizes to achieve growth and digital transformation
        </p>

        {loading ? (
          <div className="text-gray-500">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="text-gray-500">No clients found.</div>
        ) : (
          <div className="relative mt-8">
            {/* Left Arrow */}
            {clients.length > itemsPerView && (
              <button
                onClick={prev}
                className="absolute -left-10 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-3 shadow-xl hover:bg-blue-50 hover:scale-110 transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
            )}

            {/* Carousel Container */}
            <div className="overflow-hidden mx-8 sm:mx-16">
              <div
                className={`flex transition-transform duration-700 ease-in-out ${
                  clients.length < itemsPerView ? "justify-center" : ""
                }`}
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                }}
              >
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="flex-shrink-0 px-3"
                    style={{
                      width: `${100 / itemsPerView}%`,
                      maxWidth: itemsPerView === 1 ? "280px" : "100%",
                    }}
                  >
                    <div
                      className="bg-white border border-gray-200 rounded-lg shadow-md p-6 h-[250px] flex flex-col justify-between 
                                 items-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:border-blue-300"
                    >
                      <div className="flex justify-center items-center h-[150px] w-full">
                        {client.img ? (
                          <Image
                            src={client.img}
                            alt={client.name}
                            width={120}
                            height={120}
                            className="object-contain max-h-[120px]"
                          />
                        ) : (
                          <div className="h-[120px] w-[120px] flex items-center justify-center bg-gray-100 rounded-md text-gray-500 text-sm">
                            No Image
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-gray-800 text-sm mt-4">{client.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            {clients.length > itemsPerView && (
              <button
                onClick={next}
                className="absolute -right-10 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-3 shadow-xl hover:bg-blue-50 hover:scale-110 transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

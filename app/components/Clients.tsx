"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SERVER_BASE_URL, getImageUrl } from "@/lib/config";

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
  imageUrl: string | null;
  description?: string;
  website?: string;
}

export default function ClientsSection() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // ✅ Ganti ke SERVER_BASE_URL agar pasti ke backend
        const response = await fetch(`${SERVER_BASE_URL}/api/clients`, {
          headers: { Accept: "*/*" },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiClient[] = await response.json();

        // Map data
        const mappedClients: Client[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          img: getImageUrl(item.imageUrl || "/placeholder.png"),
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

  // Responsif
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

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 text-center">
        <p className="text-gray-500">Loading clients...</p>
      </section>
    );
  }

  if (clients.length === 0) {
    return (
      <section className="py-20 bg-gray-50 text-center">
        <p className="text-gray-500">No clients found.</p>
      </section>
    );
  }

  const repeatedClients = [...clients, ...clients];

  return (
    <section className="py-20 md:py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-10 text-center">
        <h2 className="font-bold mb-6 text-gray-800 text-[25px]">Our Clients</h2>
        <p className="text-gray-600 py-6 mb-8 max-w-4xl mx-auto leading-relaxed text-[18px]">
          Trusted by companies of all sizes to achieve growth and digital transformation
        </p>

        {clients.length < 4 ? (
          // Static grid
          <div className="flex justify-center flex-wrap gap-6">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-5 w-[200px] h-[220px] flex flex-col justify-between items-center hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-center items-center h-[100px] w-full">
                  <Image
                    src={client.img}
                    alt={client.name}
                    width={100}
                    height={100}
                    className="object-contain max-h-[80px]"
                    unoptimized
                  />
                </div>
                <p className="font-semibold text-gray-800 text-sm mt-2 text-center">
                  {client.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          // Infinite carousel
          <div className="relative w-full overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

            <div
              className="flex gap-6 animate-smoothCarousel will-change-transform"
              style={{ animationDuration: `${clients.length * 2.5}s` }}
            >
              {repeatedClients.map((client, index) => (
                <div
                  key={`${client.id}-${index}`}
                  className="flex-shrink-0 w-[22%] min-w-[180px] max-w-[220px]"
                >
                  <div className="bg-white border border-gray-200 rounded-lg shadow-md p-5 h-[220px] flex flex-col justify-between items-center hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-300">
                    <div className="flex justify-center items-center h-[100px] w-full">
                      <Image
                        src={client.img}
                        alt={client.name}
                        width={100}
                        height={100}
                        className="object-contain max-h-[80px]"
                        unoptimized
                      />
                    </div>
                    <p className="font-semibold text-gray-800 text-sm mt-2 text-center">
                      {client.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes smoothCarousel {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .animate-smoothCarousel {
          display: flex;
          width: 200%;
          animation-name: smoothCarousel;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-direction: normal;
          animation-fill-mode: forwards;
          will-change: transform;
        }

        .animate-smoothCarousel:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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
  const [itemsPerView, setItemsPerView] = useState(4);

  // Fetch data
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://103.103.20.23:8080/api/clients", {
          headers: { Accept: "*/*" },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

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

  // Responsif jumlah card per view
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

        {/* Jika data < 4 → tampilkan statis di tengah */}
        {clients.length < 4 ? (
          <div className="flex justify-center flex-wrap gap-6">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-5 w-[200px] h-[220px] flex flex-col justify-between items-center hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-center items-center h-[100px] w-full">
                  {client.img ? (
                    <Image
                      src={client.img}
                      alt={client.name}
                      width={100}
                      height={100}
                      className="object-contain max-h-[80px]"
                    />
                  ) : (
                    <div className="h-[80px] w-[80px] flex items-center justify-center bg-gray-100 rounded-md text-gray-500 text-sm">
                      No Image
                    </div>
                  )}
                </div>
                <p className="font-semibold text-gray-800 text-sm mt-2 text-center">{client.name}</p>
              </div>
            ))}
          </div>
        ) : (
          // Infinite scroll jika data >= 4
          <div className="relative w-full overflow-hidden">
            {/* Fade kiri-kanan */}
            <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

            <div
              className="flex gap-6 animate-carousel will-change-transform"
              style={{
                animationDuration: `${clients.length * 3}s`,
              }}
            >
              {repeatedClients.map((client, index) => (
                <div
                  key={`${client.id}-${index}`}
                  className="flex-shrink-0 w-[22%] min-w-[180px] max-w-[220px]"
                >
                  <div className="bg-white border border-gray-200 rounded-lg shadow-md p-5 h-[220px] flex flex-col justify-between items-center hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-blue-300">
                    <div className="flex justify-center items-center h-[100px] w-full">
                      {client.img ? (
                        <Image
                          src={client.img}
                          alt={client.name}
                          width={100}
                          height={100}
                          className="object-contain max-h-[80px]"
                        />
                      ) : (
                        <div className="h-[80px] w-[80px] flex items-center justify-center bg-gray-100 rounded-md text-gray-500 text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-gray-800 text-sm mt-2 text-center">{client.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CSS Animasi */}
      <style jsx>{`
        @keyframes carousel {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-carousel {
          display: flex;
          width: 200%;
          animation: carousel linear infinite;
        }

        .animate-carousel:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

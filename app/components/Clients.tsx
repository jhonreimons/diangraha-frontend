"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { SERVER_BASE_URL } from "@/lib/config";

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
  const [scrollSpeed, setScrollSpeed] = useState(60);
  const [isMounted, setIsMounted] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const contentWidthRef = useRef(0);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchClients = async () => {
      try {
        const res = await fetch(`${SERVER_BASE_URL}/api/clients`, {
          headers: { Accept: "*/*" },
          cache: "no-store",
        });

        const data: ApiClient[] = await res.json();

        const mapped: Client[] = data.map((d) => ({
          id: d.id,
          name: d.name,
          img: d.imageUrl
            ? d.imageUrl.startsWith("http")
              ? d.imageUrl
              : `${SERVER_BASE_URL}${d.imageUrl.startsWith("/") ? "" : "/"}${d.imageUrl}`
            : "/placeholder.png",
          description: d.description,
          website: d.website,
        }));

        setClients(mapped);
      } catch (err) {
        console.error("Error fetching clients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const updateSpeed = () => {
      if (window.innerWidth < 640) setScrollSpeed(45);
      else if (window.innerWidth < 1024) setScrollSpeed(55);
      else setScrollSpeed(70);
    };
    updateSpeed();

    window.addEventListener("resize", updateSpeed);
    return () => window.removeEventListener("resize", updateSpeed);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || clients.length === 0) return;

    const track = trackRef.current;
    if (!track) return;

    let lastTime = performance.now();

    const updateWidth = () => {
      contentWidthRef.current = track.scrollWidth / 2;
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);

    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      positionRef.current += (scrollSpeed * delta) / 1000;

      if (positionRef.current >= contentWidthRef.current) {
        positionRef.current -= contentWidthRef.current;
      }

      track.style.transform = `translate3d(-${positionRef.current.toFixed(2)}px, 0, 0)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", updateWidth);
    };
  }, [clients, scrollSpeed, isMounted]);

  if (!isMounted) {
    return (
      <section className="py-20 bg-gray-50 text-center">
        <p className="text-gray-400 text-sm">Loading clients...</p>
      </section>
    );
  }

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
          <div className="flex justify-center flex-wrap gap-6">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-5 w-[200px] h-[220px]
                           flex flex-col justify-between items-center hover:shadow-xl transition-all duration-300"
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
                <p className="font-semibold text-gray-800 text-sm mt-2 text-center">{client.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative w-full overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

            <div
              ref={trackRef}
              className="flex gap-6 will-change-transform"
              style={{
                transform: "translate3d(0,0,0)",
                transition: "none",
                backfaceVisibility: "hidden",
                WebkitFontSmoothing: "antialiased",
              }}
            >
              {repeatedClients.map((client, index) => (
                <div
                  key={`${client.id}-${index}`}
                  className="flex-shrink-0 w-[22%] min-w-[180px] max-w-[220px]"
                >
                  <div
                    className="bg-white border border-gray-200 rounded-lg shadow-md p-5 h-[220px]
                               flex flex-col justify-between items-center hover:shadow-lg transition-transform
                               duration-300 hover:scale-105 hover:border-blue-300"
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

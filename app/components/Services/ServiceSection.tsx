"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  imageUrl: string; // berisi Base64 string dari backend
  features: Feature[];
}

export default function ServiceSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [cardMinHeight, setCardMinHeight] = useState<number | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/services`, {
          headers: { Accept: "*/*" },
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch services");
        const data: Service[] = await res.json();

        const normalized = (data || []).map((s) => ({
          id: s.id,
          name: s.name ?? "",
          shortDesc: s.shortDesc ?? "",
          longDesc: s.longDesc ?? "",
          imageUrl: s.imageUrl ?? "",
          features: Array.isArray(s.features) ? s.features : [],
        }));

        setServices(normalized);
      } catch (err) {
        console.error("Error fetching services:", err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Responsive items per view
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

  // Measure layout dynamically
  useLayoutEffect(() => {
    const measure = () => {
      const el = viewportRef.current;
      const vw = el ? el.clientWidth : 0;
      setViewportWidth(vw);
      const iw = vw ? vw / itemsPerView : 0;
      setItemWidth(iw);
      setContainerWidth(iw * services.length);
    };

    measure();
    const ro = new ResizeObserver(() => measure());
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [itemsPerView, services.length]);

  // Keep currentIndex in range
  useEffect(() => {
    const maxIndex = Math.max(0, Math.ceil(services.length / itemsPerView) - 1);
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [services.length, itemsPerView]);

  const maxIndex = Math.max(0, Math.ceil(services.length / itemsPerView) - 1);
  const next = () => setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : maxIndex));
  const prev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));

  // Measure card heights for uniform layout
  useLayoutEffect(() => {
    if (!cardRefs.current || cardRefs.current.length === 0) {
      setCardMinHeight(null);
      return;
    }

    const measureHeights = () => {
      let maxH = 0;
      for (let i = 0; i < cardRefs.current.length; i++) {
        const el = cardRefs.current[i];
        if (el) {
          const h = el.offsetHeight;
          if (h > maxH) maxH = h;
        }
      }
      if (maxH > 0) setCardMinHeight(maxH);
      else setCardMinHeight(null);
    };

    measureHeights();

    const imgs: HTMLImageElement[] = [];
    cardRefs.current.forEach((el) => {
      if (!el) return;
      const found = Array.from(el.querySelectorAll("img"));
      found.forEach((img) => {
        if (!img.complete) imgs.push(img);
      });
    });

    if (imgs.length > 0) {
      let loaded = 0;
      const onLoad = () => {
        loaded += 1;
        if (loaded === imgs.length) measureHeights();
      };
      imgs.forEach((img) => {
        img.addEventListener("load", onLoad);
        img.addEventListener("error", onLoad);
      });
      return () => {
        imgs.forEach((img) => {
          img.removeEventListener("load", onLoad);
          img.removeEventListener("error", onLoad);
        });
      };
    }
  }, [services, viewportWidth, itemsPerView]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-bold text-gray-800 mb-4 text-[25px]">Our Services</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-8">
            Specialized business solutions designed to meet your unique needs
          </p>
          <div className="text-gray-500">Loading services...</div>
        </div>
      </section>
    );
  }

  // Calculate horizontal translation
  const rawTranslate = -currentIndex * viewportWidth;
  const maxTranslate = Math.min(0, viewportWidth - (containerWidth || 0));
  const translatePx = containerWidth
    ? Math.max(maxTranslate, Math.min(0, rawTranslate))
    : 0;

  return (
    <section className="py-16 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* ===== Section Header ===== */}
        <div className="text-center mb-12">
          <h2 className="font-bold text-gray-800 mb-4 text-[25px]">Our Services</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Specialized business solutions designed to meet your unique needs
          </p>
        </div>

        {/* ===== Carousel Section ===== */}
        <div className="relative flex items-center justify-center">
          {services.length > itemsPerView && (
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 z-10 
                         bg-white border border-gray-200 rounded-full p-3 shadow-xl 
                         hover:bg-blue-50 hover:scale-105 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
          )}

          {/* Viewport */}
          <div ref={viewportRef} className="overflow-hidden mx-6 sm:mx-12 w-full" style={{ minHeight: 340 }}>
            <div
              ref={containerRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                width: containerWidth || "auto",
                transform: `translateX(${translatePx}px)`,
              }}
            >
              {services.map((service, idx) => (
                <div
                  key={service.id}
                  className="flex-shrink-0 px-3"
                  style={{
                    width: itemWidth || "100%",
                  }}
                >
                  <div
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    className="w-full"
                  >
                    <div
                      className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col justify-between h-full 
                                 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 
                                 hover:border-blue-300 group"
                      style={{
                        minHeight: cardMinHeight ? `${cardMinHeight}px` : undefined,
                      }}
                    >
                      <div>
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                          {service.imageUrl ? (
                            <img
                              src={
                                service.imageUrl.startsWith("data:")
                                  ? service.imageUrl
                                  : `data:image/jpeg;base64,${service.imageUrl}`
                              }
                              alt={service.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="bg-blue-600 text-white font-bold text-lg w-full h-full flex items-center justify-center">
                              {service.name?.[0] ?? "S"}
                            </div>
                          )}
                        </div>

                        <h3 className="font-semibold text-gray-800 text-lg mb-3 text-center break-words">
                          {service.name}
                        </h3>

                        <p className="text-gray-600 text-sm leading-relaxed text-center break-words whitespace-pre-line">
                          {service.shortDesc && service.shortDesc.trim() !== ""
                            ? service.shortDesc
                            : "No short description available."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {services.length > itemsPerView && (
            <button
              onClick={next}
              aria-label="Next"
              className="absolute -right-6 sm:-right-8 top-1/2 -translate-y-1/2 z-10 
                         bg-white border border-gray-200 rounded-full p-3 shadow-xl 
                         hover:bg-blue-50 hover:scale-105 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          )}
        </div>

        {/* ===== View All Button ===== */}
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

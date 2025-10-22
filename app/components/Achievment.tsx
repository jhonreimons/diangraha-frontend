"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { achievementsAPI } from "@/lib/api";
import { getImageUrl } from "@/lib/config";

interface Award {
  id: number;
  title: string;
  imageUrl?: string;
}

export default function AchievementSection() {
  const [achievements, setAchievements] = useState<Award[]>([]);
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

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await achievementsAPI.fetchAchievements();
        const mapped: Award[] = data.map((a) => ({
          id: a.id,
          title: a.title ?? "",
          imageUrl: a.imageUrl ? getImageUrl(a.imageUrl) : "",
        }));
        setAchievements(mapped);
      } catch (err) {
        console.error("Error fetching achievements:", err);
        setAchievements([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

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

  useLayoutEffect(() => {
    const measure = () => {
      const vw = viewportRef.current?.clientWidth || 0;
      setViewportWidth(vw);
      const iw = vw / itemsPerView;
      setItemWidth(iw);
      setContainerWidth(iw * achievements.length);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [itemsPerView, achievements.length]);

  useEffect(() => {
    const maxIndex = Math.max(0, Math.ceil(achievements.length / itemsPerView) - 1);
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [achievements.length, itemsPerView]);

  const maxIndex = Math.max(0, Math.ceil(achievements.length / itemsPerView) - 1);
  const next = () => setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : maxIndex));
  const prev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));

  useLayoutEffect(() => {
    if (!cardRefs.current.length) return;
    const measureHeights = () => {
      let maxH = 0;
      for (const el of cardRefs.current) {
        if (el) {
          const h = el.offsetHeight;
          if (h > maxH) maxH = h;
        }
      }
      setCardMinHeight(maxH > 0 ? maxH : null);
    };
    measureHeights();
  }, [achievements, viewportWidth, itemsPerView]);

  if (loading) {
    return (
      <section className="py-20 bg-white text-center">
        <h2 className="font-bold text-gray-800 mb-4 text-[25px]">Achievement</h2>
        <p className="text-gray-600 text-lg">Loading achievements...</p>
      </section>
    );
  }

  const rawTranslate = -currentIndex * viewportWidth;
  const maxTranslate = Math.min(0, viewportWidth - containerWidth);
  const translatePx = containerWidth
    ? Math.max(maxTranslate, Math.min(0, rawTranslate))
    : 0;

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-12">
          <h2 className="font-bold text-gray-800 mb-4 text-[25px]">Achievement</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            A proud testament to our unwavering dedication, innovation and consistent growth
            throughout the years.
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          {achievements.length > itemsPerView && (
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

          <div
            ref={viewportRef}
            className="overflow-hidden mx-6 sm:mx-12 w-full"
            style={{ minHeight: 320 }}
          >
            <div
              ref={containerRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                width: containerWidth || "auto",
                transform: `translateX(${translatePx}px)`,
              }}
            >
              {achievements.map((award, idx) => (
                <div
                  key={award.id}
                  className="flex-shrink-0 px-3"
                  style={{
                    width: itemWidth || "100%",
                  }}
                >
                  <div ref={(el) => (cardRefs.current[idx] = el)} className="w-full">
                    <div
                      className="bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col justify-between h-full 
                                 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 
                                 hover:border-blue-300 group"
                      style={{
                        minHeight: cardMinHeight ? `${cardMinHeight}px` : undefined,
                      }}
                    >
                      <div className="flex flex-col items-center justify-center">
                        {/* Updated Image Container */}
                        <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mb-4 overflow-hidden p-3">
                          {award.imageUrl ? (
                            <Image
                              src={award.imageUrl}
                              alt={award.title}
                              width={110}
                              height={110}
                              className="object-contain"
                            />
                          ) : (
                            <div className="bg-blue-600 text-white text-xl font-bold w-full h-full flex items-center justify-center">
                              🏅
                            </div>
                          )}
                        </div>

                        <p className="text-gray-800 font-medium text-center text-sm leading-relaxed">
                          {award.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {achievements.length > itemsPerView && (
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
      </div>
    </section>
  );
}

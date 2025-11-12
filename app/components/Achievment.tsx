"use client";

import { useEffect, useRef, useState, useLayoutEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { achievementsAPI } from "@/lib/api";
import { SERVER_BASE_URL } from "@/lib/config";

type ApiAchievement = {
  id: number;
  name?: string | null;
  title?: string | null;
  imageUrl?: string | null;
  createdAt?: string | null;
};

export default function AchievementSection() {
  const [achievements, setAchievements] = useState<ApiAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [viewportWidth, setViewportWidth] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [cardMinHeight, setCardMinHeight] = useState<number | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data: ApiAchievement[] = await achievementsAPI.fetchAchievements();
        setAchievements(Array.isArray(data) ? data : []);
      } catch {
        setAchievements([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const formattedAchievements = useMemo(() => {
    return achievements.map((a) => ({
      id: a.id,
      title: (a.name ?? a.title ?? "").toString(),
      imageUrl: a.imageUrl
        ? a.imageUrl.startsWith("http")
          ? a.imageUrl
          : `${SERVER_BASE_URL}${a.imageUrl}`
        : "",
      createdAt: a.createdAt ?? "",
    }));
  }, [achievements]);

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
      setContainerWidth(iw * formattedAchievements.length);
    };
    measure();

    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [itemsPerView, formattedAchievements.length]);

  useLayoutEffect(() => {
    if (!cardRefs.current.length) return;
    let maxH = 0;
    cardRefs.current.forEach((el) => {
      if (el && el.offsetHeight > maxH) maxH = el.offsetHeight;
    });
    setCardMinHeight(maxH > 0 ? maxH : null);
  }, [formattedAchievements, viewportWidth, itemsPerView]);

  if (loading) {
    return (
      <section className="py-20 bg-white text-center">
        <h2 className="font-bold text-gray-800 mb-4 text-[25px]">Achievement</h2>
        <p className="text-gray-600 text-lg">Loading achievements...</p>
      </section>
    );
  }

  const maxIndex = Math.max(0, Math.ceil(formattedAchievements.length / itemsPerView) - 1);
  const rawTranslate = -currentIndex * viewportWidth;
  const translatePx = containerWidth
    ? Math.max(Math.min(0, rawTranslate), viewportWidth - containerWidth)
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
          {formattedAchievements.length > itemsPerView && (
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              aria-label="Previous"
              className="absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-3 shadow-xl hover:bg-blue-50 hover:scale-105 transition-all duration-300"
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
              {formattedAchievements.map((award, idx) => (
                <div
                  key={award.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: itemWidth || "100%" }}
                >
                <div ref={(el) => { cardRefs.current[idx] = el; }} className="w-full">
                    <div
                      className="bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col justify-between h-full hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:border-blue-300 group"
                      style={{
                        minHeight: cardMinHeight ? `${cardMinHeight}px` : undefined,
                      }}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-full h-28 flex items-center justify-center mb-4 overflow-hidden">
                          {award.imageUrl ? (
                            <img
                              loading="lazy"
                              src={award.imageUrl}
                              alt={award.title}
                              className="object-contain max-h-28"
                            />
                          ) : (
                            <div className="bg-blue-600 text-white text-xl font-bold w-24 h-24 flex items-center justify-center rounded-lg">
                              *
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

          {formattedAchievements.length > itemsPerView && (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))}
              aria-label="Next"
              className="absolute -right-6 sm:-right-8 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-3 shadow-xl hover:bg-blue-50 hover:scale-105 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

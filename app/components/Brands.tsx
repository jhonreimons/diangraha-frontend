"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Brand {
  id: number;
  name: string;
  img: string;
  description?: string;
  website?: string;
}

interface ApiBrand {
  id: number;
  name: string;
  logoUrl: string;
}

interface BrandsProps {
  brands?: Brand[];
}

const defaultBrands: Brand[] = [
  { id: 1, name: "Schneider Electric", img: "https://dummyimage.com/150x150/4f46e5/ffffff.png&text=Schneider" },
  { id: 2, name: "ABB", img: "https://dummyimage.com/150x150/dc2626/ffffff.png&text=ABB" },
  { id: 3, name: "Siemens", img: "https://dummyimage.com/150x150/059669/ffffff.png&text=Siemens" },
  { id: 4, name: "Legrand", img: "https://dummyimage.com/150x150/7c3aed/ffffff.png&text=Legrand" },
  { id: 5, name: "Eaton", img: "https://dummyimage.com/150x150/ea580c/ffffff.png&text=Eaton" },
  { id: 6, name: "Mitsubishi", img: "https://dummyimage.com/150x150/be123c/ffffff.png&text=Mitsubishi" },
  { id: 7, name: "Omron", img: "https://dummyimage.com/150x150/0891b2/ffffff.png&text=Omron" },
  { id: 8, name: "Phoenix Contact", img: "https://dummyimage.com/150x150/65a30d/ffffff.png&text=Phoenix" },
  { id: 9, name: "Weidmuller", img: "https://dummyimage.com/150x150/c2410c/ffffff.png&text=Weidmuller" },
  { id: 10, name: "Rittal", img: "https://dummyimage.com/150x150/1d4ed8/ffffff.png&text=Rittal" },
  { id: 11, name: "Fluke", img: "https://dummyimage.com/150x150/facc15/000000.png&text=Fluke" },
  { id: 12, name: "Danfoss", img: "https://dummyimage.com/150x150/374151/ffffff.png&text=Danfoss" },
];

export default function Brands({ brands: propBrands }: BrandsProps) {
  const [brands, setBrands] = useState<Brand[]>(defaultBrands);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [originalBrands, setOriginalBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("http://103.103.20.23:8080/api/brands");
        if (!response.ok) throw new Error("Failed to fetch brands");
        const data = await response.json();
        const mappedBrands: Brand[] = data.map((item: ApiBrand) => ({
          id: item.id,
          name: item.name,
          img: item.logoUrl,
        }));
        setOriginalBrands(mappedBrands);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setOriginalBrands(defaultBrands);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    setBrands(originalBrands);
  }, [originalBrands]);

  // Responsive layout
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

  const maxIndex = Math.ceil(brands.length / itemsPerView) - 1;

  const next = () => setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  const prev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));

  return (
    <section className="py-20 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center">
        <h2 className="font-bold mb-6 text-gray-800 text-[25px]">Our Brands</h2>
        <p className="text-gray-600 py-6 mb-8 max-w-4xl mx-auto leading-relaxed text-[18px]">
          We are proud to work with companies of all sizes, from startups to Fortune 500 enterprises.
        </p>

        <div className="relative mt-8">
          {/* Left Arrow */}
          {brands.length > itemsPerView && (
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
                brands.length < itemsPerView ? "justify-center" : ""
              }`}
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {brands.map((brand) => (
                <div
                  key={brand.id}
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
                      <Image
                        src={brand.img}
                        alt={brand.name}
                        width={120}
                        height={120}
                        className="object-contain max-h-[120px]"
                      />
                    </div>
                    <p className="font-semibold text-gray-800 text-sm mt-4">{brand.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          {brands.length > itemsPerView && (
            <button
              onClick={next}
              className="absolute -right-10 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-3 shadow-xl hover:bg-blue-50 hover:scale-110 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

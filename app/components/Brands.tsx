"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Brand {
    id: number;
    name: string;
    img: string;
    description?: string;
    website?: string;
}

interface BrandsProps {
    brands?: Brand[];
}

// Default data sebagai fallback
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

export default function Brands({ brands = defaultBrands }: BrandsProps) {
    const [index, setIndex] = useState(0);
    const itemsPerPage = 4;

    const maxIndex = Math.ceil(brands.length / itemsPerPage) - 1;

    const next = () => setIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
    const prev = () => setIndex((prev) => (prev > 0 ? prev - 1 : prev));

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <h2 className="text-2xl font-bold mb-2">Our Brands</h2>

                <div className="mt-8">
                    {/* Carousel wrapper */}
                    <div className="overflow-hidden rounded-lg">
                        <div 
                            className="flex transition-all duration-700 ease-in-out"
                            style={{ transform: `translateX(-${index * 100}%)` }}
                        >
                            {Array.from({ length: Math.ceil(brands.length / itemsPerPage) }).map((_, pageIndex) => (
                                <div key={pageIndex} className="grid grid-cols-2 md:grid-cols-4 gap-6 min-w-full px-2">
                                    {brands
                                        .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                                        .map((brand) => (
                                            <div key={brand.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                                <Image
                                                    src={brand.img}
                                                    alt={brand.name}
                                                    width={100}
                                                    height={100}
                                                    className="mx-auto mb-4"
                                                />
                                                <p className="font-semibold text-sm">{brand.name}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Buttons - Di bawah carousel dan center */}
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                            onClick={prev}
                            disabled={index === 0}
                            className="bg-white border-2 border-gray-200 rounded-full p-3 shadow-lg hover:bg-gray-50 hover:border-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={next}
                            disabled={index === maxIndex}
                            className="bg-white border-2 border-gray-200 rounded-full p-3 shadow-lg hover:bg-gray-50 hover:border-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
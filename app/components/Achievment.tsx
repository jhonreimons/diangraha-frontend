"use client";
import { useState } from "react";
import Image from "next/image";

interface Award {
    id: number;
    title: string;
    image?: string;
    description?: string;
}

interface AchievementProps {
    awards?: Award[];
}

// Default data sebagai fallback
const defaultAwards: Award[] = [
    { id: 1, title: "Award Best Partner", image: "https://dummyimage.com/80x80/ffd700/ffffff.png&text=🏅" },
    { id: 2, title: "Award Best Partner", image: "https://dummyimage.com/80x80/ffd700/ffffff.png&text=🏅" },
    { id: 3, title: "Award Best Partner", image: "https://dummyimage.com/80x80/ffd700/ffffff.png&text=🏅" },
    { id: 4, title: "Award Best Partner", image: "https://dummyimage.com/80x80/ffd700/ffffff.png&text=🏅" },
    { id: 5, title: "Award Best Partner", image: "https://dummyimage.com/80x80/ffd700/ffffff.png&text=🏅" },
    { id: 6, title: "Award Best Partner", image: "https://dummyimage.com/80x80/ffd700/ffffff.png&text=🏅" },
];

export default function Achievement({ awards = defaultAwards }: AchievementProps) {
    const [page, setPage] = useState(0);
    const itemsPerPage = 4; // tampil 4 card per halaman

    const totalPages = Math.ceil(awards.length / itemsPerPage);

    const prev = () => setPage((p) => (p > 0 ? p - 1 : totalPages - 1));
    const next = () => setPage((p) => (p < totalPages - 1 ? p + 1 : 0));

    return (
        <section className="px-8 py-16 text-center">
            <h2 className="text-2xl font-bold mb-2">Achievement</h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                A reflection of our dedication, innovation, and consistent growth throughout the years.
            </p>

            <div className="relative max-w-5xl mx-auto">
                {/* Carousel wrapper */}
                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${page * 100}%)` }}
                    >
                        {Array.from({ length: totalPages }).map((_, pageIndex) => (
                            <div key={pageIndex} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 min-w-full px-2">
                                {awards
                                    .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                                    .map((award) => (
                                        <div
                                            key={award.id}
                                            className="border rounded-xl shadow-md p-6 flex flex-col items-center bg-white"
                                        >
                                            <Image
                                                src={award.image || "https://dummyimage.com/80x80/ffd700/ffffff.png&text=🏅"}
                                                alt={award.title}
                                                width={80}
                                                height={80}
                                                className="mb-4"
                                            />
                                            <p className="font-medium">{award.title}</p>
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Left Button */}
                <button
                    onClick={prev}
                    className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-white border rounded-full p-2 shadow-md"
                >
                    ←
                </button>

                {/* Right Button */}
                <button
                    onClick={next}
                    className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-white border rounded-full p-2 shadow-md"
                >
                    →
                </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <span
                        key={i}
                        onClick={() => setPage(i)}
                        className={`h-3 w-3 rounded-full cursor-pointer ${i === page ? "bg-blue-600" : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}

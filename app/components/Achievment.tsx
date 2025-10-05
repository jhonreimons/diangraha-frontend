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
    { id: 1, title: "Award Best Partner 1", image: "https://dummyimage.com/80x80/ffd700/ffffff.png&text=🏅" },
    { id: 2, title: "Award Best Partner 2", image: "https://dummyimage.com/80x80/ff6b35/ffffff.png&text=🏆" },
    { id: 3, title: "Award Best Partner 3", image: "https://dummyimage.com/80x80/4ecdc4/ffffff.png&text=🥇" },
    { id: 4, title: "Award Best Partner 4", image: "https://dummyimage.com/80x80/45b7d1/ffffff.png&text=⭐" },
    { id: 5, title: "Award Best Partner 5", image: "https://dummyimage.com/80x80/f39c12/ffffff.png&text=🎖️" },
    { id: 6, title: "Award Best Partner 6", image: "https://dummyimage.com/80x80/27ae60/ffffff.png&text=🏵️" },
];

export default function Achievement({ awards = defaultAwards }: AchievementProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    const handleTransition = (newIndex: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(newIndex);
        
        // Reset transitioning state after animation
        setTimeout(() => {
            setIsTransitioning(false);
            
            // Handle infinite loop reset
            if (newIndex >= awards.length) {
                setCurrentIndex(0);
            } else if (newIndex < 0) {
                setCurrentIndex(awards.length - 1);
            }
        }, 700); // Match transition duration
    };
    
    const prev = () => {
        const newIndex = currentIndex === 0 ? awards.length - 1 : currentIndex - 1;
        handleTransition(newIndex);
    };

    const next = () => {
        const newIndex = currentIndex === awards.length - 1 ? 0 : currentIndex + 1;
        handleTransition(newIndex);
    };

    return (
        <section className="px-6 md:px-12 lg:px-20 py-20 md:py-24 text-center bg-white">
            <div className="max-w-7xl mx-auto">
                <h2 className="font-bold mb-6 text-gray-800" style={{fontSize: '25px'}}>Achievement</h2>
                <p className="text-lg md:text-xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
                    A reflection of our dedication, innovation, and consistent growth throughout the years.
                </p>

                <div className="relative">
                    {/* Carousel wrapper */}
                    <div className="overflow-hidden">
                        <div className="overflow-hidden">
                            <div 
                                className="flex transition-transform duration-700 ease-in-out"
                                style={{ transform: `translateX(-${currentIndex * (100 / 4)}%)` }}
                            >
                                {/* Duplicate awards untuk smooth infinite scroll */}
                                {[...awards, ...awards].map((award, index) => (
                                    <div 
                                        key={`${award.id}-${Math.floor(index / awards.length)}`} 
                                        className="flex-shrink-0 w-1/4 px-3"
                                    >
                                        <div className="border border-gray-200 rounded-xl shadow-md p-6 flex flex-col items-center bg-white hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-3 hover:border-blue-300 group">
                                            <Image
                                                src={award.image || "https://dummyimage.com/80x80/ffd700/ffffff.png&text=🏅"}
                                                alt={award.title}
                                                width={80}
                                                height={80}
                                                className="mb-4"
                                            />
                                            <p className="font-medium text-center">{award.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Left Button */}
                    <button
                        onClick={prev}
                        className="absolute top-1/2 -left-8 transform -translate-y-1/2 bg-white border-2 border-gray-200 rounded-full p-4 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 z-10"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Right Button */}
                    <button
                        onClick={next}
                        className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-white border-2 border-gray-200 rounded-full p-4 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 z-10"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center mt-6 space-x-2">
                    {awards.map((_, i) => (
                        <span
                            key={i}
                            onClick={() => !isTransitioning && handleTransition(i)}
                            className={`h-3 w-3 rounded-full cursor-pointer transition-all duration-300 ${
                                i === (currentIndex % awards.length) ? "bg-blue-600 scale-125" : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

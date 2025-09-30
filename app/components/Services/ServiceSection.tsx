"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

const services = [
    {
        id: 1,
        title: "Outsourcing",
        description: "Solusi teknologi yang handal untuk mendukung kelancaran operasional bisnis Anda.",
        icon: "https://dummyimage.com/64x64/3b82f6/ffffff.png&text=💼"
    },
    {
        id: 2,
        title: "Medical Equipment",
        description: "Peralatan medis berkualitas tinggi untuk mendukung layanan kesehatan terbaik.",
        icon: "https://dummyimage.com/64x64/10b981/ffffff.png&text=🏥"
    },
    {
        id: 3,
        title: "PABX System",
        description: "Sistem komunikasi terintegrasi untuk meningkatkan efisiensi komunikasi perusahaan.",
        icon: "https://dummyimage.com/64x64/f59e0b/ffffff.png&text=📞"
    },
    {
        id: 4,
        title: "Network Solutions",
        description: "Solusi jaringan komprehensif untuk konektivitas bisnis yang optimal.",
        icon: "https://dummyimage.com/64x64/8b5cf6/ffffff.png&text=🌐"
    },
    {
        id: 5,
        title: "Security Systems",
        description: "Sistem keamanan terintegrasi untuk melindungi aset dan data perusahaan.",
        icon: "https://dummyimage.com/64x64/ef4444/ffffff.png&text=🔒"
    },
    {
        id: 6,
        title: "Maintenance Support",
        description: "Layanan pemeliharaan dan dukungan teknis untuk menjaga performa optimal.",
        icon: "https://dummyimage.com/64x64/06b6d4/ffffff.png&text=🔧"
    }
];

export default function ServicesSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationId: number;
        let isPaused = false;
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;

        const autoScroll = () => {
            if (!isPaused && !isDragging) {
                scrollContainer.scrollLeft += 1;
                
                // Infinite loop - reset ke awal saat mencapai akhir
                if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
                    scrollContainer.scrollLeft = 0;
                }
            }
            animationId = requestAnimationFrame(autoScroll);
        };

        // Mouse wheel scroll
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            scrollContainer.scrollLeft += e.deltaY;
        };

        // Drag functionality
        const handleMouseDown = (e: MouseEvent) => {
            isDragging = true;
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
            scrollContainer.style.cursor = 'grabbing';
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2; // Multiply for faster scroll
            scrollContainer.scrollLeft = scrollLeft - walk;
        };

        const handleMouseUp = () => {
            isDragging = false;
            scrollContainer.style.cursor = 'grab';
        };

        const handleMouseEnter = () => { isPaused = true; };
        const handleMouseLeave = () => { 
            isPaused = false;
            isDragging = false;
            scrollContainer.style.cursor = 'grab';
        };

        // Event listeners
        scrollContainer.addEventListener('mouseenter', handleMouseEnter);
        scrollContainer.addEventListener('mouseleave', handleMouseLeave);
        scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
        scrollContainer.addEventListener('mousedown', handleMouseDown);
        scrollContainer.addEventListener('mousemove', handleMouseMove);
        scrollContainer.addEventListener('mouseup', handleMouseUp);
        
        // Start auto scroll
        autoScroll();

        return () => {
            cancelAnimationFrame(animationId);
            scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
            scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
            scrollContainer.removeEventListener('wheel', handleWheel);
            scrollContainer.removeEventListener('mousedown', handleMouseDown);
            scrollContainer.removeEventListener('mousemove', handleMouseMove);
            scrollContainer.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold mb-10">Our Services</h2>
                
                {/* Carousel Container - Menampilkan 3 card dengan jarak */}
                <div className="max-w-4xl mx-auto overflow-hidden">
                    <div 
                        ref={scrollRef}
                        className="flex gap-8 overflow-x-auto scrollbar-hide pb-4 cursor-grab select-none"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitScrollbar: { display: 'none' }
                        }}
                    >
                        {/* Duplicate services untuk infinite scroll */}
                        {[...services, ...services].map((service, index) => (
                            <div
                                key={`${service.id}-${index}`}
                                className="bg-white shadow-md rounded-xl p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105 min-w-[280px] max-w-[280px] h-[380px] flex-shrink-0 flex flex-col items-center justify-center text-center"
                            >
                                <div className="mb-6">
                                    <Image
                                        src={service.icon}
                                        alt={service.title}
                                        width={80}
                                        height={80}
                                        className="h-20 w-20 mx-auto"
                                    />
                                </div>
                                <h3 className="font-bold text-xl mb-4 text-gray-800">{service.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="mt-10">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        View More
                    </button>
                </div>
            </div>
        </section>
    );
}

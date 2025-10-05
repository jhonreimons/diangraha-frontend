"use client";
import Link from "next/link";

const services = [
    {
        id: 1,
        title: "Human Resource",
        description: "Professional HR solutions and workforce management.",
        icon: (
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        )
    },
    {
        id: 2,
        title: "Financial Services",
        description: "Expert financial consulting and accounting solutions.",
        icon: (
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        id: 3,
        title: "IT Solutions",
        description: "Modern technology and digital transformation.",
        icon: (
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
        )
    },
    {
        id: 4,
        title: "Business Consulting",
        description: "Strategic consulting for sustainable growth.",
        icon: (
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        )
    }
];

const ServiceSection = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="font-bold text-gray-800 mb-4" style={{fontSize: '25px'}}>Our Services</h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        Comprehensive business solutions tailored to your needs.
                    </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 text-center border border-gray-200 hover:border-blue-300 transform hover:-translate-y-2 hover:scale-105 group">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                {service.icon}
                            </div>
                            <h3 className="font-semibold text-gray-800 text-lg mb-3">{service.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                        </div>
                    ))}
                </div>
                
                <div className="text-center mt-12">
                    <Link href="/services" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300">
                        View All Services
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ServiceSection;
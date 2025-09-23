export default function ServicesSection() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold mb-10">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition"
                        >
                            <div className="flex justify-center mb-4">
                                <img
                                    src="/service-icon.png"
                                    alt="Outsourcing"
                                    className="h-16 w-16"
                                />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Outsourcing</h3>
                            <p className="text-gray-600 text-sm">
                                Solusi teknologi yang handal untuk mendukung kelancaran
                                operasional bisnis Anda.
                            </p>
                        </div>
                    ))}
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

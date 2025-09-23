import Image from "next/image";

export default function Hero() {
    return (
        <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-gradient-to-r from-gray-100 to-gray-200">
            {/* Text */}
            <div className="max-w-xl">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                    Integrity In Every Step
                </h1>
                <h2 className="text-xl text-gray-600 mb-6">
                    PT Dian Graha Elektrika <br />
                    <span className="text-base">Siap Membantu Bisnis Anda Berkembang</span>
                </h2>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
                    Learn more
                </button>
            </div>

            {/* Image */}
            <div className="mt-8 md:mt-0">
                <Image
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80"
                    alt="Hero"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                />
            </div>
        </section>
    );
}

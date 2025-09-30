import Image from "next/image";

export default function Hero() {
    return (
        <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 py-12 md:py-16 lg:py-20 bg-gradient-to-r from-gray-100 to-gray-200">
            {/* Text */}
            <div className="max-w-2xl mb-12 md:mb-0 md:mr-12">
                <h1 className="font-bold text-gray-800 mb-6 leading-tight" style={{fontSize: '30px'}}>
                    Integrity In Every Step
                </h1>
                <h2 className="text-gray-600 mb-8 leading-relaxed" style={{fontSize: '25px'}}>
                    PT Dian Graha Elektrika <br />
                    <span className="text-lg text-gray-500">Siap Membantu Bisnis Anda Berkembang</span>
                </h2>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Learn more
                </button>
            </div>

            {/* Image */}
            <div className="flex-shrink-0">
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

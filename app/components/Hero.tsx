export default function Hero() {
    return (
        <section className="h-screen flex items-center justify-center px-6 relative">
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1920&q=80")'
                }}
            ></div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gray-100 bg-opacity-40"></div>
            
            {/* Content */}
            <div className="relative z-10 text-center max-w-4xl">
                <h1 className="font-bold text-gray-800 mb-6 leading-tight" style={{fontSize: '48px'}}>
                    Integrity In Every Step
                </h1>
                <h2 className="text-gray-600 mb-8 leading-relaxed" style={{fontSize: '28px'}}>
                    PT Dian Graha Elektrika <br />
                    <span className="text-xl text-gray-500">Siap Membantu Bisnis Anda Berkembang</span>
                </h2>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
                    Learn more
                </button>
            </div>
        </section>
    );
}

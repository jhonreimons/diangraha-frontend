import Link from 'next/link';

export default function Hero() {
  return (
<section className="h-screen flex items-center justify-center px-6 relative overflow-hidden">
  {/* Background Video */}
  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source src="/background.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* Content */}
  <div className="relative z-10 text-center max-w-4xl">
    <h1
      className="font-bold text-white mb-6 leading-tight"
      style={{ fontSize: "48px" }}
    >
      Integrity In Every Step
    </h1>
    <h2
      className="text-gray-200 mb-8 leading-relaxed"
      style={{ fontSize: "28px" }}
    >
      PT Dian Graha Elektrika <br />
      <span className="text-xl text-gray-300">
        {/* Siap Membantu Bisnis Anda Berkembang */}
        Empowering Your Business to Grow
      </span>
    </h2>
    <Link href="/about">
      <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg shadow-lg">
        Learn more
      </button>
    </Link>
  </div>
</section>

  );
}

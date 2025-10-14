import Image from "next/image";
import Link from "next/link";

export default function AboutUs() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Centered Header */}
        <div className="text-center mb-16">
          <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '25px' }}>
            About Us
          </h2>
          <h3 className="font-bold text-gray-800 mb-8" style={{ fontSize: '30px' }}>
            PT. Dian Graha Elektrika
          </h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Established in 1977, PT. Dian Graha Elektrika became one of the most solid national
              companies until now, by utilizing our expertise and resources to prioritize
              high-quality services and foster existing customer relationships.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              Our human resource management services business began in 2001 in response to
              market demand for human resource service. Our commitment to excellence,
              supported by systems that stay shoulder to shoulder with the latest technological
              changes, ensures the services of skilled manpower for various industries and
              companies.
            </p>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
                alt="About Us Team"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 w-full"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100 rounded-full opacity-50 z-0"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-50 rounded-full opacity-30 z-0"></div>
          </div>
        </div>

        {/* Centered Button */}
        <div className="text-center mt-20">
          <Link
            href="/about"
            className="inline-block bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold 
               hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 
               hover:shadow-lg min-w-[200px]"
          >
            Learn More
          </Link>
        </div>

      </div>
    </section>
  );
}

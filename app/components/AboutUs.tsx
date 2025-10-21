import Image from "next/image";
import Link from "next/link";

export default function AboutUs() {
  return (
    <section className="pb-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-bold text-gray-900 mb-2 text-2xl sm:text-3xl">
            About Us
          </h2>
          <h3 className="font-bold text-gray-800 text-[26px] sm:text-[30px]">
            PT. Dian Graha Elektrika
          </h3>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Content */}
          <div className="space-y-6 flex flex-col justify-center text-center lg:text-left">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Established in 1977, PT. Dian Graha Elektrika became one of the most
              solid national companies until now, by utilizing our expertise and
              resources to prioritize high-quality services and foster existing
              customer relationships.
            </p>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Our human resource management services business began in 2001 in
              response to market demand for human resource service. Our
              commitment to excellence, supported by systems that stay shoulder to
              shoulder with the latest technological changes, ensures the services
              of skilled manpower for various industries and companies.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex justify-center items-center relative">
            {/* Wrapper for decorative circles */}
            <div className="relative flex justify-center items-center">
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-4 w-20 h-20 sm:w-28 sm:h-28 bg-blue-100 rounded-full opacity-40 z-0"></div>
              <div className="absolute -bottom-6 -left-4 w-24 h-24 sm:w-36 sm:h-36 bg-blue-50 rounded-full opacity-30 z-0"></div>

              {/* Image Container */}
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 flex items-center justify-center">
                <Image
                  src="/aboutusHome2.png"
                  alt="About Us Team"
                  width={400}
                  height={300}
                  priority
                  className="object-contain w-full max-w-[280px] sm:max-w-[350px] md:max-w-[400px] h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="text-center mt-16 md:mt-20">
          <Link
            href="/about"
            className="inline-block bg-blue-800 text-white px-8 py-3 sm:py-4 rounded-lg font-semibold 
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

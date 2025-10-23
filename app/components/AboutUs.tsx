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
          <div className="space-y-6 flex flex-col justify-center text-justify">
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
          <div className="flex justify-center items-center relative h-full">
            <div className="relative flex justify-center items-center w-full h-full">
              {/* Decorative elements */}
              <div className="absolute -top-8 -right-6 w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 rounded-full opacity-40 z-0"></div>
              <div className="absolute -bottom-8 -left-6 w-28 h-28 sm:w-40 sm:h-40 bg-blue-50 rounded-full opacity-30 z-0"></div>

              {/* Image (without white background box) */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl w-full h-full flex justify-center items-center">
                <Image
                  src="/aboutusHome.jpg"
                  alt="About Us Team"
                  width={800}
                  height={600}
                  priority
                  className="object-cover w-full h-full rounded-2xl"
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

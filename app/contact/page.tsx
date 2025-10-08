import Navbar from "../components/Navbar";
import Footer from "../components/Footer/Footer";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section (pakai video seperti halaman Career) */}
      <section className="relative w-full h-[420px] md:h-[520px] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Centered Text */}
        <div className="relative z-20 flex justify-center">
          <span className="inline-block px-6 py-3 rounded-md text-white text-3xl md:text-4xl font-extrabold 
                           bg-gradient-to-r from-indigo-600 to-violet-600/90 backdrop-blur-sm shadow-lg">
            Contact Us
          </span>
        </div>
      </section>
{/* Contact Section */}
<div className="w-full bg-gradient-to-b from-gray-50 to-white py-16">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-center text-2xl font-bold mb-12">Contact Us</h2>

    <div className="flex flex-col md:flex-row gap-12">
      {/* Form */}
      <div className="bg-white p-8 rounded-xl shadow-xl flex-1">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Phone Number</label>
            <input
              type="text"
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              What Are You Interested In?
            </label>
            <input
              type="text"
              placeholder="Select the service"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Message</label>
            <textarea
              placeholder="Send Message"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg h-32 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Centered Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                         px-10 py-3 rounded-lg shadow-md transition"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Contact Info */}
      <div className="flex-1">
        <h3 className="text-lg font-bold mb-6">Contact Information</h3>
        <div className="space-y-6 text-gray-700">
          <div>
            <p className="font-semibold">Location</p>
            <p>
              Jl. Pahlawan Revolusi No.46b, RT.10/RW.3, Pd. Bambu, Kec. Duren
              Sawit, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13430
              Indonesia
            </p>
          </div>

          <div>
            <p className="font-semibold">Phone</p>
            <p>+1 (555) 123-4567</p>
          </div>

          <div>
            <p className="font-semibold">Email</p>
            <p>contact@company.com</p>
          </div>

          <div>
            <p className="font-semibold">Business Hours</p>
            <p>Mon – Fri: 9:00 AM – 6:00 PM</p>
            <p>Sat – Sun: Closed</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


      {/* Footer */}
      <Footer />
    </div>
  );
}

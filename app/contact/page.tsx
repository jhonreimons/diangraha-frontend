"use client";
import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    companyName: "",
    interestedIn: "",
    email: "",
    message: "",
  });
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  //  Global phone regex (E.164-style)
  const phoneRegex = /^\+?[1-9]\d{6,14}$/;

  useEffect(() => {
    fetch("http://103.103.20.23:8080/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      if (value && !phoneRegex.test(value)) {
        setPhoneError("Please enter a valid phone number (7–15 digits, may start with +).");
      } else {
        setPhoneError("");
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phoneRegex.test(formData.phoneNumber)) {
      setPhoneError("Please enter a valid phone number before submitting.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://103.103.20.23:8080/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setShowModal(true);
      setFormData({
        fullName: "",
        phoneNumber: "",
        companyName: "",
        interestedIn: "",
        email: "",
        message: "",
      });
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/*  Hero Section */}
      <section className="relative w-full h-[420px] md:h-[520px] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Transparent Title */}
        <div className="relative z-20 flex justify-center">
          <span className="iinline-block px-6 py-3 rounded-md text-white text-3xl md:text-4xl font-extrabold 
                     bg-gradient-to-r from-indigo-29 to-violet-60 backdrop-blur-sm shadow-lg">
            Contact Us
          </span>
        </div>
      </section>

      {/*  Contact Section */}
      <div className="w-full bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-2xl font-bold mb-12 text-gray-800">
            Get In Touch
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-12">
            {/*  Form */}
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex-1 border border-gray-200 hover:shadow-3xl transition-all duration-300">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 bg-gray-50 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:border-blue-400"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+62-xxx-xxxx-xxxx"
                    className={`w-full px-4 py-3 border ${phoneError ? "border-red-400" : "border-gray-300"
                      } rounded-lg text-gray-800 placeholder-gray-500 bg-gray-50 focus:ring-2 ${phoneError
                        ? "focus:ring-red-400"
                        : "focus:ring-blue-500 focus:border-transparent"
                      } outline-none transition-all duration-300 hover:border-blue-400`}
                    required
                  />
                  {phoneError && (
                    <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1 italic">
                    Example: +6281234567890, +12025550123, +447700900123
                  </p>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 bg-gray-50 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:border-blue-400"
                    required
                  />
                </div>

                {/* Interested In */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What Are You Interested In?
                  </label>
                  <select
                    name="interestedIn"
                    value={formData.interestedIn}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-gray-50 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:border-blue-400"
                    required
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.name}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="company@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 bg-gray-50 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:border-blue-400"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 bg-gray-50 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:border-blue-400 h-32 resize-none"
                    required
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-800 hover:bg-blue-900 text-white font-semibold px-10 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>

            {/*  Contact Info */}
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-6 text-gray-800">
                Contact Information
              </h3>
              <div className="space-y-6 text-gray-700">
                <div>
                  <p className="font-semibold">Location</p>
                  <p>
                    Jl. Pahlawan Revolusi No.46b, RT.10/RW.3, Pd. Bambu, Kec.
                    Duren Sawit, Kota Jakarta Timur, DKI Jakarta 13430
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Phone</p>
                  <p>+62 812-3456-7890</p>
                </div>

                <div>
                  <p className="font-semibold">Email</p>
                  <p>contact@company.com</p>
                </div>

                <div>
                  <p className="font-semibold">Business Hours</p>
                  <p>Mon – Fri: 9:00 AM – 5:00 PM</p>
                  <p>Sat – Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 text-center max-w-md mx-4 shadow-2xl border">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold mb-2 text-gray-800">Thank You!</h3>
            <p className="text-gray-600 mb-6">
              Your message has been sent successfully. We will get back to you
              soon.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

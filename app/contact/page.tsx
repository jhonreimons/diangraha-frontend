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

  useEffect(() => {
    fetch("http://103.103.20.23:8080/api/services")
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error("Error fetching services:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://103.103.20.23:8080/api/contact-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

    {error && (
      <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    )}

    <div className="flex flex-col md:flex-row gap-12">
      {/* Form */}
      <div className="bg-white p-8 rounded-xl shadow-xl flex-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter your company name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              What Are You Interested In?
            </label>
            <select
              name="interestedIn"
              value={formData.interestedIn}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a service</option>
              {services.map(service => (
                <option key={service.id} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Send Message"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg h-32
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Centered Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold
                         px-10 py-3 rounded-lg shadow-md transition"
            >
              {loading ? "Sending..." : "Send"}
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

{/* Success Modal */}
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 text-center max-w-md mx-4 shadow-2xl border">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
      <h3 className="text-xl font-bold mb-2">Thank You!</h3>
      <p className="text-gray-600 mb-6">Your message has been sent successfully. We will get back to you soon.</p>
      <button
        onClick={() => setShowModal(false)}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        OK
      </button>
    </div>
  </div>
)}

      {/* Footer */}
      <Footer />
    </div>
  );
}

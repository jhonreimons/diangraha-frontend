"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { SERVER_BASE_URL } from "@/lib/config"; // gunakan config.ts agar dinamis

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // Regex nomor telepon internasional (E.164)
  const phoneRegex = /^\+?[1-9]\d{6,14}$/;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Validasi nomor telepon real-time
    if (name === "phone") {
      if (value && !phoneRegex.test(value)) {
        setPhoneError(
          "Please enter a valid phone number (7–15 digits, may start with +)."
        );
      } else {
        setPhoneError("");
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneRegex.test(formData.phone)) {
      setPhoneError("Please enter a valid phone number before submitting.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/contact-messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phone.trim(),
          companyName: formData.company.trim(),
          message: formData.message.trim(),
        }),
      });

      console.log("Response status:", response.status);

      // Jika gagal
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        alert(`Failed to send message. Server responded with ${response.status}`);
        return;
      }

      // Aman jika body kosong
      let data = null;
      try {
        data = await response.json();
      } catch {
        console.warn("Empty or non-JSON response body");
      }

      console.log("API success response:", data);

      setShowModal(true);
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Unable to reach API. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="font-bold text-gray-800 mb-4"
            style={{ fontSize: "25px" }}
          >
            Get In Touch
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Ready to start your project? Contact us today and let's discuss how
            we can help your business grow.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-12 border border-gray-200 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:border-blue-400"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Company Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="company@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:border-blue-400"
                  required
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your company name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:border-blue-400"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+62-xxx-xxxx-xxxx"
                  className={`w-full px-4 py-3 border ${
                    phoneError ? "border-red-400" : "border-gray-300"
                  } rounded-lg text-gray-800 placeholder-gray-500 bg-gray-50 focus:ring-2 ${
                    phoneError
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
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project or requirements..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:border-blue-400 resize-none"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 hover:shadow-lg min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 text-center max-w-md mx-4 shadow-2xl border">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Thank You!
            </h3>
            <p className="text-gray-600 mb-6">
              Your message has been sent successfully. We will get back to you
              soon.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

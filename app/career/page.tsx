"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer/Footer";

export default function CareerPage() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* 404 Illustration */}
          <div className="mb-12">
            <div className="relative">
              <h1 className="text-[120px] md:text-[180px] font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text leading-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-24 h-24 text-blue-500 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-[35px] font-bold text-gray-800 mb-4">
              Career Page Coming Soon!
            </h2>
            <p className="text-[22px] text-gray-600 leading-relaxed max-w-2xl mx-auto">
              We're building something amazing for our career opportunities. Stay tuned for exciting job openings and professional growth opportunities at PT. Dian Graha Elektrika.
            </p>
            
            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-6 mt-12 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Job Opportunities</h3>
                <p className="text-gray-600 text-sm">Explore various career paths in our growing company</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Professional Growth</h3>
                <p className="text-gray-600 text-sm">Develop your skills with our training programs</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Great Team</h3>
                <p className="text-gray-600 text-sm">Join our collaborative and supportive work environment</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => window.history.back()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Go Back
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
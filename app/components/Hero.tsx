"use client";
import Link from 'next/link';
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";


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
    <motion.div
      className="relative z-10 text-center max-w-4xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Judul utama */}
      <motion.h1
        className="font-bold text-white mb-6 leading-tight"
        style={{ fontSize: "48px" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        Integrity In Every Step
      </motion.h1>

      {/* Subjudul dengan efek mengetik */}
      <motion.h2
        className="text-gray-200 mb-8 leading-relaxed"
        style={{ fontSize: "28px" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        PT Dian Graha Elektrika
        <br />
        <span className="text-xl text-gray-300">
          <TypeAnimation
            sequence={[
              "Empowering Your Business to Grow", 2000,
              "Innovating Every Solution", 2000,
              "Integrity. Excellence. Growth.", 2000,
            ]}
            speed={50}
            repeat={Infinity}
          />
        </span>
      </motion.h2>

      {/* Tombol */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <Link href="/about">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold text-lg
                       hover:bg-blue-900 transition-all duration-300 hover:shadow-lg
                       min-w-[200px] shadow-md"
          >
            Learn More
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
</section>

  );
}

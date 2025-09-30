export default function ConsultationSection() {
  return (
    <section 
      className="py-16 px-4"
      style={{
        background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)'
      }}
    >
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-[35px] font-bold mb-4">
          Need Expert Advice? It's Free!
        </h2>
        <p className="text-[25px] mb-8 leading-relaxed">
          We'll help you find the right strategy to achieve better results—simple, effective, and personalized.
        </p>
        <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Consult Now
        </button>
      </div>
    </section>
  );
}
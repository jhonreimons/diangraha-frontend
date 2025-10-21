import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-10 w-full mt-0">
      <div className="max-w-screen-2xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Company Info */}
        <div>
          <h3 className="text-lg font-bold mb-4">PT Dian Graha Elektrika</h3>
          <p className="text-sm leading-relaxed">
            Jl. Pahlawan Revolusi No.46b, RT.10/RW.3, Pd. Bambu, Kec. Duren
            Sawit, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13430
            Indonesia
          </p>
          <p className="mt-3 text-sm">Phone: (021) 29195165</p>
          <p className="text-sm">Email: company@email.com</p>

          {/* Social Media */}
          <div className="flex gap-4 mt-4">
            <a
              href="https://www.instagram.com/dge.idn/"
              className="hover:opacity-80"
            >
              <Image
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
                className="invert"
              />
            </a>
            <a
              href="https://www.linkedin.com/company/pt-dian-graha-elektrika/"
              className="hover:opacity-80"
            >
              <Image
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg"
                alt="LinkedIn"
                width={24}
                height={24}
                className="invert"
              />
            </a>
            <a
              href="https://id.jobstreet.com/id/companies/dian-graha-elektrika-168555371921443/jobs"
              className="hover:opacity-80"
            >
              <Image
                src="/jobstreet.png"
                alt="Jobstreet"
                width={24}
                height={24}
                className="invert"
              />
            </a>
          </div>
        </div>

        {/* Jam Operasional + Logo tambahan */}
        <div className="flex flex-col justify-start">
          <h4 className="font-semibold mb-4">Jam Operasional</h4>
          <p className="text-sm">Monday - Friday: 08.00 – 17.00 WIB</p>
          <p className="text-sm mb-6">Saturday - Sunday: Closed</p>

          <div className="flex justify-center md:justify-start items-start">
            <div
              className="
                transform
                scale-[1.25]              /* mobile — ukuran seperti gambar pertama */
                md:scale-[2.2]            /* desktop tetap besar dan proporsional */
                md:-mt-6                  /* sejajarkan di desktop */
                origin-center md:origin-left
                transition-transform duration-300
              "
            >
              <Image
                src="/logoIso.png"
                alt="Certification Logos"
                width={220}
                height={130}
                className="object-contain opacity-95 hover:opacity-100 transition-opacity duration-300"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Career
              </a>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Outsourcing</a></li>
            <li><a href="#" className="hover:underline">Medical</a></li>
            <li><a href="#" className="hover:underline">PABX</a></li>
            <li><a href="#" className="hover:underline">Other</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-screen-2xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center mt-8 pt-6 border-t border-blue-800">
        <div className="flex items-center mb-4 md:mb-0">
          <Image
            src="/diangraha-logo.png"
            alt="PT Dian Graha Elektrika"
            width={140}
            height={40}
            className="h-10 w-auto"
          />
        </div>

        <div className="text-sm text-gray-300 text-center md:text-right">
          © 2024 PT Dian Graha Elektrika. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

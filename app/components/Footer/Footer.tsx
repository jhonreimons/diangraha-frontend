import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-blue-900 text-white py-8">
            <div className="w-full px-2 grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Company Info */}
                <div className="md:col-span-2 ml-10">
                    <h3 className="text-lg font-bold mb-4">PT Dian Graha Elektrika</h3>
                    <p className="text-sm leading-relaxed">
                        Jl. Pahlawan Revolusi No.46b, RT.10/RW.3, Pd. Bambu, Kec. Duren
                        Sawit, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13430
                        Indonesia
                    </p>
                    <p className="mt-3 text-sm">Phone: (021) 29195165</p>
                    <p className="text-sm">Email: company@email.com</p>
                    <div className="flex gap-3 mt-4">
                        <a href="#" className="hover:opacity-80">
                            <Image src="https://cdn-icons-png.flaticon.com/512/3670/3670147.png" alt="YouTube" width={24} height={24} />
                        </a>
                        <a href="#" className="hover:opacity-80">
                            <Image src="https://cdn-icons-png.flaticon.com/512/3670/3670274.png" alt="Instagram" width={24} height={24} />
                        </a>
                        <a href="#" className="hover:opacity-80">
                            <Image src="https://cdn-icons-png.flaticon.com/512/3670/3670129.png" alt="LinkedIn" width={24} height={24} />
                        </a>
                    </div>
                </div>

                {/* Jam Operasional */}
                <div className="ml-12">
                    <h4 className="font-semibold mb-4">Jam Operasional</h4>
                    <p className="text-sm">Senin - Jumat: 08.00 – 17.00 WIB</p>
                    <p className="text-sm">Sabtu: 08.00 – 12.00 WIB</p>
                    <p className="text-sm">Minggu: Libur</p>
                </div>

                {/* Company */}
                <div className="text-center">
                    <h4 className="font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:underline">About Us</a></li>
                        <li><a href="#" className="hover:underline">Career</a></li>
                        <li><a href="#" className="hover:underline">Our Team</a></li>
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
            <div className="w-full px-2 flex justify-between items-center mt-6 pt-4 border-t border-blue-800">
                {/* Logo */}
                <div className="ml-8 flex items-center">
                    <Image
                        src="/logo.svg"
                        alt="PT Dian Graha Elektrika"
                        width={120}
                        height={36}
                        className="h-8 w-auto"
                    />
                </div>
                
                {/* Copyright di kanan */}
                <div className="text-sm text-gray-300 mr-6">
                    © 2024 PT Dian Graha Elektrika. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
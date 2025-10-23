"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openService, setOpenService] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const pathname = usePathname();

  // Fetch API menggunakan config.ts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/services`, {
          headers: { Accept: "*/*" },
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
        setServices([]);
      }
    };
    fetchServices();
  }, []);

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/career", label: "Career" },
    { href: "/contact", label: "Contact Us" },
  ];

  const serviceItems = services.map((service) => ({
    href: `/service/${encodeURIComponent(service.name.toLowerCase().replace(/\s+/g, "-"))}`,
    label: service.name,
  }));

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-blue-800/90 backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-20 py-4">
        {/* ===== Logo ===== */}
        <Link href="/" className="flex items-center">
          <Image
            src="/diangraha-logo.png"
            alt="PT Dian Graha Elektrika"
            width={120}
            height={36}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* ===== Desktop Menu ===== */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium relative">
          {menuItems.map((item) =>
            item.label === "Services" ? (
              <li key={item.href} className="relative group">
                <button
                  className={`flex items-center transition-all duration-200 ${
                    isActive(item.href)
                      ? "text-white font-semibold border-b-2 border-white pb-1"
                      : "text-gray-200 hover:text-white"
                  }`}
                >
                  {item.label}
                  <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>

                {/* Dropdown (Desktop) */}
                <ul className="absolute left-0 mt-2 w-52 bg-white shadow-lg rounded-md py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  {serviceItems.length > 0 ? (
                    serviceItems.map((service) => (
                      <li key={service.href}>
                        <Link
                          href={service.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          {service.label}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-sm text-gray-400">Loading...</li>
                  )}
                </ul>
              </li>
            ) : (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`transition-all duration-200 ${
                    isActive(item.href)
                      ? "text-white font-semibold border-b-2 border-white pb-1"
                      : "text-gray-200 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* ===== CTA Button (Desktop) ===== */}
        <Link
          href="/contact"
          className="hidden md:block bg-white/90 text-blue-800 px-4 py-2 rounded-md font-medium hover:bg-white transition-colors text-sm"
        >
          Get Started
        </Link>

        {/* ===== Hamburger Menu (Mobile) ===== */}
        <button
          className="md:hidden text-2xl text-white"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* ===== Mobile Menu ===== */}
      {open && (
        <div className="md:hidden bg-blue-900/95 backdrop-blur-md flex flex-col items-center space-y-4 py-6 shadow-lg">
          {menuItems.map((item) =>
            item.label === "Services" ? (
              <div key={item.href} className="w-full flex flex-col items-center">
                {/* Services Row */}
                <div className="flex items-center space-x-2">
                  {/* Link ke halaman utama Services */}
                  <Link
                    href={item.href}
                    onClick={() => {
                      setOpen(false);
                      setOpenService(false);
                    }}
                    className={`transition-all duration-200 ${
                      isActive(item.href)
                        ? "text-white font-semibold"
                        : "text-gray-200 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>

                  {/* Dropdown Toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenService(!openService);
                    }}
                    className="text-gray-200 hover:text-white focus:outline-none"
                  >
                    {openService ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Dropdown (Mobile) */}
                {openService && (
                  <div className="flex flex-col space-y-2 mt-2 items-center">
                    {serviceItems.length > 0 ? (
                      serviceItems.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          className="text-gray-200 hover:text-white text-sm"
                          onClick={() => setOpen(false)}
                        >
                          {service.label}
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">Loading...</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`transition-all duration-200 ${
                  isActive(item.href)
                    ? "text-white font-semibold"
                    : "text-gray-200 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            )
          )}

          {/* CTA Button (Mobile) */}
          <Link
            href="/contact"
            className="bg-white text-blue-800 px-4 py-2 rounded-md font-medium hover:bg-gray-200 text-sm"
            onClick={() => setOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}

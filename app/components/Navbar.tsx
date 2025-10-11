"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openService, setOpenService] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    fetch("http://103.103.20.23:8080/api/services")
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error("Error fetching services:", err));
  }, []);

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/career", label: "Career" },
    { href: "/contact", label: "Contact Us" },
  ];

  const serviceItems = services.map(service => ({
    href: `/service/${service.id}`,
    label: service.name
  }));

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-blue-800/90 backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-20 py-4">
        {/* Logo */}
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

        {/* Menu Desktop */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium relative">
          {menuItems.map((item) =>
            item.label === "Services" ? (
              <li key={item.href} className="relative group">
                {/* Services now clickable */}
                <Link
                  href={item.href}
                  className={`flex items-center transition-all duration-200 ${
                    isActive(item.href)
                      ? "text-white font-semibold border-b-2 border-white pb-1"
                      : "text-gray-200 hover:text-white"
                  }`}
                >
                  {item.label}
                  <ChevronDown className="ml-1 w-4 h-4" />
                </Link>

                {/* Dropdown Desktop */}
                <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {serviceItems.map((service) => (
                    <li key={service.href}>
                      <Link
                        href={service.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        {service.label}
                      </Link>
                    </li>
                  ))}
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

        {/* Button Desktop */}
        <Link
          href="/contact"
          className="hidden md:block bg-white/90 text-blue-800 px-4 py-2 rounded-md font-medium hover:bg-white transition-colors text-sm"
        >
          Get Started
        </Link>

        {/* Hamburger Mobile */}
        <button
          className="md:hidden text-2xl text-white"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Menu Mobile */}
      {open && (
        <div className="md:hidden bg-blue-900/95 backdrop-blur-md flex flex-col items-center space-y-4 py-6 shadow-lg">
          {menuItems.map((item) =>
            item.label === "Services" ? (
              <div key={item.href} className="w-full flex flex-col items-center">
                {/* Toggle untuk Services */}
                <button
                  onClick={() => setOpenService(!openService)}
                  className={`flex items-center space-x-1 transition-all duration-200 ${
                    isActive(item.href)
                      ? "text-white font-semibold"
                      : "text-gray-200 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  {openService ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {/* Submenu Mobile */}
                {openService && (
                  <div className="flex flex-col space-y-2 mt-2">
                    {serviceItems.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="text-gray-200 hover:text-white text-sm"
                        onClick={() => setOpen(false)}
                      >
                        {service.label}
                      </Link>
                    ))}
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

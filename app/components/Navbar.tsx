"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const menuItems = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About Us" },
        { href: "/services", label: "Services" },
        { href: "/career", label: "Career" },
        { href: "/contact", label: "Contact Us" }
    ];

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center relative">
            {/* Logo */}
            <div className="flex flex-col">
                <div className="text-white font-bold text-xl leading-tight">
                    DGE
                </div>
                <span className="text-white text-sm font-medium leading-tight">PT Dian Graha Elektrika</span>
            </div>

            {/* Menu Desktop */}
            <ul className="hidden md:flex space-x-6">
                {menuItems.map((item) => (
                    <li key={item.href}>
                        <Link 
                            href={item.href} 
                            className={`transition-all duration-200 ${
                                isActive(item.href)
                                    ? "text-white font-semibold border-b-2 border-white pb-1"
                                    : "text-gray-300 hover:text-white opacity-75 hover:opacity-100"
                            }`}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Button Desktop */}
            <Link
                href="/contact"
                className="hidden md:block bg-white text-blue-800 px-3 py-1 rounded-md font-medium hover:bg-gray-200 transition-colors text-sm"
            >
                Get Started
            </Link>

            {/* Hamburger (Mobile) */}
            <button className="md:hidden" onClick={() => setOpen(!open)}>
                ☰
            </button>

            {/* Menu Mobile */}
            {open && (
                <div className="absolute top-full left-0 w-full bg-blue-900 flex flex-col items-center space-y-4 py-6 md:hidden z-50">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.href}
                            href={item.href} 
                            onClick={() => setOpen(false)}
                            className={`transition-all duration-200 ${
                                isActive(item.href)
                                    ? "text-white font-semibold"
                                    : "text-gray-300 hover:text-white"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link 
                        href="/contact" 
                        className="bg-white text-blue-800 px-3 py-1 rounded-md font-medium hover:bg-gray-200 text-sm"
                        onClick={() => setOpen(false)}
                    >
                        Get Started
                    </Link>
                </div>
            )}
        </nav>
    );
}

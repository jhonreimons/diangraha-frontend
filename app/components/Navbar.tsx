"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center relative">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <img
                    src="https://dummyimage.com/100x40/ffffff/000000.png&text=LOGO"
                    alt="Company Logo"
                    className="h-8"
                />
                <span className="font-semibold">PT Dian Graha Elektrika</span>
            </div>

            {/* Menu Desktop */}
            <ul className="hidden md:flex space-x-6">
                <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
                <li><Link href="/about" className="hover:text-gray-300">About Us</Link></li>
                <li><Link href="/services" className="hover:text-gray-300">Services</Link></li>
                <li><Link href="/career" className="hover:text-gray-300">Career</Link></li>
                <li><Link href="/contact" className="hover:text-gray-300">Contact Us</Link></li>
            </ul>

            {/* Button Desktop */}
            <Link
                href="#"
                className="hidden md:block bg-white text-blue-800 px-4 py-2 rounded-md font-medium hover:bg-gray-200"
            >
                Get Started
            </Link>

            {/* Hamburger (Mobile) */}
            <button className="md:hidden" onClick={() => setOpen(!open)}>
                ☰
            </button>

            {/* Menu Mobile */}
            {open && (
                <div className="absolute top-full left-0 w-full bg-blue-900 flex flex-col items-center space-y-4 py-6 md:hidden">
                    <Link href="/" onClick={() => setOpen(false)}>Home</Link>
                    <Link href="/about" onClick={() => setOpen(false)}>About Us</Link>
                    <Link href="/services" onClick={() => setOpen(false)}>Services</Link>
                    <Link href="/career" onClick={() => setOpen(false)}>Career</Link>
                    <Link href="/contact" onClick={() => setOpen(false)}>Contact Us</Link>
                    <Link href="#" className="bg-white text-blue-800 px-4 py-2 rounded-md">Get Started</Link>
                </div>
            )}
        </nav>
    );
}

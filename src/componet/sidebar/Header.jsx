"use client";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Mobile Toggle Button */}
        <button
          className="text-2xl md:hidden focus:outline-none"
          onClick={toggleSidebar}
          aria-label="Toggle Menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        {/* Logo */}
        <h1 className="text-xl font-bold tracking-wide">Bachelor Point <span className="text-yellow-300">(Beta)</span></h1>
        
        {/* Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 text-lg">
            <li>
              <Link href="#" className="hover:text-yellow-300 transition duration-300">Notification</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-yellow-300 transition duration-300">Update</Link>
            </li>
        
          </ul>
        </nav>
      </div>
    </header>
  );
}

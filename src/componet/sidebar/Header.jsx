"use client";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaBell, FaSyncAlt } from "react-icons/fa";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg py-2 text-gray-800" 
          : "bg-gradient-to-r from-indigo-600 to-purple-700 py-4 text-white"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Mobile Toggle Button */}
        <button
          className="text-xl md:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md p-2"
          onClick={toggleSidebar}
          aria-label="Toggle Menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-lg ${
            scrolled ? "bg-gradient-to-r from-indigo-600 to-purple-700" : "bg-white"
          } flex items-center justify-center`}>
            <span className={`font-bold ${scrolled ? "text-white" : "text-indigo-700"}`}>BP</span>
          </div>
          <h1 className="text-xl font-bold tracking-wide">
            Bachelor Point <span className="text-amber-400">(Beta)</span>
          </h1>
        </Link>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="#" 
            className="flex items-center space-x-1 hover:text-amber-400 transition-colors duration-300 font-medium"
          >
            <FaBell className="text-sm" />
            <span>Notification</span>
          </Link>
          <Link 
            href="#" 
            className="flex items-center space-x-1 hover:text-amber-400 transition-colors duration-300 font-medium"
          >
            <FaSyncAlt className="text-sm" />
            <span>Update</span>
          </Link>
        </nav>

        {/* Mobile Navigation Sidebar */}
        {isOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/30"
              onClick={toggleSidebar}
            />
            
            {/* Sidebar */}
            <div className="absolute top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-xl">
              <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Menu</h2>
                  <button onClick={toggleSidebar}>
                    <FaTimes />
                  </button>
                </div>
              </div>
              
              <nav className="p-5">
                <ul className="space-y-4">
                  <li>
                    <Link 
                      href="#" 
                      className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 p-2 rounded-md hover:bg-indigo-50 transition-colors"
                      onClick={toggleSidebar}
                    >
                      <FaBell />
                      <span>Notification</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#" 
                      className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 p-2 rounded-md hover:bg-indigo-50 transition-colors"
                      onClick={toggleSidebar}
                    >
                      <FaSyncAlt />
                      <span>Update</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
'use client'
import React from "react";

export default function Header() {
  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.toggle("hidden");
  };
  return (
    <header className="bg-blue-600 text-white p-4">
    <div className="container mx-auto flex items-center justify-between">
      <button
        className="text-2xl md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle Menu"
      >
        ☰
      </button>
      <h1 className="text-lg font-bold">Batchlar Point</h1>
      <nav className="hidden md:block">
        <ul className="flex space-x-4">
          <li>
            <a href="#" className="hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
  );
}

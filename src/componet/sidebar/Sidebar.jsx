"use client";
import Link from "next/link";
import React from "react";

export default function Sidebar() {
  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.toggle("hidden");
  };
  return (
    <aside
      id="sidebar"
      className="hidden fixed top-0 left-0 h-full bg-gray-800 text-white w-64 md:block md:relative z-50 shadow-lg"
    >
      <nav className="p-4">
        <button
          className="block md:hidden text-2xl mb-4"
          onClick={toggleSidebar}
        >
          ✕
        </button>
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard" className="block p-2 hover:bg-gray-700 rounded">
              Dashboard
            </Link>
          </li>
          <li>
            <a href="/meal" className="block p-2 hover:bg-gray-700 rounded">
              Meal
            </a>
          </li>
          <li>
            <a href="/bazer" className="block p-2 hover:bg-gray-700 rounded">
              Bazar
            </a>
          </li>

          <li>
            <a href="/deposit-money" className="block p-2 hover:bg-gray-700 rounded">
            Deposit Money
            </a>
          </li>
          <li>
            <a href="/settings" className="block p-2 hover:bg-gray-700 rounded">
              Settings
            </a>
          </li>

          <li>
            <a href="/settings" className="block p-2 hover:bg-gray-700 rounded">
              LogOut
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

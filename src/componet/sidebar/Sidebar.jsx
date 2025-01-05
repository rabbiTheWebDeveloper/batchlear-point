"use client";
import { logout } from "@/lib/auth";
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
            <Link
              href="/dashboard"
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/meal" className="block p-2 hover:bg-gray-700 rounded">
              Meal
            </Link>
          </li>
          <li>
            <Link href="/bazer" className="block p-2 hover:bg-gray-700 rounded">
              Bazar
            </Link>
          </li>

          <li>
            <Link
              href="/deposit-money"
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Deposit Money
            </Link>
          </li>
          <li>
            <Link href="/roommate" className="block p-2 hover:bg-gray-700 rounded">
              Roommate
            </Link>
          </li>
          <li>
            <a href="/settings" className="block p-2 hover:bg-gray-700 rounded">
              Settings
            </a>
          </li>

          <li>
            <Link
              href="/logout"
              className="block p-2 hover:bg-gray-700 rounded"
            >
              LogOut
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

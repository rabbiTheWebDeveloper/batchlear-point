"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaBars, FaTimes, FaHome, FaUtensils, FaShoppingCart, FaMoneyBill, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, trickleSpeed: 2000 });

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleStart = () => NProgress.start();
    const handleStop = () => {
      NProgress.done();
      setIsOpen(false); // Hide sidebar on page change
    };

    router.prefetch(pathname); // Prefetch the route for faster navigation
    handleStart();
    const timeout = setTimeout(handleStop, 500); // Ensure progress bar completes

    return () => clearTimeout(timeout);
  }, [pathname, router]);

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 z-50" id="progress-bar" />
      
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-50 shadow-lg transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative`}
      >
        <nav className="p-4">
          <button
            className="block md:hidden text-2xl mb-4"
            onClick={toggleSidebar}
          >
            <FaTimes />
          </button>
          <ul className="space-y-4">
            <li>
              <Link href="/dashboard" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaHome className="mr-2" /> Dashboard
              </Link>
            </li>
            <li>
              <Link href="/meal" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaUtensils className="mr-2" /> Meal
              </Link>
            </li>
            <li>
              <Link href="/bazer" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaShoppingCart className="mr-2" /> Bazar
              </Link>
            </li>
            <li>
              <Link href="/other-cost" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaMoneyBill className="mr-2" /> Other Cost
              </Link>
            </li>
            <li>
              <Link href="/deposit-money" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaMoneyBill className="mr-2" /> Deposit Money
              </Link>
            </li>
            <li>
              <Link href="/roommate" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaUsers className="mr-2" /> Roommate
              </Link>
            </li>
            <li>
              <Link href="/settings" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaCog className="mr-2" /> Settings
              </Link>
            </li>
            <li>
              <Link href="/logout" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaSignOutAlt className="mr-2" /> LogOut
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

"use client";

import { FaUtensils, FaMoneyBillWave, FaShoppingCart, FaBalanceScale } from "react-icons/fa";
import { MdAttachMoney, MdOutlinePendingActions } from "react-icons/md";



export default function Dashboard({dashboardData}) {
  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Meal */}
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <FaUtensils className="text-blue-600 text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Total Meal</h2>
            <p className="text-gray-600 text-xl font-bold"> {dashboardData.totalMeals}</p>
          </div>
        </div>

        {/* Total Cost */}
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <FaMoneyBillWave className="text-green-600 text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Total Cost</h2>
            <p className="text-gray-600 text-xl font-bold">৳ {dashboardData.totallCost}</p>
          </div>
        </div>

        {/* Total Bazar */}
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <FaShoppingCart className="text-yellow-600 text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Total Bazar</h2>
            <p className="text-gray-600 text-xl font-bold">৳ {dashboardData.totalBazer}</p>
          </div>
        </div>

        {/* Meal Charge */}
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <FaBalanceScale className="text-purple-600 text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Meal Charge</h2>
            <p className="text-gray-600 text-xl font-bold">৳ {dashboardData.mealCharge.toFixed(2)}/meal</p>
          </div>
        </div>

        {/* Total Given */}
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <MdAttachMoney className="text-red-600 text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Total Given</h2>
            <p className="text-gray-600 text-xl font-bold">৳ {dashboardData.totalDeposit}</p>
          </div>
        </div>

        {/* Total Due */}
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <MdOutlinePendingActions className="text-indigo-600 text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Total Due</h2>
            <p className="text-gray-600 text-xl font-bold">৳ 00</p>
          </div>
        </div>
      </div>
    </div>
  );
}

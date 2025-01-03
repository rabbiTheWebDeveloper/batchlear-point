"use client";

import React, { useState } from "react";

const initialData = [
  { name: "Rabbi Rahman", meals: Array(31).fill(0) }, // Example with a longer name
  { name: "Rahim Khan", meals: Array(31).fill(0) },
  { name: "Karim Ahmed", meals: Array(31).fill(0) },
  { name: "Hasan Ali", meals: Array(31).fill(0) },
  { name: "Jamil Hussain", meals: Array(31).fill(0) },
  { name: "Sabbir Alam", meals: Array(31).fill(0) },
  { name: "Another Long Name Example", meals: Array(31).fill(0) }, // Even longer name for testing
];

const MealTracker = () => {
  const [data, setData] = useState(initialData);

  const updateMeal = (personIndex, dayIndex, value) => {
    const updatedData = [...data];
    updatedData[personIndex].meals[dayIndex] = parseInt(value) || 0;
    setData(updatedData);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen flex flex-col">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">Meal Tracker</h1>

      <div className="flex-1 overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2 border border-blue-500 text-left sticky top-0 z-10 w-32 min-w-[8rem]"> {/* Increased min-width */}
                Name
              </th>
              {Array.from({ length: 31 }).map((_, i) => (
                <th
                  key={i}
                  className="p-2 border border-blue-500 text-center text-xs sm:text-sm md:text-base sticky top-0 z-10 w-8 sm:w-10 md:w-12 lg:w-16" // Adjusted widths
                >
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((person, personIndex) => (
              <tr key={personIndex} className="hover:bg-gray-100 transition-colors">
                <td className="p-2 border border-gray-300 font-medium text-sm md:text-base whitespace-nowrap">
                  {person.name}
                </td>
                {person.meals.map((meal, dayIndex) => (
                  <td key={dayIndex} className="p-2 border border-gray-300 text-center">
                    <input
                      type="number"
                      min="0"
                      value={meal}
                      onChange={(e) => updateMeal(personIndex, dayIndex, e.target.value)}
                      className="w-8 sm:w-10 md:w-12 lg:w-16 p-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 text-xs sm:text-sm" // Adjusted input widths
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Total Meals per Person</h2>
        <ul className="space-y-2">
          {data.map((person, index) => (
            <li key={index} className="flex justify-between bg-gray-100 p-2 rounded-md">
              <span className="font-medium">{person.name}</span>
              <span className="font-bold text-blue-600">
                {person.meals.reduce((sum, meal) => sum + meal, 0)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MealTracker;
"use client";
import {
  mealTrackerInsertAction,
  mealTrackerUpdateAction,
} from "@/app/actions";
import React, { useState } from "react";
import toast from "react-hot-toast";

const MealTracker = ({ data: initialData }) => {
  const [data, setData] = useState(initialData);
  const [newUserName, setNewUserName] = useState("");
  const [selectedDay, setSelectedDay] = useState(null); // For tracking selected day
  const [mealCount, setMealCount] = useState(0); // For tracking meal count
  const [mealDay, setMealDay] = useState(0); // For tracking meal count
  const [mealDetails, setMealDetails] = useState(""); // For tracking details
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility

console.log("data", data)
  // Function to open the modal
  const openModal = (personIndex, dayIndex) => {
    const mealData = data[personIndex].meals[dayIndex];
    setSelectedDay({ personIndex, dayIndex });
    setMealCount(mealData.count);
    setMealDetails(mealData.details);
    setMealDay(mealData.day);
    setIsModalOpen(true);
    console.log("mealData", personIndex);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to save the updated meal data
  const saveMeal = async () => {
    if (selectedDay) {
      const { personIndex, dayIndex } = selectedDay;
      const meal = data[personIndex].meals[dayIndex];
      const id = data[personIndex].id;

      try {
        console.log("personIndex", data[personIndex]._id, personIndex)
        // Call the API to update the meal in the backend
        const response = await mealTrackerUpdateAction(
          id, 
          meal._id, // Meal ID (for the specific day)
          mealCount,
          mealDetails
        );
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("User added successfully!");
        }
        // console.log(updatedMeal);
        // After successful update, update the state to reflect changes in UI
        // updateMeal(personIndex, dayIndex, mealCount, mealDetails);
        toast.success("Meal updated successfully!");
        closeModal();
      } catch (error) {
        toast.error("Failed to update meal. Please try again.");
      }
    }
  };

  // Function to add a new user (this is assumed to be an API call)
  const addUser = async () => {
    const updatedData = { name: newUserName };
    try {
      const response = await mealTrackerInsertAction(updatedData);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("User added successfully!");
      }
    } catch (err) {
      toast.error("Failed to add user. Please try again.");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen flex flex-col">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Meal Tracker
      </h1>

      {/* Add User Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Add User</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter user name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 text-sm md:text-base"
          />
          <button
            onClick={addUser}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add User
          </button>
        </div>
      </div>

      {/* Meal Tracker Table */}
      <div className="flex-1 overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2 border border-blue-500 text-left sticky top-0 z-10 w-32 min-w-[8rem]">
                Name
              </th>
              {Array.from({ length: 31 }).map((_, i) => (
                <th
                  key={i}
                  className="p-2 border border-blue-500 text-center text-xs sm:text-sm md:text-base sticky top-0 z-10 w-8 sm:w-10 md:w-12 lg:w-16"
                >
                  <button
                    onClick={() => openModal(0, i)} // Open modal for first user and day 1 (You can modify for dynamic)
                    className="text-white text-xs sm:text-sm"
                  >
                    {i + 1}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((person, personIndex) => (
              <tr
                key={personIndex}
                className="hover:bg-gray-100 transition-colors"
              >
                <td className="p-2 border border-gray-300 font-medium text-sm md:text-base whitespace-nowrap">
                  {person.name}
                </td>
                {person.meals.map((meal, dayIndex) => (
                  <td
                    key={dayIndex}
                    className="p-2 border border-gray-300 text-center"
                  >
                    <button
                      onClick={() => openModal(personIndex, dayIndex)}
                      className="w-8 sm:w-10 md:w-12 lg:w-16 p-1 text-center border border-gray-300 rounded-md"
                    >
                      {meal.count}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Meals Per Person */}
      <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Total Meals per Person</h2>
        <ul className="space-y-2">
          {data.map((person, index) => (
            <li
              key={index}
              className="flex justify-between bg-gray-100 p-2 rounded-md"
            >
              <span className="font-medium">{person.name}</span>
              <span className="font-bold text-blue-600">
                {person.meals.reduce((sum, meal) => sum + meal.count, 0)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for Meal Update */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Update Meal</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Meal Count
              </label>
              <label className="block text-sm font-medium mb-2">
                Day - {mealDay}{" "}
              </label>
              <input
                type="number"
                value={mealCount}
                onChange={(e) => setMealCount(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="0"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Details</label>
              <textarea
                value={mealDetails}
                onChange={(e) => setMealDetails(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={saveMeal}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealTracker;

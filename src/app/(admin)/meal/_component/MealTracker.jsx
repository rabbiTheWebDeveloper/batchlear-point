"use client";
import { mealTrackerInsertAction, mealTrackerUpdateAction } from "@/app/actions";
import Spinner from "@/componet/ui/Spinner";
import React, { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const MealTracker = ({ data: initialData , roommade }) => {
  const [data, setData] = useState(initialData);
  const [newUserName, setNewUserName] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [mealCount, setMealCount] = useState(0);
  const [mealDetails, setMealDetails] = useState("");
  const [mealDay, setMealDay] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(""); 

  // Open modal with the selected meal's data
  const openModal = useCallback((personIndex, dayIndex) => {
    const mealData = data[personIndex].meals[dayIndex];
    const userName = data[personIndex].person.name;
    setSelectedDay({ personIndex, dayIndex });
    setMealCount(mealData.count);
    setMealDetails(mealData.details);
    setMealDay({day: mealData.day ,name: userName});
    setIsModalOpen(true);
  }, [data]);

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Save meal update to the backend
  const saveMeal = async () => {
    if (!selectedDay) return; // Early return if no day is selected
  
    setIsLoading(true);
  
    const { personIndex, dayIndex } = selectedDay;
    const meal = data[personIndex]?.meals[dayIndex]; // Use optional chaining to avoid errors
    const personId = data[personIndex]?.id; // Safely access person ID
  
    if (!meal || !personId) {
      toast.error("Invalid data. Please refresh the page and try again.");
      setIsLoading(false);
      return;
    }
  
    try {
      // Call the update API
      const response = await mealTrackerUpdateAction(personId, meal._id, mealCount, mealDetails);
  
      if (response.error) {
        toast.error(response.error || "An unknown error occurred."); // Show a user-friendly error message
      } else {
        // Update the UI optimistically
        toast.success("Meal updated successfully!");
        setData(prevData => {
          const updatedData = [...prevData];
          updatedData[personIndex].meals[dayIndex] = { ...meal, count: mealCount, details: mealDetails };
          return updatedData;
        });
        closeModal(); // Close the modal after success
      }
    } catch (error) {
      console.error("Meal update failed:", error); // Log the error for debugging
      toast.error("Failed to update meal. Please try again.");
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };
  

  // Add a new user
  const addUser = async () => {
    if (!selectedUser) {
      toast.error("Please enter a valid name.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await mealTrackerInsertAction({ personId: selectedUser });
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("User added successfully!");
        setNewUserName(""); // Clear the input field after adding
      }
    } catch (err) {
      toast.error("Failed to add user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

if (!isClient || isLoading) {
  return  <Spinner size="xl" color="blue" />; // or a loading spinner, etc.
}

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen flex flex-col">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Meal Tracker
      </h1>

      {/* Add User Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Add User</h2>
        <div className="flex gap-4">
        <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 text-sm md:text-base"
          >
            <option value="">Select an existing user</option>
            {roommade.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
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
                    onClick={() => openModal(0, i)} // Open modal for first user and day 1 (modify for dynamic)
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
                  {person?.person?.name}
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
            <li key={index} className="flex justify-between bg-gray-100 p-2 rounded-md">
              <span className="font-medium">{person?.person?.name}</span>
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
            Meal Count - {mealDay.name}
          </label>
          <label className="block text-sm font-medium mb-2">
            Day - {mealDay.day}
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMealCount(prev => Math.max(prev - 1, 0))} // Decrease meal count, not going below 0
              className="px-2 py-1 bg-gray-300 text-gray-600 rounded-md"
            >
              -
            </button>
            <input
              type="number"
              value={mealCount}
              onChange={(e) => setMealCount(Math.max(0, Number(e.target.value)))}
              className="w-full p-2 border border-gray-300 rounded-md text-center"
              min="0"
            />
            <button
              onClick={() => setMealCount(prev => prev + 1)} // Increase meal count
              className="px-2 py-1 bg-gray-300 text-gray-600 rounded-md"
            >
              +
            </button>
          </div>
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

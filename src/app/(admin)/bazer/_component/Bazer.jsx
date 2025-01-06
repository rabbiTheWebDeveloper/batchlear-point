"use client";
import { bazerInsertAction, bazerUpdateAction } from "@/app/actions";
import Spinner from "@/componet/ui/Spinner";
import React, { useState } from "react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const Bazer = ({ people, initialBazaars }) => {
  const [bazaars, setBazaars] = useState(initialBazaars);
  const [isLoading, setIsLoading] = useState(false);
  const [newBazar, setNewBazar] = useState({
    personId: "",
    cost: "",
    description: "",
    date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Add or Update Bazar
  const handleAddOrUpdateBazar = async () => {
    setIsLoading(true);
    try {
      if (newBazar.id) {
        // Update existing bazar
        const response = await bazerUpdateAction(newBazar.id, newBazar);
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Bazar updated successfully!");
          setNewBazar({ personId: "", cost: "", description: "", date: "" });
        }
      } else {
        // Add new bazar
        const response = await bazerInsertAction(newBazar);
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Bazar added successfully!");
          setNewBazar({ personId: "", cost: "", description: "", date: "" });
        }
      }
    } catch (err) {
      toast.error("Failed to add/update bazar. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastBazar = currentPage * itemsPerPage;
  const indexOfFirstBazar = indexOfLastBazar - itemsPerPage;
  const currentBazaars = bazaars.slice(indexOfFirstBazar, indexOfLastBazar);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return <Spinner size="xl" color="blue" />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Bazar List
      </h1>

      {/* Add / Update Bazar Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {newBazar.id ? "Update" : "Add"} Bazar
        </h2>

        {/* Person Selector */}
        <select
          value={newBazar.personId}
          onChange={(e) =>
            setNewBazar({ ...newBazar, personId: e.target.value })
          }
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        >
          <option value="">Select Person</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>

        {/* Bazar Cost */}
        <input
          type="number"
          placeholder="Bazar Cost"
          value={newBazar.cost}
          onChange={(e) => setNewBazar({ ...newBazar, cost: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />

        {/* Bazar Description */}
        <textarea
          placeholder="Bazar Description"
          value={newBazar.description}
          onChange={(e) =>
            setNewBazar({ ...newBazar, description: e.target.value })
          }
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />

        {/* Bazar Date */}
        <input
          type="date"
          value={newBazar.date}
          onChange={(e) => setNewBazar({ ...newBazar, date: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />

        {/* Submit Button */}
        <button
          onClick={handleAddOrUpdateBazar}
          className="w-full p-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          {newBazar.id ? "Update Bazar" : "Add Bazar"}
        </button>
      </div>

      {/* Bazar List */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Bazar List</h2>
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2 border border-blue-500 text-left">Name</th>
              <th className="p-2 border border-blue-500 text-left">Cost</th>
              <th className="p-2 border border-blue-500 text-left">Description</th>
              <th className="p-2 border border-blue-500 text-left">Date</th>
              <th className="p-2 border border-blue-500 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBazaars.map((bazar) => (
              <tr key={bazar.id} className="hover:bg-gray-100">
                <td className="p-2 border border-gray-300">
                  {people.find((person) => person.id === bazar.personId)?.name}
                </td>
                <td className="p-2 border border-gray-300">{bazar.cost}</td>
                <td className="p-2 border border-gray-300">{bazar.description}</td>
                <td className="p-2 border border-gray-300">{bazar.date}</td>
                <td className="p-2 border border-gray-300">
                  <button
                    onClick={() => setNewBazar(bazar)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="mx-4 self-center text-lg">{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= bazaars.length}
          className="p-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Bazer;

"use client";
import { bazerInsertAction, bazerUpdateAction, otherCostGetListAction, otherCostInsertAction, otherCostUpdateAction } from "@/app/actions";
import Spinner from "@/componet/ui/Spinner";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";


const OtherCost = ({ initialBazaars }) => {
  const [bazaars, setBazaars] = useState(initialBazaars);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [newBazar, setNewBazar] = useState({
    name: "",
    cost: "",
    description: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Add or Update Bazar
  const handleAddOrUpdateBazar = async () => {
    setIsLoading(true);
    try {
      if (newBazar.id) {
        const response = await otherCostUpdateAction(newBazar.id, newBazar);
        if (response.error) toast.error(response.error);
        else {
          toast.success("Bazar updated successfully!");
          setNewBazar({ name: "", cost: "", description: ""});
        }
      } else {
        const response = await otherCostInsertAction(newBazar);
        if (response.error) toast.error(response.error);
        else {
          toast.success("Bazar added successfully!");
          setNewBazar({ name: "", cost: "", description: "", });
        }
      }
    } catch {
      toast.error("Failed to add/update bazar. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // Pagination logic
  const indexOfLastBazar = currentPage * itemsPerPage;
  const indexOfFirstBazar = indexOfLastBazar - itemsPerPage;
  const currentBazaars = bazaars.slice(indexOfFirstBazar, indexOfLastBazar);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0"); // Get month (1-based)
    const currentYear = currentDate.getFullYear(); // Get year
    const defaultDate = `${currentYear}-${currentMonth}`; // Format as "YYYY-MM"
    setSelectedDate(defaultDate); // Set default month and year in state
    handleDateFilter(defaultDate); // Fetch data for the current month and year
  }, []);

  const handleDateFilter = async (date) => {
    setSelectedDate(date);
    if (!date) {
      setFilteredBazaars(bazaars); // Show all bazaars if no date selected
      return;
    }

    const [year, month] = date.split("-");
    setIsLoading(true); // Show loading spinner while fetching data
    try {
      if (month) {
        const response = await otherCostGetListAction(month, year);
        if (response.error) {
          toast.error(response.error);
        } else {
          setBazaars(response); // Update filteredBazaars with fetched data
        }
      }
    } catch (err) {
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };


  if (isLoading) return <Spinner size="xl" color="blue" />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-700">
        Other Cost List
      </h1>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {newBazar.id ? "Edit Entry" : "Add New Entry"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddOrUpdateBazar();
          }}
        >
          {/* Name Selector */}
          <input
          type="text"
            value={newBazar.name}
            onChange={(e) => setNewBazar({ ...newBazar, name: e.target.value })}
            className="w-full p-3 mb-4 border rounded-md focus:ring focus:ring-blue-300"
            placeholder="Enter Name"
          />
         
          {/* Cost Input */}
          <input
            type="number"
            placeholder="Enter Amount"
            value={newBazar.cost}
            onChange={(e) => setNewBazar({ ...newBazar, cost: e.target.value })}
            className="w-full p-3 mb-4 border rounded-md focus:ring focus:ring-blue-300"
          />

          {/* Description Input */}
          <textarea
            placeholder="Enter Description"
            value={newBazar.description}
            onChange={(e) =>
              setNewBazar({ ...newBazar, description: e.target.value })
            }
            className="w-full p-3 mb-4 border rounded-md focus:ring focus:ring-blue-300"
            rows="3"
          ></textarea>


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            {newBazar.id ? "Update Entry" : "Add Entry"}
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Entries</h2>
        <div className="mb-4">
            <label className="block font-semibold mb-2">
              Filter by Month and Year:
            </label>
            <input
              type="month" // "month" input to select month and year
              value={selectedDate}
              onChange={(e) => handleDateFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-60"
            />
          </div>
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBazaars.map((bazar) => (
              <tr key={bazar.id} className="hover:bg-gray-100">
                <td className="p-3">{bazar.name}</td>
                <td className="p-3">{bazar.cost}</td>
                <td className="p-3">{bazar.description}</td>
                <td className="p-3">
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
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center text-lg">{currentPage}</span>
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

export default OtherCost;

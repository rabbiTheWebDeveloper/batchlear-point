"use client";
import React, { useState } from 'react';

const initialBazaars = [
  { id: 1, name: 'Bazar 1', cost: 150, description: 'Food and vegetables', date: '2025-01-01' },
  { id: 2, name: 'Bazar 2', cost: 200, description: 'Clothes and accessories', date: '2025-01-02' },
  { id: 3, name: 'Bazar 3', cost: 250, description: 'Electronics and gadgets', date: '2025-01-03' },
  { id: 4, name: 'Bazar 4', cost: 180, description: 'Books and stationery', date: '2025-01-04' },
  { id: 5, name: 'Bazar 5', cost: 120, description: 'Toys and games', date: '2025-01-05' },
  { id: 6, name: 'Bazar 6', cost: 300, description: 'Furniture and home appliances', date: '2025-01-06' },
];

const BazarPage = () => {
  const [bazaars, setBazaars] = useState(initialBazaars);
  const [newBazar, setNewBazar] = useState({ name: '', cost: '', description: '', date: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Add or Update Bazar
  const handleAddOrUpdateBazar = () => {
    if (newBazar.id) {
      // Update existing bazar
      setBazaars(bazaars.map(bazar => bazar.id === newBazar.id ? newBazar : bazar));
    } else {
      // Add new bazar
      setBazaars([...bazaars, { ...newBazar, id: bazaars.length + 1 }]);
    }
    setNewBazar({ name: '', cost: '', description: '', date: '' }); // Reset form
  };

  // Pagination logic
  const indexOfLastBazar = currentPage * itemsPerPage;
  const indexOfFirstBazar = indexOfLastBazar - itemsPerPage;
  const currentBazaars = bazaars.slice(indexOfFirstBazar, indexOfLastBazar);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Bazar List</h1>

      {/* Add / Update Bazar Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">{newBazar.id ? 'Update' : 'Add'} Bazar</h2>
        <input
          type="text"
          placeholder="Bazar Name"
          value={newBazar.name}
          onChange={(e) => setNewBazar({ ...newBazar, name: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Bazar Cost"
          value={newBazar.cost}
          onChange={(e) => setNewBazar({ ...newBazar, cost: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />
        <textarea
          placeholder="Bazar Description"
          value={newBazar.description}
          onChange={(e) => setNewBazar({ ...newBazar, description: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />
        <input
          type="date"
          value={newBazar.date}
          onChange={(e) => setNewBazar({ ...newBazar, date: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />
        <button
          onClick={handleAddOrUpdateBazar}
          className="w-full p-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          {newBazar.id ? 'Update Bazar' : 'Add Bazar'}
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
            {currentBazaars.map(bazar => (
              <tr key={bazar.id} className="hover:bg-gray-100">
                <td className="p-2 border border-gray-300">{bazar.name}</td>
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

export default BazarPage;

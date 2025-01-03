"use client";
import React, { useState } from 'react';

const initialDeposits = [
  { id: 1, name: 'Rabbi', amount: 100, description: 'Initial deposit', date: '2025-01-01' },
  { id: 2, name: 'Rahim', amount: 200, description: 'Payment for service', date: '2025-01-02' },
  { id: 3, name: 'Karim', amount: 150, description: 'Deposit for shopping', date: '2025-01-03' },
  { id: 4, name: 'Hasan', amount: 300, description: 'Monthly subscription', date: '2025-01-04' },
];

const Deposit = () => {
  const [deposits, setDeposits] = useState(initialDeposits);
  const [newDeposit, setNewDeposit] = useState({ name: '', amount: '', description: '', date: '' });
  const [editDeposit, setEditDeposit] = useState(null);
  const [showDetails, setShowDetails] = useState(null); // Track which deposit's details to show

  // Handle Add or Update Deposit
  const handleDeposit = () => {
    if (editDeposit) {
      // Update the existing deposit
      setDeposits(deposits.map(deposit =>
        deposit.id === editDeposit.id ? { ...editDeposit, amount: parseFloat(newDeposit.amount), date: newDeposit.date, description: newDeposit.description } : deposit
      ));
      setEditDeposit(null); // Reset edit state
    } else {
      // Add new deposit
      setDeposits([
        ...deposits,
        { ...newDeposit, id: deposits.length + 1, amount: parseFloat(newDeposit.amount), date: newDeposit.date, description: newDeposit.description },
      ]);
    }

    // Reset the form
    setNewDeposit({ name: '', amount: '', description: '', date: '' });
  };

  // Handle Edit Deposit
  const handleEdit = (deposit) => {
    setNewDeposit({ name: deposit.name, amount: deposit.amount, description: deposit.description, date: deposit.date });
    setEditDeposit(deposit); // Set the deposit being edited
  };

  // Toggle the visibility of the payment details
  const toggleDetails = (id) => {
    setShowDetails(showDetails === id ? null : id); // Toggle between showing and hiding details
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Deposit System</h1>

      {/* Deposit Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">{editDeposit ? 'Update Deposit' : 'Add Deposit'}</h2>

        <input
          type="text"
          placeholder="Person Name"
          value={newDeposit.name}
          onChange={(e) => setNewDeposit({ ...newDeposit, name: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Deposit Amount"
          value={newDeposit.amount}
          onChange={(e) => setNewDeposit({ ...newDeposit, amount: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />
        <textarea
          placeholder="Deposit Description"
          value={newDeposit.description}
          onChange={(e) => setNewDeposit({ ...newDeposit, description: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />
        <input
          type="date"
          value={newDeposit.date}
          onChange={(e) => setNewDeposit({ ...newDeposit, date: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />
        <button
          onClick={handleDeposit}
          className="w-full p-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          {editDeposit ? 'Update Deposit' : 'Add Deposit'}
        </button>
      </div>

      {/* Deposit History */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Deposit History</h2>
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2 border border-blue-500 text-left">Name</th>
              <th className="p-2 border border-blue-500 text-left">Amount</th>
              <th className="p-2 border border-blue-500 text-left">Date</th>
              <th className="p-2 border border-blue-500 text-left">Actions</th>
              <th className="p-2 border border-blue-500 text-left">Payment Details</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((deposit) => (
              <tr key={deposit.id} className="hover:bg-gray-100">
                <td className="p-2 border border-gray-300">{deposit.name}</td>
                <td className="p-2 border border-gray-300">{deposit.amount}</td>
                <td className="p-2 border border-gray-300">{deposit.date}</td>
                <td className="p-2 border border-gray-300">
                  <button
                    onClick={() => handleEdit(deposit)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </td>
                <td className="p-2 border border-gray-300">
                  <button
                    onClick={() => toggleDetails(deposit.id)}
                    className="text-blue-600 hover:underline"
                  >
                    {showDetails === deposit.id ? 'Hide Details' : 'Show Payment Details'}
                  </button>

                  {/* Payment Details */}
                  {showDetails === deposit.id && (
                    <div className="mt-2 bg-gray-50 p-4 rounded-md border border-gray-300">
                      <p><strong>Description:</strong> {deposit.description}</p>
                      <p><strong>Amount:</strong> {deposit.amount}</p>
                      <p><strong>Date:</strong> {deposit.date}</p>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Deposit;

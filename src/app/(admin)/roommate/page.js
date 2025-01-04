"use client";
import React, { useState } from "react";

const RoommatePage = () => {
  const [roommates, setRoommates] = useState([]);
  const [newRoommate, setNewRoommate] = useState({ name: "", phone: "" });
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoommate({ ...newRoommate, [name]: value });
  };

  const addRoommate = () => {
    if (newRoommate.name && newRoommate.phone) {
      if (editIndex !== null) {
        const updatedRoommates = [...roommates];
        updatedRoommates[editIndex] = newRoommate;
        setRoommates(updatedRoommates);
        setEditIndex(null);
      } else {
        setRoommates([...roommates, newRoommate]);
      }
      setNewRoommate({ name: "", phone: "" });
    }
  };

  const deleteRoommate = (index) => {
    setRoommates(roommates.filter((_, i) => i !== index));
  };

  const editRoommate = (index) => {
    setEditIndex(index);
    setNewRoommate(roommates[index]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Roommate Manager</h1>

      {/* Add/Edit Form */}
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {editIndex !== null ? "Edit Roommate" : "Add Roommate"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={newRoommate.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={newRoommate.phone}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter phone number"
            />
          </div>
          <button
            onClick={addRoommate}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          >
            {editIndex !== null ? "Update Roommate" : "Add Roommate"}
          </button>
        </div>
      </div>

      {/* Roommate List */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Roommate List</h2>
        {roommates.length === 0 ? (
          <p className="text-gray-500">No roommates added yet.</p>
        ) : (
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border border-gray-300 text-left">Name</th>
                <th className="p-3 border border-gray-300 text-left">
                  Phone Number
                </th>
                <th className="p-3 border border-gray-300 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {roommates.map((roommate, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition duration-300"
                >
                  <td className="p-3 border border-gray-300">{roommate.name}</td>
                  <td className="p-3 border border-gray-300">{roommate.phone}</td>
                  <td className="p-3 border border-gray-300 text-center">
                    <button
                      onClick={() => editRoommate(index)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRoommate(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RoommatePage;

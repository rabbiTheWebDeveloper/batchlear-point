"use client";
import { roommateDeleteAction, roommateInsertAction, roommateUpdateAction } from "@/app/actions";
import Spinner from "@/componet/ui/Spinner";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Roommate = ({ roommates}) => {
  const [newRoommate, setNewRoommate] = useState({ name: "", phone: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoommate({ ...newRoommate, [name]: value });
  };

  const addRoommate =async () => {
    if (newRoommate.name && newRoommate.phone) {
      if (editIndex !== null) {
        try {
          setIsLoading(true);
          const response = await roommateUpdateAction(editId ,{ name: newRoommate.name, phone: newRoommate.phone });
          if (response.error) {
            toast.error(response.error);
          } else {
            toast.success("Edit added successfully!");
            setNewRoommate({ name: "", phone: "" });// Clear the input field after adding
          }
        } catch (err) {
          toast.error("Failed to add user. Please try again.");
        }finally {
          setIsLoading(false);
        }

        setEditIndex(null);
      } else {

        try {
          setIsLoading(true);
          const response = await roommateInsertAction({ name: newRoommate.name, phone: newRoommate.phone });
          if (response.error) {
            toast.error(response.error);
          } else {
            toast.success("User added successfully!");
            setNewRoommate({ name: "", phone: "" });// Clear the input field after adding
          }
        } catch (err) {
          toast.error("Failed to add user. Please try again.");
        }finally {
          setIsLoading(false);
        }
      }
      setNewRoommate({ name: "", phone: "" });
    }
  };

  const deleteRoommate =async (id) => {
    try {
      setIsLoading(true);
      const response = await roommateDeleteAction(id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Deleted successfully!");// Clear the input field after adding
      }
    } catch (err) {
      toast.error("Failed to add user. Please try again.");
    }finally {
      setIsLoading(false);
    }
  };

  const editRoommate = (index , id) => {
    setEditIndex(index);
    setEditId(id);
    setNewRoommate(roommates[index]);
  };
 const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

if (!isClient) {
  return null; // or a loading spinner, etc.
}
if ( isLoading) {
  return  <Spinner size="xl" color="blue" />; // or a loading spinner, etc.
}
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
                      onClick={() => editRoommate( index,roommate.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRoommate(roommate.id)}
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

export default Roommate;

"use client";
import { depositGetListAction, depositInsertAction, depositUpdateAction } from "@/app/actions";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";


const DepositMoney = ({ persons, deposits: initialDeposits }) => {
  const [deposits, setDeposits] = useState(initialDeposits);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const [newDeposit, setNewDeposit] = useState({
    personId: "",
    amount: "",
    description: "",
    date: "",
  });

  // console.log(deposits);
  const [editDeposit, setEditDeposit] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const handleDeposit = async () => {
    if (
      !newDeposit.personId ||
      !newDeposit.amount ||
      !newDeposit.date ||
      !newDeposit.description
    ) {
      toast.error("Please fill out all fields.");
      return;
    }
    if (editDeposit) {
      setIsLoading(true);
      try {
        const response = await depositUpdateAction(editDeposit.id, newDeposit);
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("ADD added successfully!");
          setNewRoommate({ name: "", phone: "" }); // Clear the input field after adding
        }
      } catch (err) {
        toast.error("Failed to add user. Please try again.");
      } finally {
        setIsLoading(false);
      }
      setEditDeposit(null);
    } else {
      // setDeposits([
      setIsLoading(true);
      try {
        const response = await depositInsertAction(newDeposit);
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("ADD added successfully!");
          setNewRoommate({ name: "", phone: "" }); // Clear the input field after adding
        }
      } catch (err) {
        toast.error("Failed to add user. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    setNewDeposit({ personId: "", amount: "", description: "", date: "" });
  };

  const handleEdit = (deposit) => {
    setNewDeposit({
      personId: deposit.personId || "",
      amount: deposit.amount,
      description: deposit.description,
      date: deposit.date,
    });
    setEditDeposit(deposit);
  };

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
        const response = await depositGetListAction(month, year);
        if (response.error) {
          toast.error(response.error);
        } else {
          setDeposits(response); // Update filteredBazaars with fetched data
        }
      }
    } catch (err) {
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  // if (isLoading) {
  //   return <Spinner size="xl" color="blue" />; // or a loading spinner, etc.
  // }
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Deposit System</h1>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editDeposit ? "Update Deposit" : "Add Deposit"}
        </h2>
        <select
          value={newDeposit.personId}
          onChange={(e) =>
            setNewDeposit({ ...newDeposit, personId: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded-md"
        >
          <option value="">Select Person</option>
          {persons.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={newDeposit.amount}
          onChange={(e) =>
            setNewDeposit({ ...newDeposit, amount: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded-md"
        />
        <textarea
          placeholder="Description"
          value={newDeposit.description}
          onChange={(e) =>
            setNewDeposit({ ...newDeposit, description: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded-md"
        />
        <input
          type="date"
          value={newDeposit.date}
          onChange={(e) =>
            setNewDeposit({ ...newDeposit, date: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded-md"
        />
        <button
          onClick={handleDeposit}
          className="w-full p-2 bg-blue-600 text-white rounded-md"
        >
          {editDeposit ? "Update Deposit" : "Add Deposit"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Deposit History</h2>

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
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((deposit) => (
              <tr key={deposit.id} className="hover:bg-gray-100">
                <td className="p-2 border">{deposit?.person?.name}</td>
                <td className="p-2 border">{deposit.amount}</td>
                <td className="p-2 border">{deposit.date}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleEdit(deposit)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepositMoney;

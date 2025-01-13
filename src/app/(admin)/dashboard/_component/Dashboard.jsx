"use client";

import {
  FaUtensils,
  FaMoneyBillWave,
  FaShoppingCart,
  FaBalanceScale,
} from "react-icons/fa";
import { MdAttachMoney, MdOutlinePendingActions } from "react-icons/md";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// const reports = [
//   {
//     name: "John Doe",
//     totalMeals: 15,
//     mealRate: 50,
//     totalMealCost: 750,
//     given: 800,
//     bazer: 600,
//     otherCost: 50,
//     due: 0,
//   },
//   {
//     name: "Jane Smith",
//     totalMeals: 20,
//     mealRate: 50,
//     totalMealCost: 1000,
//     given: 900,
//     bazer: 700,
//     otherCost: 100,
//     due: 100,
//   },
//   {
//     name: "Alice Johnson",
//     totalMeals: 12,
//     mealRate: 50,
//     totalMealCost: 600,
//     given: 700,
//     bazer: 500,
//     otherCost: 50,
//     due: 0,
//   },
//   {
//     name: "Bob Brown",
//     totalMeals: 18,
//     mealRate: 50,
//     totalMealCost: 900,
//     given: 1000,
//     bazer: 800,
//     otherCost: 50,
//     due: -100,
//   },
//   {
//     name: "Charlie Davis",
//     totalMeals: 10,
//     mealRate: 50,
//     totalMealCost: 500,
//     given: 500,
//     bazer: 400,
//     otherCost: 50,
//     due: 50,
//   },
//   {
//     name: "Eve White",
//     totalMeals: 25,
//     mealRate: 50,
//     totalMealCost: 1250,
//     given: 1200,
//     bazer: 1000,
//     otherCost: 100,
//     due: 50,
//   },
// ];
export default function Dashboard({ dashboardData  ,reports}) {
  const downloadPDF = () => {
    const doc = new jsPDF();
    const table = document.getElementById("report-table");
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 190;
      const pageHeight = 290;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 10;
      doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save("Report.pdf");
    });
  };

  const downloadImage = () => {
    const table = document.getElementById("report-table");
    html2canvas(table).then((canvas) => {
      const link = document.createElement("a");
      link.download = "Report.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Total Meal */}
         <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <FaUtensils className="text-blue-600 text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Total Meal</h2>
            <p className="text-gray-600 text-xl font-bold">
              {dashboardData.totalMeals}
            </p>
          </div>
        </div>

        {/* Total Cost */}
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <FaMoneyBillWave className="text-green-600 text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Total Cost</h2>
            <p className="text-gray-600 text-xl font-bold">
              ৳ {dashboardData.totallCost}
            </p>
          </div>
        </div>

        {/* Total Bazar */}
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <FaShoppingCart className="text-yellow-600 text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Total Bazar</h2>
            <p className="text-gray-600 text-xl font-bold">
              ৳ {dashboardData.totalBazer}
            </p>
          </div>
        </div>

        {/* Meal Charge */}
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <FaBalanceScale className="text-purple-600 text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Meal Charge</h2>
            <p className="text-gray-600 text-xl font-bold">
              ৳ {dashboardData?.mealCharge?.toFixed(2)}/meal
            </p>
          </div>
        </div>

        {/* Total Given */}
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <MdAttachMoney className="text-red-600 text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Total Given</h2>
            <p className="text-gray-600 text-xl font-bold">
              ৳ {dashboardData.totalDeposit}
            </p>
          </div>
        </div>

        {/* Total Due */}
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <MdOutlinePendingActions className="text-indigo-600 text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Total Due</h2>
            <p className="text-gray-600 text-xl font-bold">৳ 00</p>
          </div>
        </div>
      </div>

      {/* Previous Month Report */}
      <h1 className="text-2xl font-bold mt-8 mb-6">Previous Month Report</h1>

      {/* Download Buttons */}
      <div className="mb-4">
        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 mr-2"
        >
          Download PDF
        </button>
        <button
          onClick={downloadImage}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700"
        >
          Download Image
        </button>
      </div>

      {/* Report Table */}
      <div
        id="report-table-wrapper"
        className="overflow-x-auto bg-white rounded-lg shadow-md p-4"
      >
        <table
          id="report-table"
          className="table-auto w-full border-collapse border border-gray-200"
        >
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Total Meals</th>
              <th className="border border-gray-300 px-4 py-2">Meal Rate</th>
              <th className="border border-gray-300 px-4 py-2">
                Total Meal Cost
              </th>
              <th className="border border-gray-300 px-4 py-2">TK Given</th>
              <th className="border border-gray-300 px-4 py-2">Bazer</th>
              <th className="border border-gray-300 px-4 py-2">Other Cost</th>
              <th className="border border-gray-300 px-4 py-2">Due</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="border border-gray-300 px-4 py-2">{report.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {report.totalMeals}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ৳ {report.mealRate}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ৳ {report.mealCost}
                </td>
                <td className="border border-gray-300 px-4 py-2">৳ {report.totalDeposit}</td>
                <td className="border border-gray-300 px-4 py-2">৳ {report.totalBazar}</td>
                <td className="border border-gray-300 px-4 py-2">
                  ৳ {report.sharedCostPerRoommate}
                </td>
                <td className="border border-gray-300 px-4 py-2">৳ {report.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

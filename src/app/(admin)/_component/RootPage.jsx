"use client";
import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// Component to display meal and bazar reports
const RootPage = ({ mealData, bazerData, reports }) => {
  // Create summary report per person
  const report = mealData.map((entry) => {
    const personName = entry.person.name;
    const totalMeals = entry.meals.reduce((sum, m) => sum + (m.count || 0), 0);
    const personBazerEntries = bazerData.filter(
      (b) => b.personId === entry.person._id
    );
    const totalBazerCost = personBazerEntries.reduce(
      (sum, b) => sum + (b.cost || 0),
      0
    );
    return {
      name: personName,
      meals: totalMeals,
      bazer: totalBazerCost,
    };
  });

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title Section
    doc.setFontSize(18);
    doc.text("Monthly Report", 105, 20, null, null, "center");
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 30);
    doc.text("Description: Monthly meal and expense summary", 15, 40);

    // Table Section
    const table = document.getElementById("report-table");
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 190;
      const pageHeight = 290;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let position = 50;

      doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      let heightLeft = imgHeight - (pageHeight - position);

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Signature Section
      doc.setFontSize(12);
      doc.text("Signature:", 15, doc.internal.pageSize.height - 20);
      doc.line(
        40,
        doc.internal.pageSize.height - 20,
        100,
        doc.internal.pageSize.height - 20
      );

      doc.save("Monthly_Report.pdf");
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 space-y-12">
      {/* Summary Table */}
      <div>
        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
          মাসিক সারাংশ রিপোর্ট 📊
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead className="bg-blue-100 text-gray-800">
              <tr>
                <th className="py-3 px-4 text-left">👤 নাম</th>
                <th className="py-3 px-4 text-left">🍽️ মোট মিল</th>
                <th className="py-3 px-4 text-left">🛒 বাজার খরচ (৳)</th>
              </tr>
            </thead>
            <tbody>
              {report.map((person, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{person.name}</td>
                  <td className="py-3 px-4">{person.meals}</td>
                  <td className="py-3 px-4">৳ {person.bazer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Monthly Meal Report */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Monthly Meal Report</h1>
        <div className="space-y-8">
          {mealData.map((entry) => {
            const { person, meals, month } = entry;
            const totalMeals = meals.reduce(
              (sum, day) => sum + (day?.count || 0),
              0
            );

            return (
              <div key={entry.id} className="bg-white rounded-2xl shadow p-4">
                <div className="flex justify-between items-center mb-2 border-b pb-2">
                  <div>
                    <h2 className="text-xl font-semibold">{person.name}</h2>
                    <p className="text-gray-500 text-sm">{person.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-blue-600">
                      Month: {month}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-sm">
                  {meals.map((day, index) => (
                    <div key={index} className="bg-gray-100 rounded p-2">
                      <div className="font-medium">Day {index + 1}</div>
                      <div className="text-gray-700">
                        {day.count || 0} meals
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-right">
                  <span className="font-semibold text-lg">
                    Total: {totalMeals} meals
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
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
          <h1 className="text-2xl font-bold mb-4">
            Report is from {new Date().getFullYear()}
          </h1>
          <table
            id="report-table"
            className="table-auto w-full border-collapse border border-gray-200"
          >
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">
                  Total Meals
                </th>
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
                  <td className="border border-gray-300 px-4 py-2">
                    {report.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {report.totalMeals}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ৳ {report.mealRate}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ৳ {report.mealCost}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ৳ {report.totalDeposit}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ৳ {report.totalBazar}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ৳ {report?.sharedCostPerRoommate}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ৳ {report?.balance?.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-300 font-bold">
                <td className="border border-gray-300 px-4 py-2">Total</td>
                <td className="border border-gray-300 px-4 py-2">
                  {reports.reduce((sum, r) => sum + r.totalMeals, 0)}
                </td>
                <td className="border border-gray-300 px-4 py-2">-</td>{" "}
                {/* Meal rate isn't summed */}
                <td className="border border-gray-300 px-4 py-2">
                  ৳{" "}
                  {reports
                    .reduce((sum, r) => sum + parseFloat(r.mealCost), 0)
                    .toFixed(1)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ৳{" "}
                  {reports
                    .reduce((sum, r) => sum + r.totalDeposit, 0)
                    .toFixed(1)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ৳{" "}
                  {reports.reduce((sum, r) => sum + r.totalBazar, 0).toFixed(1)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ৳{" "}
                  {reports
                    .reduce((sum, r) => sum + r.sharedCostPerRoommate, 0)
                    .toFixed(1)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ৳ {reports.reduce((sum, r) => sum + r.balance, 0)?.toFixed(1)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RootPage;

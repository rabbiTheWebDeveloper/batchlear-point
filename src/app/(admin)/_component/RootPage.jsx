"use client";
import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const RootPage = ({ mealData, bazerData, reports }) => {
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
    doc.setFontSize(18);
    doc.text("Monthly Report", 105, 20, null, null, "center");
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 30);
    doc.text("Description: Monthly meal and expense summary", 15, 40);

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
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-white p-6 md:p-10 space-y-14">
      {/* Summary Table */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          📊 মাসিক সারাংশ রিপোর্ট
        </h2>
        <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100 text-gray-800">
              <tr>
                <th className="py-3 px-5 text-left">👤 নাম</th>
                <th className="py-3 px-5 text-left">🍽️ মোট মিল</th>
                <th className="py-3 px-5 text-left">🛒 বাজার খরচ (৳)</th>
              </tr>
            </thead>
            <tbody>
              {report.map((person, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-5 font-medium">{person.name}</td>
                  <td className="py-3 px-5">{person.meals}</td>
                  <td className="py-3 px-5">৳ {person.bazer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Reports */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-blue-800">মাসিক খাবার রিপোর্ট</h1>
        <div className="space-y-10">
          {mealData.map((entry) => {
            const { person, meals, month } = entry;
            const totalMeals = meals.reduce((sum, day) => sum + (day?.count || 0), 0);

            return (
              <div key={entry.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{person.name}</h2>
                    <p className="text-sm text-gray-500">{person.phone}</p>
                  </div>
                  <span className="text-sm font-medium text-blue-600">Month: {month}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-sm">
                  {meals.map((day, index) => (
                    <div key={index} className="bg-gray-100 rounded-md p-2">
                      <div className="font-medium">Day {index + 1}</div>
                      <div>{day.count || 0} meals</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-right">
                  <span className="font-semibold text-lg text-gray-700">
                    Total: {totalMeals} meals
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Report Table */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-blue-800">Previous Month Report</h1>

        <div className="flex gap-4 mb-4">
          <button
            onClick={downloadPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow"
          >
            Download PDF
          </button>
          <button
            onClick={downloadImage}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 shadow"
          >
            Download Image
          </button>
        </div>

        <div
          id="report-table-wrapper"
          className="overflow-x-auto bg-white rounded-lg shadow p-4"
        >
          <h1 className="text-xl font-semibold mb-4 text-gray-800">
            Report is from {new Date().getFullYear()}
          </h1>
          <table
            id="report-table"
            className="table-auto w-full border border-gray-200 text-sm"
          >
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Total Meals</th>
                <th className="border px-3 py-2">Meal Rate</th>
                <th className="border px-3 py-2">Total Meal Cost</th>
                <th className="border px-3 py-2">TK Given</th>
                <th className="border px-3 py-2">Bazer</th>
                <th className="border px-3 py-2">Other Cost</th>
                <th className="border px-3 py-2">Due</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="border px-3 py-2">{r.name}</td>
                  <td className="border px-3 py-2">{r.totalMeals}</td>
                  <td className="border px-3 py-2">৳ {r.mealRate}</td>
                  <td className="border px-3 py-2">৳ {r.mealCost}</td>
                  <td className="border px-3 py-2">৳ {r.totalDeposit}</td>
                  <td className="border px-3 py-2">৳ {r.totalBazar}</td>
                  <td className="border px-3 py-2">৳ {r.sharedCostPerRoommate}</td>
                  <td className="border px-3 py-2">৳ {r.balance.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-200 font-semibold">
                <td className="border px-3 py-2">Total</td>
                <td className="border px-3 py-2">
                  {reports.reduce((sum, r) => sum + r.totalMeals, 0)}
                </td>
                <td className="border px-3 py-2">-</td>
                <td className="border px-3 py-2">
                  ৳ {reports.reduce((sum, r) => sum + parseFloat(r.mealCost), 0).toFixed(1)}
                </td>
                <td className="border px-3 py-2">
                  ৳ {reports.reduce((sum, r) => sum + r.totalDeposit, 0).toFixed(1)}
                </td>
                <td className="border px-3 py-2">
                  ৳ {reports.reduce((sum, r) => sum + r.totalBazar, 0).toFixed(1)}
                </td>
                <td className="border px-3 py-2">
                  ৳ {reports.reduce((sum, r) => sum + r.sharedCostPerRoommate, 0).toFixed(1)}
                </td>
                <td className="border px-3 py-2">
                  ৳ {reports.reduce((sum, r) => sum + r.balance, 0).toFixed(1)}
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

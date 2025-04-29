"use client";
import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FiDownload, FiFileText, FiImage, FiPrinter, FiUser, FiDollarSign, FiCoffee } from "react-icons/fi";

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
      personId: entry.person._id
    };
  });

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm"
    });

    // Title Section
    doc.setFontSize(20);
    doc.setTextColor(29, 78, 216); // Blue-600
    doc.text("Monthly Report Summary", 145, 15, null, null, "center");
    
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99); // Gray-600
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 25);
    doc.text("Mess Management System", 15, 32);

    // Summary Table
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Summary Overview", 15, 45);
    
    doc.setFontSize(10);
    // Table headers
    doc.setFillColor(219, 234, 254); // Blue-100
    doc.rect(15, 50, 260, 8, 'F');
    doc.setTextColor(31, 41, 55); // Gray-800
    doc.text("Name", 20, 55);
    doc.text("Total Meals", 80, 55);
    doc.text("Bazar Cost (৳)", 140, 55);
    
    // Table rows
    let y = 60;
    report.forEach((person, i) => {
      doc.setTextColor(0, 0, 0);
      doc.text(person.name, 20, y);
      doc.text(person.meals.toString(), 80, y);
      doc.text(`৳ ${person.bazer.toFixed(2)}`, 140, y);
      y += 7;
      
      // Add page if content exceeds page height
      if (y > 180) {
        doc.addPage();
        y = 20;
      }
    });

    // Detailed Report Section
    doc.addPage();
    doc.setFontSize(20);
    doc.setTextColor(29, 78, 216);
    doc.text("Detailed Monthly Report", 145, 15, null, null, "center");
    
    doc.setFontSize(10);
    // Table headers for detailed report
    doc.setFillColor(219, 234, 254);
    doc.rect(15, 25, 260, 8, 'F');
    doc.setTextColor(31, 41, 55);
    const headers = [
      "Name", "Total Meals", "Meal Rate", "Total Meal Cost", 
      "TK Given", "Bazer", "Other Cost", "Due"
    ];
    const colWidth = 260 / headers.length;
    
    headers.forEach((header, i) => {
      doc.text(header, 15 + (i * colWidth) + 5, 30);
    });
    
    // Table rows for detailed report
    y = 35;
    reports.forEach((report, index) => {
      const rowData = [
        report.name,
        report.totalMeals,
        `৳ ${report.mealRate}`,
        `৳ ${report.mealCost}`,
        `৳ ${report.totalDeposit}`,
        `৳ ${report.totalBazar}`,
        `৳ ${report?.sharedCostPerRoommate?.toFixed(2) || '0.00'}`,
        `৳ ${report?.balance?.toFixed(2) || '0.00'}`
      ];
      
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(243, 244, 246); // Gray-100
        doc.rect(15, y - 3, 260, 7, 'F');
      }
      
      rowData.forEach((cell, i) => {
        doc.text(cell, 15 + (i * colWidth) + 5, y);
      });
      
      y += 7;
      
      // Add page if content exceeds page height
      if (y > 180) {
        doc.addPage();
        y = 20;
      }
    });

    // Footer with totals
    doc.setFillColor(209, 213, 219); // Gray-300
    doc.rect(15, y, 260, 8, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("Total", 20, y + 5);
    doc.text(reports.reduce((sum, r) => sum + r.totalMeals, 0).toString(), 15 + colWidth + 5, y + 5);
    doc.text("-", 15 + (2 * colWidth) + 5, y + 5);
    doc.text(`৳ ${reports.reduce((sum, r) => sum + parseFloat(r.mealCost), 0).toFixed(2)}`, 15 + (3 * colWidth) + 5, y + 5);
    doc.text(`৳ ${reports.reduce((sum, r) => sum + r.totalDeposit, 0).toFixed(2)}`, 15 + (4 * colWidth) + 5, y + 5);
    doc.text(`৳ ${reports.reduce((sum, r) => sum + r.totalBazar, 0).toFixed(2)}`, 15 + (5 * colWidth) + 5, y + 5);
    doc.text(`৳ ${reports.reduce((sum, r) => sum + r.sharedCostPerRoommate, 0).toFixed(2)}`, 15 + (6 * colWidth) + 5, y + 5);
    doc.text(`৳ ${reports.reduce((sum, r) => sum + r.balance, 0).toFixed(2)}`, 15 + (7 * colWidth) + 5, y + 5);

    // Signature line
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    doc.text("Signature:", 15, doc.internal.pageSize.height - 20);
    doc.line(35, doc.internal.pageSize.height - 20, 100, doc.internal.pageSize.height - 20);

    doc.save(`Monthly_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const downloadImage = () => {
    const input = document.getElementById("report-table-wrapper");
    html2canvas(input, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      scrollY: -window.scrollY
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `Monthly_Report_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const printReport = () => {
    const printContent = document.getElementById("report-table-wrapper").innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
      <div class="p-8 max-w-6xl mx-auto">
        <h1 class="text-2xl font-bold mb-4 text-center">Monthly Report</h1>
        ${printContent}
        <div class="mt-8 text-right">
          <p>Signature: ________________________</p>
          <p class="text-sm text-gray-500">Date: ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              মাসিক হিসাব রিপোর্ট
            </h1>
            <p className="text-gray-600 mt-1">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-colors"
            >
              <FiFileText /> PDF
            </button>
            <button
              onClick={downloadImage}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition-colors"
            >
              <FiImage /> Image
            </button>
            <button
              onClick={printReport}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow transition-colors"
            >
              <FiPrinter /> Print
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <FiUser size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Total Members</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{report.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <FiCoffee size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Total Meals</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {report.reduce((sum, r) => sum + r.meals, 0)}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                <FiDollarSign size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Total Bazar Cost</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ৳ {report.reduce((sum, r) => sum + r.bazer, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FiUser /> সদস্যদের সারাংশ
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    নাম
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    মোট মিল
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    বাজার খরচ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    প্রতি মিলের খরচ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report.map((person, i) => {
                  const totalMeals = report.reduce((sum, r) => sum + r.meals, 0);
                  const totalBazar = report.reduce((sum, r) => sum + r.bazer, 0);
                  const mealRate = totalMeals > 0 ? (totalBazar / totalMeals).toFixed(2) : 0;
                  
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            {person.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{person.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {person.meals}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ৳ {person.bazer.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ৳ {mealRate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Meal Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FiCoffee /> মাসিক খাবার রিপোর্ট
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-6">
              {mealData.map((entry) => {
                const { person, meals, month } = entry;
                const totalMeals = meals.reduce(
                  (sum, day) => sum + (day?.count || 0),
                  0
                );

                return (
                  <div key={entry.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-2 border-b border-gray-200">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-600 p-1 rounded-full">
                            <FiUser size={16} />
                          </span>
                          {person.name}
                        </h3>
                        {person.phone && (
                          <p className="text-sm text-gray-500 mt-1">{person.phone}</p>
                        )}
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                          Month: {month}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-2">
                      {meals.map((day, index) => (
                        <div 
                          key={index} 
                          className={`p-2 rounded text-center ${day.count > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}
                        >
                          <div className="text-xs font-medium">Day {index + 1}</div>
                          <div className="text-sm font-semibold">{day.count || 0}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-2 border-t border-gray-200 text-right">
                      <span className="font-semibold text-blue-600">
                        Total: {totalMeals} meals
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Financial Report */}
        <div id="report-table-wrapper" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FiDollarSign /> বিস্তারিত আর্থিক রিপোর্ট
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().getFullYear()} - {new Date().toLocaleDateString('en-US', { month: 'long' })}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table id="report-table" className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meals
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meal Rate
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meal Cost
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deposits
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bazar
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Other Cost
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {report.totalMeals}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ৳ {report.mealRate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ৳ {report.mealCost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ৳ {report.totalDeposit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ৳ {report.totalBazar}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ৳ {report?.sharedCostPerRoommate?.toFixed(2) || '0.00'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                      report?.balance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ৳ {report?.balance?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    {reports.reduce((sum, r) => sum + r.totalMeals, 0)}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    -
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    ৳ {reports.reduce((sum, r) => sum + parseFloat(r.mealCost), 0).toFixed(2)}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    ৳ {reports.reduce((sum, r) => sum + r.totalDeposit, 0).toFixed(2)}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    ৳ {reports.reduce((sum, r) => sum + r.totalBazar, 0).toFixed(2)}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    ৳ {reports.reduce((sum, r) => sum + r.sharedCostPerRoommate, 0).toFixed(2)}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    ৳ {reports.reduce((sum, r) => sum + r.balance, 0).toFixed(2)}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RootPage;
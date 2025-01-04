import Footer from "@/componet/sidebar/Footer";
import Header from "@/componet/sidebar/Header";
import Sidebar from "@/componet/sidebar/Sidebar";
import React from "react";

const layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}

      <Header />
      {/* Main Content with Sidebar */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-grow bg-white p-6 shadow-md rounded-md m-4 md:ml-50 w-5/6">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default layout;

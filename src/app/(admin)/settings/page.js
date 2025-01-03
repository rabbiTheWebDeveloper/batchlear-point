"use client";
import React, { useState } from 'react';

const Page = () => {
  const [theme, setTheme] = useState('light'); // Example of setting theme preference
  const [notifications, setNotifications] = useState(true); // Example for notification toggle

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleNotificationToggle = () => {
    setNotifications(!notifications);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-8">Settings</h1>

      {/* Settings Form */}
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">General Settings</h2>

        {/* Theme Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
          <select
            value={theme}
            onChange={handleThemeChange}
            className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Notification Toggle */}
        <div className="mb-6">
          <label className="inline-flex items-center text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={notifications}
              onChange={handleNotificationToggle}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Enable Notifications</span>
          </label>
        </div>

        {/* Save Button */}
        <button
          onClick={() => alert('Settings Saved!')}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
        >
          Save Settings
        </button>
      </div>

      {/* Privacy Settings Section */}
      <div className="max-w-xl mx-auto bg-white p-6 mt-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Privacy Settings</h2>

        {/* Data Sharing Toggle */}
        <div className="mb-6">
          <label className="inline-flex items-center text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={true} // This can be managed with state if needed
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Share Data with Third Parties</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Page;

import React from 'react';
import Dashboard from './_component/Dashboard';
import { dashboardQuery } from '@/queries/dashboard';

const page = async() => {
   let data = {};
  
    try {
      data = await dashboardQuery.getAllFromDB(); 
       // Fetch data from DB
    } catch (error) {
      console.error("Error fetching data:", error);  // Add error logging for debugging
    }
  return (
    <>
      <Dashboard dashboardData={data} />
    </>
  );
};

export default page;
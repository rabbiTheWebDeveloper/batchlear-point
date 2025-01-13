import React from 'react';
import Dashboard from './_component/Dashboard';
import { dashboardQuery } from '@/queries/dashboard';
export const dynamic = 'force-dynamic'

const page = async() => {
   let data = {};
   let report=[]
  
    try {
      data = await dashboardQuery.getAllFromDB(); 
      report = await dashboardQuery.getAllReportFromDB(); 
       // Fetch data from DB
    } catch (error) {
      console.error("Error fetching data:", error);  // Add error logging for debugging
    }
    // console.log(report);
  return (
    <>
      <Dashboard dashboardDatas={data}  reports={report} />
    </>
  );
};

export default page;
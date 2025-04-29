import React from 'react';
import RootPage from './(admin)/_component/RootPage';
import { mealTrackerQuery } from '@/queries/mealTracker';
import { roommateQuery } from '@/queries/roommate';
import { bazerQuery } from '@/queries/bazer';
import { dashboardQuery } from '@/queries/dashboard';
export const dynamic = 'force-dynamic'

const page =async () => {
    let data = [];
    let roommade = [];
    let bazer = [];
    let report=[]
    try {
      data = await mealTrackerQuery.getAllFromDB(); 
      bazer = await bazerQuery.getAllFromDB();
       report = await dashboardQuery.getAllReportFromDB(); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    // console.log(bazer)
  return (
    <RootPage
    mealData={data}
    bazerData={bazer}
    reports={report}
  />
  
  );
};

export default page;
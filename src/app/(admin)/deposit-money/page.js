import React from 'react';
import DepositMoney from './_component/DepositMoney';
import { roommateQuery } from '@/queries/roommate';
import { depositQuery } from '@/queries/deposit-money';
export const dynamic = 'force-dynamic'

const page = async() => {
  let data = [];
  let deposite = [];
  try {
    data = await roommateQuery.getAllFromDB();  // Fetch data from DB
    deposite = await depositQuery.getAllFromDB(); 
    // console.log() // Fetch data from DB
  } catch (error) {
    console.error("Error fetching data:", error);  // Add error logging for debugging
  }

// console.log(deposite)
  return (

    <>
      <DepositMoney  persons={data} deposits={deposite}/>
    </>
  );
};

export default page;
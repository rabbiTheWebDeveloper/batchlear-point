

async function getAllFromDB() {
  await dbConnect();

  const result = await DepositModel.find({})
    .populate({
      path: "personId", // Reference field in the schema
      select: "name phone", // Include these fields from the Roommate model
    })
    .lean();

  // Add a `person` field while keeping the `personId` as is
  const finalResult = result.map(deposit => ({
    ...deposit,
    person: deposit.personId, // Move populated data to a `person` field
    personId: deposit.personId?._id || deposit.personId, // Keep the original ID
  }));
  return replaceMongoIdInArray(JSON.parse(JSON.stringify(finalResult)));
}


export const dashboardQuery = {
  statIntoDB,

};

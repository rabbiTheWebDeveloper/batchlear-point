import { replaceMongoIdInArray } from "@/lib/convertData";
import { OnBoardingModel } from "@/model/onBoarding-model";
import { userModel } from "@/model/user-model";
import { dbConnect } from "@/service/mongo";


export async function saveOnBoardingQuery(onBoardingData) {
  await dbConnect(); // Ensure database connection
  try {
    const newOnBoarding = new OnBoardingModel(onBoardingData , {strict: false }); // Create a new document instance
    const savedData = await newOnBoarding.save(); // Save to database
    return {
      success: true,
      data:JSON.parse(JSON.stringify(savedData)),
    };
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    return {
      success: false,
      error: "Failed to save onboarding data. Please try again.",
    };
  }
}
export async function getOnBoarding(page = 1, limit = 90) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const onBoarding = await OnBoardingModel.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  const totalCount = await OnBoardingModel.countDocuments({});
  return {
    data: replaceMongoIdInArray(JSON.parse(JSON.stringify(onBoarding))),
    totalCount, // Total number of documents
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit), // Calculate total pages
  };
}

export async function getAffiliateReportUser(page = 1, limit = 90) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const onBoarding = await OnBoardingModel.find({ ref: { $ne: null } })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
    const totalCount = await OnBoardingModel.countDocuments({ ref: { $ne: null } });
  // console.log(onBoarding)
  return {
    data: replaceMongoIdInArray(JSON.parse(JSON.stringify(onBoarding))),
    totalCount, // Total number of documents
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit), // Calculate total pages
  };
}


export async function updateOnBoarding(data) {
  await dbConnect(); // Ensure DB is connected
  try {
    // console.log("data", data);
    
    const user = await OnBoardingModel.findOne({ email: data.email });
    // console.log("user", user);
    if (user) {
      const updateUser = await OnBoardingModel.findOneAndUpdate(
        { email: data.email },
        {note:data.note},
        { new: true, runValidators: true } // Ensure the updated doc is returned
      );
      return JSON.parse(JSON.stringify(updateUser));
    }
    return null; // Handle case where user is not found
  } catch (error) {
    console.error("Update error:", error); // Log the error for better debugging
    throw new Error(error.message); // Use error.message to prevent redundant Error wrapping
  }
}



export async function updateOnBoardingDetailsQuery(id, updateData) {
  await dbConnect();
  try {
    const updatedUser = await OnBoardingModel.findByIdAndUpdate(
      id,
      {
        note: updateData.note,
        status: updateData.status,
        paymentStatus: updateData.status === "completed" ? "paid" : "unpaid",
        followUpDate: updateData.followUpDate,
      },
      { //options
        returnNewDocument: true,
        new: true,
        strict: false
      }
      // { new: true, runValidators: true }
    );
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.error("Update error:", error);
    throw new Error(error.message);
  }
}


export async function getOnBoardingBySpecificStatusAndDate(status, searchParam, creationDate) {
  await dbConnect();

  try {
    // Build the query object with the specified status
    const query = { status };

    // Add a search term to query name, email, or phone if provided
    if (searchParam) {
      query.$or = [
        { name: { $regex: searchParam, $options: "i" } }, // Case-insensitive search for name
        { email: { $regex: searchParam, $options: "i" } }, // Case-insensitive search for email
        { phone: { $regex: searchParam, $options: "i" } }  // Case-insensitive search for phone
      ];
    }

    // Add filtering for creation date if provided
    if (creationDate) {
      // Create a new Date object for the given creation date
      const startOfDay = new Date(creationDate);
      const endOfDay = new Date(creationDate);
      endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day

      // Update the query to filter records created on the specific date
      query.createdAt = {
        $gte: startOfDay, // Greater than or equal to start of the day
        $lte: endOfDay    // Less than or equal to end of the day
      };
    }

    // Fetch the filtered onboarding data
    const onboardingData = await OnBoardingModel.find(query)
      .lean() // Use lean for faster queries, returning plain JavaScript objects
      .sort({ createdAt: -1 }); // Optional: sort by creation date, newest first

    return replaceMongoIdInArray (JSON.parse(JSON.stringify(onboardingData))); // Return the array of documents with the specified status
  } catch (error) {
    console.error("Error retrieving onboarding data by status and date:", error);
    throw new Error(error.message);
  }
}


export async function getAffiliationBySpecificStatusAndDate(status, searchParam, creationDate) {
  await dbConnect();

  try {
    // Build the query object with the specified status
    const query = { status, ref: { $ne: null } };

    // Add a search term to query name, email, or phone if provided
    if (searchParam) {
      query.$or = [
        { name: { $regex: searchParam, $options: "i" } }, // Case-insensitive search for name
        { email: { $regex: searchParam, $options: "i" } }, // Case-insensitive search for email
        { phone: { $regex: searchParam, $options: "i" } }  // Case-insensitive search for phone
      ];
    }

    // Add filtering for creation date if provided
    if (creationDate) {
      // Create a new Date object for the given creation date
      const startOfDay = new Date(creationDate);
      const endOfDay = new Date(creationDate);
      endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day

      // Update the query to filter records created on the specific date
      query.createdAt = {
        $gte: startOfDay, // Greater than or equal to start of the day
        $lte: endOfDay    // Less than or equal to end of the day
      };
    }

    // Fetch the filtered onboarding data
    const onboardingData = await OnBoardingModel.find(query)
      .lean() // Use lean for faster queries, returning plain JavaScript objects
      .sort({ createdAt: -1 }); // Optional: sort by creation date, newest first

    return replaceMongoIdInArray (JSON.parse(JSON.stringify(onboardingData))); // Return the array of documents with the specified status
  } catch (error) {
    console.error("Error retrieving onboarding data by status and date:", error);
    throw new Error(error.message);
  }
}



export async function getStatusCount() {
  await dbConnect();

  try {
    const statusCount = await OnBoardingModel.aggregate([
      {
        $group: {
          _id: "$status",             // Group by the 'status' field
          count: { $sum: 1 }          // Count the number of documents for each status
        }
      },
      {
        $project: {
          status: "$_id",            // Include status in the result
          count: 1,                  // Include count in the result
          _id: 0                     // Exclude the default _id field
        }
      }
    ]);

    return statusCount; // Return an array of objects with status and their counts
  } catch (error) {
    console.error("Error retrieving status count:", error);
    throw new Error(error.message);
  }
}
export async function getStatusCountAffiliate() {
  await dbConnect();

  try {
    const statusCount = await OnBoardingModel.aggregate([
      {
        $match: {
          ref: { $ne: null } // Only include documents where ref is not null
        }
      },
      {
        $group: {
          _id: { status: "$status", ref: "$ref" }, // Group by both status and ref
          count: { $sum: 1 } // Count the number of documents for each combination
        }
      },
      {
        $project: {
          status: "$_id.status", // Include status in the result
          ref: "$_id.ref",       // Include ref in the result
          count: 1,              // Include count in the result
          _id: 0                 // Exclude the default _id field
        }
      },
      {
        $sort: { count: -1 } // Optional: Sort by count in descending order
      }
    ]);

    return statusCount; // Return an array of objects with status, ref, and their counts
  } catch (error) {
    console.error("Error retrieving status count by ref:", error);
    throw new Error(error.message);
  }
}



export async function getAffiliateReport(id) {
  await dbConnect();

  try {
    // Fetch the data using the ref parameter and sort by creation date
    const onboardingData = await OnBoardingModel.find({ ref: id })
      .lean() // For faster performance (returns plain JavaScript objects)
      .sort({ createdAt: -1 }); // Sort by creation date, newest first
    const users = await userModel.findById(id);

    // Initialize the payment status counts
    const paymentStatusCount = {
      unpaid: 0,
      paid: 0,
      active: users?.visitorCount || 0,
      pending_payment: 0,
      approved_payment: 0
    };

    // Reduce the data to count the paymentStatus occurrences
    onboardingData.forEach((curr) => {
      if (curr.paymentStatus === 'unpaid') {
        paymentStatusCount.unpaid += 1;
      } else if (curr.paymentStatus === 'paid') {
        paymentStatusCount.paid += 1;
      }
    });

    // Calculate pending_payment based on the number of paid occurrences
    const { paid } = paymentStatusCount;

    if (paid >= 3 && paid <= 20) {
      paymentStatusCount.pending_payment = paid * 800;
    } else if (paid >= 21 && paid <= 50) {
      paymentStatusCount.pending_payment = paid * 1200;
    } else if (paid >= 81 && paid <= 120) {
      paymentStatusCount.pending_payment = paid * 1600;
    } else if (paid > 120) {
      paymentStatusCount.pending_payment = paid * 1800;
    }

    // Return the data with counts
    return paymentStatusCount;
  } catch (error) {
    // Improved error handling with a more specific message
    console.error("Error retrieving onboarding data by status and date:", error);
    throw new Error(`Failed to get affiliate report: ${error.message}`);
  }
}


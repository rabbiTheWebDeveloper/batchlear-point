import mongoose, { Schema } from "mongoose";

// Function to get number of days in a month for a given year and month (1-12)
const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate(); // Returns the number of days in the month
};

// Function to get the current month in "YYYY-MM" format
const getCurrentMonth = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure 2-digit format
  return `${year}-${month}`;
};

const mealTrackerSchema = new Schema(
  {
   personId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Roommate",
   },
    month: {
      type: String,
      required: true, // Format: "YYYY-MM" (e.g., "2025-01")
      default: getCurrentMonth, // Set the default value to the current month
    },
    meals: {
      type: [
        {
          day: { type: Number, required: true }, // Day of the month (1-31)
          count: { type: Number, default: 0 }, // Number of meals
          details: { type: String, default: "" }, // Optional details for the day
        },
      ],
      default: function () {
        // Default meals array based on the month (dynamic day count)
        const [year, month] = this.month.split("-").map(Number);
        const daysInMonth = getDaysInMonth(year, month);
        return Array.from({ length: daysInMonth }, (_, index) => ({
          day: index + 1,
          count: 0,
          details: "",
        }));
      },
    },
  },
  { timestamps: true, versionKey: false }
);

export const MealTrackerModel =
  mongoose.models.mealTracker ?? mongoose.model("mealTracker", mealTrackerSchema);

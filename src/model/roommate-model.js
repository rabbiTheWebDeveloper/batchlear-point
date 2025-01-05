import mongoose from 'mongoose';

const RoommateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // Ensures the name is provided
    trim: true,      // Removes any leading/trailing whitespace
  },
  phone: {
    type: String,
    required: true,  // Ensures the phone number is provided
    unique: true,    // Ensures phone numbers are unique
    // match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'], // Regex to validate phone number format (adjust if needed)
  },
}, {
  timestamps: true,
  versionKey: false // Automatically adds `createdAt` and `updatedAt` fields
});

const RoommateModel = mongoose.models.Roommate || mongoose.model('Roommate', RoommateSchema);

export default RoommateModel;

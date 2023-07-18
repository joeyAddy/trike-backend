const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

// Define the CarRider Schema
const carRiderSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  plateNumber: {
    type: String,
    required: true,
    unique: true,
  },
  vehicleCode: {
    type: String,
    default: () => nanoid(4), // Generate a random 4-character code using nanoid
  },
  rating: {
    type: Number,
    default: 0,
  },
  ridesCompleted: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Mongoose pre-save middleware
carRiderSchema.pre("save", async function (next) {
  // If vehicleCode is not provided or is empty, generate a new one
  if (!this.vehicleCode || this.vehicleCode.trim() === "") {
    let generatedCode = nanoid(4);
    while (true) {
      // Check if the generatedCode already exists in the database
      const existingCarRider = await this.constructor.findOne({
        vehicleCode: generatedCode,
      });
      if (!existingCarRider) {
        this.vehicleCode = generatedCode;
        break;
      }
      // Regenerate a new code if the generatedCode already exists
      generatedCode = nanoid(4);
    }
  }
  next();
});

// Create the CarRider model using the schema
const CarRider = mongoose.model("CarRider", carRiderSchema);

module.exports = CarRider;
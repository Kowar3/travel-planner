const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  isFinal: { type: Boolean, default: false },
});

module.exports = mongoose.model("Destination", DestinationSchema);

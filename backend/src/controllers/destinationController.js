const Destination = require("../models/Destination");
const Activity = require("../models/Activity");
const Expense = require("../models/Expense");
const Trip = require("../models/Trip");

exports.createDestination = async (req, res) => {
  try {
    const {
      tripId,
      city,
      country,
      startDate,
      endDate,
      latitude,
      longitude,
      isFinal,
    } = req.body;

    const trip = await Trip.findOne({ _id: tripId, userId: req.user.userId });

    if (!trip) {
      return res.status(403).json({ message: "Forbidden!" });
    }

    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    const existingDestinations = await Destination.find({ tripId });
    const overlap = existingDestinations.find((d) => {
      const dStart = new Date(d.startDate);
      const dEnd = new Date(d.endDate);
      return newStart < dEnd && newEnd > dStart;
    });

    if (overlap) {
      return res.status(400).json({
        error: `The term overlaps with an existing station: ${overlap.city}!`,
      });
    }

    const destination = new Destination({
      tripId,
      city: city || "Unknown city",
      country: country || "Unknown country",
      startDate: newStart,
      endDate: newEnd,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      isFinal: isFinal || false,
    });

    await destination.save();
    res.status(201).json(destination);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDestinationsByTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.tripId,
      userId: req.user.userId,
    });
    if (!trip) {
      return res.status(403).json({ message: "Forbidden!" });
    }

    let destinations = await Destination.find({ tripId: req.params.tripId })
      .sort({
        isFinal: 1,
        startDate: 1,
      })
      .lean();

    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found!" });
    }

    const updated = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found!" });
    }

    await Destination.findByIdAndDelete(req.params.id);
    await Activity.deleteMany({ destinationId: destination._id });
    await Expense.deleteMany({ destinationId: destination._id });

    res.json({ message: "Destination deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

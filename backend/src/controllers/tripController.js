const Activity = require("../models/Activity");
const Destination = require("../models/Destination");
const Expense = require("../models/Expense");
const Trip = require("../models/Trip");

exports.createTrip = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      title,
      description,
      startDate,
      endDate,
      totalBudget,
      startCity,
      startLat,
      startLng,
      endCity,
      endLat,
      endLng,
    } = req.body;

    const newTrip = new Trip({
      title,
      description,
      startDate,
      endDate,
      totalBudget: Number(totalBudget) || 0,
      userId,
      startCity,
      startLat,
      startLng,
      endCity,
      endLat,
      endLng,
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const { userId } = req.user;

    let { search, status, sortBy, order } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    search = search?.trim();

    let query = { userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { startCity: { $regex: search, $options: "i" } },
        { endCity: { $regex: search, $options: "i" } },
      ];
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (status === "upcoming") query.startDate = { $gt: today };
    else if (status === "past") query.endDate = { $lt: today };
    else if (status === "active") {
      query.startDate = { $lte: today };
      query.endDate = { $gte: today };
    }

    let sortObj = {};
    if (sortBy) {
      sortObj[sortBy] = order === "desc" ? -1 : 1;
    } else {
      sortObj = { startDate: 1 };
    }

    const [trips, totalTrips] = await Promise.all([
      Trip.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
      Trip.countDocuments(query),
    ]);

    res.json({
      trips,
      totalTrips,
      totalPages: Math.ceil(totalTrips / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const { userId } = req.user;
    const trip = await Trip.findOne({ _id: req.params.id, userId });

    if (!trip) return res.status(404).json({ message: "Trip not found!" });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const { userId } = req.user;
    const updateData = { ...req.body };
    if (updateData.totalBudget !== undefined) {
      updateData.totalBudget = Number(updateData.totalBudget) || 0;
    }
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId },
      updateData,
      { new: true, runValidators: true },
    );

    if (!trip) return res.status(404).json({ message: "Trip not found!" });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const { userId } = req.user;
    const tripId = req.params.id;

    const [trip, destinations] = await Promise.all([
      Trip.findOne({ _id: tripId, userId }),
      Destination.find({ tripId }),
    ]);

    if (!trip) return res.status(404).json({ message: "Trip not found!" });

    const destIds = destinations.map((d) => d._id);

    await Promise.all([
      Trip.deleteOne({ _id: tripId }),
      Activity.deleteMany({ destinationId: { $in: destIds } }),
      Expense.deleteMany({ destinationId: { $in: destIds } }),
      Destination.deleteMany({ tripId }),
    ]);

    res.json({ message: "Trip and all associated data deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

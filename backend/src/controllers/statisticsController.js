const mongoose = require("mongoose");
const Destination = require("../models/Destination");
const Activity = require("../models/Activity");
const Expense = require("../models/Expense");
const Trip = require("../models/Trip");

const tripBelongsToUser = async (tripId, userId) => {
  const trip = await Trip.findOne({ _id: tripId, userId });
  return trip;
};

exports.getTripOverview = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await tripBelongsToUser(tripId, req.user.userId);
    if (!trip) return res.status(404).json({ error: "Trip not found!" });

    const destinations = await Destination.find({ tripId });
    const destIds = destinations.map((d) => d._id);

    const stats = await Expense.aggregate([
      { $match: { destinationId: { $in: destIds } } },
      {
        $facet: {
          totalSpent: [{ $group: { _id: null, sum: { $sum: "$amount" } } }],
          categories: [
            { $group: { _id: "$category", amount: { $sum: "$amount" } } },
            { $project: { category: "$_id", amount: 1, _id: 0 } },
          ],
        },
      },
    ]);

    const totalActivities = await Activity.countDocuments({
      destinationId: { $in: destIds },
    });

    res.json({
      destinations: destinations.length,
      activities: totalActivities,
      totalSpent: stats[0].totalSpent[0]?.sum || 0,
      plannedBudget: trip.totalBudget || 0,
      categoryBreakdown: stats[0].categories,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGlobalStats = async (req, res) => {
  try {
    const { userId } = req.user;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const tripStats = await Trip.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          totalTrips: { $sum: 1 },
          totalPlanned: { $sum: "$totalBudget" },
          totalDays: {
            $sum: {
              $add: [
                {
                  $divide: [
                    { $subtract: ["$endDate", "$startDate"] },
                    1000 * 60 * 60 * 24,
                  ],
                },
                1,
              ],
            },
          },
        },
      },
    ]);

    const userDestinations = await Destination.find({
      tripId: { $in: await Trip.find({ userId }).distinct("_id") },
    }).distinct("_id");

    const expenseStats = await Expense.aggregate([
      { $match: { destinationId: { $in: userDestinations } } },
      { $group: { _id: null, totalSpent: { $sum: "$amount" } } },
    ]);

    const lastFiveTrips = await Trip.find({ userId })
      .sort({ startDate: -1 })
      .limit(5)
      .select("title totalBudget startDate endDate startCity endCity")
      .lean();

    const tStats = tripStats[0] || {
      totalTrips: 0,
      totalPlanned: 0,
      totalDays: 0,
    };
    const eStats = expenseStats[0] || { totalSpent: 0 };

    res.json({
      totalTrips: tStats.totalTrips,
      totalPlanned: tStats.totalPlanned,
      totalSpent: eStats.totalSpent,
      totalDays: Math.round(tStats.totalDays) || 0,
      lastFiveTrips: lastFiveTrips.reverse(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

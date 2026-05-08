const Destination = require("../models/Destination");
const Activity = require("../models/Activity");
const Expense = require("../models/Expense");

exports.isDestinationOwner = async (req, res, next) => {
  try {
    const destinationId =
      req.params.id || req.params.destinationId || req.body.destinationId;

    const dest = await Destination.findById(destinationId).populate("tripId");

    if (!dest)
      return res.status(404).json({ message: "Destination not found!" });

    if (dest.tripId.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        message: "You do not have permission (You do not own the trip)!",
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.isActivityOwner = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id).populate({
      path: "destinationId",
      populate: { path: "tripId" },
    });

    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    if (
      activity.destinationId.tripId.userId.toString() !==
      req.user.userId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to another's activity!" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.isExpenseOwner = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id).populate({
      path: "destinationId",
      populate: { path: "tripId" },
    });

    if (!expense) return res.status(404).json({ message: "No cost found!" });

    if (
      expense.destinationId.tripId.userId.toString() !==
      req.user.userId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to someone else's expense!" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

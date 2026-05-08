const express = require("express");

const router = express.Router();

const statisticsController = require("../controllers/statisticsController");

const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/global-stats",
  authMiddleware,
  statisticsController.getGlobalStats,
);

router.get(
  "/trip/:tripId/overview",
  authMiddleware,
  statisticsController.getTripOverview,
);

module.exports = router;

const express = require("express");

const router = express.Router();

const activityController = require("../controllers/activityController");

const authMiddleware = require("../middleware/authMiddleware");
const {
  isDestinationOwner,
  isActivityOwner,
} = require("../middleware/checkOwner");

router.post(
  "/",
  authMiddleware,
  isDestinationOwner,
  activityController.createActivity,
);

router.get(
  "/:destinationId",
  authMiddleware,
  isDestinationOwner,
  activityController.getActivitiesByDestination,
);

router.put(
  "/:id",
  authMiddleware,
  isActivityOwner,
  activityController.updateActivity,
);

router.delete(
  "/:id",
  authMiddleware,
  isActivityOwner,
  activityController.deleteActivity,
);

module.exports = router;

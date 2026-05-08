const express = require("express");

const router = express.Router();

const destinationController = require("../controllers/destinationController");

const authMiddleware = require("../middleware/authMiddleware");

const { isDestinationOwner } = require("../middleware/checkOwner");

router.post("/", authMiddleware, destinationController.createDestination);

router.get(
  "/:tripId",
  authMiddleware,
  destinationController.getDestinationsByTrip,
);

router.put(
  "/:id",
  authMiddleware,
  isDestinationOwner,
  destinationController.updateDestination,
);

router.delete(
  "/:id",
  authMiddleware,
  isDestinationOwner,
  destinationController.deleteDestination,
);

module.exports = router;

const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, tripController.createTrip);
router.get("/", authMiddleware, tripController.getTrips);
router.get("/:id", authMiddleware, tripController.getTripById);
router.put("/:id", authMiddleware, tripController.updateTrip);
router.delete("/:id", authMiddleware, tripController.deleteTrip);

module.exports = router;

const express = require("express");

const router = express.Router();

const expenseController = require("../controllers/expenseController");

const authMiddleware = require("../middleware/authMiddleware");
const {
  isDestinationOwner,
  isExpenseOwner,
} = require("../middleware/checkOwner");

router.post(
  "/",
  authMiddleware,
  isDestinationOwner,
  expenseController.createExpense,
);

router.get(
  "/:destinationId",
  authMiddleware,
  isDestinationOwner,
  expenseController.getExpensesByDestination,
);

router.put(
  "/:id",
  authMiddleware,
  isExpenseOwner,
  expenseController.updateExpense,
);

router.delete(
  "/:id",
  authMiddleware,
  isExpenseOwner,
  expenseController.deleteExpense,
);

module.exports = router;

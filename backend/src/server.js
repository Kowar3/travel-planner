const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const activityRoutes = require("./routes/activityRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");
const userRoutes = require("./routes/userRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const { apiLimiter, authLimiter } = require("./middleware/rateLimiter");

const app = express();

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

if (process.env.NODE_ENV !== "production") {
  ALLOWED_ORIGINS.push("http://localhost:5173", "http://localhost:3000");
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' is not allowed!`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.set("trust proxy", 1);

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Travel Planner API running");
});

app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/users", userRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env file!");
  process.exit(1);
}

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is working on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

startServer();

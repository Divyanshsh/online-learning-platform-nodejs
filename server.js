// Import required modules
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const app = express();
const env = process.env;

dotenv.config();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Learning Platform API",
      version: "1.0.0",
      description: "API documentation for the Learning Platform",
    },
    servers: [{ url: `http://localhost:${env.PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connect to MongoDB
mongoose
  .connect(env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(`Error connecting to MongoDB: ${err.message}`));

// Middleware
app.use(express.json());
// Serve static files for uploaded videos
app.use(
  "/videos",
  express.static(
    path.join(__dirname, env.VIDEO_STORAGE_PATH || "./uploads/videos")
  )
);

// Import routes
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const sectionRoutes = require("./routes/sectionRoutes");

// Route middlewares
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use("/reviews", reviewRoutes);
app.use("/sections", sectionRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Learning Platform API!");
});

// Start the server
app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});

/* Folder Structure:
.
├── controllers
│   ├── courseController.js
│   ├── reviewController.js
│   └── userController.js
├── middlewares
│   └── auth.js
├── models
│   ├── courseModel.js
│   ├── reviewModel.js
│   └── userModel.js
├── routes
│   ├── courseRoutes.js
│   ├── reviewRoutes.js
│   └── userRoutes.js
├── server.js
└── .env
*/

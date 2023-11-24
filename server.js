require("dotenv").config();
const express = require("express");
const { connectDB } = require("./db/db");
const notFound = require("./notFound");
const errorHandler = require("./middleware/errorHandler");

const postRouter = require("./routes/postRoute");
const userRouter = require("./routes/userRoute");
const app = express();
const port = 5000;

connectDB()
  .then(() => {
    app.use(express.json());

    app.use("/api/v1/post", postRouter);
    app.use("/api/v1/user", userRouter);

    app.use(notFound);
    app.use(errorHandler);
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });

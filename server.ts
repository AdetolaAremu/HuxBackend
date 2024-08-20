const mongoose = require("mongoose");
const dotenv = require("dotenv");
import * as http from "http";

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message, err.stack);
  console.log("UNCAUGHT REJECTION shutting down 💥💥💥");

  process.exit(1);
});

dotenv.config({ path: "./.env" });

import app from "./index";

const database = process.env.DATABASE;

if (database && process.env.DATABASE_PASSWORD) {
  const DB: string = database.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
  );

  mongoose.connect(DB).then(() => {
    console.log("connection successful");
  });
} else {
  console.error("Database variable is not defined.");
}

const port = process.env.PORT;
const server: http.Server = app.listen(port, () => {
  console.log(`Port is running on ${port}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
  console.log('"UNHANDLED REJECTION shutting down 💥💥💥"');
  server.close(() => {
    process.exit(1); // close the server by exiting
  });
});

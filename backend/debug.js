require("dotenv").config();
const app = require("./src/app");
const PORT = process.env.PORT || 3000;

process.on("uncaughtException", (err) => {
  console.error("Uncaught:", err.message);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err.message);
});

const server = app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});

server.on("error", (err) => {
  console.error("Server error:", err.message);
});
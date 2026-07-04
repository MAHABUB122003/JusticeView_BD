require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./config/db");
const logger = require("./src/utils/logger");

// Connect Database
connectDB();

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`JusticeView server running on port ${PORT}`);
  console.log(`🚀 JusticeView server running on http://localhost:${PORT}`);
});
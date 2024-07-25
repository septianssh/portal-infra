import app from "./app.js";
import logger from "./utils/logger.js"
import portalDB from "./utils/database.js";

(async () => {
  try {

    // Load Database
    await portalDB.authenticate();
    logger.info("Connection to PostgreSQL database successful");

    await portalDB.sync();
    logger.info("Database synchronized");

    // Create server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, (err) => {
      if (err) logger.error("Error in server setup");
      logger.info("Server listening on Port", PORT);
    });

  } catch (error) {
    logger.error("Error initializing the application:", error);
    process.exit(1);
  }
})();

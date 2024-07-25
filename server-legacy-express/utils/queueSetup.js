// queueSetup.js

import Queue from "bull";

const jobQueue = new Queue("jobMonitor", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
  },
});

export default jobQueue;

// server2.js
const Queue = require("bull");
const mongoose = require("mongoose");

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb://localhost:27017/jobQueue");
const db = mongoose.connection;

// Define a schema for the jobs
const jobSchema = new mongoose.Schema({
  data: Object,
});
const Job = mongoose.model("Job", jobSchema);

// Create a new Bull queue instance
const redisOptions = {
  redis: {
    host: "192.168.1.5",
    port: 6379,
    password: "123456",
  },
};
const queue = new Queue("jobQueue", redisOptions);

// Process jobs from the queue
const { promisify } = require("util");
const delay = promisify(setTimeout);
queue.process("registerUser", async (job) => {
  try {
    await delay(5000);
    await Job.create({ data: job.data });
    console.log("Data stored in database:", job.data);
  } catch (error) {
    console.error("Error processing job:", error.message);
  }
});

// Start the queue processing
queue.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

queue.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});

console.log("Server 2 running, waiting for jobs...");

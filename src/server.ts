import express from "express";
import path from "path";
import "dotenv/config";

import employerRoutes from "./routes/employer.routes";
import jobRoutes from "./routes/job.routes";
import candidateRoutes from "./routes/candidate.routes";
import applicationRoutes from "./routes/application.routes";
import statsRoutes from "./routes/stats.routes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/employers", employerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/stats", statsRoutes);

// Serve frontend for any non-API route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

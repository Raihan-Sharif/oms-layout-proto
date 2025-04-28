import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import moment from "moment-timezone";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
// MongoDB Connection
mongoose
  .connect("mongodb+srv://asif:....@cluster0.fijag02.mongodb.net/")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Schema
const layoutSchema = new mongoose.Schema({
  layout: Object,
  widgets: Array,
  createdAt: {
    type: Date,
    default: () => moment.tz(Date.now(), "Asia/Dhaka").toDate(), // Set time in Dhaka timezone
  },
});


const Layout = mongoose.model("Layout", layoutSchema);

// API Endpoint to Save Layout
app.post("/api/save-layout", async (req, res) => {
    try {
      console.log("Request body:", req.body); // Log the incoming data
      const { layout, widgets } = req.body;
  
      if (!layout || !widgets) {
        return res.status(400).json({ error: "Invalid data" });
      }
  
      const newLayout = new Layout({ layout, widgets });
      await newLayout.save();
      console.log("Layout saved:", newLayout);
  
      res.status(201).json({ message: "Layout saved successfully!" });
    } catch (error) {
      console.error("Error saving layout:", error);
      res.status(500).json({ error: "Failed to save layout" });
    }
  });

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
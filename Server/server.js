import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/dbConnect.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/folder", folderRoutes);
app.use("/api/note", notesRoutes);

app.get("/", (req, res)=>{
  res.send("API WORKING CORRECTLY");
})
app.get("/api/health", (req, res)=>{
  res.status(200).send("Server is healthy!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.DBCONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });

// Define Schema
const FileSchema = new mongoose.Schema({
    fileUrl: String,
});
const FileModel = mongoose.model("File", FileSchema);

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Configure Multer Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads", // Folder in Cloudinary
        format: async (req, file) => "png", // Adjust format if needed
        public_id: (req, file) => file.originalname.split(".")[0], // Filename without extension
    },
});
const upload = multer({ storage });

// Upload Route
app.post("/upload", upload.single("file"), async (req, res) => {
    const file = new FileModel({ fileUrl: req.file.path });
    await file.save();
    res.redirect('/')
});

app.get('/upload', async (req, res) => {
    res.render("upload");
});

// Get All Files
app.get("/", async (req, res) => {
    const files = await FileModel.find();
    res.render("index", { files });
});
// Delete FIles
app.post("/delete/:id", async (req, res) => {
    console.log(req.body)
    const { id } = req.body; // Get _id from request body

    try {
        const result = await cloudinary.uploader.destroy(id);
        console.log(result);
        res.json({ success: true, message: "Image deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete image", error });
    }
})

app.listen(3000, () => console.log("Server running on port 3000"));
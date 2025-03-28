const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(process.env.DBCONNECTION)
    .then(() => { console.log('Database Connected') })
    .catch((error) => { console.log('Error : ' + error) })

// Define Schema
const FileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    cloudinaryUrl: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
    size: { type: Number, required: true }
});
const FileModel = mongoose.model("File", FileSchema);

module.exports = FileModel
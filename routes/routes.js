const cloudinary = require('../utils/cloudinary')
const upload = require('../utils/multer')
const path = require("path");


// Upload Route
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const file = new FileModel({ fileUrl: req.file.path });
        await file.save();
        res.redirect('/')
    }
    catch (error) {
        console.log(error)
        res.redirect('/')
    }
});


module.exports = { cloudinary, multer }
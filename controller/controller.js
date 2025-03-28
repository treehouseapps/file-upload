const upload = require('../utils/multer')
const mongoModel = require('../utils/mongodb')
const cloudinary = require('../utils/cloudinary')
const path = require('path');
const stream = require('stream');
// Get All Files
const home = async (req, res) => {
    const files = await mongoModel.find();
    res.render("index", { files });
}

const view = async (req, res) => {
    const retrive = await mongoModel.find()
    res.json({ data: retrive })
}
//store the file in folder
const uploadFile = (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Upload failed', error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Use the buffer stored in memory (req.file.buffer) for Cloudinary upload
        try {
            const result = await cloudinary.uploader.upload_stream(
                {
                    folder: 'uploads'
                },
                async (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return res.status(500).json({ message: 'Cloudinary upload failed', error: error.message });
                    }

                    // Save file metadata (Cloudinary URL, public ID, etc.) to MongoDB
                    const file = new mongoModel({
                        filename: req.file.originalname,
                        cloudinaryUrl: result.secure_url,  // Cloudinary file URL
                        cloudinaryId: result.public_id,    // Cloudinary public ID for future operations
                        size: req.file.size,
                    });

                    // Save the file metadata to MongoDB
                    try {
                        await file.save();
                        res.json({
                            message: 'File uploaded successfully',
                            file: result.secure_url  // Send Cloudinary URL as the response
                        });
                    } catch (dbError) {
                        console.error('Error saving file to MongoDB:', dbError);
                        return res.status(500).json({ message: 'Error saving file to MongoDB', error: dbError.message });
                    }
                }
            );

            // Pipe the buffer directly to Cloudinary's upload stream
            const bufferStream = new stream.PassThrough();
            bufferStream.end(req.file.buffer);
            bufferStream.pipe(result);
        } catch (uploadErr) {
            console.error('Cloudinary upload error:', uploadErr);
            return res.status(500).json({ message: 'Cloudinary upload failed', error: uploadErr.message });
        }
    });
};

const uploadPage = async (req, res) => {
    res.render("upload");
}

module.exports = { home, uploadFile, view, uploadPage };



// // Delete FIles
// app.post("/delete/:id", async (req, res) => {
//     console.log(req.body)
//     const { id } = req.body; // Get _id from request body

//     try {
//         const result = await cloudinary.uploader.destroy(id);
//         console.log(result);
//         res.json({ success: true, message: "Image deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Failed to delete image", error });
//     }
// })
// app.get('/delete', async (req, res) => {
//     cloud.uploader
//         .destroy('uploads/sample')
//         // cloudinary.uploader.destroy('uploads/sample')
//         .then(result => console.log(result));
// })
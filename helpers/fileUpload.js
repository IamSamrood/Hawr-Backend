import cloudinary from "../config/cloudinary.js";



export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        const { folder } = req.body
        const result = await cloudinary.uploader.upload(req.file.path, {
             folder,
        });

        res.status(200).json({ file_url: result.secure_url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const uploadFiles = async (req, res) => {
    try {

        console.log(req.files);
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded.' });
        }

        const { folder } = req.body;
        const fileUrls = [];

        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder,
            });
            fileUrls.push(result.secure_url);
        }

        res.status(200).json({ file_urls: fileUrls });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
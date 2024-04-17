import { extractPublicId } from "cloudinary-build-url";
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



        if (req.body.removed instanceof Array) {
            for (const file of req.body.removed) {
                const publicId = extractPublicId(file);
                const result = await cloudinary.uploader.destroy(publicId);
            }
        } else if (req.body.removed) {
            const publicId = extractPublicId(req.body.removed);
            const result = await cloudinary.uploader.destroy(publicId);
        }
        
        

        const { folder } = req.body;
        let fileUrls = [];

        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder,
            });
            fileUrls.push(result.secure_url);
        }

        if (req.body.files instanceof Array) {
            fileUrls = [...fileUrls, ...req.body.files];
        } else if (req.body.files) {
            fileUrls = [...fileUrls, req.body.files];
        }

        res.status(200).json({ file_urls: fileUrls });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
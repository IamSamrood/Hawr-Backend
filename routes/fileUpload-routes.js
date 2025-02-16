import { Router } from "express";
import upload from "../config/multer.js";
import { uploadFile, uploadFiles } from "../helpers/fileUpload.js";

const router = Router();

router.post('/upload-file', upload.single('file'), uploadFile);
router.post('/upload-files', upload.array('files', 10), uploadFiles);

export default router;
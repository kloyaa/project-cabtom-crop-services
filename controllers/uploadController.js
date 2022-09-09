require("dotenv").config();
const express = require("express");
const router = express.Router();
const cloudinary = require("../services/img-upload/cloundinary");

router.post("/upload/img", async (req, res) => {
    try {
        const filePath = req.file.path;
        const options = {
            folder: process.env.CLOUDINARY_FOLDER + "/public/images",
            unique_filename: true,
        };
        const uploadedImg = await cloudinary.uploader.upload(filePath, options);
        return res.status(200).json({ url: uploadedImg.url });

    } catch (error) {
        return res.status(400).json(error);
    }
});


module.exports = router;
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadBuffer = (buffer, folder) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );

        streamifier
            .createReadStream(buffer)
            .pipe(stream);
    });

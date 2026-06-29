import cloudinary from "../config/cloudinary.js";

export const deleteImage = async (url) => {

    if (!url || !url.includes("cloudinary"))
        return;

    try {

        const parts = url.split("/upload/")[1];

        if (!parts)
            return;

        const publicId = parts
            .replace(/^v\d+\//, "")
            .replace(/\.[^.]+$/, "");

        await cloudinary.uploader.destroy(publicId);

        console.log("Deleted:", publicId);

    } catch (err) {

        console.error(
            "Cloudinary delete failed:",
            err.message
        );

    }

};

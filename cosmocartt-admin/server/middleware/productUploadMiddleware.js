import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "uploads/products";

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, {
        recursive: true,
    });
}

const storage = multer.diskStorage({

    destination: function (
        req,
        file,
        cb
    ) {

        cb(
            null,
            uploadPath
        );

    },

    filename: function (
        req,
        file,
        cb
    ) {

        cb(
            null,
            Date.now() +
            "-" +
            file.originalname
        );

    },

});

const productUpload = multer({
    storage,
});

export default productUpload;
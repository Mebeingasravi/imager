const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp')

exports.resizeImage = async (req, res, next) => {
    const { height, width, format } = req.query;
    console.log('query ', req.query)

    // console.log("validation ", validateParams(height, width, format))


    // if (!validateParams(height, width, format)) return res.status(400).send("any of the height, width, format is missing")

    try {
        if (!req.files || req.files.length === 0) return res.status(400).send("No files uploaded.");
        const uploadPath = path.join(process.cwd(), 'uploads');

        await Promise.all(
            req.files.map(async (file, index) => {
                console.log(file)
                const uniqueFilename = `resized ${Date.now()}_${index}_${file.originalname.split(".")[0]}.webp`;
                const savePath = path.join(uploadPath, uniqueFilename);
                try {
                    await sharp(file.path)
                        .resize(parseInt(width), parseInt(height))
                        .toFormat(format)
                        .toFile(savePath)

                    console.log(`Image successfully resized and saved to: ${savePath}`);
                } catch (err) {
                    console.log("err : ", err)
                }
            })
        )

        res.json({ imgs: req.files });
    } catch (err) {
        console.error("Error during file upload:", err);
        res.status(500).send("Internal Server Error");
    }
}

function validateParams(height, width, format) {
    // if(typeof height !== )
    height = parseInt(height)
    width = Number(width)

    console.log(height, width, format)
    const keywords = ["jpeg", "png", "webp", "avif", "tiff", "gif", "svg", "jp2", "dzi", "image", "resize", "thumbnail", "crop", "embed", "libvips", "vips"];
    try {

        if (keywords.includes(format) && height_width_size()) return true

        function height_width_size() {
            const min = 200, max = 2000
            if (width >= min && width <= max && height >= min && height <= max) return true
        }
    } catch (err) { console.log('err ', err) }
}
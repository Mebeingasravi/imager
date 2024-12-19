const fs = require('fs')
const sharp = require('sharp')
const path = require('path')

exports.resizeImage1 = async (req, res) => {
    const { width, height, format } = req.query;
    console.log('files ', req.file)
    try {
        const imgs = req.files.map(async (file) => {
            const outputPath = path.join('uploads', `${Date.now()}-${file.filename}.${format}`);
            console.log("file ", file)
            await sharp(file.path)
                // .resize(parseInt(width), parseInt(height))
                .resize(parseInt(800), parseInt(529))
                .toFormat(format)
                .file(outputPath)
            fs.unlinkSync(file.path);
            return outputPath;
        })
        res.json({ imgs: imgs })
    } catch (err) {
        console.log("err : ", err)
    }

}


exports.resizeImage = async (req, res, next) => {
    const { height, width, format } = req.params;
    try {
        if (!req.files || req.files.length === 0) return res.status(400).send("No files uploaded.");
        const uploadPath = path.join(__dirname, 'uploads');

        await Promise.all(
            req.files.map(async (file, index) => {
                console.log(file)
                const uniqueFilename = `resized ${Date.now()}_${index}_${file.originalname.split(".")[0]}.webp`;
                const savePath = path.join(uploadPath, uniqueFilename);
                try {
                    await sharp(file.path)
                        .resize(4032, 3024)
                        .toFormat('webp').toFile(savePath)

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
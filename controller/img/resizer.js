const fs = require('fs')
const sharp = require('sharp')
const path = require('path')

exports.resizeImage = async (req, res) => {
    const { width, height, format } = req.query;
    console.log('files ', req.file)
    try {
        const imgs = req.files.map(async (file) => {
            const outputPath = path.join('uploads', `${Date.now()}-${file.filename}.${format}`);
            console.log("file ", file)
            await sharp(file.path)
                // .resize(parseInt(width), parseInt(height))
                .resize(parseInt(4032), parseInt(3024))
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
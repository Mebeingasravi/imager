const express = require('express')
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp')

app.use(express.urlencoded({ extented: false }))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage });
app.post("/resize-image", upload.array('files', 12), async (req, res, next) => {
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
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
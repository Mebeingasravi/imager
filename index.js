const express = require('express')
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp')

app.use(express.urlencoded({ extented: false }))

const { resizeImage } = require('./controller/img/resizer')

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
app.post("/resizeImage", upload.array('files', 200), resizeImage);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
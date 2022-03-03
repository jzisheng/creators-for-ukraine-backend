import {postToPinata, uploadToPinataAndCallContract} from "../utils/pinata.js"
const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(express.urlencoded({ extended: true }));


/* routes */
app.get('/', (req, res) => res.send('Hello World'));

app.post('/mint', upload.single('image'), function (req, res, next) {
    uploadToPinataAndCallContract(req.body['address'], req.file.filename)
    res.send('success');
});

app.listen(4000, () => console.log('Listening on port 4000!'));
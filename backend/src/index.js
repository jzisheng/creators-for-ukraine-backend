import {postToPinata, uploadToPinataAndCallContract} from "../utils/pinata.js"
const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(express.urlencoded({ extended: true }));


/* routes */
app.get('creator/mint', upload.single('image'), function (req, res, next) {
    uploadToPinataAndCallContract(req.body['address'], req.file.filename)
    res.send('success');
});

app.post('creator/verify', (req, res) => {
    res.send('verify')
});

app.post('creator/addMinterRole', (req, res) => {
    res.send('added minter role')
});

app.post('creator/storeSignature', (req, res) => {
    res.send('stored signature')
});

app.get('collector/signatures', upload.single('image'), function (req, res, next) {
    res.send('get signatures');
});

app.post('collector/redeem', upload.single('image'), function (req, res, next) {
    res.send('redeem NFT');
});

app.listen(4000, () => console.log('Listening on port 4000!'));
import express from 'express';
import { postToPinata } from '../services/pinataService.js';
import multer from 'multer';

// let upload = multer.multer({ dest: 'uploads/' });

const CREATOR_ROUTER = express.Router();


CREATOR_ROUTER.post('/mint', multer.upload.single('image'), function (req, res, next) {
    postToPinata(req.body['address'], req.file.filename)
    res.send('success');
});

export default CREATOR_ROUTER;
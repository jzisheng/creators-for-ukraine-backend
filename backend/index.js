import CREATE_ROUTER from './routes/creator.js';
import express from 'express';

let upload = multer({ storage: storage, fileFilter: fileFilter,});


const createServer = () => {
    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use('/creators', CREATE_ROUTER)
    app.listen(4000, () => console.log('Listening on port 4000!'));
}

export default createServer;
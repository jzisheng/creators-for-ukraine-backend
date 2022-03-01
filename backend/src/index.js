
const express = require('express');
const app = express();
const multer  = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

var upload = multer({ dest: 'uploads/' });

app.use(express.urlencoded({ extended: true }));

/* variables. */

let rawdata = fs.readFileSync('/Users/zisheng/secretKeys.json');
let keys = JSON.parse(rawdata);
const pinataUrl = keys['pinataUrl'];
const pinataApiKey = keys['pinataApiKey'];
const pinataSecretApiKey = keys['pinataSecretApiKey'];

/* helper methods */
const uploadToPinata =  (address, filename) => {
    console.log('here: ', address, filename);
    // pinata metadata
    const metadata = JSON.stringify({
      name: address+'-nft.png'
    });
    
    // create JSON metadata
    let data = new FormData();
    data.append('pinataMetadata', metadata);
    data.append('file', fs.createReadStream('./uploads/'+filename));
    
    // post to pinata
    return axios.post(
      pinataUrl,
      data,
      {
        headers: {
          'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretApiKey
        }
      }
    ).then(function (response) {
      var hash = response.data['IpfsHash'];
      console.log('success, ipfsh hash: ', hash)
      return 'success';
    }).catch(function (error) {
      console.log(error);
      return null;
    });
    
   };
   

/* routes */
app.get('/', (req, res) => res.send('Hello World'));

/* minting endpoint */
app.post('/mint', upload.single('image'), function (req, res, next) {
    // console.log(req.file);
    // console.log(req.body['address']);
    uploadToPinata(req.body['address'], req.file.filename)
    res.send('success');
});



app.listen(4000, () => console.log('Listening on port 4000!'));
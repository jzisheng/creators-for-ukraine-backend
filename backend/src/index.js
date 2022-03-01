// import {ethers} from 'ethers'
// import Greeter from '../../contract/artifacts/contracts/Greeter.sol/Greeter.json' assert {type: "json"};


const express = require('express');
const multer = require('multer');

const app = express();
const ethers = require('ethers');
const axios = require('axios');
const upload = multer({ dest: 'uploads/' });

const FormData = require('form-data');
const fs = require('fs');


app.use(express.urlencoded({ extended: true }));

/* smart contract */
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const clientAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
// const contract = new ethers.Contract(contractAddress, Greeter.abi, clientAddress);

/* variables. */

let rawdata = fs.readFileSync('/Users/zisheng/secretKeys.json');
let keys = JSON.parse(rawdata);

const pinataUrl = keys['pinataUrl'];
const pinataApiKey = keys['pinataApiKey'];
const pinataSecretApiKey = keys['pinataSecretApiKey'];

/* helper methods */
const callContract = () => {
    // call smart contract
    var provider = new ethers.providers.Web3Provider(clientAddress);
    // var contract = new ethers.Contract(clientAddress, )
}

const postToPinata = (data) => {
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
}

const uploadToPinataAndCallContract = (address, filename) => {
    console.log('here: ', address, filename);

    // pinata metadata
    const metadata = JSON.stringify({
        name: address + '-nft.png'
    });
    let data = new FormData();
    data.append('pinataMetadata', metadata);
    data.append('file', fs.createReadStream('./uploads/' + filename));

    // call contract method
    callContract();

    postToPinata(data);
};


/* routes */
app.get('/', (req, res) => res.send('Hello World'));

/* minting endpoint */
app.post('/mint', upload.single('image'), function (req, res, next) {
    uploadToPinataAndCallContract(req.body['address'], req.file.filename)
    res.send('success');
});



app.listen(4000, () => console.log('Listening on port 4000!'));
const express = require('express');
const multer = require('multer');

const app = express();
const { ethers } = require("ethers");
// const hardhatEthers = require("@nomiclabs/hardhat-ethers");
const axios = require('axios');
const upload = multer({ dest: 'uploads/' });

const FormData = require('form-data');
const fs = require('fs');


app.use(express.urlencoded({ extended: true }));

/* smart contract */
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const abi = [
    "constructor(string memory _greeting)",
    "function greet() public view returns (string memory)",
    "function setGreeting(string memory _greeting) public "
];
const clientAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'; // for testing


/* variables. */

let rawdata = fs.readFileSync('/Users/zisheng/secretKeys.json');
let keys = JSON.parse(rawdata);

const pinataUrl = keys['pinataUrl'];
const pinataApiKey = keys['pinataApiKey'];
const pinataSecretApiKey = keys['pinataSecretApiKey'];

/* helper methods */


const callContract = async () => {
    console.log("callContract: ");

    // call smart contract
    const rpcUrl = 'http://127.0.0.1:8545'
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    
    const contract = new ethers.Contract(contractAddress, abi, provider)

    const wallet = new ethers.Wallet(privateKey, provider);
    const contractWithSigner  = await contract.connect(wallet);
    const val1 = await contractWithSigner.setGreeting("Hello Jason");
    const val2 = await contractWithSigner.greet();
    console.log(val2);

}
// for debugging:
callContract();

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

    // postToPinata(data);
};


/* routes */
app.get('/', (req, res) => res.send('Hello World'));

/* minting endpoint */
app.post('/mint', upload.single('image'), function (req, res, next) {
    uploadToPinataAndCallContract(req.body['address'], req.file.filename)
    res.send('success');
});



app.listen(4000, () => console.log('Listening on port 4000!'));
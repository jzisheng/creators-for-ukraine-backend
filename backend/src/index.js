const express = require('express');
const multer = require('multer');

const app = express();
const { ethers } = require('ethers');
const { MerkleTree } = require('merkletreejs')

const keccak256 = require('keccak256')
const axios = require('axios');
const upload = multer({ dest: 'uploads/' });

const FormData = require('form-data');
const fs = require('fs');


app.use(express.urlencoded({ extended: true }));

/* contract */
const clientAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'; // testing address
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; 
const abi = [
    'constructor()',
    'function _verifyArtist(address _artist, bytes32[] memory _merkleProof ) public view returns (bool valid)',
    'function vetArtist(address artist, bytes32[] memory _merkleProof) public ',
    'function cronJobRoot(bytes32 newRoot) external',
    'function redeem(address redeemer, NFTVoucher voucher, bytes memory signature) public payable callerIsUser whenNotPaused returns (uint256) '
];

/* variables */
let rawdata = fs.readFileSync('/Users/zisheng/secretKeys.json');
let keys = JSON.parse(rawdata);

const pinataUrl = keys['pinataUrl'];
const pinataApiKey = keys['pinataApiKey'];
const pinataSecretApiKey = keys['pinataSecretApiKey'];

let whitelistAddresses = [
    clientAddress
]

/* helper methods */

const callContract = async () => {
    // call smart contract
    const rpcUrl = 'http://127.0.0.1:8545'
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(contractAddress, abi, provider)

    const wallet = new ethers.Wallet(privateKey, provider);
    const contractWithSigner  = await contract.connect(wallet);

    // read write smart contract functions
    const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});
    const _merkleProof = merkleTree.getHexProof(clientAddress);
    
    const r1 = await contractWithSigner.cronJobRoot(merkleTree.getRoot());
    const r2 = await contractWithSigner.vetArtist(clientAddress, _merkleProof);
    const r3 = await contract._verifyArtist(clientAddress, _merkleProof);

    // redeem voucher
    const voucher = { tokenId: 0, minPrice: 0.01, uri:'QmQVCN3eD4A737PNavj7phLAZy37RtkoL85PQR8WfatPDA'};
    const signingKey = new ethers.utils.SigningKey(privateKey);
    const r4 = await contractWithSigner.redeem(clientAddress, voucher, signingKey);


    console.log("[contract]: ", r1);
    console.log("[contract]: ", r2);
    console.log("[contract]: ", r3);
    console.log("[contract]: ", r4);
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

app.post('/mint', upload.single('image'), function (req, res, next) {
    uploadToPinataAndCallContract(req.body['address'], req.file.filename)
    res.send('success');
});

app.listen(4000, () => console.log('Listening on port 4000!'));
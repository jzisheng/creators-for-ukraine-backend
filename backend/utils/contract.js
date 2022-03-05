
let whitelistAddresses = [
    clientAddress
]


/* contract */
const clientAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'; // testing address
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

var jsonFile = './YourContract.json';
var parsed = JSON.parse(fs.readFileSync(jsonFile));
var abi = parsed.abi;

// Addresses are a list of addresses
const buildMerkleTree = async (addresses) => {
    const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});
    return merkleTree;
}

const buildMerkleProof = async (clientAddress) => {
    const _merkleProof = merkleTree.getHexProof(clientAddress);
    return _merkleProof;
}

const vetArtist = async () => {
    // call smart contract
    const rpcUrl = 'http://127.0.0.1:8545'
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(contractAddress, abi, provider)

    const wallet = new ethers.Wallet(privateKey, provider);
    const contractWithSigner  = await contract.connect(wallet);
    return {'contract': contract, 'contractWithSigner': contractWithSigner};
}


const verifyArtist =  async (clientAddress, _merkleProof) => {
    const res = await contract._verifyArtist(clientAddress, _merkleProof);
    return res;
}

const setTreeRoot = async (merkleTree)  => { 
    const merkleTreeRoot = await contractWithSigner.cronJobRoot(merkleTree.getRoot());
    return merkleTreeRoot;
}

const redeem = async (clientAddress, voucher, signingKey, uri) => {
    // redeem voucher
    const voucher = { tokenId: 0, minPrice: 0.01, uri:uri};
    const signingKey = new ethers.utils.SigningKey(privateKey);
    const voucher = await contractWithSigner.redeem(clientAddress, voucher, signingKey);
    return voucher;
}

const redeemArt = async (clientAddress, minPrice, uri) => {
    tokenId = 1 // to increment
    const types = {
        NFTVoucher: [
          {name: "tokenId", type: "uint256"},
          {name: "minPrice", type: "uint256"},
          {name: "uri", type: "string"},  
        ]
      }
    const voucher = { tokenId, minPrice, uri};
    const signers = await ethers.getSigners();
    const addr = await contract.address;
    
    domain = {
      name: "Poignart NFT",
      version: "1",
      chainId: 31337,
      verifyingContract: clientAddress,
    }

    const signature = await signers[0]._signTypedData(domain, types, voucher)
    return await contract.redeem(clientAddress, voucher, signature);
}
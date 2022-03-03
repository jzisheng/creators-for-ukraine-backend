
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

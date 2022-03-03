import { response } from "express";
import FormData from 'form-data';
import axios from 'axios';
//const FormData = require('form-data');
//const axios = require('axios');

export const createRequest = (address, filename) => {
    // pinata metadata
    const metadata = JSON.stringify({
        name: address + '-nft.png'
    });
    let data = new FormData();
    data.append('pinataMetadata', metadata);
    data.append('file', fs.createReadStream('./uploads/' + filename));
    return data;
};

export const postToPinata = async (address, filename) => {
    var formData = createRequest(address, filename);
    try {
        const resp = await axios.post(pinataUrl, data, {
            headers: {
                'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
                'pinata_api_key': pinataApiKey,
                'pinata_secret_api_key': pinataSecretApiKey
            }
        });
        return resp.data['IpfsHash'];
    }
    catch(err) {
        console.log(error);
        return null;
    }
}


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
    // pinata metadata
    const metadata = JSON.stringify({
        name: address + '-nft.png'
    });
    let data = new FormData();
    data.append('pinataMetadata', metadata);
    data.append('file', fs.createReadStream('./uploads/' + filename));
    postToPinata(data);
};
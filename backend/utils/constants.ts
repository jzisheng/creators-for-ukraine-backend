const fs = require('fs');

/* variables */
const rawdata = fs.readFileSync('/Users/zisheng/secretKeys.json');
const keys = JSON.parse(rawdata);

const pinataUrl = keys['pinataUrl'];
const pinataApiKey = keys['pinataApiKey'];
const pinataSecretApiKey = keys['pinataSecretApiKey'];

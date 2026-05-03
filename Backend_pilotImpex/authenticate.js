const { google } = require('googleapis');
const fs = require('fs').promises;

async function authenticate() {
    const credentials = JSON.parse(await fs.readFile('credentials.json'));
    const { client_email, private_key } = credentials;

    const auth = new google.auth.JWT({
        email: client_email,
        key: private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    return auth;
}

module.exports = {authenticate}
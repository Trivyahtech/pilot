const { readGoogleSheet } = require("./readGoogleSheet");

async function fetChData(spreadsheetId, range) {

    const data = await readGoogleSheet(spreadsheetId, range);

    return data;
}

module.exports = { fetChData }
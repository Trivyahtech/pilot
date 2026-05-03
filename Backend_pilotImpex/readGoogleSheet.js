const { google } = require('googleapis');
const { authenticate } = require('./authenticate');

async function readGoogleSheet(spreadsheetId, range) {
  try {
    const auth = await authenticate();
    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    console.log(response)

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return [];
    }

    // Convert rows to JSON (assuming first row is headers)
    const headers = rows[0];
    const jsonData = rows.slice(1).map(row => {
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index] || '';
      });
      return rowData;
    });

    return jsonData;
  } catch (error) {
    console.error('Error reading Google Sheet:', error);
    throw error;
  }
}

module.exports = {readGoogleSheet};
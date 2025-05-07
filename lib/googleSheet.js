const { google } = require("googleapis");
const fs = require("fs");
require("dotenv").config();

// Use environment variables
const SHEET_ID = process.env.SHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME;

/**
 * Appends data to a Google Spreadsheet
 * @param {Array} rowData - Array of values to append as a row
 * @param {String} sheetName - Name of the sheet to append data to (default: "Sheet1")
 * @param {Boolean} checkHeaders - Whether to check and create headers if they don't exist
 * @param {Array} headers - Array of header values to use if headers need to be created
 * @returns {Object} - Result of the operation
 */
async function appendData(rowData, headers = []) {
  try {
    // Read credentials from the file specified in environment variables
    const credentials = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8"));

    // Set up authentication
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // Create sheets client
    const sheets = google.sheets({ version: "v4", auth });

    // Check if headers exist and create them if needed
    if (headers.length > 0) {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A1:A1`,
      });

      // Headers Create IF Does not exist. First Time Data Uploading
      if (!response.data.values || response.data.values.length === 0) {
        // Add headers to the spreadsheet
        await sheets.spreadsheets.values.append({
          spreadsheetId: SHEET_ID,
          range: `${SHEET_NAME}!A1`,
          valueInputOption: "RAW",
          insertDataOption: "INSERT_ROWS",
          resource: { values: [headers] },
        });

        console.log("Headers added to Google Sheets successfully.");
      }
    }

    // Append data to the spreadsheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: { values: [rowData] },
    });

    console.log("Data appended to Google Sheets successfully.");
    return { success: true, message: "Data uploaded to Google Sheets." };
  } catch (error) {
    console.error("Error appending data to Google Sheets:", error);
    return { success: false, message: "Failed to append data to Google Sheets.", error: error.message };
  }
}

module.exports = {
  appendData
};

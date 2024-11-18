const { google } = require("googleapis");
const fs = require("fs");

// Authenticate with Google Sheets API
const authenticate = async () => {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_API_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return google.sheets({ version: "v4", auth });
  };

module.exports = {
    async readGoogleSheetData(req,res){
        try {
            const sheets = await authenticate();
            const response = await sheets.spreadsheets.values.get({
              spreadsheetId: process.env.SHEET_ID,
              range: "Sheet1", // Change "Sheet1" to your desired sheet name
            });
            res.status(200).json({ data: response.data.values });
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    },

     // Write (Append) data to Google Sheet
  async writeGoogleSheetData(req, res) {
    try {
      const { values } = req.body; // Example: { "values": ["John", "25", "New York"] }
      const sheets = await authenticate();
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SHEET_ID,
        range: "Sheet1", // Adjust to match your sheet name
        valueInputOption: "USER_ENTERED",
        resource: { values: [values] },
      });
      res.status(201).json({ message: "Data written successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateGoogleSheetData(req, res) {
    try {
      const { rowNumber, values } = req.body; // Example: { "rowNumber": 2, "values": ["John", "30", "Los Angeles"] }
      const sheets = await authenticate();
      const range = `Sheet1!A${rowNumber}:Z${rowNumber}`; // Adjust range based on your sheet's structure
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.SHEET_ID,
        range,
        valueInputOption: "USER_ENTERED",
        resource: { values: [values] },
      });
      res.status(200).json({ message: "Data updated successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateSpecificCell(req, res) {
    try {
        const { rowNumber, columnNumber, value } = req.body; // Example: { "rowNumber": 2, "columnNumber": "D", "value": "John" }
        
        // Authenticate with Google Sheets
        const sheets = await authenticate();
        
        // Construct the range dynamically based on the row and column
        const range = `Sheet1!${columnNumber}${rowNumber}`;
        
        // Update the cell value in the sheet
        await sheets.spreadsheets.values.update({
          spreadsheetId: process.env.SHEET_ID,
          range,
          valueInputOption: "USER_ENTERED",
          resource: { values: [[value]] }, // Set the new value
        });
        
        res.status(200).json({ message: "Data updated successfully!" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  },
  // Delete data from Google Sheet
  async deleteGoogleSheetData(req, res) {
    try {
      const { rowNumber } = req.body; // Example: { "rowNumber": 2 }
      const sheets = await authenticate();
      const range = `Sheet1!A${rowNumber}:Z${rowNumber}`;
      await sheets.spreadsheets.values.clear({
        spreadsheetId: process.env.SHEET_ID,
        range,
      });
      res.status(200).json({ message: "Data deleted successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async deleteGoogleSheetCell(req, res) {
    try {
      const { rowNumber, columnNumber } = req.body; // Example: { "rowNumber": 2, "columnNumber": "D" }
      
      // Authenticate with Google Sheets
      const sheets = await authenticate();
      
      // Construct the range dynamically based on the row and column
      const range = `Sheet1!${columnNumber}${rowNumber}`;
      
      // Clear the specific cell's data
      await sheets.spreadsheets.values.clear({
        spreadsheetId: process.env.SHEET_ID,
        range,
      });
      
      res.status(200).json({ message: "Data deleted successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}
    
}

const Marksheet = require("../../models/marksheet");
const googleSheet = require("../../lib/googleSheet");
require("dotenv").config();

// Use environment variable for sheet name
const SHEET_NAME = process.env.SHEET_NAME;

module.exports = {
    async addMarksheet(req, res){
        try {
            const { name, rollNumber, className, marks } = req.body;
            if (!name || !rollNumber || !className || !marks) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            // Create marksheet in database with the generated uniqueId
            const marksheet = await Marksheet.create({
                name,
                rollNumber,
                className,
                marks
            });

            // Add marksheet data to Google Spreadsheet
            try {
                // Define headers based on Marksheet model
                const headers = [
                    "Student Name",
                    "Roll Number",
                    "Class",
                    "Math Marks",
                    "Science Marks",
                    "English Marks",
                    "History Marks",
                    "Geography Marks",
                    "Timestamp"
                ];

                // Prepare row data
                const rowData = [
                    name || "",
                    rollNumber || "",
                    className || "",
                    marks.math || "",
                    marks.science || "",
                    marks.english || "",
                    marks.history || "",
                    marks.geography || "",
                    new Date().toISOString() // Timestamp
                ];

                // Use the appendData method from googleSheet module
                const result = await googleSheet.appendData(
                    rowData,
                    headers
                );

                if (result.success) {
                    res.status(201).json({
                        message: "Marksheet added successfully and uploaded to Google Sheets!",
                        marksheet: marksheet
                    });
                } else {
                    res.status(201).json({
                        message: "Marksheet added to database successfully, but failed to upload to Google Sheets.",
                        marksheet: marksheet,
                        sheetError: result.error
                    });
                }
            } catch (sheetError) {
                console.error("Error appending marksheet data to Google Sheets:", sheetError);
                // Still return success for database creation, but include sheet error
                res.status(201).json({
                    message: "Marksheet added to database successfully, but failed to upload to Google Sheets.",
                    marksheet: marksheet,
                    sheetError: sheetError.message
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },

    async addMarksheetToDB(req, res) {
        try {
            const { name, rollNumber, className, marks } = req.body;
            if (!name || !rollNumber || !className || !marks) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            // Create marksheet in database
            const marksheet = await Marksheet.create({ name, rollNumber, className, marks });

            res.status(201).json({
                message: "Marksheet added successfully!",
                marksheet: marksheet
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }
}
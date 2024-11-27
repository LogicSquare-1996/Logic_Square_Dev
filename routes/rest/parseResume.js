const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const xlsx = require("xlsx");
const Tesseract = require("tesseract.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = {
    async  parseResume(req, res) {
        try {
            // Check if the file is uploaded
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
    
            // Extract text from PDF
            const fileBuffer = req.file.buffer;
            const fileMime = req.file.mimetype;
            let extractedText = "";

            // Determine file type and extract text accordingly
            if (fileMime === "application/pdf") {
                const pdfData = await pdfParse(fileBuffer);
                extractedText = pdfData.text;
            } else if (fileMime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                const result = await mammoth.extractRawText({ buffer: fileBuffer });
                extractedText = result.value;
            } else if (fileMime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                const workbook = xlsx.read(fileBuffer, { type: "buffer" });
                const sheetNames = workbook.SheetNames;
                const firstSheet = workbook.Sheets[sheetNames[0]];
                extractedText = xlsx.utils.sheet_to_csv(firstSheet); // Convert the first sheet to CSV
            } else if (["image/png", "image/jpeg"].includes(fileMime)) {
                const ocrResult = await Tesseract.recognize(fileBuffer, "eng");
                extractedText = ocrResult.data.text;
            } else {
                return res.status(400).json({ error: "Unsupported file format" });
            }

            if (!extractedText.trim()) {
                return res.status(400).json({ error: "Failed to extract text from file" });
            }

            
            
            // Initialize Google Generative AI
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
            // Define the prompt with extracted text
            const prompt = `
                Return response in the below json format and fill the data with the text given below, and using all this data create a candidate summary at last field. If you don't find any data for a specific field, please do not fill in any random values, also fill start Time and end time in this format 'MM/YYYY'.
                {
                    "FULL NAME": '',
                    "GENDER": '',
                    "DESIGNATION": '',
                    "LOCATION NAME": '',
                    "CONTACT NUMBERS": [],
                    "EMAIL": '',
                    "ADDRESS DETAILS": '',
                    "LINKS DETAILS" : '',
                    "LINKEDIN LINK" : '',
                    "SPOKEN LANGUAGE" : '',
                    "TOTAL WORKING EXPERIENCE": '',
                    "PROFILE DESCRIPTION": '',
                    "EDUCATION DETAILS" : [{
                        "Title" : '',
                        "INSTITUTION" : '',
                        "LOCATION" : '',
                        "YEAR" : ''
                    }],
                    "PREVIOUS EXPERIENCE" : [{
                        "COMPANY NAME": '',
                        "TITLE" : '',
                        "TIME PERIOD" : '',
                        "DETAILS" : '',
                        "START TIME": '',
                        "END TIME": ''
                    }],
                    "SKILLS" : [],
                    "CANDIDATE SUMMARY" : ''
                }
    
                Text: 
                ${extractedText}
            `;
    
            // Generate content using the AI model
            const result = await model.generateContent(prompt);
    
            // Extract the generated JSON content from the model's response
            const jsonResponse = result.response.candidates[0].content.parts[0].text;
    
        
            // Remove the markdown formatting (```json and ```)
            let jsonText = jsonResponse.replace(/^```json\n/, '').replace(/\n```$/, '');

            
            
            
            // Clean the response further to remove any unwanted characters or extra backticks
            jsonText = jsonText.replace(/`/g, '').trim(); // Remove all backticks if they are present
            // console.log(jsonText);
    
            // Parse the cleaned JSON string
            const parsedData = JSON.parse(jsonText);
    
            // Respond with the cleaned and structured JSON result
            res.status(200).json({
                message: "Resume parsed successfully",
                result: parsedData,
            });
        } catch (error) {
            console.error("Error parsing resume:", error);
            res.status(500).json({ error: "Failed to parse resume" });
        }
    }
};

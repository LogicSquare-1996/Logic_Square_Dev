const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = {
    async  parseResume(req, res) {
        try {
            // Check if the file is uploaded
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
    
            // Extract text from PDF
            const pdfBuffer = req.file.buffer;
            const pdfData = await pdfParse(pdfBuffer);
            const extractedText = pdfData.text;
    
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

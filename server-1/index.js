const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/excelData');

// Define MongoDB schema and model
const excelDataSchema = new mongoose.Schema({
    
});

const ExcelData = mongoose.model('ExcelData', excelDataSchema);

// Route for uploading Excel file
app.post('/upload', async (req, res) => {
    try {
        const base64Data = req.body.file;
        const buffer = Buffer.from(base64Data, 'base64');
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        await ExcelData.create(data);
        res.status(200).send('Data stored successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error storing data');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

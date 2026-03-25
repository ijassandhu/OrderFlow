const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { processOrdersWithOpenClaw } = require('./openclawService');

const app = express();
const PORT = process.env.PORT || 3001;

// Setup multer for file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.post('/api/process-orders', upload.single('file'), async (req, res) => {
  try {
    let orderData = '';

    if (req.file && req.file.mimetype === 'application/pdf') {
      console.log('Received PDF file, attempting to parse...');
      try {
        const ObjectToParse = req.file.buffer;
        // Parse PDF
        const pdfData = await pdfParse(ObjectToParse);
        orderData = pdfData.text;
        console.log('Successfully parsed PDF. Extracted length:', orderData.length);
      } catch (err) {
        console.error('Failed to parse PDF:', err);
        return res.status(500).json({ error: 'Failed to extract text from PDF', details: err.message });
      }
    } else if (req.body.orders) {
      // Parse JSON
      orderData = req.body.orders;
    }

    if (!orderData || (typeof orderData !== 'string' && !Array.isArray(orderData))) {
      return res.status(400).json({ error: 'Invalid payload: "orders" array or PDF file is required.' });
    }

    // Call OpenClaw service
    const { results, alerts, issues } = await processOrdersWithOpenClaw(orderData);
    res.json({
      success: true,
      data: {
        results,
        alerts,
        issues
      }
    });

  } catch (error) {
    console.error('Error processing orders:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process orders',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

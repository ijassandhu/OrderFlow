const PDFDocument = require('pdfkit');
const fs = require('fs');

const writeStream = fs.createWriteStream('C:\\Users\\91623\\Desktop\\EOXS\\Task\\dummy_order.pdf');
const doc = new PDFDocument();
doc.pipe(writeStream);

doc.fontSize(20).text('Order from Acme Corp', 100, 100);
doc.fontSize(14).text('Date: 2026-03-17');
doc.text('Order ID: ORD-8888');
doc.moveDown();
doc.text('Items:');
doc.text('- 15x Server Racks ($500.00 each)');
doc.text('- 30x Cisco Switches ($200.00 each)');
doc.moveDown();
doc.text('Notes: Urgency is Critical. Need immediate processing.');

doc.end();

writeStream.on('finish', () => {
  console.log('PDF created successfully!');
});

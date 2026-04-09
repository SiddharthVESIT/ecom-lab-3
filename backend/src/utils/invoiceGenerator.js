import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateInvoicePDF(orderId, totalCents, items, discountPaise = 0) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        
        // Ensure an "invoices" folder exists
        const dirPath = path.join(__dirname, `../../invoices`);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        
        const filePath = path.join(dirPath, `${orderId}.pdf`);
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Build the PDF design
        doc.fontSize(24).text('AMAI Chocolates Invoice', 50, 50);
        doc.fontSize(12).text(`Order ID: ${orderId}`, 50, 100);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 115);
        doc.text('---------------------------------------------------------', 50, 135);
        
        let yCursor = 155;
        doc.font('Helvetica-Bold');
        doc.text('Item', 50, yCursor);
        doc.text('Qty', 350, yCursor);
        doc.text('Price (INR)', 450, yCursor);
        doc.font('Helvetica');
        
        yCursor += 20;

        items.forEach(item => {
            doc.text(`${item.name}`, 50, yCursor, { width: 280, height: 15 });
            doc.text(`${item.quantity}`, 350, yCursor);
            doc.text(`₹${(item.price_at_purchase_cents / 100).toFixed(2)}`, 450, yCursor);
            yCursor += 25;
            
            // Add extra pages if list is too long
            if (yCursor > 700) {
                doc.addPage();
                yCursor = 50;
            }
        });

        doc.text('---------------------------------------------------------', 50, yCursor);
        yCursor += 20;
        doc.font('Helvetica-Bold');
        
        if (discountPaise > 0) {
            doc.text(`Discount Applied: -₹${(discountPaise / 100).toFixed(2)}`, 300, yCursor);
            yCursor += 20;
        }
        
        doc.text(`Total Amount Paid: ₹${(totalCents / 100).toFixed(2)}`, 300, yCursor);
        doc.font('Helvetica');
        
        yCursor += 40;
        doc.text('Thank you for shopping with Amai Chocolates!', 50, yCursor, { align: 'center' });

        doc.end();

        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
}

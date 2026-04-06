const PDFDocument = require('pdfkit');
const moment = require('moment-timezone');

const generateOrderPDFBuffer = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      doc.on('data', chunk => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', err => {
        console.error('PDFKit error:', err);
        reject(err);
      });

      // --- Header ---
      doc.fontSize(25).text('CSK Food Truck', { align: 'center' });
      doc.fontSize(10).text('Deliciousness delivered to your doorstep!', { align: 'center' });
      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // --- Order Details ---
      doc.fontSize(14).text(`Invoice for Order: ${order.orderId || 'N/A'}`, { underline: true });
      doc.moveDown(0.5);
      
      const istDate = moment(order.createdAt).tz('Asia/Kolkata').format('DD-MM-YYYY hh:mm:ss A');
      doc.fontSize(10).text(`Date & Time (IST): ${istDate}`);
      doc.text(`Payment Method: ${(order.paymentMethod || 'N/A').toUpperCase()}`);
      doc.text(`Payment Status: ${(order.paymentStatus || 'N/A').toUpperCase()}`);
      doc.moveDown();

      // --- Customer Details ---
      doc.fontSize(12).text('Customer Details:', { underline: true });
      const address = order.address || {};
      const user = order.user || {};
      doc.fontSize(10).text(`Name: ${address.name || user.name || 'N/A'}`);
      doc.text(`Email: ${address.email || user.email || 'N/A'}`);
      doc.text(`Mobile: ${address.mobile || user.mobile || 'N/A'}`);
      doc.text(`Address: ${address.fullAddress || ''}, ${address.area || ''}, ${address.city || ''} - ${address.pincode || ''}`);
      doc.moveDown();

      // --- Items Table ---
      doc.fontSize(12).text('Ordered Items:', { underline: true });
      doc.moveDown(0.5);

      const tableTop = doc.y;
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Item', 50, tableTop);
      doc.text('Qty', 300, tableTop);
      doc.text('Price', 350, tableTop);
      doc.text('Total', 450, tableTop);
      doc.font('Helvetica');
      
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
      
      let currentY = tableTop + 25;

      (order.items || []).forEach(item => {
        const itemQty = Number(item.quantity) || 0;
        const itemPrice = Number(item.price) || 0;
        const itemTotal = itemQty * itemPrice;

        doc.text(item.name || 'Unknown Item', 50, currentY);
        doc.text(itemQty.toString(), 300, currentY);
        doc.text(`Rs. ${itemPrice.toFixed(2)}`, 350, currentY);
        doc.text(`Rs. ${itemTotal.toFixed(2)}`, 450, currentY);
        currentY += 20;

        if (item.customizationData && item.customizationData.addOns && item.customizationData.addOns.length > 0) {
          item.customizationData.addOns.forEach(addon => {
             doc.fontSize(8).text(`+ ${addon.name} (Rs. ${Number(addon.price || 0).toFixed(2)})`, 60, currentY);
             currentY += 12;
          });
          doc.fontSize(10);
        }

        if (currentY > 700) {
          doc.addPage();
          currentY = 50;
        }
      });

      doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
      currentY += 10;

      // --- Calculations ---
      const deliveryFee = Number(order.deliveryFee) || 0;
      const total = Number(order.total) || 0;
      const subtotal = Number(order.subtotal) || 0;

      doc.text('Item Total:', 350, currentY);
      doc.text(`Rs. ${subtotal.toFixed(2)}`, 450, currentY);
      currentY += 15;

      doc.text('Delivery Fee:', 350, currentY);
      doc.text(`Rs. ${deliveryFee.toFixed(2)}`, 450, currentY);
      currentY += 20;

      doc.fontSize(12).font('Helvetica-Bold');
      doc.text('Total Amount:', 350, currentY);
      doc.text(`Rs. ${total.toFixed(2)}`, 450, currentY);
      doc.font('Helvetica');
      
      // --- Footer ---
      doc.moveDown(4);
      doc.fontSize(11).font('Helvetica-Bold').text('Delivery Note:', { underline: true });
      doc.fontSize(10).font('Helvetica').text('Delivery will be completed on or before 9:00 PM IST');
      doc.moveDown(2);
      doc.fontSize(10).text('Thank you for your order!', { align: 'center' });

      doc.end();
    } catch (e) {
      console.error('Catch Error in PDF Gen:', e);
      reject(e);
    }
  });
};

const generateBulkOrdersPDFBuffer = (orders, title = 'Orders Report') => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      doc.on('data', chunk => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      doc.fontSize(20).text('CSK Food Truck', { align: 'center' });
      doc.fontSize(14).text(title, { align: 'center' });
      doc.moveDown();

      let currentY = doc.y;

      (orders || []).forEach((order, index) => {
        if (currentY > 700) {
          doc.addPage();
          currentY = 50;
        }

        const total = Number(order.total) || 0;
        const name = (order.address && order.address.name) || (order.user && order.user.name) || 'Unknown';

        doc.fontSize(10).font('Helvetica-Bold').text(`${index + 1}. Order: ${order.orderId || 'N/A'}`, 50, currentY);
        doc.font('Helvetica').text(`Customer: ${name} | Date: ${moment(order.createdAt).tz('Asia/Kolkata').format('DD-MM-YYYY')}`, 50, currentY + 12);
        doc.text(`Total: Rs. ${total.toFixed(2)} | Status: ${order.status}`, 50, currentY + 24);
        
        currentY += 45;
        doc.moveTo(50, currentY - 5).lineTo(550, currentY - 5).strokeColor('#cccccc').stroke();
      });

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
};

const generateCustomerReportPDFBuffer = (rows) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      doc.on('data', chunk => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      doc.fontSize(20).text('CSK Food Truck', { align: 'center' });
      doc.fontSize(14).text('Customer Order Count Report', { align: 'center' });
      doc.moveDown();

      const tableTop = doc.y;
      doc.fontSize(11).font('Helvetica-Bold');
      doc.text('Customer Name', 50, tableTop);
      doc.text('Email', 250, tableTop);
      doc.text('Total Orders', 450, tableTop);
      doc.font('Helvetica');

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      let currentY = tableTop + 25;

      (rows || []).forEach(row => {
        if (currentY > 700) {
          doc.addPage();
          currentY = 50;
        }
        doc.fontSize(10).text(row.name || 'Unknown', 50, currentY);
        doc.text(row.email || 'N/A', 250, currentY);
        doc.text((row.order_count || 0).toString(), 450, currentY);
        currentY += 20;
      });

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  generateOrderPDFBuffer,
  generateBulkOrdersPDFBuffer,
  generateCustomerReportPDFBuffer
};

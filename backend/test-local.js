require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');
const { generateBulkOrdersPDFBuffer } = require('./utils/pdfGenerator');

async function test() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/csk-food-truck');
  console.log('Connected to DB');
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    console.log(`Found ${orders.length} orders`);
    const pdfBuffer = await generateBulkOrdersPDFBuffer(orders, `Orders Report (${orders.length} orders)`);
    console.log('PDF Generated OK, length:', pdfBuffer.length);
  } catch (e) {
    console.error('Error in generation:', e);
  }
  process.exit(0);
}

test();

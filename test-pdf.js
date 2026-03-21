const { generateOrderPDFBuffer } = require('./backend/utils/pdfGenerator');
const fs = require('fs');

const mockOrder = {
  orderId: 'CSKTEST123',
  createdAt: new Date(),
  paymentMethod: 'cod',
  paymentStatus: 'pending',
  status: 'placed',
  address: {
    name: 'Test User',
    email: 'test@example.com',
    mobile: '1234567890',
    fullAddress: '123 Test St',
    area: 'Test Area',
    city: 'Test City',
    pincode: '123456'
  },
  user: {
    name: 'Test User',
    email: 'test@example.com',
    mobile: '1234567890'
  },
  items: [
    { name: 'Pizza', quantity: 2, price: 500, customizationData: { addOns: [] } }
  ],
  subtotal: 1000,
  tax: 180,
  deliveryFee: 50,
  total: 1230
};

generateOrderPDFBuffer(mockOrder)
  .then(buffer => {
    fs.writeFileSync('test_order.pdf', buffer);
    console.log('PDF generated successfully: test_order.pdf');
  })
  .catch(err => {
    console.error('Error generating PDF:', err);
  });

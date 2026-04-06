require('dotenv').config();
const mongoose = require('mongoose');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Category = require('../models/Category');
        const Food = require('../models/Food');
        
        await Category.updateMany({ name: 'Beverages' }, { $set: { name: 'Desert', description: 'Sweet treats and after-meal delights' } });
        await Food.updateMany({ categoryName: 'Beverages' }, { $set: { categoryName: 'Desert' } });
        
        console.log('Successfully renamed Beverages to Desert in database.');
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}

migrate();

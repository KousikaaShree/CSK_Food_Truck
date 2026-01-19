/**
 * Environment Setup Helper Script
 * This script helps you create .env files interactively
 * 
 * Run: node setup-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupBackendEnv() {
  console.log('\n=== Backend Environment Setup ===\n');
  
  const port = await question('Backend Port (default: 5000): ') || '5000';
  const mongodbUri = await question('MongoDB Atlas Connection String: ');
  const jwtSecret = await question('JWT Secret (min 32 chars, or press Enter for random): ') || 
    require('crypto').randomBytes(32).toString('hex');
  const razorpayKeyId = await question('Razorpay Key ID: ');
  const razorpayKeySecret = await question('Razorpay Key Secret: ');
  const cloudinaryCloudName = await question('Cloudinary Cloud Name: ');
  const cloudinaryApiKey = await question('Cloudinary API Key: ');
  const cloudinaryApiSecret = await question('Cloudinary API Secret: ');

  const envContent = `PORT=${port}
NODE_ENV=development

# MongoDB Atlas Connection
MONGODB_URI=${mongodbUri}

# JWT Secret
JWT_SECRET=${jwtSecret}

# Razorpay Configuration
RAZORPAY_KEY_ID=${razorpayKeyId}
RAZORPAY_KEY_SECRET=${razorpayKeySecret}

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=${cloudinaryCloudName}
CLOUDINARY_API_KEY=${cloudinaryApiKey}
CLOUDINARY_API_SECRET=${cloudinaryApiSecret}
`;

  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  fs.writeFileSync(backendEnvPath, envContent);
  console.log('\n✅ Backend .env file created successfully!');
}

async function setupFrontendEnv() {
  console.log('\n=== Frontend Environment Setup ===\n');
  
  const razorpayKeyId = await question('Razorpay Key ID (same as backend): ');
  const googleMapsKey = await question('Google Maps API Key: ');

  const envContent = `# Razorpay Key ID (for frontend)
VITE_RAZORPAY_KEY_ID=${razorpayKeyId}

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=${googleMapsKey}
`;

  const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
  fs.writeFileSync(frontendEnvPath, envContent);
  console.log('\n✅ Frontend .env file created successfully!');
}

async function main() {
  console.log('🚀 CSK Food Truck - Environment Setup Helper\n');
  console.log('This script will help you create .env files for backend and frontend.\n');
  console.log('Make sure you have:');
  console.log('  - MongoDB Atlas connection string');
  console.log('  - Razorpay API keys');
  console.log('  - Cloudinary credentials');
  console.log('  - Google Maps API key\n');

  const setupBackend = await question('Setup backend .env? (y/n): ');
  if (setupBackend.toLowerCase() === 'y') {
    await setupBackendEnv();
  }

  const setupFrontend = await question('\nSetup frontend .env? (y/n): ');
  if (setupFrontend.toLowerCase() === 'y') {
    await setupFrontendEnv();
  }

  console.log('\n✅ Setup complete!');
  console.log('\nNext steps:');
  console.log('1. Verify your .env files in backend/ and frontend/ folders');
  console.log('2. Run: cd backend && npm run seed:categories');
  console.log('3. Start backend: cd backend && npm run dev');
  console.log('4. Start frontend: cd frontend && npm run dev');
  console.log('5. Create admin account (see STEP_BY_STEP_SETUP.md)\n');

  rl.close();
}

main().catch(console.error);


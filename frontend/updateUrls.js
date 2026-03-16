const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/pages/UserDashboard.jsx',
  'src/pages/OrderConfirmation.jsx',
  'src/pages/Menu.jsx',
  'src/pages/Checkout.jsx',
  'src/pages/admin/AdminOrders.jsx',
  'src/pages/admin/AdminMenu.jsx',
  'src/pages/admin/AdminDashboard.jsx',
  'src/context/MenuContext.jsx',
  'src/context/CartContext.jsx',
  'src/context/AuthContext.jsx'
];

const backendBaseUrl = 'https://csk-food-truck-backend.onrender.com';

targetFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Determine import path for config
  const depth = file.split('/').length - 2; // src/pages/UserDashboard.jsx -> 3-2 = 1 (..)
  const importPath = depth === 0 ? './config' : '../'.repeat(depth) + 'config';
  const importStatement = `import API_URL from '${importPath}';\n`;

  // Add import if not present
  if (!content.includes('import API_URL')) {
    // find the last import and insert after
    const lines = content.split('\n');
    let lastImportIndex = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
            lastImportIndex = i;
        }
    }
    lines.splice(lastImportIndex + 1, 0, importStatement);
    content = lines.join('\n');
  }

  // Replace axios.get('/api/...') -> axios.get(`${API_URL}/api/...`)
  // We need to match things like '/api/', "/api/", `/api/`
  // Regex to match string or template literal containing /api/ but not already having API_URL
  // Just simple replacement, it's safer to use regex that looks for quotes/backticks
  
  content = content.replace(/'\/api\/([^']+)'/g, "`${API_URL}/api/$1`");
  content = content.replace(/"\/api\/([^"]+)"/g, "`${API_URL}/api/$1`");
  
  // For backticks that already have variables: `/api/orders/${orderId}` => `${API_URL}/api/orders/${orderId}`
  // But we have to make sure it doesn't already start with API_URL
  content = content.replace(/`\/api\/([^`]+)`/g, "`${API_URL}/api/$1`");

  // There's also one fetch in MenuContext.jsx
  // const res = await fetch('/api/foods');
  content = content.replace(/fetch\('\/api\/([^']+)'\)/g, "fetch(`${API_URL}/api/$1`)");
  content = content.replace(/fetch\("\/api\/([^"]+)"\)/g, "fetch(`${API_URL}/api/$1`)");
  content = content.replace(/fetch\(`\/api\/([^`]+)`\)/g, "fetch(`${API_URL}/api/$1`)");

  fs.writeFileSync(fullPath, content, 'utf8');
});

console.log('Update complete.');

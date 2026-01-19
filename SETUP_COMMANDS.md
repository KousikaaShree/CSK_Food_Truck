# Quick Setup Commands

## ✅ Step 1: Dependencies Installed
Both backend and frontend dependencies are now installed!

## 📝 Step 2: Create Environment Files

### Option A: Manual (Recommended for first time)

**Backend .env:**
```bash
cd backend
copy env.example .env
```
Then edit `.env` file with your credentials.

**Frontend .env:**
```bash
cd frontend
copy env.example .env
```
Then edit `.env` file with your credentials.

### Option B: Using Helper Script
```bash
node setup-env.js
```
This will guide you through creating both .env files interactively.

## 🔧 Step 3: Get Your API Credentials

### MongoDB Atlas:
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create account → Create cluster → Get connection string
3. Format: `mongodb+srv://username:password@cluster.mongodb.net/csk-food-truck?retryWrites=true&w=majority`

### Razorpay:
1. Go to: https://razorpay.com/
2. Sign up → Dashboard → Settings → API Keys
3. Generate Test Key (for development)
4. Copy Key ID and Key Secret

### Cloudinary:
1. Go to: https://cloudinary.com/
2. Sign up → Dashboard shows credentials
3. Copy: Cloud Name, API Key, API Secret

### Google Maps:
1. Go to: https://console.cloud.google.com/
2. Create project → Enable Maps JavaScript API
3. Create API Key → Copy it

## 🗄️ Step 4: Seed Categories
```bash
cd backend
npm run seed:categories
```

## 🚀 Step 5: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 👤 Step 6: Create Admin Account

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/admin/signup -H "Content-Type: application/json" -d "{\"name\":\"Admin\",\"email\":\"admin@test.com\",\"password\":\"admin123\"}"
```

**Or use Postman:**
- POST http://localhost:5000/api/auth/admin/signup
- Body (JSON):
```json
{
  "name": "Admin",
  "email": "admin@test.com",
  "password": "admin123"
}
```

## 🌐 Step 7: Access Application

- **User Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login

---

**For detailed instructions, see: STEP_BY_STEP_SETUP.md**


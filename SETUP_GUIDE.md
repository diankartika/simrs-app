# 🚀 SIMRS Setup Guide

Panduan lengkap untuk setup dan menjalankan SIMRS di local environment.

## 📋 Prerequisites

Pastikan kamu sudah menginstall:
- **Node.js** v16+ (download dari https://nodejs.org)
- **npm** atau **yarn** (biasanya comes with Node.js)
- **MongoDB** (local atau cloud atlas)
- **Git** (optional, untuk version control)
- **Text Editor/IDE** (VSCode recommended)

Verify installation:
```bash
node --version    # v16.x.x atau lebih tinggi
npm --version     # 7.x.x atau lebih tinggi
mongo --version   # MongoDB 4.x atau lebih tinggi (jika install local)
```

## 🔧 Database Setup

### Option 1: MongoDB Local
```bash
# Instalasi MongoDB Community Edition
# MacOS (dengan Homebrew):
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Windows:
# Download dari https://www.mongodb.com/try/download/community
# Run installer dan pilih "Install MongoDB as a Service"

# Linux (Ubuntu):
sudo apt-get install mongodb

# Verify MongoDB running
mongosh
# Output: MongoDB shell version v5.x.x
# Ketik: exit
```

### Option 2: MongoDB Atlas (Cloud)
```
1. Buka https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster baru (M0 free tier)
4. Get connection string: mongodb+srv://user:password@cluster.mongodb.net/simrs
5. Paste di backend/.env MONGODB_URI
```

## 📥 Installation Steps

### 1. Clone/Download Project
```bash
# Jika sudah di folder, skip step ini
cd simrs-app
```

### 2. Backend Setup

```bash
# Navigate ke backend folder
cd backend

# Install dependencies
npm install

# Jika npm install terlalu lama, coba:
npm install --legacy-peer-deps

# Create .env file dengan copy-paste ini:
# ============ MULAI COPY ============
MONGODB_URI=mongodb://localhost:27017/simrs
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
PORT=5000
NODE_ENV=development
# ============ AKHIR COPY ============

# Test backend
npm run dev
```

**Expected Output:**
```
MongoDB connected
Server running on port 5000
```

Jika ada error, cek:
- MongoDB sudah running? `mongosh`
- Port 5000 sudah dipakai? Change PORT di .env
- node_modules issue? Delete lalu `npm install` lagi

### 3. Frontend Setup (Terminal/Tab Baru)

```bash
# Navigate ke frontend folder
cd ../frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Expected:**
- Browser otomatis buka http://localhost:3000
- Jika tidak, manual open browser ke http://localhost:3000

## ✅ Testing

### Login dengan demo credentials:
```
Username: admin
Password: admin
Role: Administrator
```

atau

```
Username: doctor  
Password: doctor
Role: Doctor
```

atau

```
Username: medical_coder
Password: coder
Role: Medical Coder
```

### Test basic workflow:
1. ✅ Login successful
2. ✅ View Dashboard
3. ✅ Create patient (Patients → Pasien Baru)
4. ✅ View patient list
5. ✅ Add medical record
6. ✅ Add coding
7. ✅ View reports

## 🎨 Development Tips

### Frontend Development
```bash
# Dari frontend folder
npm start           # Start dev server

# Edit files di src/
# Auto-reload on save
# Console logs visible di browser dev tools (F12)

# Build untuk production
npm run build       # Generate optimized build
```

### Backend Development
```bash
# Dari backend folder
npm run dev         # Start dengan nodemon (auto-reload)
npm start           # Start normal

# Edit files di routes/ dan models/
# Auto-restart server on save

# Debug dengan logging:
console.log('Debug message:', variable);
```

### Common Commands

```bash
# Stop server
Ctrl + C

# Clear npm cache
npm cache clean --force

# Update packages
npm update

# Check package version
npm list package-name

# Install specific version
npm install package@1.2.3
```

## 🐛 Troubleshooting

### Issue: "Cannot find module"
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 5000 already in use"
```bash
# Solution 1: Kill process on port 5000
npx kill-port 5000

# Solution 2: Change PORT in .env
PORT=5001
```

### Issue: "MongoDB Connection Failed"
```bash
# Solution 1: Start MongoDB
mongod

# Solution 2: Check connection string
# mongosh "mongodb://localhost:27017"

# Solution 3: Use MongoDB Atlas
# Update MONGODB_URI in .env dengan connection string dari Atlas
```

### Issue: "CORS Error" di frontend
```bash
# Solution: Restart backend server
# Pastikan CORS middleware aktif di server.js

const cors = require('cors');
app.use(cors());
```

### Issue: "React not rendering"
```bash
# Solution 1: Clear cache
rm -rf node_modules/.cache

# Solution 2: Restart npm start
npm start

# Solution 3: Clear browser cache
# Chrome: DevTools → Application → Clear storage
```

## 📝 File Structure Quick Reference

```
backend/
├── models/           # MongoDB schemas
├── routes/           # API endpoints
├── server.js        # Main server file
├── package.json
└── .env            # Environment variables

frontend/
├── src/
│   ├── pages/       # Page components
│   ├── components/  # Reusable components
│   ├── api.js      # API calls
│   ├── App.jsx     # Main component
│   └── index.css   # Tailwind CSS
├── index.html
├── package.json
└── tailwind.config.js
```

## 🚀 Deployment Preview (Next Steps)

Untuk deploy ke production:
1. Frontend → Vercel, Netlify, atau Github Pages
2. Backend → Heroku, Railway, atau DigitalOcean
3. Database → MongoDB Atlas (free tier cukup untuk small projects)

## 💡 Development Best Practices

### Frontend
- Use React DevTools browser extension untuk debugging
- Check console.log di browser devtools (F12)
- Use meaningful variable/component names
- Keep components reusable dan small

### Backend
- Use Postman/Insomnia untuk test API
- Log request/response untuk debugging
- Keep code organized by routes/models
- Add proper error handling

### General
- Use .env untuk sensitive data (jangan commit!)
- Write comments untuk complex logic
- Test sebelum commit
- Keep dependencies updated

## 📞 Getting Help

Jika ada error:
1. Baca error message dengan teliti
2. Google error message (99% ada solusinya)
3. Check troubleshooting section di atas
4. Check MongoDB/Node.js documentation

## ✨ Next: Development

Sekarang kamu siap develop! 🎉

Mulai dari:
1. Modifikasi homepage (Dashboard.jsx)
2. Add new fields ke patient form
3. Customize styling dengan Tailwind
4. Add new API endpoints

Happy coding! 💻

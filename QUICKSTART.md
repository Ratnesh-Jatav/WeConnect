# Quick Start Guide

## 5-Minute Setup

### Step 1: Prerequisites
- Node.js installed
- MongoDB running locally or a MongoDB Atlas account
- Cloudinary account (sign up at https://cloudinary.com)

### Step 2: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your settings (MongoDB URI, JWT Secret, Cloudinary credentials)
# For quick testing, use:
MONGODB_URI=mongodb://localhost:27017/family-memory
JWT_SECRET=test_secret_key_12345
PORT=5000

# Start server
npm run dev
```

Server will be running on http://localhost:5000

### Step 3: Frontend Setup

```bash
# In another terminal, navigate to client directory
cd client

# Install dependencies
npm install

# Start React app
npm start
```

App will open at http://localhost:3000

### Step 4: First Login

1. Click "Register"
2. Create account (first user becomes admin)
3. Log in

## Getting Cloudinary Credentials

1. Go to https://cloudinary.com and sign up
2. Find your Dashboard
3. Copy:
   - **Cloud Name** (visible at top)
   - **API Key** (in Settings → API Keys)
   - **API Secret** (in Settings → API Keys)
4. Update server/.env with these values

## Start Using the App

1. **Dashboard**: Add family members with photos and details
2. **Gallery**: Create albums for events and upload photos
3. **Videos**: Upload family videos
4. Use search and filters to organize memories

## Commands Reference

**Backend**
- `npm install` - Install dependencies
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

**Frontend**
- `npm install` - Install dependencies
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

## Default Ports

- Backend API: http://localhost:5000
- Frontend App: http://localhost:3000
- MongoDB: localhost:27017

## Troubleshooting Quick Fixes

**"Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**"Port already in use"**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

**"MongoDB connection failed"**
- Ensure MongoDB is running
- Check MONGODB_URI is correct
- For Atlas: ensure IP whitelist includes your IP

**"Cannot POST /api/..."**
- Ensure backend is running on port 5000
- Check API URL in frontend (.env)

## Next Steps

1. Complete your profile
2. Add family members
3. Create events and upload photos
4. Share the experience with family!

## Need Help?

Check the main README.md for detailed documentation and API reference.

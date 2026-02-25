# Dependencies & Requirements

## Backend Dependencies

### package.json Overview
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.6.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.1.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.40.0",
    "express-fileupload": "^1.5.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Backend Dependencies Breakdown

| Package | Version | Purpose |
|---------|---------|---------|
| **express** | ^4.18.2 | Web framework for Node.js |
| **mongoose** | ^7.6.0 | MongoDB ODM (Object Data Modeling) |
| **bcryptjs** | ^2.4.3 | Password hashing and encryption |
| **jsonwebtoken** | ^9.1.0 | JWT token creation and verification |
| **dotenv** | ^16.3.1 | Environment variable management |
| **cors** | ^2.8.5 | Cross-Origin Resource Sharing middleware |
| **multer** | ^1.4.5-lts.1 | Multipart file upload handling |
| **cloudinary** | ^1.40.0 | Cloud media storage SDK |
| **express-fileupload** | ^1.5.0 | Simplified file upload middleware |
| **nodemon** | ^3.0.1 | Auto-restart server on file changes (dev only) |

---

## Frontend Dependencies

### package.json Overview
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.16.0",
    "axios": "^1.5.0",
    "react-icons": "^4.12.0",
    "date-fns": "^2.30.0",
    "react-hot-toast": "^2.4.1"
  },
  "devDependencies": {
    "react-scripts": "5.0.1"
  }
}
```

### Frontend Dependencies Breakdown

| Package | Version | Purpose |
|---------|---------|---------|
| **react** | ^18.2.0 | React library for building UIs |
| **react-dom** | ^18.2.0 | React DOM rendering |
| **react-router-dom** | ^6.16.0 | Client-side routing |
| **axios** | ^1.5.0 | HTTP client for API calls |
| **react-icons** | ^4.12.0 | Icon library |
| **date-fns** | ^2.30.0 | Date formatting and manipulation |
| **react-hot-toast** | ^2.4.1 | Toast notifications |
| **react-scripts** | 5.0.1 | Create React App build scripts |

---

## System Requirements

### For Development

**Hardware:**
- Minimum 4GB RAM
- 2GB free disk space
- Modern multi-core processor

**Operating Systems:**
- Windows 10/11
- macOS 10.14+
- Ubuntu 18.04+
- Any Linux with Node.js support

**Internet:**
- Stable internet connection
- Access to npm registry
- Access to Cloudinary API
- Access to MongoDB (local or cloud)

### For Production

**Server Requirements:**
- Minimum 512MB RAM (1GB recommended)
- 5GB+ storage for media
- CDN for media delivery (Cloudinary handles this)
- SSL certificate

**Database:**
- MongoDB 4.0+ (local or Atlas)
- Proper backups configured
- Connection pooling

---

## Installation Instructions

### Backend Setup

1. **Check Node.js and npm**
   ```bash
   node --version  # v14.0.0 or higher
   npm --version   # v6.0.0 or higher
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install MongoDB** (if not using Atlas)
   - Download from https://www.mongodb.com/try/download/community
   - Follow platform-specific installation

4. **Verify Installation**
   ```bash
   npm list
   ```

### Frontend Setup

1. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Verify Installation**
   ```bash
   npm list
   ```

---

## External Services Required

### MongoDB
- **Free Option**: MongoDB Atlas (cloud)
  - Sign up at https://www.mongodb.com/cloud/atlas
  - Create cluster
  - Get connection string
  
- **Paid Options**: 
  - Self-hosted MongoDB
  - Enterprise MongoDB

### Cloudinary
- **Free Plan**: Includes 25GB storage, 25 GB bandwidth/month
  - Sign up at https://cloudinary.com
  - Get API credentials
  - Upgrade as needed

### Optional Services
- **SendGrid** (for email notifications) - future feature
- **Stripe** (for premium features) - future feature
- **Auth0** (for advanced auth) - alternative to JWT

---

## Environment Setup

### Backend .env Template
```
# Database
MONGODB_URI=mongodb://localhost:27017/family-memory
# OR for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/family-memory?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_key_with_at_least_32_characters
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Frontend .env Template
```
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Optional: Analytics, etc.
REACT_APP_ENV=development
```

---

## Version Management

### Node.js Versions
- **Minimum**: v14.0.0
- **Recommended**: v18.0.0+
- **LTS**: v18.x or v20.x

To check/manage Node.js versions:
```bash
# Using nvm (Node Version Manager)
nvm install 18
nvm use 18
nvm list
```

### Package Versions
- All major dependencies use ^ (caret) for compatible updates
- Run `npm outdated` to check for updates
- Run `npm audit` to check for security vulnerabilities

---

## Installing Specific Versions

### If you encounter compatibility issues:

**Backend**:
```bash
cd server

# Install exact versions from package.json
npm ci

# Or install specific versions
npm install express@4.18.2 mongoose@7.6.0
```

**Frontend**:
```bash
cd client
npm ci
```

---

## Dependency Security

### Check for Vulnerabilities
```bash
# Backend
cd server
npm audit

# Frontend
cd client
npm audit
```

### Fix Vulnerabilities
```bash
npm audit fix
npm audit fix --force  # Only if necessary
```

### Update Dependencies
```bash
# Check what's outdated
npm outdated

# Update all dependencies
npm update

# Update to latest major versions
npm install -g npm-check-updates
ncu -u
npm install
```

---

## Storage Requirements by Feature

### Cloudinary Free Plan
- **Upload Limit**: 25GB total
- **Bandwidth**: 25GB/month
- **API Requests**: Unlimited
- **Transformations**: Unlimited

### MongoDB Free (Atlas)
- **Storage**: 512MB per free cluster
- **Backup**: Automated
- **Shared Clusters**: Yes
- **Connections**: 3 concurrent

---

## Performance Dependencies

### To Optimize Performance:

**Backend**:
- Consider adding `compression` middleware
- Add `helmet` for security headers
- Implement `redis` for caching

**Frontend**:
- Use code splitting with React.lazy
- Implement image optimization
- Consider `react-query` for data fetching

---

## Troubleshooting Dependencies

### Module Not Found
```bash
# Reinstall node_modules
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Backend
# Change PORT in .env or kill process using 5000

# Frontend
PORT=3001 npm start
```

### Permission Errors
```bash
# Windows: Run as Administrator
# macOS/Linux: Use sudo carefully or fix npm permissions
sudo npm install -g npm
```

### Network Issues
```bash
# Check npm registry
npm config set registry https://registry.npmjs.org/

# Clear cache
npm cache clean --force

# Try installing again
npm install
```

---

## Alternative Packages

### If you want to use alternatives:

**Instead of Axios** → Fetch API or React Query
**Instead of Cloudinary** → AWS S3, Azure Blob Storage
**Instead of MongoDB** → PostgreSQL with Prisma
**Instead of JWT** → OAuth 2.0 or Auth0
**Instead of bcryptjs** → argon2

---

## Keeping Dependencies Updated

### Monthly Updates
```bash
npm outdated          # Check for updates
npm update            # Safe updates (minor/patch)
npm audit fix         # Fix vulnerabilities
```

### Yearly Major Version Updates
```bash
ncu -u                # Check major versions
npm install           # Install all updates
npm test              # Test thoroughly
```

---

## Minimum Installation Example

If you want minimal setup for testing:

```bash
# Backend minimal
npm install express mongoose bcryptjs jsonwebtoken dotenv cors express-fileupload

# Frontend minimal
npm install react react-dom react-router-dom axios
```

---

## Production Dependencies

### Additional Recommended for Production:
```bash
# Backend
npm install helmet            # Security headers
npm install compression       # Gzip compression
npm install express-validator # Input validation
npm install winston          # Logging
npm install redis            # Caching (optional)

# Frontend
npm install react-query      # Data fetching
npm install sentry           # Error tracking
```

---

## Summary

✅ **All dependencies are included in package.json files**
✅ **Versions are locked for consistency**
✅ **Security is considered (bcryptjs, JWT)**
✅ **Performance libraries included**
✅ **Easy to update and maintain**

Simply run:
```bash
cd server && npm install
cd ../client && npm install
```

And you're ready to go! 🚀

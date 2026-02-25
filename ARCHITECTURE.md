# System Architecture

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        WEB BROWSER                               │
│                      (React Frontend)                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP/HTTPS
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
┌──────────────────┐                 ┌──────────────────┐
│   React App      │                 │  Static Assets   │
│  (Port 3000)     │                 │   (JS, CSS)      │
│                  │                 └──────────────────┘
│ ├─ Pages         │
│ ├─ Components    │
│ ├─ Context       │
│ └─ Services      │
└─────────┬────────┘
          │ API Calls
          │ (Axios)
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│          EXPRESS SERVER (Port 5000)                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  ROUTES & CONTROLLERS                                  │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │    │
│  │  │ /api/auth    │  │ /api/members │  │ /api/albums │ │    │
│  │  │              │  │              │  │             │ │    │
│  │  │ Register     │  │ Get All      │  │ Get Albums  │ │    │
│  │  │ Login        │  │ Add Member   │  │ Create      │ │    │
│  │  │ Get Me       │  │ Update       │  │ Upload      │ │    │
│  │  │              │  │ Delete       │  │ Delete      │ │    │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │    │
│  │                                                        │    │
│  │  ┌──────────────┐  ┌──────────────────────────────┐  │    │
│  │  │ /api/videos  │  │  MIDDLEWARE                  │  │    │
│  │  │              │  │  ┌────────────────────────┐  │  │    │
│  │  │ Get Videos   │  │  │ Auth Middleware        │  │  │    │
│  │  │ Upload       │  │  │ (JWT Verification)     │  │  │    │
│  │  │ Update       │  │  │ Role-Based Access      │  │  │    │
│  │  │ Delete       │  │  │ Error Handling         │  │  │    │
│  │  │              │  │  │ CORS                   │  │  │    │
│  │  └──────────────┘  │  │ File Upload            │  │  │    │
│  │                     │  └────────────────────────┘  │  │    │
│  └────────────────────────────────────────────────────┘  │    │
└───────┬───────────────────┬──────────────────────┬───────┘
        │                   │                      │
        ▼                   ▼                      ▼
┌───────────────┐   ┌──────────────┐   ┌──────────────────┐
│   MONGODB     │   │  CLOUDINARY  │   │  JWT AUTH        │
│               │   │              │   │  ┌────────────┐  │
│ Collections:  │   │ Cloud Storage│   │  │ Token Gen  │  │
│               │   │ for:         │   │  │ Validation │  │
│ • Users       │   │ • Photos     │   │  │ Expiry     │  │
│ • FamilyMem   │   │ • Videos     │   │  │ Refresh    │  │
│ • Albums      │   │ • Thumbnails │   │  └────────────┘  │
│ • Videos      │   │              │   │                  │
│               │   │ API Key:     │   │  bcryptjs        │
│ Indexes:      │   │ Credentials  │   │  for password    │
│ • User ID     │   │ Secure       │   │  encryption      │
│ • Relation    │   │              │   │                  │
│ • Event Type  │   └──────────────┘   └──────────────────┘
│ • Year        │
└───────────────┘
```

---

## Data Flow Diagram

### Authentication Flow
```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Enter credentials
     ▼
┌──────────────────────────┐
│  Register/Login Page     │
└────┬─────────────────────┘
     │ 2. POST /api/auth/login
     ▼
┌──────────────────────────┐
│  Express Server          │
│  1. Hash password        │
│  2. Compare with DB      │
│  3. Generate JWT         │
└────┬─────────────────────┘
     │ 4. Return token
     ▼
┌──────────────────────────┐
│  React App               │
│  1. Store token in localStorage
│  2. Add to auth context  │
│  3. Redirect to dashboard
└──────────────────────────┘
```

### Photo Upload Flow
```
┌─────────┐
│  Admin  │ 1. Select photo from computer
└────┬────┘
     │
     ▼
┌──────────────────────────┐
│  Photo Upload Modal      │
│  • Preview image         │
│  • Add caption           │
└────┬─────────────────────┘
     │ 2. POST /albums/:id/photos
     │    (FormData with image)
     ▼
┌──────────────────────────┐
│  Express Server          │
│  • Receive file          │
│  • Validate              │
│  • Create upload stream  │
└────┬─────────────────────┘
     │ 3. Upload to Cloudinary
     ▼
┌──────────────────────────┐
│  Cloudinary CDN          │
│  • Store image           │
│  • Generate thumbnail    │
│  • Create public URL     │
│  • Return public_id      │
└────┬─────────────────────┘
     │ 4. Return URL & metadata
     ▼
┌──────────────────────────┐
│  Express Server          │
│  • Save URL to MongoDB   │
│  • Return response       │
└────┬─────────────────────┘
     │ 5. Update UI
     ▼
┌──────────────────────────┐
│  React App               │
│  • Show new photo        │
│  • Update album view     │
│  • Show success message  │
└──────────────────────────┘
```

### Search & Filter Flow
```
┌──────────────────────┐
│  User Types Search   │
│  Selects Filter      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────┐
│  SearchBar/Dropdown      │
│  onChange event          │
└──────┬───────────────────┘
       │ 1. Update state
       │ 2. Call API
       │
       ▼ GET /api/family-members?search=John&relation=father
┌──────────────────────────┐
│  Express Server          │
│  1. Parse query params   │
│  2. Build query object   │
│  3. Query MongoDB        │
│  { $regex: search }      │
│  4. Return results       │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│  React App               │
│  Update state with       │
│  filtered results        │
│  Re-render components    │
└──────────────────────────┘
```

---

## Component Hierarchy

```
App
├── AuthProvider
│   ├── Router
│   │   ├── ProtectedRoute
│   │   │   ├── Dashboard
│   │   │   │   ├── Navbar
│   │   │   │   ├── SearchBar
│   │   │   │   ├── FamilyMemberList
│   │   │   │   │   ├── FamilyMemberCard
│   │   │   │   │   └── EditFamilyMemberModal
│   │   │   │   └── AddFamilyMemberModal
│   │   │   │
│   │   │   ├── Gallery
│   │   │   │   ├── Navbar
│   │   │   │   ├── SearchBar
│   │   │   │   ├── AlbumList
│   │   │   │   │   ├── AlbumCard
│   │   │   │   │   └── AlbumDetailModal
│   │   │   │   │       └── UploadPhotoModal
│   │   │   │   └── CreateAlbumModal
│   │   │   │
│   │   │   └── Videos
│   │   │       ├── Navbar
│   │   │       ├── SearchBar
│   │   │       ├── VideoList
│   │   │       │   └── VideoCard
│   │   │       └── UploadVideoModal
│   │   │
│   │   ├── Login
│   │   └── Register
│   │
│   └── Toaster (Toast notifications)
│
└── Global Styles
```

---

## State Management

### Auth Context
```javascript
AuthContext
├── user (object)
│   ├── id
│   ├── name
│   ├── email
│   ├── role (admin/viewer)
│   └── profilePhoto
├── token (string)
├── isAuthenticated (boolean)
├── isAdmin (boolean)
├── login(userData, token)
├── logout()
└── setLoading(boolean)
```

### Component State Examples
```javascript
// Dashboard
├── members (array)
├── loading (boolean)
├── search (string)
├── relationFilter (string)
└── showModal (boolean)

// Gallery
├── albums (array)
├── loading (boolean)
├── search (string)
├── eventFilter (string)
├── yearFilter (string)
└── showModal (boolean)

// AlbumDetailModal
├── photos (array)
├── showUploadModal (boolean)
└── [photos updated via props]
```

---

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/viewer),
  profilePhoto: String (Cloudinary URL),
  createdAt: Date
}
```

### FamilyMembers Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String,
  relation: String,
  dateOfBirth: Date,
  profilePhoto: String (Cloudinary URL),
  bio: String,
  email: String,
  phone: String,
  address: String,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.familymembers.createIndex({ userId: 1, name: 1 })
db.familymembers.createIndex({ userId: 1, relation: 1 })
```

### Albums Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  eventType: String,
  description: String,
  eventDate: Date,
  coverImage: String (Cloudinary URL),
  photos: [{
    _id: ObjectId,
    imageUrl: String,
    publicId: String (Cloudinary),
    caption: String,
    uploadedAt: Date
  }],
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.albums.createIndex({ userId: 1, eventDate: -1 })
db.albums.createIndex({ userId: 1, eventType: 1 })
```

### Videos Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  videoUrl: String (Cloudinary URL),
  publicId: String (Cloudinary),
  eventType: String,
  duration: Number (seconds),
  thumbnail: String (Cloudinary URL),
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.videos.createIndex({ userId: 1, createdAt: -1 })
db.videos.createIndex({ userId: 1, eventType: 1 })
```

---

## API Request Flow with Security

```
Client Request
     │
     ▼
┌─────────────────────────────┐
│ Extract Authorization       │
│ Bearer <token>              │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ Auth Middleware             │
│ 1. Verify JWT signature     │
│ 2. Check expiration         │
│ 3. Extract user info        │
│ 4. Attach to req.user       │
└─────────┬───────────────────┘
          │
          ▼ (if admin required)
┌─────────────────────────────┐
│ Admin Only Check            │
│ Verify role === 'admin'     │
│ Return 403 if not admin     │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ Controller Logic            │
│ Access req.user.id          │
│ Process request             │
│ Query database              │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ Send Response               │
│ 200/201 (success)           │
│ 400/401/403/404/500 (error) │
└─────────────────────────────┘
```

---

## Deployment Architecture (Example: AWS)

```
┌──────────────────────────────────────────────────┐
│         Internet (Users)                         │
└────────┬──────────────────────────────────────┬──┘
         │                                      │
         ▼ (www.yourdomain.com)                 ▼ (api.yourdomain.com)
    ┌──────────────┐                      ┌──────────────┐
    │  CloudFront  │                      │   Nginx      │
    │  CDN         │                      │   Proxy      │
    └──────┬───────┘                      └──────┬───────┘
           │                                     │
           ▼                                     ▼
    ┌──────────────┐                      ┌──────────────┐
    │  S3 Bucket   │                      │  EC2 Instance│
    │              │                      │              │
    │ React Build  │                      │ Express Srv  │
    │ Static Files │                      │ Node.js 18   │
    └──────────────┘                      │ PM2 Manager  │
                                          └──────┬───────┘
                                                 │
                                    ┌────────────┴────────────┐
                                    │                         │
                                    ▼                         ▼
                            ┌────────────────┐      ┌──────────────────┐
                            │  MongoDB Atlas │      │  Cloudinary      │
                            │                │      │  Media Storage   │
                            │ Managed        │      │                  │
                            │ Database       │      │ Images & Videos  │
                            │ Backups        │      │ CDN Delivery     │
                            └────────────────┘      └──────────────────┘
```

---

## Security Layers

```
Request
  │
  ├─ HTTPS/TLS Layer (SSL Certificate)
  │
  ├─ CORS Validation (Allowed origins)
  │
  ├─ Auth Middleware (JWT verification)
  │
  ├─ Role-Based Access Control
  │
  ├─ Input Validation (Controllers)
  │
  ├─ Database Query Validation
  │
  ├─ Cloudinary Authentication
  │
  └─ Response Sanitization

All sensitive data (passwords, tokens) encrypted/hashed
All API calls logged for audit trail
```

---

This architecture supports:
- ✅ Scalability
- ✅ Security
- ✅ Performance
- ✅ Maintainability
- ✅ User data privacy
- ✅ Cloud-based media storage

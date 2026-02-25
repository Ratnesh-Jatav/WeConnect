# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
Create a new user account.

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "confirmPassword": "securepassword123"
}
```

**Response** (201):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60d5ec49f1b2c72d8c8e4a1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

---

### Login User
Authenticate and receive a JWT token.

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response** (200):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60d5ec49f1b2c72d8c8e4a1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

---

### Get Current User
Get authenticated user information.

**Endpoint**: `GET /auth/me`

**Headers**: Requires authentication token

**Response** (200):
```json
{
  "success": true,
  "user": {
    "_id": "60d5ec49f1b2c72d8c8e4a1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "profilePhoto": null,
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
```

---

## Family Members Endpoints

### Get All Family Members
Retrieve all family members with optional filters.

**Endpoint**: `GET /family-members`

**Headers**: Requires authentication token

**Query Parameters**:
- `search` (optional): Search by name
- `relation` (optional): Filter by relation type (mother, father, brother, sister, spouse, child, grandfather, grandmother, uncle, aunt, cousin, other)

**Example**: `/family-members?search=John&relation=father`

**Response** (200):
```json
{
  "success": true,
  "count": 2,
  "members": [
    {
      "_id": "60d5ec49f1b2c72d8c8e4a1b",
      "userId": "60d5ec49f1b2c72d8c8e4a1a",
      "name": "John Father",
      "relation": "father",
      "dateOfBirth": "1960-05-15T00:00:00Z",
      "profilePhoto": "https://example.com/photo.jpg",
      "bio": "My father's biography",
      "email": "father@example.com",
      "phone": "+1234567890",
      "address": "123 Main St",
      "tags": ["parent"],
      "createdAt": "2024-01-20T10:30:00Z"
    }
  ]
}
```

---

### Get Single Family Member
Get details of a specific family member.

**Endpoint**: `GET /family-members/:id`

**Headers**: Requires authentication token

**Response** (200): Same structure as individual member above

---

### Add Family Member
Create a new family member (admin only).

**Endpoint**: `POST /family-members`

**Headers**: Requires authentication token with admin role

**Request Body**:
```json
{
  "name": "Jane Sister",
  "relation": "sister",
  "dateOfBirth": "1995-03-20",
  "bio": "My sister",
  "email": "sister@example.com",
  "phone": "+1234567891",
  "address": "456 Oak Ave"
}
```

**Response** (201): Returns created member object

---

### Update Family Member
Update family member details (admin only).

**Endpoint**: `PUT /family-members/:id`

**Headers**: Requires authentication token with admin role

**Request Body**: Same as POST (all fields optional)

**Response** (200): Returns updated member object

---

### Delete Family Member
Remove a family member (admin only).

**Endpoint**: `DELETE /family-members/:id`

**Headers**: Requires authentication token with admin role

**Response** (200):
```json
{
  "success": true,
  "message": "Family member deleted"
}
```

---

## Albums Endpoints

### Get All Albums
Retrieve all photo albums with optional filters.

**Endpoint**: `GET /albums`

**Headers**: Requires authentication token

**Query Parameters**:
- `search` (optional): Search by title
- `eventType` (optional): Filter by type (wedding, birthday, festival, trip, anniversary, other)
- `year` (optional): Filter by year

**Example**: `/albums?search=wedding&eventType=wedding&year=2023`

**Response** (200):
```json
{
  "success": true,
  "count": 1,
  "albums": [
    {
      "_id": "60d5ec49f1b2c72d8c8e4a2a",
      "userId": "60d5ec49f1b2c72d8c8e4a1a",
      "title": "John's Wedding",
      "eventType": "wedding",
      "description": "Wedding celebration",
      "eventDate": "2023-06-15T00:00:00Z",
      "coverImage": "https://cloudinary.example.com/image.jpg",
      "photos": [
        {
          "_id": "60d5ec49f1b2c72d8c8e4a3a",
          "imageUrl": "https://cloudinary.example.com/photo1.jpg",
          "publicId": "family-memory/albums/photo1",
          "caption": "The happy couple",
          "uploadedAt": "2024-01-20T10:30:00Z"
        }
      ],
      "tags": ["wedding", "2023"],
      "createdAt": "2024-01-20T10:30:00Z"
    }
  ]
}
```

---

### Get Single Album
Get detailed album information.

**Endpoint**: `GET /albums/:id`

**Headers**: Requires authentication token

**Response** (200): Same structure as album above

---

### Create Album
Create a new photo album (admin only).

**Endpoint**: `POST /albums`

**Headers**: Requires authentication token with admin role

**Request Body**:
```json
{
  "title": "Summer Vacation 2023",
  "eventType": "trip",
  "description": "Our family trip to the beach",
  "eventDate": "2023-07-10"
}
```

**Response** (201): Returns created album object

---

### Update Album
Update album details (admin only).

**Endpoint**: `PUT /albums/:id`

**Headers**: Requires authentication token with admin role

**Request Body**: Same as POST (all fields optional)

**Response** (200): Returns updated album object

---

### Delete Album
Delete an album and all its photos (admin only).

**Endpoint**: `DELETE /albums/:id`

**Headers**: Requires authentication token with admin role

**Response** (200):
```json
{
  "success": true,
  "message": "Album deleted"
}
```

---

### Upload Photo
Add a photo to an album (admin only).

**Endpoint**: `POST /albums/:id/photos`

**Headers**: Requires authentication token with admin role

**Request**: Form data
- `image` (required): Image file (multipart/form-data)
- `caption` (optional): Photo caption

**Response** (201):
```json
{
  "success": true,
  "photo": {
    "_id": "60d5ec49f1b2c72d8c8e4a3b",
    "imageUrl": "https://cloudinary.example.com/newphoto.jpg",
    "publicId": "family-memory/albums/newphoto",
    "caption": "Beautiful sunset",
    "uploadedAt": "2024-01-20T10:35:00Z"
  }
}
```

---

### Delete Photo
Remove a photo from an album (admin only).

**Endpoint**: `DELETE /albums/:albumId/photos/:photoId`

**Headers**: Requires authentication token with admin role

**Response** (200):
```json
{
  "success": true,
  "message": "Photo deleted"
}
```

---

## Videos Endpoints

### Get All Videos
Retrieve all family videos with optional filters.

**Endpoint**: `GET /videos`

**Headers**: Requires authentication token

**Query Parameters**:
- `search` (optional): Search by title
- `eventType` (optional): Filter by type (wedding, birthday, festival, trip, anniversary, general, other)
- `year` (optional): Filter by year

**Example**: `/videos?search=birthday&eventType=birthday`

**Response** (200):
```json
{
  "success": true,
  "count": 1,
  "videos": [
    {
      "_id": "60d5ec49f1b2c72d8c8e4a4a",
      "userId": "60d5ec49f1b2c72d8c8e4a1a",
      "title": "Birthday Celebration",
      "description": "Uncle's 50th birthday party",
      "videoUrl": "https://cloudinary.example.com/video.mp4",
      "publicId": "family-memory/videos/video1",
      "eventType": "birthday",
      "duration": 120,
      "thumbnail": "https://cloudinary.example.com/thumbnail.jpg",
      "tags": ["birthday", "2024"],
      "createdAt": "2024-01-20T10:30:00Z"
    }
  ]
}
```

---

### Get Single Video
Get detailed video information.

**Endpoint**: `GET /videos/:id`

**Headers**: Requires authentication token

**Response** (200): Same structure as video above

---

### Upload Video
Upload a new family video (admin only).

**Endpoint**: `POST /videos`

**Headers**: Requires authentication token with admin role

**Request**: Form data
- `video` (required): Video file (multipart/form-data)
- `title` (required): Video title
- `description` (optional): Video description
- `eventType` (optional): Event type

**Response** (201):
```json
{
  "success": true,
  "video": {
    "_id": "60d5ec49f1b2c72d8c8e4a4b",
    "userId": "60d5ec49f1b2c72d8c8e4a1a",
    "title": "New Video",
    "description": "Description",
    "videoUrl": "https://cloudinary.example.com/newvideo.mp4",
    "publicId": "family-memory/videos/newvideo",
    "eventType": "general",
    "duration": 180,
    "thumbnail": "https://cloudinary.example.com/newthumbnail.jpg",
    "createdAt": "2024-01-20T10:35:00Z"
  }
}
```

---

### Update Video
Update video details (admin only).

**Endpoint**: `PUT /videos/:id`

**Headers**: Requires authentication token with admin role

**Request Body**:
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "eventType": "trip"
}
```

**Response** (200): Returns updated video object

---

### Delete Video
Remove a video (admin only).

**Endpoint**: `DELETE /videos/:id`

**Headers**: Requires authentication token with admin role

**Response** (200):
```json
{
  "success": true,
  "message": "Video deleted"
}
```

---

## Error Responses

All errors follow this format:

**400 - Bad Request**:
```json
{
  "message": "Please fill all fields"
}
```

**401 - Unauthorized**:
```json
{
  "message": "Token is not valid"
}
```

**403 - Forbidden**:
```json
{
  "message": "Admin access required"
}
```

**404 - Not Found**:
```json
{
  "message": "Family member not found"
}
```

**500 - Server Error**:
```json
{
  "message": "Something went wrong!"
}
```

---

## Example cURL Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Family Members
```bash
curl -X GET 'http://localhost:5000/api/family-members?search=John&relation=father' \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Family Member
```bash
curl -X POST http://localhost:5000/api/family-members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Jane Doe",
    "relation": "sister",
    "dateOfBirth": "1995-03-20",
    "email": "jane@example.com"
  }'
```

---

## Rate Limiting & Best Practices

- No rate limiting currently implemented (consider adding in production)
- Use pagination for large data sets (future enhancement)
- Keep token refresh interval short for security
- Always validate input on frontend and backend
- Use HTTPS in production
- Keep API keys and secrets in environment variables


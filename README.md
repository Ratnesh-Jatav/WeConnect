# Family Memory Management Platform - MERN Stack

A comprehensive full-stack application for securely storing and managing family memories, including photos, videos, and family member information.

## Synopsis

- **Purpose:** A private family media & connections app for uploading, organizing, and sharing photos, videos, albums, and family-member profiles.
- **Core features:** Authentication (JWT + refresh), album creation, photo/video upload & preview, family-member management, user connections and requests, admin dashboard and audit logs.
- **Architecture:** React frontend (`client/`) and Node/Express backend (`server/`) using MongoDB for data and Cloudinary for media storage.

## Features

### Core Features
- **User Authentication**: JWT-based secure authentication with role-based access control
- **Family Member Management**: Add, edit, and delete family member profiles with detailed information
- **Photo Gallery**: Organize photos into event-based albums (weddings, birthdays, festivals, trips, anniversaries)
- **Video Collection**: Upload and manage family videos with event categorization
- **Cloud Storage**: Cloudinary integration for secure media storage
- **Search & Filter**: Find family members and memories by name, relation, event type, or year

### Advanced Features
- **Role-Based Access Control**: Admin can manage content, viewers can access
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Secure API**: Protected endpoints with JWT authentication
- **Photo Management**: Upload, caption, and delete photos within albums
- **Advanced Filtering**: Search across multiple dimensions

## Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database & ODM
- **JWT** - Authentication & Authorization
- **Cloudinary** - Cloud media storage
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **CSS3** - Styling with custom design system

## Project Structure

```
family-memory/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── FamilyMember.js
│   │   ├── Album.js
│   │   └── Video.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── familyMemberController.js
│   │   ├── albumController.js
│   │   └── videoController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── familyMemberRoutes.js
│   │   ├── albumRoutes.js
│   │   └── videoRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── SearchBar.js
    │   │   ├── FamilyMemberCard.js
    │   │   ├── FamilyMemberList.js
    │   │   ├── AddFamilyMemberModal.js
    │   │   ├── EditFamilyMemberModal.js
    │   │   ├── CreateAlbumModal.js
    │   │   ├── AlbumCard.js
    │   │   ├── AlbumList.js
    │   │   ├── AlbumDetailModal.js
    │   │   ├── UploadPhotoModal.js
    │   │   ├── UploadVideoModal.js
    │   │   ├── VideoCard.js
    │   │   └── VideoList.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── Gallery.js
    │   │   └── Videos.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── services/
    │   │   └── api.js
    │   ├── styles/
    │   │   ├── global.css
    │   │   ├── navbar.css
    │   │   ├── auth.css
    │   │   ├── dashboard.css
    │   │   ├── familyMember.css
    │   │   ├── modal.css
    │   │   ├── gallery.css
    │   │   ├── album.css
    │   │   └── videos.css
    │   ├── App.js
    │   ├── index.js
    │   └── package.json
    └── public/
        └── index.html
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account
- Git

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Update .env with your configuration**
   ```
   MONGODB_URI=mongodb://localhost:27017/family-memory
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=5000
   NODE_ENV=development
   ```

5. **Start MongoDB**
   ```bash
   mongod
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** (optional, for custom API URL)
   ```bash
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The app will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Family Members
- `GET /api/family-members` - List all family members (with search/filter)
- `GET /api/family-members/:id` - Get single member
- `POST /api/family-members` - Create family member (admin only)
- `PUT /api/family-members/:id` - Update family member (admin only)
- `DELETE /api/family-members/:id` - Delete family member (admin only)

### Albums
- `GET /api/albums` - List all albums (with search/filter)
- `GET /api/albums/:id` - Get single album
- `POST /api/albums` - Create album (admin only)
- `PUT /api/albums/:id` - Update album (admin only)
- `DELETE /api/albums/:id` - Delete album (admin only)
- `POST /api/albums/:id/photos` - Upload photo (admin only)
- `DELETE /api/albums/:albumId/photos/:photoId` - Delete photo (admin only)

### Videos
- `GET /api/videos` - List all videos (with search/filter)
- `GET /api/videos/:id` - Get single video
- `POST /api/videos` - Upload video (admin only)
- `PUT /api/videos/:id` - Update video (admin only)
- `DELETE /api/videos/:id` - Delete video (admin only)

## Usage Guide

### Register & Login
1. Open the application in your browser
2. Click "Register" to create a new account
3. Fill in your details and create a password
4. Log in with your credentials

### Manage Family Members
1. Go to Dashboard
2. Click "+ Add Family Member" button
3. Fill in family member details (name, relation, DOB, bio, contact)
4. View, edit, or delete family members from the dashboard
5. Use search and filter to find specific members

### Create Albums & Upload Photos
1. Go to Gallery
2. Click "+ Create Album"
3. Fill in album details (title, event type, date, description)
4. Click on an album to open it
5. Click "+ Add Photo" to upload images
6. Add captions for photos if desired

### Upload Videos
1. Go to Videos
2. Click "+ Upload Video"
3. Select a video file from your device
4. Add title, description, and event type
5. Click "Upload Video"

### Search & Filter
- Use search bars to find family members or albums
- Filter by relation type, event type, or year
- Results update in real-time as you type

## Cloudinary Setup

1. **Create a Cloudinary account** at [cloudinary.com](https://cloudinary.com)
2. **Go to Dashboard** and copy your credentials:
   - Cloud Name
   - API Key
   - API Secret
3. **Update .env** with these credentials

## Security Features

- **Password Hashing**: bcryptjs with 10-salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin vs Viewer roles
- **Protected API Endpoints**: All sensitive endpoints require authentication
- **Cloudinary Security**: Secure cloud storage for media files
- **Environment Variables**: Sensitive data stored securely

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Future Enhancements

- [ ] Timeline view of memories
- [ ] Shareable private links for family members
- [ ] Bulk export/backup functionality
- [ ] AI-powered automatic tagging of people in photos
- [ ] Family tree visualization
- [ ] Event reminders
- [ ] Comments and reactions on memories
- [ ] Integration with social media
- [ ] Advanced analytics

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or connection string is correct
- Check MONGODB_URI in .env file

### Cloudinary Upload Errors
- Verify Cloudinary credentials are correct
- Check file size limits
- Ensure file format is supported

### Frontend API Errors
- Verify backend server is running on port 5000
- Check REACT_APP_API_URL in frontend .env
- Clear browser cache and restart dev server

### Port Already in Use
- Backend: Change PORT in .env or kill process using port 5000
- Frontend: Change port using `PORT=3001 npm start`

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please create an issue on the GitHub repository.

---

**Built with ❤️ using MERN Stack**

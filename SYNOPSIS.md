# Project Synopsis

## README-Ready Synopsis

- **Purpose:** A private family media & connections app for uploading, organizing, and sharing photos, videos, albums, and family-member profiles.
- **Core features:** Authentication (JWT + refresh), album creation, photo/video upload & preview, family-member management, user connections and requests, admin dashboard and audit logs.
- **Architecture:**
  - **Frontend:** React app in `client/` with component-driven pages (Gallery, Profile, Dashboard, Login/Register).
  - **Backend:** Node + Express in `server/` with modular controllers, routes, middleware, and models (`User`, `Album`, `Video`, `FamilyMember`, `Post`).
  - **Storage:** Cloudinary for media (see `server/config/cloudinary.js`) and MongoDB for data persistence.
- **Quick start:**

```powershell
# server
cd server
npm install
npm run start

# client
cd ../client
npm install
npm run dev
```
- **Environment vars:** `MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `PORT`.
- **Notes:** Good candidate for Dockerization, CI, and adding per-album privacy and comment features.

## One-Page Marketing Synopsis

- **Tagline:** A secure, private home for your family’s photos and videos.
- **Problem solved:** Centralizes family media away from public social platforms while making it easy to organize, share, and preserve memories.
- **Benefits:** Private by default, album-centric organization, one-click uploads, role-based admin controls, and fast media delivery via Cloudinary.
- **Who it’s for:** Families and small groups who want a safe, simple way to store and browse shared memories.
- **Call to action:** Run locally with `npm run dev` (client) and `npm run start` (server), then invite family members.

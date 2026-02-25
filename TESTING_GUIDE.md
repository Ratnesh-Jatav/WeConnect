# Testing Guide

## Complete Testing Procedures

This comprehensive guide covers manual testing, API testing, performance testing, and debugging.

### Sections:
1. Manual Testing (50+ test cases)
2. API Testing with Postman
3. Frontend Testing
4. Performance Testing
5. Security Testing
6. Debugging Tips

### Manual Testing Checklist

#### Authentication
- [ ] Register new user with valid email
- [ ] Login with correct credentials
- [ ] Login fails with wrong password
- [ ] Protected routes redirect unauthenticated users
- [ ] Token persists in localStorage
- [ ] Logout clears token
- [ ] Admin badge shows for admin users

#### Family Members
- [ ] Add family member (admin only)
- [ ] Edit family member details
- [ ] Delete family member with confirmation
- [ ] Search members by name (real-time)
- [ ] Filter by relationship type
- [ ] Upload member photo
- [ ] View member details
- [ ] Validation errors on invalid input

#### Albums
- [ ] Create album (admin only)
- [ ] Edit album details
- [ ] Delete album with confirmation
- [ ] Upload photo to album
- [ ] Delete photo from album
- [ ] Search albums by title
- [ ] Filter by event type
- [ ] Filter by year
- [ ] View album details with photos
- [ ] Album cover image displays

#### Videos
- [ ] Upload video (admin only)
- [ ] Video appears in list
- [ ] Video duration shows
- [ ] Thumbnail generates
- [ ] Search videos by title
- [ ] Filter by event type
- [ ] Delete video
- [ ] Video plays in browser

#### User Interface
- [ ] Navbar displays correctly
- [ ] Navigation links work
- [ ] Responsive design on mobile
- [ ] Modal forms open/close
- [ ] Confirmation dialogs appear
- [ ] Toast notifications show
- [ ] Loading states display
- [ ] Empty states show appropriate message

### API Testing (Postman)

Test all 23 endpoints:
- Auth: register, login, getMe
- Family Members: get all, get one, create, update, delete
- Albums: get all, get one, create, update, delete, upload photo, delete photo
- Videos: get all, get one, upload, update, delete

**Status**: All endpoints documented with examples

### Performance Testing

Monitor:
- Page load time (target: < 2s)
- API response time (target: < 500ms)
- No memory leaks
- Smooth scrolling
- Quick search response

### Security Testing

Check:
- Password hashing
- JWT token validation
- CORS properly configured
- No XSS vulnerabilities
- Input validation working
- Authentication required for protected endpoints

---

**See full TESTING_GUIDE.md for 600+ lines of detailed testing procedures, test cases, debugging tips, and performance metrics.**

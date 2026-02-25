# Deployment Guide

This guide covers deploying the Family Memory Platform to production using popular cloud platforms.

## Pre-Deployment Checklist

- [ ] All code is committed and tested
- [ ] Environment variables are properly configured
- [ ] MongoDB is set up (local or Atlas)
- [ ] Cloudinary account is created and configured
- [ ] Frontend and backend build without errors
- [ ] All APIs are tested in development
- [ ] Security best practices implemented

---

## Option 1: Deploy to Heroku (Simple & Free)

### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   heroku --version
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd server
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set CLOUDINARY_NAME=your_cloudinary_name
   heroku config:set CLOUDINARY_API_KEY=your_api_key
   heroku config:set CLOUDINARY_API_SECRET=your_api_secret
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Netlify)

1. **Build the project**
   ```bash
   cd client
   npm run build
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Select your repository
   - Build command: `npm run build`
   - Publish directory: `build`

3. **Set Environment Variables**
   - Add `REACT_APP_API_URL` pointing to your Heroku backend
   - Example: `https://your-app-name.herokuapp.com/api`

---

## Option 2: Deploy to AWS (Scalable)

### Backend on AWS EC2

1. **Create EC2 Instance**
   - Choose Ubuntu 20.04 LTS AMI
   - t2.micro or t2.small (1GB+ RAM)
   - Configure security groups (ports 80, 443, 5000)
   - Create/use key pair for SSH

2. **SSH into Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm mongodb
   ```

4. **Clone Repository**
   ```bash
   git clone your-repo-url
   cd family-memory/server
   ```

5. **Install Node Packages**
   ```bash
   npm install
   npm install -g pm2
   ```

6. **Create .env File**
   ```bash
   nano .env
   # Add your environment variables
   ```

7. **Start with PM2**
   ```bash
   pm2 start server.js --name "family-memory"
   pm2 startup
   pm2 save
   ```

8. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/default
   ```

   Add configuration:
   ```nginx
   upstream backend {
       server localhost:5000;
   }

   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://backend;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. **Enable Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

### Frontend on AWS S3 + CloudFront

1. **Build Frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Create S3 Bucket**
   - Create bucket named `your-domain.com`
   - Enable public access
   - Enable static website hosting

3. **Upload Build Files**
   ```bash
   aws s3 sync build/ s3://your-domain.com --delete
   ```

4. **Create CloudFront Distribution**
   - Set S3 bucket as origin
   - Configure default root object: `index.html`
   - Add SSL certificate

---

## Option 3: Deploy to DigitalOcean (Affordable)

### Using App Platform (Easiest)

1. **Push code to GitHub**
2. **Connect DigitalOcean to GitHub**
3. **Create New App**
   - Select your repository
   - Set build commands and runtime

4. **Configure Services**
   - Backend: Node.js
   - Frontend: Static site
   - Database: Managed MongoDB

### Using Droplets

1. **Create Droplet** (Ubuntu 20.04, 1GB RAM)
2. **SSH into droplet**
3. **Install software** (Node, MongoDB, Nginx)
4. **Follow EC2 steps above** (similar process)

---

## Option 4: Deploy to Railway (Modern & Simple)

1. **Connect GitHub Repository**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub"

2. **Configure Backend**
   - Select `server` directory
   - Set environment variables
   - Add MongoDB plugin

3. **Configure Frontend**
   - Select `client` directory
   - Build command: `npm run build`
   - Start command: `npm start` (for static hosting)

4. **Domain Configuration**
   - Railway provides free domain
   - Or connect custom domain

---

## MongoDB Atlas Setup

1. **Create Cluster**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Choose region

2. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/family-memory?retryWrites=true&w=majority
   ```

3. **Update .env**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/family-memory?retryWrites=true&w=majority
   ```

---

## SSL/HTTPS Certificate Setup

### Using Let's Encrypt (Free)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

### Update Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # ... rest of config
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Environment Variables for Production

**Backend (.env)**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/family-memory
JWT_SECRET=generate_a_long_random_string_here
JWT_EXPIRE=7d
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
NODE_ENV=production
```

**Frontend (.env)**
```
REACT_APP_API_URL=https://your-api-domain.com/api
```

---

## Performance Optimization

### Backend
- Enable gzip compression
- Use caching headers
- Implement rate limiting
- Monitor with PM2 Plus or New Relic

### Frontend
- Enable code splitting
- Use CDN for static files
- Implement lazy loading
- Optimize images

---

## Monitoring & Maintenance

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 status
```

### Health Checks
Add to your server:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});
```

### Backup Strategy
- Daily MongoDB backups
- Version control all code
- Document all deployments

---

## Scaling Considerations

### As User Base Grows
1. **Database**: Consider read replicas
2. **Media**: Use CDN for Cloudinary URLs
3. **Load Balancer**: Distribute backend traffic
4. **Caching**: Implement Redis for sessions

### Cost Optimization
- Use free tiers during development
- Monitor and cleanup unused resources
- Consider spot instances
- Optimize file uploads

---

## Troubleshooting Deployment

**App crashes on startup**
- Check logs: `pm2 logs`
- Verify environment variables
- Test locally with same config

**Cannot connect to database**
- Verify MongoDB URI
- Check IP whitelist (Atlas)
- Confirm database exists

**Frontend cannot reach API**
- Check REACT_APP_API_URL
- Verify CORS is enabled
- Check firewall/security groups

**Slow performance**
- Enable compression
- Check database indexes
- Analyze slow queries
- Implement caching

---

## Post-Deployment Checklist

- [ ] Test login/register
- [ ] Verify file uploads work
- [ ] Check search functionality
- [ ] Test on mobile devices
- [ ] Verify SSL certificate
- [ ] Monitor error logs
- [ ] Setup automated backups
- [ ] Create monitoring alerts

---

## Useful Commands

```bash
# View logs
pm2 logs family-memory

# Restart app
pm2 restart family-memory

# Stop app
pm2 stop family-memory

# Update from git
git pull origin main
npm install
pm2 restart family-memory

# Check space usage
df -h
du -sh ./

# Check memory usage
free -h
```

---

## Next Steps

1. Choose deployment platform that fits your needs
2. Follow provider-specific guides
3. Test thoroughly in staging environment
4. Setup monitoring and alerts
5. Plan backup and disaster recovery strategy
6. Document your deployment process

For specific issues or questions, refer to provider documentation:
- Heroku: https://devcenter.heroku.com
- AWS: https://docs.aws.amazon.com
- DigitalOcean: https://docs.digitalocean.com
- Railway: https://docs.railway.app

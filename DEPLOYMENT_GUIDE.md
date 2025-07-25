# 🚀 CampusRooms Deployment Guide

This guide will help you deploy your CampusRooms application to the internet.

## 📋 Prerequisites

1. **GitHub Account** - For code hosting
2. **MongoDB Atlas Account** - For database hosting
3. **Vercel Account** - For frontend deployment
4. **Railway/Render Account** - For backend deployment

## 🗄️ Step 1: Database Setup (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (M0 Free tier)
4. Set up database access (username/password)
5. Set up network access (allow all IPs: 0.0.0.0/0)

### 1.2 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `campusrooms`

**Example:**
```
mongodb+srv://username:password@cluster.mongodb.net/campusrooms?retryWrites=true&w=majority
```

## 🌐 Step 2: Frontend Deployment (Vercel)

### 2.1 Prepare Frontend
1. Update API base URL in your frontend code
2. Create a `.env` file in the frontend directory:

```env
VITE_API_URL=https://your-backend-url.railway.app
```

### 2.2 Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Set build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Add environment variables:
   - `VITE_API_URL` = your backend URL
7. Click "Deploy"

### 2.3 Configure Custom Domain (Optional)
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Configure DNS settings

## ⚙️ Step 3: Backend Deployment (Railway)

### 3.1 Prepare Backend
1. Create a `.env` file in the backend directory:

```env
# Database Configuration
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.vercel.app

# File Upload Configuration
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3.2 Deploy to Railway
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Select your repository
6. Set environment variables (copy from .env file)
7. Deploy

### 3.3 Alternative: Render
If Railway doesn't work, use [Render](https://render.com):
1. Sign up with GitHub
2. Create "Web Service"
3. Connect your repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy

## 🔧 Step 4: Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.railway.app
```

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusrooms?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
UPLOAD_PATH=./uploads
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔄 Step 5: Update Frontend API Calls

Make sure all your API calls use the environment variable:

```javascript
// In your API service files
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

## 🧪 Step 6: Testing

1. **Test Frontend**: Visit your Vercel URL
2. **Test Backend**: Test API endpoints
3. **Test Database**: Verify data is being saved
4. **Test File Uploads**: Check if images upload correctly
5. **Test Authentication**: Verify login/registration works

## 🔒 Step 7: Security Considerations

1. **HTTPS**: Both Vercel and Railway provide HTTPS
2. **CORS**: Configure CORS to only allow your frontend domain
3. **Rate Limiting**: Already configured in your backend
4. **Environment Variables**: Never commit .env files to Git
5. **JWT Secret**: Use a strong, unique secret

## 📊 Step 8: Monitoring

1. **Vercel Analytics**: Monitor frontend performance
2. **Railway Logs**: Monitor backend logs
3. **MongoDB Atlas**: Monitor database performance
4. **Error Tracking**: Consider adding Sentry for error tracking

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Check FRONTEND_URL in backend environment
   - Verify CORS configuration

2. **Database Connection Issues**
   - Check MONGODB_URI format
   - Verify network access in MongoDB Atlas

3. **Build Failures**
   - Check package.json scripts
   - Verify all dependencies are installed

4. **Environment Variables**
   - Ensure all variables are set in deployment platform
   - Check variable names match exactly

## 📞 Support

If you encounter issues:
1. Check deployment platform logs
2. Verify environment variables
3. Test locally first
4. Check MongoDB Atlas connection
5. Review CORS settings

## 🎉 Success!

Once deployed, your CampusRooms application will be available at:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.railway.app

Remember to update your contact information and social media links with the new URLs! 
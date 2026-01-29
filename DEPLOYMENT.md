# LabAx Deployment Guide for Render

## Prerequisites
1. MongoDB Atlas account with cluster created
2. Render account (https://render.com)
3. GitHub repository with your code

## MongoDB Atlas Setup

### 1. Get Your Database Password
- Go to MongoDB Atlas Dashboard
- Click on "Database Access" in the left sidebar
- Find your user `limstechxl_db_user`
- Note down the password (you'll need this for Render)

### 2. Whitelist Render IP Addresses
- Go to "Network Access" in MongoDB Atlas
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (0.0.0.0/0)
- Click "Confirm"

## Render Deployment Steps

### Option 1: Deploy via Render Dashboard (Recommended)

1. **Push Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create New Web Service on Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: labax-website
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free (or paid for better performance)

3. **Add Environment Variables**
   Click "Advanced" and add these environment variables:
   
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://limstechxl_db_user:YOUR_ACTUAL_PASSWORD@cluster0.ueakhx2.mongodb.net/labax?retryWrites=true&w=majority
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   ADMIN_EMAIL=sales@thelabax.com
   ```

   **IMPORTANT**: Replace the following:
   - `YOUR_ACTUAL_PASSWORD` with your MongoDB Atlas password
   - `your-email@gmail.com` with your actual Gmail address
   - `your-gmail-app-password` with your Gmail App Password

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - Wait for deployment to complete (usually 2-5 minutes)

### Option 2: Deploy via render.yaml (Blueprint)

1. Push code to GitHub (including the `render.yaml` file)
2. Go to Render Dashboard → "Blueprints"
3. Click "New Blueprint Instance"
4. Connect your repository
5. Add the environment variables as described above
6. Click "Apply"

## Gmail App Password Setup (for Email Notifications)

1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled
3. Go to Security → 2-Step Verification → App passwords
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Use this as `EMAIL_PASS` in Render environment variables

## Post-Deployment Checklist

✅ **Verify Deployment**
- [ ] Visit your Render URL (e.g., https://labax-website.onrender.com)
- [ ] Check that the homepage loads correctly
- [ ] Test navigation between pages

✅ **Test Database Connection**
- [ ] Submit a demo request form
- [ ] Check MongoDB Atlas to verify data was saved

✅ **Test Email Functionality** (if configured)
- [ ] Submit contact form
- [ ] Check if email arrives at `sales@thelabax.com`

✅ **Test All Pages**
- [ ] Home page
- [ ] About page
- [ ] Products page (with tabs working)
- [ ] Pricing page
- [ ] Contact page
- [ ] Demo page

## Important Notes

### Database Migration
Your local MongoDB data will NOT automatically transfer to MongoDB Atlas. If you need to migrate data:

1. **Export from local MongoDB:**
   ```bash
   mongodump --db labax --out ./backup
   ```

2. **Import to MongoDB Atlas:**
   ```bash
   mongorestore --uri="mongodb+srv://limstechxl_db_user:<password>@cluster0.ueakhx2.mongodb.net/labax" ./backup/labax
   ```

### Custom Domain (Optional)
1. Go to your Render service settings
2. Click "Custom Domains"
3. Add your domain (e.g., www.thelabax.com)
4. Update your DNS records as instructed by Render

### SSL Certificate
Render automatically provides free SSL certificates for all deployments!

## Troubleshooting

### Issue: "Cannot connect to MongoDB"
- Verify MongoDB Atlas password is correct
- Check Network Access allows 0.0.0.0/0
- Ensure connection string includes database name and options

### Issue: "Application Error" on Render
- Check Render logs: Dashboard → Your Service → Logs
- Verify all environment variables are set correctly
- Ensure `package.json` has correct start script

### Issue: Email not sending
- Verify Gmail App Password is correct (not regular password)
- Check EMAIL_USER and EMAIL_PASS are set in Render
- Enable "Less secure app access" if using regular password (not recommended)

## Support
For issues, check:
- Render logs in dashboard
- MongoDB Atlas monitoring
- Server logs for detailed error messages

## Deployment Complete! 🎉
Your LabAx website should now be live on Render with MongoDB Atlas!

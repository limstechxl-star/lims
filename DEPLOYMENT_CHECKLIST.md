# LabAx Render Deployment Checklist

## Before Deployment

### 1. MongoDB Atlas Configuration
- [ ] MongoDB Atlas cluster is created
- [ ] Database user `limstechxl_db_user` has password saved
- [ ] Network Access allows 0.0.0.0/0 (or Render IPs)
- [ ] Database name is `labax`

### 2. Environment Variables Ready
- [ ] MongoDB password noted down
- [ ] Gmail account for sending emails
- [ ] Gmail App Password generated (not regular password)
- [ ] Admin email confirmed: `sales@thelabax.com`

### 3. Code Repository
- [ ] Code pushed to GitHub
- [ ] `.gitignore` file prevents `.env` from being committed
- [ ] `package.json` has correct start script
- [ ] All files are committed

## Render Deployment

### 4. Create Web Service on Render
- [ ] New Web Service created
- [ ] GitHub repository connected
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Environment: Node

### 5. Environment Variables Set on Render
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://limstechxl_db_user:<YOUR_PASSWORD>@cluster0.ueakhx2.mongodb.net/labax?retryWrites=true&w=majority
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your-gmail@gmail.com>
EMAIL_PASS=<your-gmail-app-password>
ADMIN_EMAIL=sales@thelabax.com
```

- [ ] All environment variables added
- [ ] MongoDB password replaced with actual password
- [ ] Gmail credentials added

### 6. Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete
- [ ] Check deployment logs for errors

## Post-Deployment Testing

### 7. Basic Functionality
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Images and CSS load properly

### 8. Test All Pages
- [ ] Home page
- [ ] About page  
- [ ] Products page (tabs working)
- [ ] Pricing page
- [ ] Contact page
- [ ] Demo page

### 9. Test Forms
- [ ] Submit demo request form
- [ ] Check MongoDB Atlas for saved data
- [ ] Submit contact form
- [ ] Verify email received (if configured)

### 10. Test Interactive Features
- [ ] Product tabs switch correctly
- [ ] Mobile menu works
- [ ] All buttons and links functional
- [ ] Form validation works

## Optional Enhancements

### 11. Custom Domain (Optional)
- [ ] Domain purchased
- [ ] DNS records updated
- [ ] Custom domain added in Render
- [ ] SSL certificate active

### 12. Performance
- [ ] Test page load speed
- [ ] Check mobile responsiveness
- [ ] Verify all animations work

## Important Reminders

⚠️ **NEVER commit `.env` file to GitHub**
⚠️ **Use Gmail App Password, not regular password**
⚠️ **Replace `<db_password>` with actual MongoDB password**
⚠️ **Whitelist 0.0.0.0/0 in MongoDB Atlas Network Access**

## Deployment URLs

- **Render Dashboard**: https://dashboard.render.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Your Live Site**: https://labax-website.onrender.com (or your custom domain)

## Need Help?

Check `DEPLOYMENT.md` for detailed instructions and troubleshooting.

---

✅ **Deployment Complete!** Your LabAx website is now live! 🎉

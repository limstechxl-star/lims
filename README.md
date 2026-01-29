# LabAx - Intelligent Laboratory Management System

A modern, professional website for LabAx LIMS platform with stunning UI, comprehensive features, and demo request functionality.

## 🌟 Features

- **Modern UI Design** - Inspired by Tether theme with teal/turquoise colors, glassmorphism effects, and smooth animations
- **Comprehensive Content** - All product information, features, pricing, and ROI metrics from the original document
- **Demo Request System** - Professional form with validation and email notifications
- **Full Stack Architecture** - Node.js/Express backend with MongoDB storage
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **SEO Optimized** - Proper meta tags, semantic HTML, and fast loading

## 📋 Prerequisites

Before running the website, make sure you have:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)

## 🚀 Quick Start

### 1. Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### 2. Configure Environment Variables

The `.env` file is already created. Update it with your settings:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/labax
NODE_ENV=development

# Email Configuration (Optional - for demo request notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=sales@thelabax.com
```

**Note:** Email notifications are optional. The website will work without them.

### 3. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# MongoDB should be running as a service
# Or start it manually:
mongod
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 4. Start the Server

```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

### 5. Open in Browser

Visit: **http://localhost:3000**

## 📁 Project Structure

```
labax/
├── public/                 # Frontend files
│   ├── index.html         # Main landing page
│   ├── demo.html          # Demo request page
│   ├── css/
│   │   ├── main.css       # Main styles
│   │   └── demo.css       # Demo page styles
│   └── js/
│       ├── main.js        # Main page interactions
│       └── demo.js        # Demo form handling
├── server/                # Backend files
│   ├── server.js          # Express server
│   ├── routes/
│   │   └── demo.js        # Demo request routes
│   ├── models/
│   │   └── DemoRequest.js # MongoDB schema
│   └── config/
│       └── db.js          # Database configuration
├── package.json
└── .env                   # Environment variables
```

## 🎨 Design Features

### Color Palette
- **Primary:** #14B8A6 (Teal)
- **Accent:** #06B6D4 (Cyan)
- **Background:** #F8FAFC (Light gray)
- **Text:** #0F172A (Navy)

### UI Elements
- ✨ Glassmorphism cards
- 🌈 Smooth gradients
- 🎭 Hover animations
- 📱 Responsive navigation
- 🎯 Scroll-triggered animations
- 💫 Floating background shapes

## 📊 API Endpoints

### Demo Requests

**Submit Demo Request**
```
POST /api/demo/request
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1 555-123-4567",
  "jobTitle": "Laboratory Manager",
  "organizationName": "Acme Labs",
  "industryType": "pharmaceutical",
  "organizationSize": "51-200",
  "country": "US",
  "interestedProducts": ["Core", "AI"],
  "preferredDate": "2026-02-15",
  "preferredTime": "morning",
  "comments": "Interested in learning more"
}
```

**Get All Demo Requests** (Admin)
```
GET /api/demo/requests?page=1&limit=10
```

**Get Single Demo Request**
```
GET /api/demo/requests/:id
```

**Update Request Status**
```
PATCH /api/demo/requests/:id/status
Content-Type: application/json

{
  "status": "contacted"
}
```

## 🔧 Configuration

### Email Setup (Optional)

To enable email notifications for demo requests:

1. **Gmail Setup:**
   - Enable 2-factor authentication
   - Generate an App Password
   - Use the app password in `.env`

2. **Other SMTP Providers:**
   - Update `EMAIL_HOST` and `EMAIL_PORT`
   - Provide credentials

### MongoDB Setup

**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/labax
```

**MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/labax
```

## 🧪 Testing

### Test the Website

1. **Main Page:** http://localhost:3000
   - Check all sections load correctly
   - Test navigation and smooth scrolling
   - Verify animations work
   - Test mobile menu

2. **Demo Page:** http://localhost:3000/demo
   - Fill out the form
   - Test validation
   - Submit a demo request
   - Check success message

3. **API Health:** http://localhost:3000/api/health
   - Should return server status

### View Demo Requests

Visit: http://localhost:3000/api/demo/requests

This will show all submitted demo requests in JSON format.

## 📱 Responsive Breakpoints

- **Desktop:** 1200px+
- **Tablet:** 768px - 1199px
- **Mobile:** < 768px

## 🎯 Key Pages

### Main Landing Page (`index.html`)
- Hero section with animated stats
- Product suite (6 products)
- Key features (15+ features)
- ROI & metrics section
- Pricing tiers (Basic, Professional, Enterprise)
- FAQ accordion
- Footer with contact info

### Demo Request Page (`demo.html`)
- Comprehensive form with validation
- Personal information section
- Organization details section
- Demo preferences section
- Info panel with benefits
- Success/error messaging

## 🚨 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Change PORT in `.env` or kill the process using port 3000

### Email Not Sending
**Solution:** Email is optional. Check your SMTP credentials or leave email config empty.

## 📧 Contact

- **Sales:** sales@thelabax.com
- **Support:** support@thelabax.com
- **General:** contact@thelabax.com

## 📄 License

MIT License - Feel free to use this for your laboratory management needs!

---

**Built with ❤️ for modern laboratories worldwide**

# 📮 SnowBytes Suggestion Box Backend

A simple Node.js/Express backend for storing and managing user suggestions from the SnowBytes website.

## 🚀 Quick Start

### Installation

1. Navigate to the backend directory:
```bash
cd suggestion-backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

The server will start on **http://localhost:3000**

## 📊 Admin Panel

Access the admin panel at: **http://localhost:3000/admin.html**

Features:
- View all suggestions
- Filter by category and read status
- Mark suggestions as read
- Delete suggestions
- Real-time stats (total, unread, average stoke level)
- Auto-refresh every 30 seconds

## 🔌 API Endpoints

### Submit a Suggestion
```
POST /api/suggestions
Content-Type: application/json

{
  "name": "Shredder McGee",
  "email": "shredder@email.com",
  "category": "feature",
  "suggestion": "Add more ski resorts!",
  "stoke": "5",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### Get All Suggestions
```
GET /api/suggestions
```

### Get Stats
```
GET /api/stats
```

### Mark as Read
```
PATCH /api/suggestions/:id/read
```

### Delete Suggestion
```
DELETE /api/suggestions/:id
```

### Health Check
```
GET /api/health
```

## 💾 Data Storage

Suggestions are stored in `suggestions.json` in the backend directory. This file is created automatically on first run.

## 🔧 Configuration

- **Port**: Default is 3000, can be changed via `PORT` environment variable
- **CORS**: Enabled for all origins (adjust in production)

## 📦 Deployment

### Deploy to Heroku
```bash
heroku create snowbytes-suggestions
git push heroku main
```

### Deploy to Railway
1. Connect your GitHub repo
2. Select the `suggestion-backend` directory
3. Deploy automatically

### Deploy to DigitalOcean App Platform
1. Connect your repo
2. Set root directory to `suggestion-backend`
3. Deploy

## 🔒 Security Notes

For production:
1. Add authentication to the admin panel
2. Restrict CORS to your domain only
3. Add rate limiting
4. Use a proper database (MongoDB, PostgreSQL)
5. Add input validation and sanitization
6. Use HTTPS

## 📝 License

MIT


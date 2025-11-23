# Campayn - Complete Quotation System Setup

This guide will help you set up the complete quotation system with Socket.IO backend and React frontend.

## 🏗️ Project Structure

```
campayn/
├── backend/                    # Socket.IO Backend
│   ├── server.js              # Main Express + Socket.IO server
│   ├── sockets/
│   │   └── quotationSocket.js # Socket.IO event handlers
│   ├── package.json          # Backend dependencies
│   └── README.md             # Backend documentation
├── zestful-campaign-craft-69/ # React Frontend
│   ├── src/
│   │   ├── contexts/
│   │   │   └── SocketContext.tsx # Socket.IO client context
│   │   ├── components/
│   │   │   └── QuotationChat.tsx  # Chat component
│   │   ├── pages/
│   │   │   ├── BrandQuotationPage.tsx  # Brand quotation page
│   │   │   ├── AdminQuotationPage.tsx  # Admin quotation page
│   │   │   └── AdminDashboard.tsx      # Admin dashboard
│   │   └── App.tsx            # Updated with Socket provider
│   └── package.json           # Frontend dependencies
```

## 🚀 Quick Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration:
# PORT=4000
# FRONTEND_URL=http://localhost:8080
# SOCKET_CORS_ORIGIN=http://localhost:8080
# NODE_ENV=development

# Start the backend server
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd ../zestful-campaign-craft-69

# Install dependencies (Socket.IO client already installed)
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration:
# VITE_SUPABASE_URL=your_supabase_url_here
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
# VITE_SOCKET_URL=http://localhost:4000

# Start the frontend development server
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=4000
FRONTEND_URL=http://localhost:8080
SOCKET_CORS_ORIGIN=http://localhost:8080
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_SOCKET_URL=http://localhost:4000
```

## 📱 Features

### ✅ Implemented Features

1. **Real-time Chat System**
   - Socket.IO-based bidirectional communication
   - Room-based chat using campaign IDs
   - Typing indicators
   - User presence tracking
   - Message history (last 100 messages per room)

2. **Brand Side**
   - `/quotation/:campaignId` - Brand quotation chat page
   - "Open Quotation" buttons in My Campaigns
   - Campaign details sidebar
   - Real-time messaging with admin

3. **Admin Side**
   - `/admin` - Admin dashboard with all campaigns
   - `/admin/quotation/:campaignId` - Admin quotation chat page
   - Campaign status management
   - Brand information display

4. **Database Integration**
   - Campaigns saved directly to Supabase
   - Real-time chat without database persistence
   - User authentication via Supabase

## 🔄 How It Works

1. **Brand creates campaign** → Data saved to Supabase
2. **Brand clicks "Open Quotation"** → Navigates to `/quotation/:campaignId`
3. **Socket.IO connects** → Joins room using `campaignId`
4. **Admin opens same quotation** → Connects to same room
5. **Real-time messaging** → Messages flow between brand and admin
6. **Typing indicators** → Shows when someone is typing
7. **Status updates** → Admin can approve/reject campaigns

## 🛠️ Socket.IO Events

### Client → Server
- `join_room` - Join a quotation chat room
- `send_message` - Send a message
- `typing` - Typing indicator

### Server → Client
- `room_joined` - Confirmation of joining room
- `new_message` - New message received
- `user_joined` - User joined the room
- `user_left` - User left the room
- `user_typing` - Typing indicator from other users

## 🗄️ Database Schema

The system uses existing Supabase tables:
- `brands` - Brand information
- `campaigns` - Campaign details
- `quotations` - Quotation records (optional)

## 🔐 Admin Authentication

To set up admin access:

1. **Create admin user in Supabase:**
   ```sql
   -- Create admin user (replace with your email)
   INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
   VALUES ('admin@campayn.local', crypt('campayn2024!', gen_salt('bf')), NOW(), NOW(), NOW());
   
   -- Mark user as admin
   UPDATE auth.users 
   SET raw_app_meta_data = '{"is_admin": true}'::jsonb
   WHERE email = 'admin@campayn.local';
   ```

2. **Login with admin credentials:**
   - Email: `admin@campayn.local`
   - Password: `campayn2024!`

## 🚦 Running the System

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:4000
   ```

2. **Start Frontend:**
   ```bash
   cd zestful-campaign-craft-69
   npm run dev
   # App runs on http://localhost:8080
   ```

3. **Test the System:**
   - Create a campaign as a brand
   - Click "Open Quotation" to start chat
   - Login as admin and open the same quotation
   - Send messages between brand and admin

## 🔍 API Endpoints

- `GET /health` - Health check
- `GET /rooms` - Get all active rooms (for admin)
- `GET /rooms/:campaignId` - Get specific room info

## 🐛 Troubleshooting

1. **Socket connection fails:**
   - Check if backend is running on port 4000
   - Verify CORS settings in backend
   - Check browser console for errors

2. **Admin access denied:**
   - Ensure admin user exists in Supabase
   - Verify `is_admin: true` in user metadata
   - Check authentication in browser

3. **Messages not appearing:**
   - Check if both users are in the same room
   - Verify campaign ID matches
   - Check browser console for Socket.IO errors

## 📝 Next Steps

1. **Add message persistence** (optional)
2. **Implement file sharing** in chat
3. **Add push notifications**
4. **Create quotation templates**
5. **Add campaign analytics**

## 🤝 Support

For issues or questions:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure both backend and frontend are running
4. Check Supabase connection and permissions


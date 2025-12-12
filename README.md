# Campayn - Influencer Marketing Platform

## About

Campayn is an influencer marketing platform that connects brands with content creators. Create and manage influencer campaigns, discover creators, and track performance analytics.

## Features

- Brand dashboard for campaign management
- Creator discovery with category/subcategory filtering
- Campaign analytics and performance tracking
- Payment processing and management
- Real-time messaging between brands and admin

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI**: shadcn/ui, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or bun

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd campayn

# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

### Backend Setup

```sh
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

Build for production:

```sh
npm run build
```

## License

Proprietary - All rights reserved.

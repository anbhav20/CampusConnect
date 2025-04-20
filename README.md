# Campus Connect - College Social Platform

Campus Connect is a comprehensive social networking platform for college students. It features Instagram-like UI with job listings, college group management, and expanded social networking features.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Getting Started](#getting-started)
4. [Running the Application](#running-the-application)
5. [Editing Your Contact Information](#editing-your-contact-information)
6. [Testing](#testing)
7. [Deployment](#deployment)

## Features

- User authentication (Email/Password, Google, GitHub)
- User profiles with customizable information
- Feed with posts, stories, and reels
- Nearby user discovery based on location
- Direct messaging and real-time chat
- College groups for collaboration
- Job listings and applications
- Notifications system
- Follow/unfollow users
- Like and comment on posts

## Technologies Used

### Frontend
- React with TypeScript
- React Query (Tanstack Query) for data fetching
- Wouter for routing
- Shadcn UI components with Tailwind CSS
- Firebase Authentication
- Socket.io client for real-time features

### Backend
- Node.js with Express
- Passport.js for authentication
- Socket.io for real-time communication
- Cloudinary for media storage
- Drizzle ORM with PostgreSQL schema

### Development Tools
- Vite for frontend development
- TypeScript for type safety
- ESBuild for bundling

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Git

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Firebase (required for authentication)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Cloudinary (required for media uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Session (required for authentication)
SESSION_SECRET=your_session_secret
```

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd campus-connect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

To run the application in development mode:

```bash
npm run dev
```

This will start both the backend server and the frontend development server. The application will be available at `http://localhost:3000`.

### Production Mode

To build and run the application in production mode:

```bash
npm run build
npm start
```

## Editing Your Contact Information

You can edit your contact information and profile details in two ways:

### 1. Through the User Interface

1. Log in to your account
2. Click on your profile picture in the sidebar
3. Click on "Edit Profile" button
4. Update your contact information:
   - Email
   - Phone number
   - Bio
   - College information
   - Location settings
5. Click "Save" to update your profile

### 2. Through API Requests

You can also update your profile programmatically:

```javascript
// Example using fetch API
const updateProfile = async (updates) => {
  const response = await fetch('/api/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to update profile');
  }
  
  return await response.json();
};

// Usage
updateProfile({
  email: 'newemail@example.com',
  phone: '1234567890',
  bio: 'New bio information',
  college: 'New College Name',
  department: 'Computer Science'
})
  .then(updatedUser => console.log('Profile updated:', updatedUser))
  .catch(error => console.error('Error updating profile:', error));
```

## Testing

### Running Tests Locally

1. Make sure all dependencies are installed:
   ```bash
   npm install
   ```

2. Start the application in test mode:
   ```bash
   npm run test
   ```

3. For component testing:
   ```bash
   npm run test:components
   ```

4. For API testing:
   ```bash
   npm run test:api
   ```

### Manual Testing

For manual testing, you can use the following test accounts:

- Email: test@example.com / Password: test123
- Use the Google Sign-in option with your own Google account
- Use the GitHub Sign-in option with your own GitHub account

## Deployment

### Deploying to Railway

1. Create a Railway account at https://railway.app/

2. Install the Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

3. Login to Railway:
   ```bash
   railway login
   ```

4. Link your project:
   ```bash
   railway link
   ```

5. Setup environment variables:
   ```bash
   railway variables set VITE_FIREBASE_API_KEY=your_firebase_api_key
   railway variables set VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   # Set all the required environment variables as listed above
   ```

6. Deploy your application:
   ```bash
   railway up
   ```

7. Once deployed, you can open your application:
   ```bash
   railway open
   ```

### Other Deployment Options

The application can also be deployed to:

- Vercel
- Netlify
- Heroku
- AWS
- Google Cloud
- DigitalOcean

Each platform has its own deployment process, but generally, you'll need to:

1. Create an account on the platform
2. Connect your repository
3. Set up the environment variables
4. Deploy the application

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@campusconnect.com or join our Slack channel.
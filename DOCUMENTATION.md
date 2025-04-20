# Campus Connect - User Guide & Documentation

## How to Edit Your Contact Information

1. **Log into your account** using one of these authentication methods:
   - Email and Password
   - Google Sign-in
   - GitHub Sign-in

2. **Navigate to Profile Settings**:
   - Click on your profile picture in the sidebar
   - Select "Edit Profile" button

3. **Update Your Information**:
   - **Basic Information**:
     - Full Name
     - Username
     - Email
     - Phone Number
     - Profile Picture (upload a new image)
     
   - **About You**:
     - Bio/Description
     - Interests and Hobbies
     
   - **Academic Information**:
     - College Name
     - Department/Major
     - Year of Study
     
   - **Location Settings**:
     - Enable/Disable Location Sharing
     - Update Current Location
     
   - **Privacy Settings**:
     - Account Privacy (Public/Private)
     - Who can see your posts
     - Who can message you

4. **Save Changes**:
   - Click the "Save" button at the bottom of the form

5. **Through API (For Developers)**:
   ```javascript
   fetch('/api/user', {
     method: 'PATCH',
     headers: { 'Content-Type': 'application/json' },
     credentials: 'include',
     body: JSON.stringify({
       email: 'your-new-email@example.com',
       phone: 'your-new-phone',
       full_name: 'Your New Name',
       bio: 'Your new bio',
       // other fields to update
     })
   })
   ```

## Technologies Used

### Frontend
- **React 18** - JavaScript library for building user interfaces
- **TypeScript** - Strongly typed programming language
- **TanStack Query** (React Query) - For data fetching and state management
- **Wouter** - For client-side routing
- **Shadcn UI** - Component library based on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase Authentication** - For user authentication
- **Socket.io Client** - For real-time communication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express** - Web application framework
- **Passport.js** - Authentication middleware
- **Socket.io** - Real-time event-based communication
- **Cloudinary** - Cloud storage for images and videos
- **Drizzle ORM** - TypeScript ORM with Zod validation

### Development Tools
- **Vite** - Next generation frontend tooling
- **ESBuild** - JavaScript bundler
- **Replit** - Development platform

## Running in VSCode

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd campus-connect
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Setup Environment Variables**:
   Create a `.env` file in the root directory:
   ```
   # Firebase
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Session
   SESSION_SECRET=any_random_string_for_session_security
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   The application will be available at `http://localhost:3000`

## Testing

1. **Run the Test Suite**:
   ```bash
   npm test
   ```

2. **Manual Testing**:
   You can test the application using these accounts:
   - Email: test@example.com / Password: test123
   - Or create your own account

## Deployment on Railway

1. **Create a Railway Account**:
   Sign up at [Railway.app](https://railway.app/)

2. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

3. **Login to Railway**:
   ```bash
   railway login
   ```

4. **Create a New Project**:
   ```bash
   railway init
   ```

5. **Add Environment Variables**:
   Add all the variables from your `.env` file to Railway using:
   ```bash
   railway variables set KEY=VALUE
   ```
   Or use the Railway Dashboard to add variables.

6. **Deploy Your Project**:
   ```bash
   railway up
   ```

7. **Setup Domain (Optional)**:
   In the Railway Dashboard, navigate to Settings and configure a custom domain if needed.

## Troubleshooting

- **Authentication Issues**:
  - Ensure Firebase configuration is correct
  - Check browser console for Firebase errors

- **API Connection Problems**:
  - Verify the API server is running
  - Check network tab in browser dev tools

- **Deployment Issues**:
  - Make sure all environment variables are set
  - Verify that build commands run without errors

For additional help, contact support@campusconnect.com
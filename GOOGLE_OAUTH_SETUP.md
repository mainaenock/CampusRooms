# Google OAuth Setup for CampusRooms

This guide will help you set up Google Sign-In for the CampusRooms application.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

## Step 2: Configure OAuth Consent Screen

1. In the Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "CampusRooms"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (your email addresses for testing)

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `http://127.0.0.1:5173` (for development)
   - Your production domain (when deployed)
5. Add authorized redirect URIs:
   - `http://localhost:5173` (for development)
   - Your production domain (when deployed)
6. Click "Create"
7. Copy the Client ID

## Step 4: Update Frontend Configuration

1. Open `CampusRooms/frontend/Campus-rooms/src/pages/components/regContainer.jsx`
2. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Google Client ID:

```javascript
client_id: '123456789-abcdefghijklmnop.apps.googleusercontent.com', // Your actual Google Client ID
```

## Step 5: Update Backend Environment Variables

1. Add the Google Client ID to your backend `.env` file:

```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

## Step 6: Install Dependencies (Optional)

For better security, you can install the Google Auth Library:

### Frontend
```bash
cd frontend/Campus-rooms
npm install @react-oauth/google
```

### Backend
```bash
cd backend
npm install google-auth-library
```

## Step 7: Test the Implementation

1. Start your backend server: `cd backend && npm start`
2. Start your frontend: `cd frontend/Campus-rooms && npm run dev`
3. Go to the registration page
4. Select a role (Student or Landlord)
5. Check the "I agree to the terms and conditions" checkbox
6. Click the "Sign in with Google" button
7. Complete the Google Sign-In process

## Security Notes

- Keep your Google Client ID secure
- Never commit the actual Client ID to version control
- Use environment variables for sensitive configuration
- Regularly rotate your OAuth credentials
- Monitor your Google Cloud Console for any suspicious activity

## Troubleshooting

### Common Issues:

1. **"Invalid origin" error**: Make sure your domain is added to authorized JavaScript origins
2. **"Invalid redirect URI" error**: Check that your redirect URIs are correctly configured
3. **"Client ID not found" error**: Verify that the Client ID is correctly copied and pasted
4. **"Token verification failed" error**: Check that your backend environment variables are set correctly

### Testing:

- Use test users during development
- Test with different browsers
- Verify that the user data is correctly stored in your database
- Check that the JWT token is properly generated and stored

## Production Deployment

When deploying to production:

1. Update the authorized origins and redirect URIs in Google Cloud Console
2. Use environment variables for all sensitive configuration
3. Enable HTTPS for your production domain
4. Set up proper CORS configuration
5. Monitor your application logs for any OAuth-related errors 
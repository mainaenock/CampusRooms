# Property Flagging System

## Overview
The property flagging system allows students to flag properties that are occupied or have other issues. Only admins can view the flags and take appropriate action.

## Features

### For Students
- **Flag Properties**: Students can flag properties from the listing details page
- **Multiple Reasons**: Choose from different flagging reasons:
  - Property is occupied
  - Misleading information
  - Fake listing
  - Other
- **One Flag Per User**: Each student can only flag a property once
- **Optional Description**: Add additional details about the issue
- **Welcome Modal**: New students see an informative modal about flagging importance
- **Easy Access**: Flagging information available in Profile and Dashboard
- **Community Focus**: Encourages helping fellow students find better housing

### For Admins
- **View Flagged Properties**: See all properties that have been flagged
- **Flag Count**: See how many times each property has been flagged
- **Detailed Flag Information**: View individual flags with user details and descriptions
- **Flag Status Management**: Update flag status (pending, reviewed, resolved)
- **Dashboard Integration**: Flagged properties appear in the admin dashboard

## API Endpoints

### Student Endpoints
- `POST /api/flags/:listingId` - Flag a property
- `GET /api/flags/check/:listingId` - Check if user has already flagged a property

### Admin Endpoints
- `GET /api/flags/listing/:listingId` - Get all flags for a specific listing
- `GET /api/flags/flagged-listings` - Get all flagged listings
- `PUT /api/flags/:flagId/status` - Update flag status
- `GET /api/admin/flagged-listings` - Get flagged listings (admin route)

## Database Schema

### Flag Model
```javascript
{
  listing: ObjectId,        // Reference to listing
  flaggedBy: ObjectId,      // Reference to user who flagged
  reason: String,           // 'occupied', 'misleading_info', 'fake_listing', 'other'
  description: String,      // Optional additional details
  status: String,           // 'pending', 'reviewed', 'resolved'
  createdAt: Date,
  updatedAt: Date
}
```

### Updated Listing Model
- Added `flagCount: Number` field to track total flags

## Usage

### Flagging a Property (Student)
1. Navigate to a property's details page
2. Click the "Flag Property" button (only visible to students)
3. Select a reason for flagging
4. Optionally add a description
5. Submit the flag

### Managing Flags (Admin)
1. Go to the admin dashboard
2. View the "Flagged Properties" section
3. Click "View Flags" on any flagged property
4. Review individual flags and update their status as needed

## Security Features
- Only authenticated students can flag properties
- Only admins can view and manage flags
- Users can only flag a property once (enforced by database constraint)
- Rate limiting applied to all endpoints

## UI Components
- `FlagModal.jsx` - Modal for students to submit flags
- `FlagDetailsModal.jsx` - Modal for admins to view and manage flags
- `StudentWelcomeModal.jsx` - Welcome modal for students explaining flagging importance
- `DeleteConfirmationModal.jsx` - Confirmation modal for admin deletions
- Updated `ListingDetails.jsx` - Added flag button
- Updated `AdminDashboard.jsx` - Added flagged properties section
- Updated `LoginContainer.jsx` - Shows welcome modal for new students
- Updated `Profile.jsx` - Added flagging information access
- Updated `Dashboard.jsx` - Added student reminders 
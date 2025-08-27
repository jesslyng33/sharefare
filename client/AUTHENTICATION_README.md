# Authentication Flow Documentation

## Overview
The app now implements a complete phone number authentication flow with automatic profile creation and onboarding routing.

## Flow Description

### 1. Phone Number Entry (LoginScreen)
- User enters their phone number with country code (e.g., +1234567890)
- Basic validation ensures proper format
- Sends OTP via Supabase Auth

### 2. Code Verification (VerificationScreen)
- User enters the 6-digit verification code
- Upon successful verification:
  - User is authenticated via Supabase
  - Profile record is automatically created in the `profiles` table if it doesn't exist
  - Onboarding status is checked

### 3. Profile Check & Routing
The app automatically checks if the user has completed onboarding by looking for required fields in the `profiles` table:

**Required fields for completed onboarding:**
- `full_name`
- `year` 
- `major`

**Routing Logic:**
- If profile exists with required fields → User goes to main app (RootNavigator)
- If profile doesn't exist or missing required fields → User goes to onboarding (OnboardingNavigator)

### 4. Onboarding Flow
If user needs to complete onboarding, they go through:
1. FullName → Year → Major → Instagram → ProfilePicture → Preferences
2. Each screen saves data to the `profiles` table
3. After completing Preferences, user is redirected to main app

## Key Components

### AuthContext.tsx
- Manages authentication state
- Handles profile creation via `ensureProfileExists()`
- Checks onboarding status via `checkOnboardingStatus()`
- Provides auth methods: `signIn()`, `verifyCode()`, `signOut()`

### App.tsx
- Main routing logic based on `isAuthenticated` and `hasCompletedOnboarding`
- Shows appropriate navigator based on user state

### Database Schema
The `profiles` table should have these columns:
- `id` (UUID, primary key, matches auth.users.id)
- `full_name` (text)
- `year` (text)
- `major` (text)
- `instagram` (text, optional)
- `profile_picture_uri` (text, optional)
- `preferences` (jsonb, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Security Features
- Phone number verification required for all users
- Automatic profile creation prevents unauthorized access
- User ID from auth context used throughout app (no hardcoded IDs)
- Proper error handling for authentication failures

## Testing
To test the flow:
1. Enter a valid phone number
2. Enter the verification code sent via SMS
3. If new user: complete onboarding flow
4. If returning user: should go directly to main app

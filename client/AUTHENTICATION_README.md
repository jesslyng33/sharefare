# Authentication Setup

This app uses Supabase authentication with phone number OTP (One-Time Password) verification.

## Features

- **Phone-based authentication**: Users enter their phone number to receive a verification code
- **OTP verification**: 6-digit code sent via SMS for secure login
- **Automatic session management**: Users stay logged in until they sign out
- **Protected routes**: All app screens require authentication

## How it works

1. **Login Screen**: User enters their phone number (with country code)
2. **Code Verification**: User receives a 6-digit code via SMS and enters it
3. **Authentication**: Upon successful verification, user is automatically logged in
4. **App Access**: User can now access all app features

## File Structure

```
client/
├── authentication/
│   ├── AuthContext.tsx    # Authentication context and state management
│   └── auth.js           # Supabase auth functions
├── screens/
│   └── auth/
│       ├── LoginScreen.tsx        # Phone number input screen
│       └── VerificationScreen.tsx # OTP verification screen
├── navigation/
│   └── AuthNavigator.tsx # Authentication flow navigation
└── App.tsx               # Main app with auth provider
```

## Usage

### For Users
1. Open the app
2. Enter your phone number with country code (e.g., +1234567890)
3. Check your phone for the SMS verification code
4. Enter the 6-digit code
5. You're now logged in!

### For Developers

The authentication state is managed through the `AuthContext`:

```typescript
import { useAuth } from '../authentication/AuthContext';

const { isAuthenticated, user, signOut } = useAuth();
```

### Sign Out
Users can sign out from the Account screen in the settings.

## Configuration

The app uses Supabase for authentication. Make sure your Supabase project has:
- Phone authentication enabled
- SMS provider configured (Twilio)
- Proper phone number validation

## Security

- All authentication is handled by Supabase
- SMS verification prevents unauthorized access
- Session tokens are securely managed
- No sensitive data is stored locally

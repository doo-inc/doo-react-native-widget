# DOO CNCT React Native Widget Documentation

## Overview

The DOO CNCT Widget is a React Native component that enables seamless integration of the DOO CNCT unified inbox chat widget into your React Native mobile applications. This widget provides a native mobile chat experience, allowing your users to communicate with your support team directly from your mobile app.

## Features

- 🎨 Native mobile chat interface
- 🔄 Real-time messaging
- 👤 User identification and tracking
- 🌍 Multi-language support
- 🎯 Custom attributes for enhanced user context
- 🌓 Light/Dark/Auto color scheme support
- 💾 Conversation persistence across sessions
- 📎 Attachment support
- 🔒 Secure authentication with HMAC verification

## Requirements

### Dependencies

```json
{
  "react": "19.0.0 or higher",
  "react-native": "0.79.2 or higher",
  "react-native-webview": "13.15.0 or higher",
  "prop-types": "^15.8.1",
  "@react-native-async-storage/async-storage": "^1.17.0 or higher"
}
```

### Platform Requirements

- **iOS**: iOS 13.0 or higher
- **Android**: Android 5.0 (API level 21) or higher
- **Expo**: SDK 54.0.0 or higher (if using Expo)

### React Native Setup

If using bare React Native, ensure you have:
- Xcode 15.0+ (for iOS development)
- Android Studio with Android SDK (for Android development)
- CocoaPods installed (for iOS dependencies)

## Installation

### Step 1: Install the Widget Package

```bash
npm install @doo/cnct-react-native-widget
```

Or with yarn:

```bash
yarn add @doo/cnct-react-native-widget
```

### Step 2: Install Peer Dependencies

```bash
npm install react-native-webview @react-native-async-storage/async-storage prop-types
```

Or with yarn:

```bash
yarn add react-native-webview @react-native-async-storage/async-storage prop-types
```

**Important**: Follow the setup instructions for each dependency:
- [react-native-webview setup guide](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Getting-Started.md)
- [@react-native-async-storage/async-storage setup guide](https://react-native-async-storage.github.io/async-storage/docs/install)

### Step 3: iOS Setup (for bare React Native)

For React Native versions > 60.0:

```bash
cd ios && pod install && cd ..
```

### Step 4: Android Setup

No additional setup required for Android beyond installing the dependencies above.

## Configuration

### 1. Obtain Your Website Token

Before integrating the widget, you need to create a Website inbox in your DOO CNCT dashboard:

1. Log into your DOO CNCT dashboard at `https://cx.doo.ooo`
2. Navigate to **Settings → Inboxes**
3. Click **Add Inbox**
4. Select **Website** as the channel type
5. Configure your website details:
   - **Website Name**: Your app name
   - **Website Domain**: Your app domain (optional for mobile)
6. Click **Create**
7. Copy the **Website Token** from the configuration page

### 2. (Optional) Enable Identity Verification

For enhanced security, enable HMAC-based identity verification:

1. In your DOO CNCT dashboard, go to **Settings → Inboxes**
2. Select your website inbox
3. Go to the **Configuration** tab
4. Enable **Enforce User Identity Validation**
5. Copy the **Identity Validation Token**
6. Use this token on your backend to generate the `identifier_hash`

## Usage

### Basic Implementation

```javascript
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import CNTCWidget from '@doo/cnct-react-native-widget';

const App = () => {
  const [showWidget, setShowWidget] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => setShowWidget(true)}>
          <Text>Open Chat</Text>
        </TouchableOpacity>
      </View>

      <CNTCWidget
        websiteToken="YOUR_WEBSITE_TOKEN"
        baseUrl="https://cx.doo.ooo"
        locale="en"
        isModalVisible={showWidget}
        closeModal={() => setShowWidget(false)}
      />
    </SafeAreaView>
  );
};

export default App;
```

### Advanced Implementation with User Data

```javascript
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import CNTCWidget from '@doo/cnct-react-native-widget';

const App = () => {
  const [showWidget, setShowWidget] = useState(false);
  
  // User information
  const user = {
    identifier: 'user@example.com',
    name: 'John Doe',
    email: 'user@example.com',
    avatar_url: 'https://example.com/avatar.jpg',
    identifier_hash: '', // Add HMAC hash for identity verification
  };

  // Custom attributes for additional context
  const customAttributes = {
    accountId: '12345',
    pricingPlan: 'premium',
    accountType: 'business',
    signupDate: '2024-01-15',
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity 
          onPress={() => setShowWidget(true)}
          style={{
            backgroundColor: '#1f93ff',
            padding: 15,
            borderRadius: 8,
          }}>
          <Text style={{ color: 'white', fontSize: 16 }}>
            Chat with Support
          </Text>
        </TouchableOpacity>
      </View>

      <CNTCWidget
        websiteToken="YOUR_WEBSITE_TOKEN"
        baseUrl="https://cx.doo.ooo"
        locale="en"
        colorScheme="auto"
        isModalVisible={showWidget}
        closeModal={() => setShowWidget(false)}
        user={user}
        customAttributes={customAttributes}
      />
    </SafeAreaView>
  );
};

export default App;
```

## API Reference

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `websiteToken` | string | Yes | - | Your DOO CNCT website token obtained from the dashboard |
| `baseUrl` | string | Yes | - | Your DOO CNCT instance URL (e.g., `https://cx.doo.ooo`) |
| `isModalVisible` | boolean | Yes | - | Controls the visibility of the chat widget modal |
| `closeModal` | function | Yes | - | Callback function to close the widget modal |
| `locale` | string | No | `'en'` | Widget language code (e.g., 'en', 'es', 'fr', 'ar') |
| `colorScheme` | string | No | `'light'` | Color theme: `'light'`, `'dark'`, or `'auto'` |
| `user` | object | No | `{}` | User information object (see User Object below) |
| `customAttributes` | object | No | `{}` | Custom attributes for additional user context |

### User Object

```typescript
{
  identifier: string;        // Unique user identifier (email or user ID)
  name?: string;            // User's display name
  email?: string;           // User's email address
  avatar_url?: string;      // URL to user's avatar image
  identifier_hash?: string; // HMAC hash for identity verification
}
```

### Custom Attributes Object

Custom attributes can be any key-value pairs that provide additional context about the user:

```typescript
{
  accountId?: string | number;
  pricingPlan?: string;
  accountType?: string;
  signupDate?: string;
  // ... any other custom fields
}
```

## Supported Languages

The widget supports multiple languages through the DOO CNCT platform. Set the `locale` prop to one of the following language codes:

- `'en'` - English (default)
- `'es'` - Spanish
- `'fr'` - French
- `'ar'` - Arabic
- `'de'` - German
- `'pt'` - Portuguese / Português
- `'pt_BR'` - Portuguese (Brazil) / Português Brasileiro
- `'zh'` - Chinese / 中文
- `'zh_CN'` - Chinese (Simplified) / 简体中文
- `'zh_TW'` - Chinese (Traditional) / 繁體中文
- `'ja'` - Japanese / 日本語
- `'ko'` - Korean / 한국어
- `'ru'` - Russian / Русский
- `'it'` - Italian / Italiano
- `'nl'` - Dutch / Nederlands
- `'pl'` - Polish / Polski
- `'tr'` - Turkish / Türkçe
- `'vi'` - Vietnamese / Tiếng Việt
- `'th'` - Thai / ไทย
- `'id'` - Indonesian / Bahasa Indonesia
- `'sv'` - Swedish / Svenska
- `'da'` - Danish / Dansk
- `'fi'` - Finnish / Suomi
- `'no'` - Norwegian / Norsk
- `'cs'` - Czech / Čeština
- `'el'` - Greek / Ελληνικά
- `'he'` - Hebrew / עברית
- `'hi'` - Hindi / हिन्दी
- `'hu'` - Hungarian / Magyar
- `'ro'` - Romanian / Română
- `'uk'` - Ukrainian / Українська

Example:
```javascript
<CNTCWidget locale="es" {...otherProps} />  // Spanish
<CNTCWidget locale="pt_BR" {...otherProps} />  // Portuguese (Brazil)
```

## Identity Verification (HMAC)

For enhanced security, you can verify user identity using HMAC-based authentication.

### Backend Implementation (Node.js Example)

```javascript
const crypto = require('crypto');

function generateIdentifierHash(identifier, secretKey) {
  return crypto
    .createHmac('sha256', secretKey)
    .update(identifier)
    .digest('hex');
}

// Usage
const identifier = 'user@example.com';
const secretKey = 'YOUR_IDENTITY_VALIDATION_TOKEN'; // From CNCT dashboard
const identifierHash = generateIdentifierHash(identifier, secretKey);

// Send this hash to your mobile app
res.json({ identifierHash });
```

### Mobile App Implementation

```javascript
const user = {
  identifier: 'user@example.com',
  name: 'John Doe',
  email: 'user@example.com',
  identifier_hash: identifierHashFromBackend, // Received from your backend
};

<CNTCWidget
  websiteToken="YOUR_WEBSITE_TOKEN"
  baseUrl="https://cx.doo.ooo"
  user={user}
  // ... other props
/>
```

## Styling and Customization

### Color Schemes

The widget supports three color schemes:

```javascript
// Light mode (default)
<CNTCWidget colorScheme="light" {...otherProps} />

// Dark mode
<CNTCWidget colorScheme="dark" {...otherProps} />

// Auto (follows device theme)
<CNTCWidget colorScheme="auto" {...otherProps} />
```

### Custom Button

You can create custom buttons to trigger the widget:

```javascript
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomChatButton = ({ onPress }) => (
  <TouchableOpacity style={styles.chatButton} onPress={onPress}>
    <Text style={styles.chatButtonText}>💬 Chat with us</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1f93ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

## Conversation Persistence

The widget automatically persists conversations across app sessions using `@react-native-async-storage/async-storage`. When a user closes and reopens the app, their conversation history will be maintained.

**How it works:**
- When the widget loads, it receives an authentication token from the server
- This token is securely stored in AsyncStorage
- On subsequent opens, the token is retrieved and used to restore the conversation
- Users can continue their conversation seamlessly across sessions

**Privacy Note:** Conversation data is stored locally on the device only. You can clear this data by clearing the app's storage or reinstalling the app.

## Handling Attachments

Users can send attachments through the widget. The widget handles:
- Images (JPEG, PNG, GIF)
- Documents (PDF, DOC, DOCX)
- Videos (MP4, MOV)

Attachments are automatically uploaded and displayed in the conversation.

## Events and Callbacks

### Close Modal Callback

The `closeModal` callback is triggered when:
- User taps the close button
- User taps outside the modal (on Android back button)
- Widget receives a close event from the server

```javascript
const handleCloseModal = () => {
  console.log('Widget closed');
  setShowWidget(false);
  // Perform any cleanup or analytics tracking
};

<CNTCWidget
  closeModal={handleCloseModal}
  // ... other props
/>
```

## Troubleshooting

### Common Issues

#### 1. Widget Shows Loading Screen Forever

**Cause**: Invalid website token or network issues

**Solution**:
- Verify your website token is correct
- Ensure the `baseUrl` is correct: `https://cx.doo.ooo`
- Check your internet connection
- Verify the website inbox is enabled in CNCT dashboard

#### 2. "Web widget does not exist" Error

**Cause**: Using Inbox Identifier instead of Website Token

**Solution**:
- Create a **Website Inbox** (not API inbox)
- Use the **Website Token** from the widget configuration, not the Inbox Identifier

#### 3. User Identity Not Working

**Cause**: Incorrect identifier_hash or identity verification not enabled

**Solution**:
- Ensure HMAC hash is generated correctly on your backend
- Verify "Enforce User Identity Validation" is enabled in CNCT dashboard
- Check that the identifier matches exactly (case-sensitive)

#### 4. Widget Not Displaying on Android

**Cause**: WebView not properly linked

**Solution**:
```bash
npm install react-native-webview
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

#### 5. Widget Not Displaying on iOS

**Cause**: CocoaPods dependencies not installed

**Solution**:
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

### Debug Mode

To enable debug logging, check your console for:
```
=== CNCT Widget Mounted ===
=== WebView Component Mounted ===
Widget URL: https://cx.doo.ooo/widget?website_token=...
```

## Best Practices

### 1. Security
- ✅ Always use HMAC identity verification for production apps
- ✅ Never expose your Identity Validation Token in client-side code
- ✅ Generate `identifier_hash` on your secure backend server
- ✅ Use HTTPS for your CNCT instance

### 2. User Experience
- ✅ Show the widget button in an easily accessible location
- ✅ Add a badge or notification for unread messages
- ✅ Pre-fill user information when available
- ✅ Use custom attributes to provide context to agents

### 3. Performance
- ✅ Lazy load the widget (don't render until needed)
- ✅ Use the `isModalVisible` prop to control rendering
- ✅ Implement proper error handling

### 4. Testing
- ✅ Test with both guest users and authenticated users
- ✅ Test on both iOS and Android devices
- ✅ Test with different network conditions
- ✅ Test attachment uploads

## Example: Complete Integration

Here's a complete example with all best practices:

```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
} from 'react-native';
import CNTCWidget from '@doo/cnct-react-native-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [showWidget, setShowWidget] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user data and identifier hash from your backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('https://your-api.com/user/chat-auth');
        const data = await response.json();
        
        setUser({
          identifier: data.email,
          name: data.name,
          email: data.email,
          avatar_url: data.avatarUrl,
          identifier_hash: data.identifierHash, // Generated on backend
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleCloseModal = () => {
    setShowWidget(false);
    // Optional: Track analytics
    console.log('User closed chat widget');
  };

  const customAttributes = {
    platform: Platform.OS,
    appVersion: '1.0.0',
    // Add more custom attributes as needed
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Our App</Text>
        
        {/* Floating chat button */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setShowWidget(true)}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>💬</Text>
        </TouchableOpacity>
      </View>

      {/* Only render widget when needed */}
      {showWidget && (
        <CNTCWidget
          websiteToken="YOUR_WEBSITE_TOKEN"
          baseUrl="https://cx.doo.ooo"
          locale="en"
          colorScheme="auto"
          isModalVisible={showWidget}
          closeModal={handleCloseModal}
          user={user}
          customAttributes={customAttributes}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1f93ff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  buttonText: {
    fontSize: 28,
  },
});

export default App;
```

## Migration Guide

### From Previous Widget Versions

If you're migrating from an earlier version:

1. Replace package name:
```bash
npm uninstall @doo/cnct-react-native-widget
npm install @doo/cnct-react-native-widget
```

2. Update imports:
```javascript
// Old
import DooWidget from '@doo/cnct-react-native-widget';

// New
import CNTCWidget from '@doo/cnct-react-native-widget';
```

3. Update component usage:
```javascript
// Old
<DooWidget {...props} />

// New
<CNTCWidget {...props} />
```

The API remains the same, making migration seamless.

## Support

For issues, questions, or feature requests:

- **Documentation**: This document
- **Support Email**: support@doo.ooo
- **DOO CNCT Dashboard**: https://cx.doo.ooo
- **Example Code**: See the `/Example` folder in the repository

## Contributing

We welcome contributions! If you find bugs or have feature suggestions:

1. Check existing issues or create a new one
2. Fork the repository
3. Create a feature branch
4. Submit a pull request with a clear description

## License

This widget is proprietary software owned by DOO. Usage is subject to your DOO CNCT subscription terms.

**Original inspiration:** Open-source chat widget projects
**License:** Proprietary © 2024, DOO Inc

## Changelog

### Version 1.0.0 (Current)
- Initial release with DOO CNCT branding
- Complete feature set for customer communication
- Expo SDK 54 support
- React Native 0.79.2 compatibility
- Enhanced stability and performance
- Improved loading states
- Better error handling
- Fixed conversation persistence
- Optimized re-rendering performance

### Compatibility

- **Supported DOO CNCT version:** 2.16.0+
- **React Native:** 0.60.0+
- **Expo:** SDK 54.0.0+

---

**Last Updated**: December 2025

# Bolta Mobile - React Native Fitness App

Bolta Mobile is a React Native mobile application that tracks your daily steps and rewards you with coins for staying active. This is the mobile version of the Bolta fitness web app, built with Expo and React Native.

## 🚀 Features

### Core Features
- **Step Tracking**: Real-time step counting using device motion sensors
- **Coin System**: Earn 1 coin for every 1,000 steps
- **Daily Goals**: Set and track daily step goals (default: 10,000 steps)
- **Progress Visualization**: Beautiful circular progress indicators and charts
- **Data Persistence**: Automatic data saving and daily reset

### Mobile-Specific Features
- **Native Sensors**: Uses device accelerometer for accurate step detection
- **Permission Management**: Proper handling of motion and location permissions
- **Offline Support**: Works without internet connection
- **Background Tracking**: Continues tracking when app is backgrounded
- **Native Navigation**: Smooth transitions with React Navigation

### Upcoming Features
- **Marketplace**: Spend coins on fitness-related deals
- **Social Features**: Share progress with friends
- **Achievements**: Unlock badges and rewards
- **Health Kit Integration**: Sync with Apple Health and Google Fit

## 📱 Screenshots

The app includes:
- **Intro Screen**: Welcome screen with feature overview
- **Authentication**: Simple user registration
- **Dashboard**: Main tracking interface with progress circle
- **Marketplace**: Coming soon section
- **Profile**: User settings and statistics

## 🛠 Technology Stack

### Frontend
- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for routing
- **Expo Sensors** for motion detection
- **AsyncStorage** for local data persistence
- **Expo Linear Gradient** for beautiful gradients

### Backend & Services
- **Firebase** (Authentication, Firestore, Storage)
- **Same backend as web app** - shared data

### Development Tools
- **Expo CLI** for development and building
- **Metro** bundler
- **TypeScript** compiler

## 🏗 Project Structure

```
BoltaMobile/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Main app screens
│   │   ├── IntroScreen.tsx
│   │   ├── AuthScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── MarketplaceScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useStepCounter.ts
│   ├── lib/               # Utilities and configurations
│   │   └── firebase.ts
│   └── types/             # TypeScript type definitions
│       └── index.ts
├── assets/                # Images, fonts, and other assets
├── App.tsx               # Main app component
├── app.json             # Expo configuration
└── package.json         # Dependencies and scripts
```

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** (for iOS development)
- **Android Studio** (for Android development)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/narso0/BOLTA.git
cd BOLTA/BoltaMobile
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm start
# or
expo start
```

### 4. Run on Device/Simulator

- **iOS**: Press `i` in terminal or scan QR code with Camera app
- **Android**: Press `a` in terminal or scan QR code with Expo Go app
- **Web**: Press `w` in terminal (for testing only)

## 📱 Running on Physical Device

### iOS
1. Install **Expo Go** from App Store
2. Scan QR code from terminal with Camera app
3. App will open in Expo Go

### Android
1. Install **Expo Go** from Google Play Store
2. Scan QR code from terminal with Expo Go app
3. App will run directly

## 🔧 Development Scripts

```bash
# Start development server
npm start

# Start with cleared cache
npm start -- --clear

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web (for testing)
npm run web

# Build for production
expo build:android
expo build:ios
```

## 🏗 Building for Production

### Android APK
```bash
expo build:android -t apk
```

### iOS App Store
```bash
expo build:ios -t archive
```

### Using EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure build
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## 🔒 Permissions

The app requires the following permissions:

### Android
- `ACTIVITY_RECOGNITION` - For step tracking
- `ACCESS_FINE_LOCATION` - For improved accuracy (optional)
- `ACCESS_COARSE_LOCATION` - For location-based features (optional)

### iOS
- **Motion & Fitness** - For step tracking
- **Location** - For improved accuracy (optional)

## 🎯 Key Features Implementation

### Step Tracking Algorithm
- Uses device accelerometer data
- Implements peak detection for step counting
- Filters out false positives with threshold values
- Calculates distance and calories automatically

### Data Management
- Automatic daily reset at midnight
- Persistent storage with AsyncStorage
- Real-time updates and synchronization
- Error handling and recovery

### User Experience
- Smooth animations and transitions
- Intuitive gesture-based navigation
- Responsive design for all screen sizes
- Accessibility support

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx react-native start --reset-cache
   ```

2. **iOS simulator not working**
   ```bash
   npx react-native run-ios --simulator="iPhone 14"
   ```

3. **Android build issues**
   ```bash
   cd android && ./gradlew clean && cd ..
   npx react-native run-android
   ```

4. **Expo Go connection issues**
   - Ensure device and computer are on same network
   - Try restarting Expo development server
   - Clear Expo Go app cache

### Performance Optimization
- Step detection runs at 10Hz for optimal battery usage
- Automatic cleanup of sensor listeners
- Efficient state management to prevent re-renders
- Lazy loading of non-essential components

## 🔄 Syncing with Web App

The mobile app shares the same Firebase backend as the web app:
- User authentication syncs across platforms
- Step data and coins are synchronized
- Achievements and progress are shared
- Marketplace purchases sync automatically

## 🚧 Development Roadmap

### Phase 1 (Current)
- ✅ Basic step tracking
- ✅ Coin earning system
- ✅ User authentication
- ✅ Daily progress tracking

### Phase 2 (Coming Soon)
- 🔄 Marketplace integration
- 🔄 Social features
- 🔄 Achievement system
- 🔄 Health Kit integration

### Phase 3 (Future)
- 📱 Apple Watch support
- 🔔 Push notifications
- 📊 Advanced analytics
- 🏆 Leaderboards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: support@bolta.app
- **GitHub Issues**: [Create an issue](https://github.com/narso0/BOLTA/issues)
- **Documentation**: [Wiki](https://github.com/narso0/BOLTA/wiki)

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Icons by [Ionicons](https://ionic.io/ionicons)
- Firebase for backend services
- React Native community for excellent libraries

---

**Ready to get moving? Download Bolta Mobile and start earning coins for every step! 🚶‍♂️💰**

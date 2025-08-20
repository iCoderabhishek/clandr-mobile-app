# Clandr

> A modern, cross-platform scheduling application that combines time management, productivity tools, and calendar synchronization in one unified experience.

Clandr is built with React Native and Expo, providing native performance on mobile devices while maintaining web compatibility. The application integrates secure authentication, focus timers, world clock functionality, and seamless Google Calendar synchronization to help users manage their time effectively.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Development Setup](#development-setup)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features

### Core Functionality
- **Secure Authentication** - User management powered by Clerk with multi-factor authentication support
- **Focus Timer** - Pomodoro-style productivity timer with customizable intervals and break notifications
- **World Clock** - Multi-timezone display with automatic daylight saving time adjustments
- **Calendar Synchronization** - Bi-directional sync with Google Calendar, including event creation and updates
- **Cross-Platform Support** - Unified codebase serving both web and native mobile applications

### User Experience
- Responsive design optimized for mobile-first usage
- Offline functionality for core timer and clock features
- Dark mode support with system preference detection
- Accessibility compliance (WCAG 2.1 AA)
- Push notifications for timer alerts and calendar reminders

## Demo

Watch Clandr in action:

[![Clandr Demo Video](https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

**Live Demo**: [https://clandr-web.vercel.app](https://clandr-web.vercel.app)

## Screenshots

<div align="center">
  <img src="./docs/images/home-screen.png" alt="Home Screen" width="200"/>
  <img src="./docs/images/timer-view.png" alt="Focus Timer" width="200"/>
  <img src="./docs/images/calendar-sync.png" alt="Calendar Integration" width="200"/>
  <img src="./docs/images/world-clock.png" alt="World Clock" width="200"/>
</div>

*Screenshots showing Home Dashboard, Focus Timer, Calendar Sync, and World Clock features*

## Tech Stack

### Frontend

* **[React Native](https://reactnative.dev/)** + **[Expo](https://expo.dev/)** – Cross-platform mobile app development
* **[Next.js](https://nextjs.org/)** – Web frontend and API routes (backend)
* **[TypeScript](https://www.typescriptlang.org/)** – Type-safe development
* **[Tailwind CSS](https://tailwindcss.com/)** – Utility-first styling

### Backend & Services

* **[Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)** – Backend services & API layer
* **[Clerk](https://clerk.com/)** – Authentication and user management
* **[Google Calendar API](https://developers.google.com/calendar)** – Calendar sync & integration
* **[Expo Router](https://docs.expo.dev/routing/introduction/)** – File-based navigation for mobile
* **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)** – Offline data persistence


### Development & Deployment
- **[EAS Build](https://docs.expo.dev/build/introduction/)** - Native app compilation service
- **[EAS Submit](https://docs.expo.dev/submit/introduction/)** - App store deployment automation
- **[Expo Dev Tools](https://docs.expo.dev/debugging/devtools/)** - Development and debugging utilities

### Data Storage
- **PostgreSQL** - Primary database for user data and application state

### Backend API Source Code

The backend API powering this project is available here: [clandr-api](https://github.com/iCoderabhishek/clandr-api.git).
It handles authentication, event scheduling, calendar sync, and meeting confirmations.

## Architecture
When user comes to the app, they follow this flow-
<img width="1536" height="1024" alt="Visual diagram" src="https://github.com/user-attachments/assets/b96a4880-cb5d-404a-bdf3-11f2893132d4" />


## Installation
[Download Clandr Native App](https://expo.dev/artifacts/eas/vUy39yCWfoj4YYhEjFUc75.apk)

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/iCoderabhishek/clandr.git
cd clandr

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev

# For mobile development
npx expo start
```

### Download APK

Get the latest Android build:
[Download Clandr APK](https://expo.dev/artifacts/eas/vUy39yCWfoj4YYhEjFUc75.apk)

## Development Setup

### Environment Configuration

Create a `.env.local` file in the project root:

```env
# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Google Calendar API
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/clandr


```

### Available Scripts

```bash
# Development
npm run dev          # Start Next.js development server
npm run expo         # Start Expo development server
npm run ios          # Run iOS simulator
npm run android      # Run Android emulator

# Building
npm run build        # Build web application
npm run build:expo   # Build native applications

# Testing
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run lint         # Check code quality

# Deployment
npm run deploy       # Deploy to production
```

## API Integration

### Google Calendar Setup

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Google Calendar API
3. Create OAuth 2.0 credentials
4. Configure authorized redirect URIs
5. Add credentials to environment variables

### Clerk Authentication Setup

1. Sign up for [Clerk](https://clerk.com/)
2. Create a new application
3. Configure authentication methods
4. Add API keys to environment configuration
5. Set up webhooks for user management

## Contributing

We welcome contributions to Clandr! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing code formatting (Prettier configuration included)
- Write comprehensive tests for new features
- Update documentation for API changes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

### Community

- **Issues**: [GitHub Issues](https://github.com/iCoderabhishek/clandr/issues)
- **Discussions**: [GitHub Discussions](https://github.com/iCoderabhishek/clandr/discussions)
- **Discord**: [Join our community](https://discord.gg/clandr)

### Documentation

- **API Documentation**: [docs/api.md](docs/api.md)
- **Deployment Guide**: [docs/deployment.md](docs/deployment.md)
- **Troubleshooting**: [docs/troubleshooting.md](docs/troubleshooting.md)

### Contact

**Author**: [Abhishek Jha](https://github.com/iCoderabhishek)
**Email**: iamabhishek1310@gmail.com
**Website**: [https://clandr-web.vercel.app](https://clandr-web.vercel.app)

---

<div align="center">
Built with ❤️ by [Abhishek](https://github.com/iCoderabhishek)
  <a href="https://clandr-web.vercel.app">
    <img src="https://img.shields.io/badge/Try%20Clandr-Live%20Demo-blue?style=for-the-badge&logo=calendar&logoColor=white" alt="Try Clandr"/>
  </a>
</div>

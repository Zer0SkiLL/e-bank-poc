# NeoBank - E-Banking React Native MVP

A modern mobile banking application built with React Native and Expo, featuring a complete banking experience with account management, transactions, payments, and settings.

## Features

- **Authentication**: Email/password login with biometric support and PIN entry
- **Dashboard**: Total balance overview, quick actions, account carousel, recent transactions
- **Accounts**: Multiple account types (Checking, Savings, Credit, Investment) with balance history charts
- **Transactions**: Full transaction history with search, filters, and detailed views
- **Payments**: Send money flow with recipient selection, confirmation, and receipt
- **Settings**: Profile management, security settings, theme toggle, notification preferences
- **Dark/Light Theme**: Full theme support across the entire application

## Architecture

- **Framework**: React Native with Expo (Managed Workflow)
- **Language**: TypeScript (Strict Mode)
- **Navigation**: React Navigation (Bottom Tabs + Native Stack)
- **State Management**: React Context + Hooks
- **Storage**: expo-secure-store for secure data
- **Biometrics**: expo-local-authentication

## Project Structure

```
/src
  /assets          - Images and fonts
  /components      - Reusable UI components
    AccountCard, BalanceCard, CustomBarChart,
    EmptyState, FilterChip, LoadingSpinner,
    QuickAction, SearchBar, SectionHeader,
    TransactionItem
  /constants       - Design system tokens
    colors, typography, spacing, shadows
  /context         - React Context providers
    ThemeContext, AuthContext
  /hooks           - Custom hooks
  /navigation      - Navigation configuration
    AppNavigator, AuthStack, MainTabs
  /screens         - Application screens
    /Auth          - LoginScreen, PinEntryScreen
    /Dashboard     - DashboardScreen
    /Accounts      - AccountListScreen, AccountDetailsScreen
    /Transactions  - TransactionListScreen, TransactionDetailScreen
    /Payments      - SendMoneyScreen, PaymentConfirmationScreen,
                    PaymentSuccessScreen, PaymentFailedScreen
    /Settings      - SettingsScreen
  /services        - Mock API services
    authService, accountService, transactionService,
    paymentService, settingsService, mockData
  /types           - TypeScript interfaces
    user, account, transaction, payment, navigation
  /utils           - Helper utilities
    formatters
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- For iOS: Xcode and CocoaPods
- For Android: Android Studio and Android SDK

### Installation

```bash
# Clone the repository
git clone https://github.com/Zer0SkiLL/e-bank-poc.git
cd e-bank-poc

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running

```bash
# Start on iOS
npx expo start --ios

# Start on Android
npx expo start --android

# Start on Web
npx expo start --web
```

### Test Credentials

- **Email**: alex.johnson@email.com
- **Password**: password123
- **PIN**: Any 6-digit number

## Design System

| Token | Light | Dark |
|-------|-------|------|
| Primary | #6C63FF | #8B83FF |
| Background | #F8F9FE | #0F0F23 |
| Surface | #FFFFFF | #1A1A2E |
| Text | #1A1A2E | #F1F1F6 |
| Success | #10B981 | #34D399 |
| Error | #EF4444 | #F87171 |
| Warning | #F59E0B | #FBBF24 |

## Available Scripts

```bash
npx expo start          # Start Expo dev server
npx expo start --ios    # Start on iOS
npx expo start --android # Start on Android
npx expo start --web    # Start on Web
npx tsc --noEmit        # Type check
npx expo export         # Build for production
```

## Dependencies

- **Core**: React Native, Expo SDK 52
- **Navigation**: @react-navigation/native, @react-navigation/bottom-tabs, @react-navigation/native-stack
- **Security**: expo-secure-store, expo-local-authentication
- **UI**: @expo/vector-icons (Feather icons)
- **Utilities**: react-native-safe-area-context, react-native-screens

## License

MIT License

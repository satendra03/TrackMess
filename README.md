# Hostel Mess Tracker

A simple React Native application to track daily mess attendance and calculate monthly expenses.

## Features
- **Track Attendance**: Mark days as Absent, Half (1 meal), or Full (2 meals).
- **Monthly Summary**: View total full days, half days, and total cost.
- **Custom Settings**: Set your mess name and daily full-day cost.
- **Local Storage**: Data is saved on your device using AsyncStorage.

## Installation

1.  **Prerequisites**: Ensure you have Node.js installed.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```

## Running the App

To start the development server:

```bash
npx expo start
```

- Scan the QR code with the **Expo Go** app on your Android/iOS device.
- Or press `a` to run on Android Emulator (if set up).
- Or press `i` to run on iOS Simulator (macOS only).

## Project Structure

- `App.js`: Main entry point and navigation setup.
- `src/screens`: Contains all screen components (`HomeScreen`, `SetupScreen`, `SettingsScreen`).
- `src/components`: Reusable UI components (`CalendarGrid`, `SummaryCard`).
- `src/context`: Global state management (`MessContext`).
- `src/storage`: AsyncStorage helper functions.
- `src/utils`: Helper functions (Date formatting, etc.).

## Technologies Used
- React Native (Expo)
- React Navigation
- AsyncStorage

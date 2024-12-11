# Taskly

## Description
Taskly is a basic React Native app designed to help users learn and explore the fundamentals of React Native development. The app mimics task completion counters, featuring countdowns that track task deadlines, along with push notifications, async storage, haptics, app icon changes, and task history.

## Features
- **Task Completion Tracking**: Mimic task counters with countdowns to completion.
- **Push Notifications**: Get notified when a task is overdue.
- **History View**: Display a history of task completions with formatted date and time.

## Installation
To get started with Taskly, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Miana-Neagos/taskly.git 
   cd taskly

2. **Install dependencies**:
   ```bash
    yarn install

3. **Set up Expo CLI**:
     - **If you don't have Expo CLI installed, you can install it globally**:
   ```bash
    npm install -g expo-cli

4. **Start the development server**:
   ```bash
    npx expo start

5. **Build the app for Android**:
    - **This step generates a QR code that you can scan with your Android device to install the app.**
    ```bash
    eas build --platform android --profile development

## Usage
1. **Running the app:**
    - **Use the provided QR code to install the app on your Android device.**
    - **Open the app and follow the instructions to start the development server and connect your device.**

2. **Testing Haptic Feedback:**
    - **Implemented in the app to provide feedback on task completion.**
    - **Ensure haptic feedback is enabled in your device settings.**

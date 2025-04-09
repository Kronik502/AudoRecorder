# 🎧 Audio Recorder App

This React Native application enables users to record, play, and manage audio recordings on both iOS and Android devices. It offers functionalities such as recording audio, playing back recordings, pausing, resuming, and deleting recordings, all within a user-friendly interface.

## ✨ Features

- ▶️ **Record Audio:** Capture high-quality audio using the device's microphone.
- 🎧 **Playback:** Listen to your recordings directly within the app.
- ⏸️ **Pause & Resume:** Control the recording process with pause and resume capabilities.
- 🗒️ **Manage Recordings:** Search, rename, and delete recordings as needed.
- 📤 **Share Recordings:** Easily share your audio files with others.

## ⚡ Prerequisites

Before running this application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- [Android Studio](https://developer.android.com/studio) and/or [Xcode](https://developer.apple.com/xcode/) for Android and iOS development, respectively.

## 🛠️ Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Kronik502/AudioRecorder.git
   cd audio-recorder-app
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Link Native Modules (if needed):**

   ```bash
   react-native link react-native-audio-record
   ```

## 📡 Permissions

To record audio, the app requires microphone access permissions:

- **iOS:** Add the following to your `Info.plist` file:
  
  ```xml
  <key>NSMicrophoneUsageDescription</key>
  <string>Your microphone permission description</string>
  ```

- **Android:** Ensure the following permissions are present in your `AndroidManifest.xml`:

  ```xml
  <uses-permission android:name="android.permission.RECORD_AUDIO" />
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
  ```

For Android devices running Marshmallow (API level 23) or higher, request permissions at runtime. Consider using the [react-native-permissions](https://github.com/zoontek/react-native-permissions) library.

## 🏃 Running the App

- **iOS:**
  
  ```bash
  npx react-native run-ios
  ```

- **Android:**
  
  ```bash
  npx react-native run-android
  ```

Ensure that you have a simulator or physical device connected.

## 📺 Usage

1. **Recording Audio:**
   - 🔥 Press the **Record** button to start recording.
   - ⏸️ Use the **Pause** button to pause the recording and **Resume** to continue.
   - ⏹️ Press the **Stop** button to end and save the recording.

2. **Playback:**
   - 🎧 Select a recording from the list.
   - ▶️ Use the playback controls to play, pause, or stop the audio.

3. **Managing Recordings:**
   - 🔍 Use the search bar to find recordings by name.
   - ❌ Swipe left on a recording to reveal options to rename or delete.
   - 📤 Press the share icon to share the recording via available options.

## 📚 Dependencies

- [react-native-audio-record](https://github.com/goodatlas/react-native-audio-record): Handles audio recording functionality.
- [react-native-sound](https://github.com/zmxv/react-native-sound): Manages audio playback.
- [react-native-permissions](https://github.com/zoontek/react-native-permissions): Simplifies the process of requesting permissions.

## 👨‍💻 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## ⚖️ License

This project is licensed under the MIT License.

---



For any questions or support, please open an issue in this repository. 📢

Screenshot:
![Recorder](https://github.com/user-attachments/assets/94baefcd-ad58-428a-ac4f-5c5cc0f984d1)

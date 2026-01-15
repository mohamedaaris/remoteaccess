# FlowLink Android Agent

Native Android application for sharing mobile device screen via FlowLink.

## Features

- Screen capture using MediaProjection API
- WebRTC-based streaming
- Touch event simulation
- Permission management
- Foreground service for reliable operation

## Requirements

- Android 7.0 (API 24) or higher
- Android Studio Arctic Fox or later
- Kotlin 1.8+

## Project Structure

```
android-agent/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/flowlink/agent/
│   │   │   │   ├── MainActivity.kt
│   │   │   │   ├── ScreenCaptureService.kt
│   │   │   │   ├── SignalingClient.kt
│   │   │   │   ├── WebRTCManager.kt
│   │   │   │   └── TouchSimulator.kt
│   │   │   ├── res/
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle
│   └── build.gradle
└── settings.gradle
```

## Setup

1. Open project in Android Studio
2. Sync Gradle files
3. Update server URL in `MainActivity.kt`
4. Build and run on device (emulator not recommended for screen capture)

## Permissions

The app requires:
- `FOREGROUND_SERVICE` - For background operation
- `INTERNET` - For WebRTC connection
- `RECORD_AUDIO` - Optional, for audio streaming
- MediaProjection permission (requested at runtime)

## Building

```bash
./gradlew assembleDebug
```

## Security Notes

- Screen capture requires explicit user permission
- Session requests show confirmation dialog
- All WebRTC connections use DTLS-SRTP encryption

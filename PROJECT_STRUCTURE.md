# FlowLink Project Structure

```
flowlink/
├── README.md                          # Project overview
├── LICENSE                            # MIT License
├── QUICKSTART.md                      # Quick start guide
├── CONTRIBUTING.md                    # Contribution guidelines
├── PROJECT_STRUCTURE.md               # This file
├── .gitignore                         # Git ignore rules
├── docker-compose.yml                 # Docker orchestration
│
├── docs/                              # Documentation
│   ├── ARCHITECTURE.md                # System architecture
│   ├── SETUP.md                       # Setup instructions
│   ├── API.md                         # Protocol API reference
│   ├── SECURITY.md                    # Security documentation
│   └── FEATURES.md                    # Feature list
│
├── shared/                            # Shared protocol definitions
│   ├── package.json                   # Package configuration
│   ├── tsconfig.json                  # TypeScript config
│   └── protocol.ts                    # Protocol types and enums
│
├── signaling-server/                  # Central coordination server
│   ├── package.json                   # Dependencies
│   ├── tsconfig.json                  # TypeScript config
│   ├── Dockerfile                     # Docker image
│   ├── .env.example                   # Environment template
│   ├── README.md                      # Server documentation
│   └── src/
│       ├── server.ts                  # Main server entry
│       └── services/
│           └── SignalingService.ts    # WebSocket signaling logic
│
├── desktop-agent/                     # Electron desktop application
│   ├── package.json                   # Dependencies
│   ├── tsconfig.json                  # TypeScript config
│   ├── README.md                      # Agent documentation
│   ├── src/
│   │   ├── main.ts                    # Electron main process
│   │   ├── SignalingClient.ts         # WebSocket client
│   │   └── ControlHandler.ts          # Mouse/keyboard control
│   └── ui/
│       └── index.html                 # Agent UI
│
├── web-viewer/                        # React web application
│   ├── package.json                   # Dependencies
│   ├── tsconfig.json                  # TypeScript config
│   ├── tsconfig.node.json             # Node TypeScript config
│   ├── vite.config.ts                 # Vite configuration
│   ├── Dockerfile                     # Docker image
│   ├── nginx.conf                     # Nginx configuration
│   ├── README.md                      # Viewer documentation
│   ├── index.html                     # HTML entry point
│   └── src/
│       ├── main.tsx                   # React entry point
│       ├── App.tsx                    # Main app component
│       ├── App.css                    # App styles
│       ├── index.css                  # Global styles
│       ├── types.ts                   # TypeScript types
│       ├── services/
│       │   └── SignalingClient.ts     # WebSocket client
│       └── components/
│           ├── DeviceList.tsx         # Device list component
│           ├── DeviceList.css         # Device list styles
│           ├── RemoteViewer.tsx       # Remote viewer component
│           └── RemoteViewer.css       # Remote viewer styles
│
└── android-agent/                     # Android native application
    ├── settings.gradle                # Gradle settings
    ├── build.gradle                   # Root build config
    ├── README.md                      # Android documentation
    └── app/
        ├── build.gradle               # App build config
        ├── src/
        │   └── main/
        │       ├── AndroidManifest.xml           # App manifest
        │       ├── java/com/flowlink/agent/
        │       │   ├── MainActivity.kt           # Main activity
        │       │   ├── SignalingClient.kt        # WebSocket client
        │       │   ├── ScreenCaptureService.kt   # Capture service
        │       │   └── WebRTCManager.kt          # WebRTC manager
        │       └── res/
        │           ├── layout/
        │           │   └── activity_main.xml     # Main layout
        │           └── values/
        │               └── strings.xml           # String resources
```

## Component Descriptions

### Root Level

- **README.md**: Project overview, features, and links
- **LICENSE**: MIT License for open source distribution
- **QUICKSTART.md**: 5-minute setup guide
- **CONTRIBUTING.md**: Guidelines for contributors
- **.gitignore**: Files to exclude from version control
- **docker-compose.yml**: Multi-container Docker setup

### Documentation (`docs/`)

Comprehensive documentation covering:
- System architecture and design decisions
- Setup and deployment instructions
- Protocol API reference
- Security model and best practices
- Feature list and roadmap

### Shared Protocol (`shared/`)

Common TypeScript definitions used across all components:
- Message types and enums
- Device and session interfaces
- Protocol message structures
- Ensures consistency across platforms

### Signaling Server (`signaling-server/`)

Node.js/Express WebSocket server:
- **server.ts**: Express app and WebSocket setup
- **SignalingService.ts**: Core signaling logic
  - Device registration
  - Session management
  - WebRTC signaling relay
  - Connection state tracking

### Desktop Agent (`desktop-agent/`)

Electron application for desktop sharing:
- **main.ts**: Electron main process
  - Window management
  - IPC handlers
  - Screen capture setup
  - WebRTC peer connection
- **SignalingClient.ts**: WebSocket communication
- **ControlHandler.ts**: robotjs integration for control
- **ui/index.html**: Simple UI for connection management

### Web Viewer (`web-viewer/`)

React-based web application:
- **App.tsx**: Main application logic
  - Device discovery
  - Session management
  - WebRTC connection setup
- **DeviceList.tsx**: Shows available devices
- **RemoteViewer.tsx**: Displays remote stream and handles control
- **SignalingClient.ts**: WebSocket client for browser

### Android Agent (`android-agent/`)

Native Android application:
- **MainActivity.kt**: Main UI and lifecycle
- **SignalingClient.kt**: WebSocket communication
- **ScreenCaptureService.kt**: Foreground service for capture
- **WebRTCManager.kt**: WebRTC peer connection management
- Uses MediaProjection API for screen capture

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express
- **WebSocket**: ws library
- **Language**: TypeScript

### Desktop
- **Framework**: Electron
- **Control**: robotjs
- **Language**: TypeScript

### Web
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Server**: Nginx (production)

### Mobile
- **Platform**: Android
- **Language**: Kotlin
- **WebRTC**: google-webrtc library
- **HTTP**: OkHttp

### Common
- **Protocol**: WebRTC
- **Signaling**: WebSocket
- **Video**: VP8/VP9/H.264
- **Encryption**: DTLS-SRTP

## Data Flow

### Registration Flow
```
Device → SignalingServer: REGISTER_DEVICE
SignalingServer → Device: DEVICE_REGISTERED
SignalingServer → All: DEVICE_LIST
```

### Connection Flow
```
Viewer → SignalingServer: REQUEST_SESSION
SignalingServer → Agent: SESSION_REQUEST
Agent → User: Permission Dialog
Agent → SignalingServer: ACCEPT_SESSION
SignalingServer → Both: SESSION_STARTED
Agent ↔ Viewer: WebRTC Negotiation
Agent ↔ Viewer: P2P Stream + Control
```

## Build Outputs

### Development
- Signaling Server: `dist/` (compiled JS)
- Desktop Agent: `dist/` (compiled JS)
- Web Viewer: Dev server (no build)
- Android: Debug APK

### Production
- Signaling Server: Docker image or `dist/`
- Desktop Agent: Platform installers (`.exe`, `.dmg`, `.AppImage`)
- Web Viewer: Static files in `dist/`
- Android: Release APK or AAB

## Configuration Files

### TypeScript
- `tsconfig.json`: TypeScript compiler options
- Strict mode enabled
- ES2020 target
- CommonJS modules (Node) or ESNext (Web)

### Build Tools
- `package.json`: Dependencies and scripts
- `vite.config.ts`: Vite configuration
- `build.gradle`: Android build configuration
- `Dockerfile`: Container image definitions

### Environment
- `.env`: Environment variables (not in git)
- `.env.example`: Template for environment variables

## Key Dependencies

### Signaling Server
- express: Web framework
- ws: WebSocket server
- uuid: Unique ID generation
- cors: Cross-origin support

### Desktop Agent
- electron: Desktop framework
- robotjs: Mouse/keyboard control
- ws: WebSocket client

### Web Viewer
- react: UI framework
- react-dom: React DOM rendering
- vite: Build tool

### Android Agent
- webrtc: WebRTC implementation
- okhttp: HTTP/WebSocket client
- gson: JSON parsing

## Development Workflow

1. **Start Signaling Server**: `cd signaling-server && npm run dev`
2. **Start Desktop Agent**: `cd desktop-agent && npm run dev`
3. **Start Web Viewer**: `cd web-viewer && npm run dev`
4. **Build Android**: Open in Android Studio

## Deployment Workflow

1. **Build All Components**: `npm run build` in each directory
2. **Create Docker Images**: `docker-compose build`
3. **Deploy Containers**: `docker-compose up -d`
4. **Package Desktop**: `npm run package` in desktop-agent
5. **Build Android Release**: `./gradlew assembleRelease`

## Testing Strategy

### Unit Tests (Planned)
- Protocol message validation
- Signaling logic
- Control event handling

### Integration Tests (Planned)
- WebSocket communication
- WebRTC connection establishment
- End-to-end session flow

### Manual Testing
- Cross-platform compatibility
- Network conditions
- Permission flows
- Error scenarios

## Maintenance

### Regular Updates
- Dependency updates
- Security patches
- Bug fixes
- Performance improvements

### Monitoring
- Server health checks
- Connection metrics
- Error logging
- Performance profiling

## Future Structure

Planned additions:
- `tests/`: Test suites
- `scripts/`: Build and deployment scripts
- `ios-agent/`: iOS native app
- `cli/`: Command-line interface
- `plugins/`: Plugin system

# FlowLink Architecture

## Overview

FlowLink is a distributed remote device access system built on WebRTC for peer-to-peer communication with a central signaling server for coordination.

## System Components

### 1. Signaling Server
- **Technology**: Node.js, Express, WebSocket
- **Purpose**: Coordinate WebRTC connections between devices
- **Responsibilities**:
  - Device registration and discovery
  - Session management
  - WebRTC signaling (SDP exchange, ICE candidates)
  - Connection state tracking

### 2. Desktop Agent
- **Technology**: Electron, Node.js, robotjs
- **Platforms**: Windows, macOS, Linux
- **Purpose**: Share desktop screen and accept remote control
- **Responsibilities**:
  - Screen capture via Electron desktopCapturer
  - WebRTC peer connection management
  - Mouse/keyboard event simulation
  - Permission dialogs for session requests

### 3. Web Viewer
- **Technology**: React, TypeScript, Vite
- **Purpose**: Browser-based remote viewing and control
- **Responsibilities**:
  - Display remote screen stream
  - Capture and send control events
  - Session management UI
  - Device discovery and connection

### 4. Android Agent
- **Technology**: Kotlin, Android SDK, WebRTC
- **Purpose**: Share mobile device screen
- **Responsibilities**:
  - Screen capture via MediaProjection API
  - WebRTC streaming
  - Foreground service for reliability
  - Permission management

## Communication Flow

### Device Registration
```
Device → Signaling Server: REGISTER_DEVICE
Signaling Server → Device: DEVICE_REGISTERED (deviceId)
Signaling Server → All Devices: DEVICE_LIST (updated)
```

### Session Establishment
```
Client → Signaling Server: REQUEST_SESSION (targetDeviceId)
Signaling Server → Host: SESSION_REQUEST (sessionId, fromDevice)
Host → User: Permission Dialog
Host → Signaling Server: ACCEPT_SESSION (sessionId)
Signaling Server → Client: SESSION_STARTED (sessionId)
Signaling Server → Host: SESSION_STARTED (sessionId)
```

### WebRTC Connection
```
Host → Signaling Server: OFFER (SDP)
Signaling Server → Client: OFFER (SDP)
Client → Signaling Server: ANSWER (SDP)
Signaling Server → Host: ANSWER (SDP)
Both Peers ↔ Signaling Server: ICE_CANDIDATE (multiple)
Host ↔ Client: Direct P2P Connection Established
```

### Control Events
```
Client → Host: Control Events via DataChannel
  - MOUSE_MOVE
  - MOUSE_CLICK
  - MOUSE_SCROLL
  - KEY_EVENT
  - TOUCH_EVENT
```

## Security Model

### Connection Security
- All WebRTC connections use DTLS-SRTP encryption
- Peer-to-peer connections minimize server exposure
- STUN/TURN servers for NAT traversal

### Permission Model
- Explicit user permission required for all sessions
- Permission dialog shows requesting device information
- Sessions can be rejected or ended at any time
- Optional password protection for sessions

### Data Protection
- No screen data passes through signaling server
- Direct peer-to-peer streaming
- Session tokens with expiration
- Device authentication via WebSocket connection

## Scalability Considerations

### Signaling Server
- Stateless design allows horizontal scaling
- WebSocket connections managed per instance
- Redis can be added for session state sharing
- Load balancer for multiple instances

### Bandwidth
- WebRTC adaptive bitrate based on network conditions
- Configurable video quality settings
- Efficient VP8/VP9/H.264 codecs

### Performance
- Hardware-accelerated video encoding/decoding
- Minimal latency with UDP-based RTP
- Efficient control event batching

## Technology Choices

### Why WebRTC?
- Low latency peer-to-peer streaming
- Built-in NAT traversal
- Adaptive bitrate and quality
- Wide browser and platform support
- Encrypted by default

### Why Electron for Desktop?
- Cross-platform (Windows, macOS, Linux)
- Access to native screen capture APIs
- Easy distribution and updates
- Familiar web technologies

### Why Native Android?
- MediaProjection API requires native code
- Better performance for video encoding
- Foreground service for reliability
- Full access to Android APIs

## Deployment Architecture

```
┌─────────────────┐
│  Load Balancer  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│Server│  │Server│  (Signaling Servers)
└───┬──┘  └──┬───┘
    │        │
    └────┬───┘
         │
    ┌────┴────────────────┐
    │                     │
┌───▼────┐          ┌────▼───┐
│Desktop │◄────────►│ Web    │  (P2P Connection)
│Agent   │          │Viewer  │
└────────┘          └────────┘
```

## Future Enhancements

1. **File Transfer**: Add file sharing via DataChannel
2. **Audio Streaming**: Include system audio in stream
3. **Multi-Monitor**: Support for multiple displays
4. **Recording**: Session recording capability
5. **Clipboard Sync**: Bidirectional clipboard sharing
6. **iOS Support**: Native iOS agent app
7. **Authentication**: User accounts and device management
8. **Analytics**: Connection quality metrics and monitoring

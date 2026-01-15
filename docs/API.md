# FlowLink Protocol API

## WebSocket Protocol

All communication between clients and the signaling server uses WebSocket with JSON messages.

## Connection

```javascript
const ws = new WebSocket('ws://localhost:8080');
```

## Message Format

All messages follow this structure:

```typescript
{
  type: string,        // Message type
  timestamp: number,   // Unix timestamp in milliseconds
  ...                  // Additional fields based on type
}
```

## Message Types

### Device Registration

#### REGISTER_DEVICE (Client → Server)

Register a new device with the signaling server.

```json
{
  "type": "register_device",
  "timestamp": 1234567890,
  "device": {
    "name": "My Desktop",
    "type": "desktop",
    "platform": "Windows 11"
  }
}
```

**Fields**:
- `device.name`: Human-readable device name
- `device.type`: Either "desktop" or "mobile"
- `device.platform`: OS/platform information

#### DEVICE_REGISTERED (Server → Client)

Confirmation of successful registration.

```json
{
  "type": "device_registered",
  "timestamp": 1234567890,
  "deviceId": "uuid-here"
}
```

**Fields**:
- `deviceId`: Unique identifier for this device

#### DEVICE_LIST (Server → Client)

List of all registered devices (broadcast to all clients).

```json
{
  "type": "device_list",
  "timestamp": 1234567890,
  "devices": [
    {
      "id": "uuid-1",
      "name": "Desktop PC",
      "type": "desktop",
      "platform": "Windows 11",
      "online": true,
      "lastSeen": 1234567890
    }
  ]
}
```

### Session Management

#### REQUEST_SESSION (Client → Server)

Request remote access to another device.

```json
{
  "type": "request_session",
  "timestamp": 1234567890,
  "targetDeviceId": "uuid-of-target",
  "password": "optional-password"
}
```

**Fields**:
- `targetDeviceId`: ID of device to connect to
- `password`: Optional password for authentication

#### SESSION_REQUEST (Server → Host)

Notification of incoming session request.

```json
{
  "type": "session_request",
  "timestamp": 1234567890,
  "sessionId": "session-uuid",
  "fromDevice": {
    "id": "uuid",
    "name": "Web Viewer",
    "type": "desktop",
    "platform": "web",
    "online": true,
    "lastSeen": 1234567890
  }
}
```

**Fields**:
- `sessionId`: Unique session identifier
- `fromDevice`: Information about requesting device

#### ACCEPT_SESSION (Host → Server)

Accept an incoming session request.

```json
{
  "type": "accept_session",
  "timestamp": 1234567890,
  "sessionId": "session-uuid"
}
```

#### REJECT_SESSION (Host → Server)

Reject an incoming session request.

```json
{
  "type": "reject_session",
  "timestamp": 1234567890,
  "sessionId": "session-uuid",
  "reason": "User declined"
}
```

**Fields**:
- `reason`: Optional reason for rejection

#### SESSION_STARTED (Server → Both Peers)

Notification that session has been established.

```json
{
  "type": "session_started",
  "timestamp": 1234567890,
  "sessionId": "session-uuid"
}
```

#### END_SESSION (Either Peer → Server)

Terminate an active session.

```json
{
  "type": "end_session",
  "timestamp": 1234567890,
  "sessionId": "session-uuid"
}
```

### WebRTC Signaling

#### OFFER (Host → Server → Client)

WebRTC offer with SDP.

```json
{
  "type": "offer",
  "timestamp": 1234567890,
  "sessionId": "session-uuid",
  "sdp": "v=0\r\no=- ..."
}
```

**Fields**:
- `sdp`: SDP offer string

#### ANSWER (Client → Server → Host)

WebRTC answer with SDP.

```json
{
  "type": "answer",
  "timestamp": 1234567890,
  "sessionId": "session-uuid",
  "sdp": "v=0\r\no=- ..."
}
```

**Fields**:
- `sdp`: SDP answer string

#### ICE_CANDIDATE (Either Peer → Server → Other Peer)

ICE candidate for NAT traversal.

```json
{
  "type": "ice_candidate",
  "timestamp": 1234567890,
  "sessionId": "session-uuid",
  "candidate": {
    "candidate": "candidate:...",
    "sdpMLineIndex": 0,
    "sdpMid": "0"
  }
}
```

**Fields**:
- `candidate`: ICE candidate object

### Control Events

Control events are sent over WebRTC DataChannel, not WebSocket.

#### MOUSE_MOVE

```json
{
  "type": "mouse_move",
  "timestamp": 1234567890,
  "x": 100,
  "y": 200
}
```

#### MOUSE_CLICK

```json
{
  "type": "mouse_click",
  "timestamp": 1234567890,
  "button": "left",
  "action": "click",
  "x": 100,
  "y": 200
}
```

**Fields**:
- `button`: "left", "right", or "middle"
- `action`: "down", "up", "click", or "dblclick"

#### MOUSE_SCROLL

```json
{
  "type": "mouse_scroll",
  "timestamp": 1234567890,
  "deltaX": 0,
  "deltaY": -120
}
```

#### KEY_EVENT

```json
{
  "type": "key_event",
  "timestamp": 1234567890,
  "action": "press",
  "key": "a",
  "code": "KeyA",
  "modifiers": {
    "ctrl": false,
    "alt": false,
    "shift": false,
    "meta": false
  }
}
```

**Fields**:
- `action`: "down", "up", or "press"
- `key`: Key value (e.g., "a", "Enter")
- `code`: Key code (e.g., "KeyA", "Enter")
- `modifiers`: State of modifier keys

#### TOUCH_EVENT (Mobile)

```json
{
  "type": "touch_event",
  "timestamp": 1234567890,
  "action": "move",
  "touches": [
    {
      "id": 0,
      "x": 100,
      "y": 200
    }
  ]
}
```

**Fields**:
- `action`: "start", "move", "end", or "cancel"
- `touches`: Array of touch points

### Status Messages

#### ERROR (Server → Client)

Error notification.

```json
{
  "type": "error",
  "timestamp": 1234567890,
  "code": "DEVICE_NOT_FOUND",
  "message": "Target device not found or offline"
}
```

**Error Codes**:
- `PARSE_ERROR`: Invalid message format
- `NOT_REGISTERED`: Device not registered
- `DEVICE_NOT_FOUND`: Target device unavailable
- `SESSION_NOT_FOUND`: Invalid session ID
- `UNAUTHORIZED`: Not authorized for action

#### PING/PONG

Keepalive messages.

```json
{
  "type": "ping",
  "timestamp": 1234567890
}
```

```json
{
  "type": "pong",
  "timestamp": 1234567890
}
```

## HTTP Endpoints

### GET /health

Health check endpoint.

**Response**:
```json
{
  "status": "ok",
  "timestamp": 1234567890
}
```

## WebRTC Configuration

### ICE Servers

Default configuration:

```javascript
{
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
}
```

### Media Constraints

Desktop screen capture:

```javascript
{
  audio: false,
  video: {
    mandatory: {
      chromeMediaSource: 'desktop',
      minWidth: 1280,
      maxWidth: 1920,
      minHeight: 720,
      maxHeight: 1080
    }
  }
}
```

## Rate Limits

Currently no rate limits implemented. Consider adding:
- Max connections per IP
- Max messages per second
- Max session requests per device

## Versioning

Protocol version: 1.0

Future versions will include version field in messages for compatibility.

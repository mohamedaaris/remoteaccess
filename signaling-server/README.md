# FlowLink Signaling Server

Central coordination server for FlowLink remote access system.

## Features

- WebSocket-based signaling
- Device registration and discovery
- Session management
- WebRTC SDP/ICE exchange
- Automatic reconnection handling
- Health check endpoint

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```env
PORT=8080
NODE_ENV=development
CORS_ORIGIN=*
SESSION_TIMEOUT=3600000
PING_INTERVAL=30000
```

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm start
```

## API Endpoints

### HTTP

- `GET /health` - Health check endpoint

### WebSocket

Connect to `ws://localhost:8080` and send JSON messages according to the protocol defined in `shared/protocol.ts`.

## Message Types

See `shared/protocol.ts` for complete protocol specification.

### Client → Server

- `register_device` - Register a new device
- `request_session` - Request remote access to a device
- `accept_session` - Accept incoming session request
- `reject_session` - Reject incoming session request
- `end_session` - End active session
- `offer` - WebRTC offer
- `answer` - WebRTC answer
- `ice_candidate` - ICE candidate

### Server → Client

- `device_registered` - Device registration confirmation
- `device_list` - List of available devices
- `session_request` - Incoming session request
- `session_started` - Session established
- `error` - Error message
- `ping` - Keepalive ping

## Monitoring

The server logs all connections, registrations, and session events to console.

For production monitoring, integrate with:
- Winston for structured logging
- Prometheus for metrics
- Sentry for error tracking

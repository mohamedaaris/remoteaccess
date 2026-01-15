# FlowLink Quick Start Guide

Get FlowLink up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Git installed
- Two devices on the same network (for testing)

## Step 1: Clone and Setup (2 minutes)

```bash
# Clone the repository
git clone <repository-url>
cd flowlink

# Install signaling server
cd signaling-server
npm install
cp .env.example .env
```

## Step 2: Start Signaling Server (30 seconds)

```bash
# In signaling-server directory
npm run dev
```

You should see: `FlowLink Signaling Server running on port 8080`

## Step 3: Start Desktop Agent (1 minute)

Open a new terminal:

```bash
cd desktop-agent
npm install
npm run dev
```

The FlowLink Agent window will open. Click "Connect" to connect to the signaling server.

## Step 4: Start Web Viewer (1 minute)

Open another terminal:

```bash
cd web-viewer
npm install
npm run dev
```

Open your browser to `http://localhost:3000`

## Step 5: Connect! (30 seconds)

1. In the web viewer, you should see your desktop agent in the device list
2. Click "Connect" next to the device
3. On the desktop agent, click "Accept" in the permission dialog
4. You're now viewing and controlling your desktop remotely!

## Testing

- Move your mouse in the web viewer - it should control the remote desktop
- Type on your keyboard - it should type on the remote desktop
- Click the fullscreen button for immersive mode
- Click the X button to disconnect

## Troubleshooting

### "No devices available"
- Make sure the desktop agent is connected
- Check that both are using the same signaling server
- Refresh the web viewer

### "Connection failed"
- Check firewall settings
- Verify signaling server is running
- Check browser console for errors

### "Permission denied"
- Grant screen recording permission (macOS)
- Grant accessibility permission (macOS)
- Run as administrator (Windows)

## Next Steps

### For Development
- Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design
- Check [docs/API.md](docs/API.md) for protocol details
- See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines

### For Production
- Follow [docs/SETUP.md](docs/SETUP.md) for production deployment
- Review [docs/SECURITY.md](docs/SECURITY.md) for security best practices
- Use Docker: `docker-compose up`

### For Android
- Open `android-agent` in Android Studio
- Update server URL in `MainActivity.kt`
- Build and install on Android device
- Grant screen capture permission

## Common Commands

```bash
# Start signaling server
cd signaling-server && npm run dev

# Start desktop agent
cd desktop-agent && npm run dev

# Start web viewer
cd web-viewer && npm run dev

# Build for production
npm run build

# Run with Docker
docker-compose up
```

## Architecture Overview

```
┌─────────────┐
│  Signaling  │  ← Coordinates connections
│   Server    │
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
┌──▼──┐ ┌─▼───┐
│Agent│◄┤Viewer│  ← Direct P2P connection
└─────┘ └─────┘
```

## Key Concepts

- **Signaling Server**: Coordinates WebRTC connections
- **Desktop Agent**: Shares screen and accepts control
- **Web Viewer**: Views and controls remote devices
- **WebRTC**: Enables low-latency peer-to-peer streaming
- **Permissions**: Explicit approval required for all sessions

## Support

- Documentation: `docs/` directory
- Issues: GitHub Issues
- Discussions: GitHub Discussions

## What's Next?

1. **Try on different networks**: Test with TURN server
2. **Add Android**: Build the Android agent
3. **Customize**: Modify UI and features
4. **Deploy**: Set up production environment
5. **Contribute**: Add features and improvements

## Tips

- Use Chrome/Edge for best WebRTC performance
- Keep devices on same network for testing
- Check browser console for debugging
- Monitor signaling server logs
- Test with different screen resolutions

## Success!

You now have a working remote desktop system! Explore the codebase, customize it, and make it your own.

For detailed documentation, see:
- [Architecture](docs/ARCHITECTURE.md)
- [Setup Guide](docs/SETUP.md)
- [API Reference](docs/API.md)
- [Security](docs/SECURITY.md)
- [Features](docs/FEATURES.md)

Happy coding! 🚀

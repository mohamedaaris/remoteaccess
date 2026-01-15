# FlowLink Desktop Agent

Electron-based desktop application for sharing screen and accepting remote control.

## Features

- Cross-platform (Windows, macOS, Linux)
- Screen capture and streaming
- Remote mouse and keyboard control
- Permission-based access control
- System tray integration
- Auto-reconnection

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Building

```bash
npm run build
npm run package
```

Installers will be created in `release/` directory.

## Configuration

Update server URL in the UI or modify default in `ui/index.html`.

## Permissions

### macOS
- Screen Recording: System Preferences → Security & Privacy → Screen Recording
- Accessibility: System Preferences → Security & Privacy → Accessibility

### Windows
- Run as Administrator for full control capabilities
- Allow through Windows Firewall when prompted

### Linux
- Install dependencies: `sudo apt-get install libx11-dev libxtst-dev libpng-dev`
- May need to run with sudo for input simulation

## Usage

1. Launch the application
2. Enter signaling server URL (default: ws://localhost:8080)
3. Click "Connect"
4. Your device will appear in other clients' device lists
5. Accept or reject incoming connection requests
6. Active sessions show in the UI

## Troubleshooting

**Screen capture not working**:
- Check screen recording permissions
- Restart application after granting permissions

**Mouse/keyboard control not working**:
- Check accessibility permissions
- Verify robotjs is properly installed
- Try running with elevated privileges

**Connection issues**:
- Verify signaling server is accessible
- Check firewall settings
- Review console logs in DevTools (View → Toggle Developer Tools)

## Security

- All connections require explicit user approval
- WebRTC connections are encrypted with DTLS-SRTP
- No data passes through the signaling server
- Sessions can be ended at any time

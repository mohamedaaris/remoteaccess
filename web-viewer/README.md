# FlowLink Web Viewer

Browser-based remote desktop viewer and controller.

## Features

- View remote desktop/mobile screens
- Full mouse and keyboard control
- Fullscreen mode
- Responsive design
- No installation required

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Access at `http://localhost:3000`

## Building

```bash
npm run build
```

Output in `dist/` directory ready for deployment.

## Configuration

Update signaling server URL in `src/App.tsx`:

```typescript
const [signalingClient] = useState(() => new SignalingClient('ws://your-server:8080'));
```

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+

WebRTC support required.

## Usage

1. Open in browser
2. Automatically connects to signaling server
3. Available devices appear in the list
4. Click "Connect" on any device
5. Wait for host to accept
6. Control remote device with mouse/keyboard

## Controls

- **Mouse**: Click and drag to control remote cursor
- **Keyboard**: Type to send keystrokes
- **Scroll**: Mouse wheel to scroll
- **Fullscreen**: Click fullscreen button in toolbar
- **Disconnect**: Click X button to end session

## Deployment

### Static Hosting

Deploy `dist/` folder to any static host:

```bash
npm run build
# Upload dist/ to hosting provider
```

### Docker

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

## Troubleshooting

**Can't see devices**:
- Check signaling server connection
- Verify devices are online
- Check browser console for errors

**No video stream**:
- Verify WebRTC support in browser
- Check network connectivity
- Review browser permissions

**Control not working**:
- Ensure session is active
- Check data channel connection
- Verify host has granted control permissions

## Security

- Always use HTTPS in production
- WebRTC connections are encrypted
- No credentials stored in browser
- Sessions require host approval

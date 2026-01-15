# FlowLink Setup Guide

## Prerequisites

- Node.js 18+ and npm
- For Desktop Agent: Electron build tools
- For Android Agent: Android Studio, JDK 17
- Git

## Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd flowlink
```

### 2. Setup Signaling Server

```bash
cd signaling-server
npm install
cp .env.example .env
# Edit .env if needed
npm run build
npm start
```

The server will start on `http://localhost:8080`

### 3. Setup Desktop Agent

```bash
cd desktop-agent
npm install
npm run build
npm start
```

**Note**: On first run, you may need to grant accessibility permissions for robotjs to control mouse/keyboard.

#### Platform-Specific Notes

**macOS**:
- Grant Screen Recording permission in System Preferences → Security & Privacy
- Grant Accessibility permission for keyboard/mouse control

**Windows**:
- Run as Administrator for full control capabilities
- Windows Defender may prompt for network access

**Linux**:
- Install X11 development libraries: `sudo apt-get install libx11-dev libxtst-dev libpng-dev`

### 4. Setup Web Viewer

```bash
cd web-viewer
npm install
npm run dev
```

Access at `http://localhost:3000`

**Configuration**: Update server URL in `src/App.tsx` if not using localhost.

### 5. Setup Android Agent

1. Open `android-agent` in Android Studio
2. Update server URL in `MainActivity.kt`:
   ```kotlin
   private val serverUrl = "ws://YOUR_SERVER_IP:8080"
   ```
3. Build and run on device (not emulator)
4. Grant required permissions when prompted

## Production Deployment

### Signaling Server

#### Using Docker

```bash
cd signaling-server
docker build -t flowlink-server .
docker run -p 8080:8080 -e NODE_ENV=production flowlink-server
```

#### Using PM2

```bash
npm install -g pm2
cd signaling-server
npm run build
pm2 start dist/server.js --name flowlink-server
pm2 save
pm2 startup
```

#### Environment Variables

```env
PORT=8080
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com
SESSION_TIMEOUT=3600000
PING_INTERVAL=30000
```

### Web Viewer

Build for production:

```bash
cd web-viewer
npm run build
```

Deploy `dist/` folder to:
- Static hosting (Netlify, Vercel, GitHub Pages)
- CDN (CloudFront, Cloudflare)
- Web server (Nginx, Apache)

**Nginx Configuration**:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/flowlink/web-viewer/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Desktop Agent

Package for distribution:

```bash
cd desktop-agent
npm run package
```

Installers will be in `release/` directory:
- Windows: `.exe` installer
- macOS: `.dmg` installer
- Linux: `.AppImage`

### Android Agent

Build release APK:

```bash
cd android-agent
./gradlew assembleRelease
```

APK location: `app/build/outputs/apk/release/app-release.apk`

For Play Store:
1. Generate signing key
2. Configure `app/build.gradle` with signing config
3. Build AAB: `./gradlew bundleRelease`

## Network Configuration

### Firewall Rules

**Signaling Server**:
- Allow TCP port 8080 (or your configured port)
- Allow WebSocket connections

**STUN/TURN Servers**:
- Default: Google's public STUN servers
- For production, consider running your own TURN server

### TURN Server Setup (Optional)

For networks with strict NAT/firewall:

```bash
# Install coturn
sudo apt-get install coturn

# Configure /etc/turnserver.conf
listening-port=3478
external-ip=YOUR_PUBLIC_IP
realm=flowlink
user=username:password
```

Update WebRTC configuration in all agents:

```javascript
iceServers: [
  { urls: 'stun:stun.l.google.com:19302' },
  {
    urls: 'turn:your-turn-server.com:3478',
    username: 'username',
    credential: 'password'
  }
]
```

## SSL/TLS Configuration

For production, use HTTPS/WSS:

### Signaling Server with SSL

```javascript
// server.ts
import https from 'https';
import fs from 'fs';

const server = https.createServer({
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('key.pem')
}, app);
```

Update client URLs to `wss://your-domain.com`

### Let's Encrypt

```bash
sudo apt-get install certbot
sudo certbot certonly --standalone -d your-domain.com
```

## Troubleshooting

### Connection Issues

1. **Can't connect to signaling server**:
   - Check firewall rules
   - Verify server is running: `curl http://localhost:8080/health`
   - Check CORS settings

2. **WebRTC connection fails**:
   - Verify STUN/TURN server accessibility
   - Check NAT type (symmetric NAT may need TURN)
   - Review browser console for ICE errors

3. **No video stream**:
   - Verify screen capture permissions
   - Check browser WebRTC support
   - Review codec compatibility

### Performance Issues

1. **High latency**:
   - Check network bandwidth
   - Reduce video quality settings
   - Use TURN server if on different networks

2. **High CPU usage**:
   - Enable hardware acceleration
   - Reduce frame rate
   - Lower resolution

### Permission Issues

1. **Desktop Agent can't control mouse/keyboard**:
   - Grant accessibility permissions
   - Run with appropriate privileges
   - Check robotjs installation

2. **Android screen capture fails**:
   - Verify MediaProjection permission granted
   - Check Android version (requires 7.0+)
   - Ensure not running on emulator

## Development Tips

### Hot Reload

**Signaling Server**:
```bash
npm run watch
```

**Web Viewer**:
```bash
npm run dev  # Vite hot reload enabled
```

**Desktop Agent**:
```bash
npm run dev  # Rebuilds and restarts
```

### Debugging

**Enable verbose logging**:

```javascript
// Add to any component
console.log('Debug info:', data);
```

**WebRTC debugging**:
- Chrome: `chrome://webrtc-internals`
- Firefox: `about:webrtc`

### Testing

Run on local network:
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update server URL to `ws://YOUR_LOCAL_IP:8080`
3. Connect devices to same network
4. Test connection

## Support

For issues and questions:
- Check documentation in `docs/`
- Review GitHub issues
- Check WebRTC compatibility: https://caniuse.com/rtcpeerconnection

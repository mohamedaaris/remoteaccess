# Start All Services - Quick Guide

## 🚀 Quick Start (3 Terminals)

### Terminal 1: Signaling Server
```cmd
cd signaling-server
npm start
```
**Wait for:** `Signaling server running on port 8080`

### Terminal 2: Web Viewer
```cmd
cd web-viewer
npm run dev
```
**Wait for:** `Local: http://localhost:5173`

### Terminal 3: Desktop Agent
```cmd
cd desktop-agent
npm start
```
**Wait for:** FlowLink Agent window opens

## ✅ Testing Steps

1. **Desktop Agent Window:**
   - Server URL: `ws://localhost:8080`
   - Click "Connect"
   - Should show: "Connected (ID: xxxxxxxx...)"

2. **Web Viewer (Browser):**
   - Open: http://localhost:5173
   - Should auto-connect
   - Should show: "● Connected"
   - Should see desktop agent in device list

3. **Start Session:**
   - In web viewer, click "Connect" on desktop device
   - Desktop agent shows dialog
   - Click "Accept"

4. **Verify Stream:**
   - Web viewer shows "Waiting for stream..." briefly
   - **Stream should appear in 5-10 seconds** ✅
   - Status: "● Connected"
   - Red "End Session" button visible

5. **Test Controls:**
   - Move mouse over video
   - Click on video
   - Scroll on video

6. **End Session:**
   - Click red "End Session" button
   - Returns to device list

## 📊 Expected Console Output

### Signaling Server:
```
Signaling server running on port 8080
New WebSocket connection
Received message: register_device
Device registered: abc123... (Desktop Agent)
New WebSocket connection
Received message: register_device
Device registered: def456... (Web Viewer)
Received message: request_session
Session requested: xyz789...
Received message: accept_session
Session accepted: xyz789...
Received message: offer
Routing offer from host to client: def456...
Received message: answer
Routing answer from client to host: abc123...
Routing ICE candidate from abc123... to def456...
Routing ICE candidate from def456... to abc123...
```

### Desktop Agent:
```
✓ robotjs loaded successfully
Connected to signaling server
Setting up signaling for session: xyz789...
Sending offer to signaling server
Received answer, setting remote description
Remote description set
Connection state: connected
```

### Web Viewer (Browser Console):
```
Connecting to signaling server at: ws://localhost:8080
Connected to signaling server
Device registered with ID: def456...
Received device list: [...]
Session started, setting up peer connection: xyz789...
Creating peer connection for session: xyz789...
Peer connection created and ready
Received offer for session: xyz789...
Setting remote description (offer)
Creating answer
Sending answer
Received remote track: video
Connection state: connected
```

## ❌ What You Should NOT See

### Bad Logs (These indicate problems):
```
❌ Session not found for offer
❌ Device disconnected (immediately after connect)
❌ Device reconnected (immediately after disconnect)
❌ Connection state: failed
❌ Binding request timed out (some are OK, but many indicate firewall issues)
```

## 🔧 If Issues Occur

### Issue: "Session not found for offer"
**Solution:**
```cmd
# Rebuild signaling server
cd signaling-server
npm run build
npm start
```

### Issue: Stream doesn't appear
**Solution:**
1. Check desktop agent has screen recording permission
2. Check firewall allows WebRTC
3. Try restarting desktop agent
4. Check all console logs for errors

### Issue: Connection timeout (30 seconds)
**Solution:**
1. Desktop agent: Grant screen recording permission
2. Restart desktop agent
3. Check network connectivity
4. Try localhost before trying network/mobile

### Issue: Devices not showing
**Solution:**
1. Check both connected to same signaling server
2. Check signaling server URL matches
3. Check network connectivity
4. Refresh web viewer

## 🌐 Mobile Testing

### Find Your IP:
```cmd
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

### Update Desktop Agent:
- Server URL: `ws://YOUR_IP:8080`
- Click "Connect"

### Open on Mobile:
- Browser: `http://YOUR_IP:5173`
- Should auto-connect
- Follow same testing steps

## 📱 Mobile Network Requirements

- All devices on same WiFi network
- Firewall allows WebRTC (UDP)
- Router allows local network communication
- No VPN or proxy interfering

## ⏱️ Performance Expectations

| Metric | Expected |
|--------|----------|
| Connection time | < 1 second |
| Session start | < 1 second |
| Stream appears | 5-10 seconds |
| Latency | 100-500ms |
| Frame rate | 15-30 fps |
| Resolution | Up to 1920x1080 |

## 🎯 Success Checklist

- [ ] Signaling server running on port 8080
- [ ] Web viewer running on port 5173
- [ ] Desktop agent window open
- [ ] Desktop agent connected to signaling server
- [ ] Web viewer shows "● Connected"
- [ ] Device list shows desktop agent
- [ ] Session request works
- [ ] Desktop agent shows accept dialog
- [ ] Stream appears within 10 seconds
- [ ] Mouse/keyboard controls work
- [ ] Red "End Session" button visible
- [ ] End session returns to device list

## 📚 Documentation

- **FINAL_FIX_APPLIED.md** - Latest fixes explained
- **STREAM_FIX_COMPLETE.md** - Original routing fix
- **WEBRTC_FLOW_DIAGRAM.md** - Visual flow diagrams
- **TEST_THE_FIX.md** - Detailed testing guide

## 🆘 Still Having Issues?

1. **Rebuild everything:**
   ```cmd
   rebuild-all.bat
   ```

2. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R
   - Or clear cache in DevTools

3. **Restart all services:**
   - Stop all terminals (Ctrl+C)
   - Start again in order

4. **Check all console logs:**
   - Compare with expected output above
   - Look for error messages

5. **Review documentation:**
   - FINAL_FIX_APPLIED.md has troubleshooting
   - WEBRTC_FLOW_DIAGRAM.md shows correct flow

---

**All fixes are applied and ready to test!** 🎉

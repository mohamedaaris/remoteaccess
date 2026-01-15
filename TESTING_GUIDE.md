# FlowLink Testing Guide

Complete guide to test FlowLink remote access functionality across all devices.

## Prerequisites

Before testing, ensure you have:
- ✅ Signaling server running
- ✅ Desktop agent running
- ✅ Web viewer running
- ✅ All devices on the same network (for initial testing)

## Quick Test Setup (5 Minutes)

### Step 1: Start Signaling Server

```bash
cd signaling-server
npm install
npm run dev
```

**Expected Output:**
```
FlowLink Signaling Server running on port 8080
WebSocket endpoint: ws://localhost:8080
```

**✅ Success Indicator:** Server logs "running on port 8080"

---

### Step 2: Start Desktop Agent

Open a **new terminal**:

```bash
cd desktop-agent
npm install
npm run dev
```

**Expected Output:**
- Electron window opens with "FlowLink Agent" title
- UI shows "Disconnected" status
- Input field with "ws://localhost:8080"
- "Connect" button

**✅ Success Indicator:** Window opens with UI visible (not blank)

**If UI is blank:**
1. Check DevTools (View → Toggle Developer Tools)
2. Look for errors in console
3. Verify `ui/index.html` file exists

---

### Step 3: Connect Desktop Agent

In the Desktop Agent window:

1. Click **"Connect"** button
2. Watch the status change

**Expected Result:**
- Status changes to "Connected (ID: xxxxxxxx...)"
- Button changes to "Disconnect"
- Server URL input becomes disabled

**Server Console Should Show:**
```
New WebSocket connection
Device registered: <uuid> (<computer-name>)
```

**✅ Success Indicator:** Status shows "Connected" with device ID

---

### Step 4: Start Web Viewer

Open a **new terminal**:

```bash
cd web-viewer
npm install
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

**✅ Success Indicator:** Vite dev server starts successfully

---

### Step 5: Open Web Viewer in Browser

1. Open browser to `http://localhost:3000`
2. Wait for connection

**Expected Result:**
- Page loads with "FlowLink" title
- Status shows "● Connected" (green)
- "Available Devices" section appears
- Your desktop agent appears in the device list

**Example Device List:**
```
Available Devices
┌─────────────────────────────┐
│ DESKTOP-ABC123              │
│ desktop • Windows 11        │
│                   [Connect] │
└─────────────────────────────┘
```

**✅ Success Indicator:** Desktop agent visible in device list

---

## Testing Remote Access

### Test 1: Establish Connection

**In Web Viewer:**

1. Click **"Connect"** button next to your desktop device

**In Desktop Agent:**

2. Permission dialog appears:
   ```
   Remote Access Request
   Web Viewer wants to access your device
   
   Device: Web Viewer
   Type: desktop
   Platform: web
   
   [Accept]  [Reject]
   ```

3. Click **"Accept"**

**Expected Result:**
- Desktop Agent: Shows "Active Session" card with session ID
- Web Viewer: Switches to full-screen remote view
- You see your desktop screen in the browser

**✅ Success Indicators:**
- Desktop screen visible in browser
- Toolbar shows "● Connected"
- Can see your desktop in real-time

---

### Test 2: Mouse Control

**In Web Viewer (browser):**

1. Move your mouse around
2. Watch the cursor on your actual desktop

**Expected Result:**
- Desktop cursor moves in sync with browser mouse
- Smooth movement with minimal lag

**✅ Success Test:**
- Move mouse to desktop corners
- Cursor reaches all edges
- Movement is responsive

---

### Test 3: Click Control

**In Web Viewer:**

1. Click on desktop icons
2. Try double-clicking
3. Try right-clicking

**Expected Result:**
- Icons select on single click
- Applications open on double-click
- Context menus appear on right-click

**✅ Success Test:**
- Open Notepad or any application
- Type some text (see Test 4)

---

### Test 4: Keyboard Control

**In Web Viewer:**

1. Click in the remote view to focus
2. Type on your keyboard

**Expected Result:**
- Text appears on remote desktop
- All keys work (letters, numbers, symbols)
- Modifier keys work (Ctrl, Alt, Shift)

**✅ Success Test:**
- Open Notepad on remote desktop
- Type: "Hello from FlowLink!"
- Try Ctrl+A, Ctrl+C, Ctrl+V

---

### Test 5: Scroll Control

**In Web Viewer:**

1. Open a web browser on remote desktop
2. Use mouse wheel to scroll

**Expected Result:**
- Page scrolls up/down
- Smooth scrolling

**✅ Success Test:**
- Scroll through a long webpage
- Scroll in different applications

---

### Test 6: Fullscreen Mode

**In Web Viewer:**

1. Click fullscreen button (⛶) in toolbar

**Expected Result:**
- Browser enters fullscreen
- Remote desktop fills entire screen
- Immersive experience

**✅ Success Test:**
- Enter/exit fullscreen multiple times
- Controls still work in fullscreen

---

### Test 7: Disconnect

**In Web Viewer:**

1. Click **X** button in toolbar

**Expected Result:**
- Returns to device list
- Desktop agent shows session ended
- Connection cleanly terminated

**✅ Success Test:**
- Can reconnect immediately
- No errors in console

---

## Testing with Multiple Devices

### Scenario 1: Two Desktop Agents

**Setup:**
1. Start signaling server
2. Start Desktop Agent #1 on Computer A
3. Start Desktop Agent #2 on Computer B
4. Connect both to signaling server

**Test:**
1. In Agent #1, you should see Agent #2 in device list
2. Click "Connect" on Agent #2
3. Agent #2 shows permission dialog
4. Accept and control Computer B from Computer A

**✅ Success:** Can control Computer B from Computer A

---

### Scenario 2: Web Viewer + Desktop Agent

**Setup:**
1. Desktop Agent on Computer A
2. Web Viewer on Computer B (or same computer)

**Test:**
1. Web viewer shows Desktop Agent in list
2. Connect and control desktop from browser

**✅ Success:** Browser can control desktop

---

### Scenario 3: Multiple Viewers

**Setup:**
1. One Desktop Agent (host)
2. Two Web Viewers (different browsers/computers)

**Test:**
1. Both viewers see the desktop agent
2. Only one can connect at a time
3. Second viewer must wait for first to disconnect

**✅ Success:** Session management works correctly

---

## Testing Across Networks

### Local Network Test

**Setup:**
1. All devices on same WiFi/LAN
2. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Update server URL to `ws://YOUR_LOCAL_IP:8080`

**Test:**
1. Connect devices using local IP
2. Test remote access

**✅ Success:** Works across local network

---

### Internet Test (Advanced)

**Setup:**
1. Deploy signaling server to cloud (AWS, DigitalOcean, etc.)
2. Use public IP or domain
3. Configure TURN server for NAT traversal

**Test:**
1. Connect from different networks
2. Test remote access

**✅ Success:** Works across internet

---

## Testing Android Agent

### Prerequisites

- Android device (7.0+)
- Android Studio installed
- USB debugging enabled

### Setup

1. Open `android-agent` in Android Studio
2. Update server URL in `MainActivity.kt`:
   ```kotlin
   private val serverUrl = "ws://YOUR_LOCAL_IP:8080"
   ```
3. Build and install on device

### Test Steps

**Step 1: Launch App**
- App opens with "FlowLink Agent" title
- Shows "Disconnected" status

**Step 2: Connect**
- Tap "Connect" button
- Status changes to "Connected"

**Step 3: Accept Session Request**
- From web viewer, connect to Android device
- Android shows permission dialog
- Tap "Accept"
- Grant screen capture permission

**Step 4: View Android Screen**
- Android screen appears in web viewer
- Can see Android UI in real-time

**✅ Success:** Android screen visible and streaming

**Note:** Touch control for Android is not yet implemented in this version.

---

## Troubleshooting Tests

### Test: Connection Fails

**Symptoms:** Can't connect to signaling server

**Debug Steps:**
1. Check server is running: `curl http://localhost:8080/health`
2. Check firewall settings
3. Verify correct URL
4. Check server logs for errors

---

### Test: No Video Stream

**Symptoms:** Connected but no screen visible

**Debug Steps:**
1. Check screen capture permissions (macOS/Windows)
2. Open browser DevTools → Console
3. Check for WebRTC errors
4. Verify peer connection established
5. Check `chrome://webrtc-internals`

---

### Test: Control Not Working

**Symptoms:** Can see screen but can't control

**Debug Steps:**
1. Check accessibility permissions
2. Verify DataChannel is open
3. Check desktop agent logs
4. Test with simple actions first (mouse move)

---

### Test: High Latency

**Symptoms:** Slow response, lag

**Debug Steps:**
1. Check network latency: `ping <server-ip>`
2. Check CPU usage
3. Reduce video quality
4. Use local network instead of internet

---

## Performance Tests

### Test 1: Video Quality

**Metrics to Check:**
- Frame rate (should be 20-30 FPS)
- Resolution (should match desktop)
- Clarity (text should be readable)

**Tools:**
- `chrome://webrtc-internals` for stats
- Task Manager for CPU usage

---

### Test 2: Latency

**Test:**
1. Move mouse quickly
2. Measure delay between browser and desktop

**Expected:** < 100ms on local network

---

### Test 3: CPU Usage

**Test:**
1. Monitor CPU during streaming
2. Check both host and viewer

**Expected:** 
- Host: 10-30% CPU
- Viewer: 5-15% CPU

---

## Verification Checklist

Use this checklist to verify full functionality:

### Signaling Server
- [ ] Server starts without errors
- [ ] Health endpoint responds
- [ ] WebSocket connections accepted
- [ ] Device registration works
- [ ] Session management works

### Desktop Agent
- [ ] UI loads correctly
- [ ] Connects to server
- [ ] Appears in device list
- [ ] Permission dialog shows
- [ ] Screen capture works
- [ ] Control events work

### Web Viewer
- [ ] Page loads in browser
- [ ] Auto-connects to server
- [ ] Shows device list
- [ ] Can request sessions
- [ ] Video stream displays
- [ ] Mouse control works
- [ ] Keyboard control works
- [ ] Scroll control works
- [ ] Fullscreen works
- [ ] Disconnect works

### Android Agent
- [ ] App installs on device
- [ ] Connects to server
- [ ] Permission dialog shows
- [ ] Screen capture works
- [ ] Appears in device list
- [ ] Stream visible in viewer

---

## Success Criteria

Your FlowLink installation is working correctly if:

✅ **Connection:** All devices connect to signaling server  
✅ **Discovery:** Devices appear in each other's lists  
✅ **Permission:** Permission dialogs work correctly  
✅ **Video:** Remote screen is visible and smooth  
✅ **Control:** Mouse, keyboard, and scroll work  
✅ **Performance:** Low latency, good frame rate  
✅ **Stability:** No crashes or disconnections  

---

## Next Steps

Once basic testing is complete:

1. **Test on different networks**
2. **Test with multiple devices**
3. **Test performance under load**
4. **Test error scenarios**
5. **Deploy to production**

---

## Getting Help

If tests fail:

1. Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
2. Review server and client logs
3. Check browser DevTools console
4. Open GitHub issue with details

---

## Demo Video Script

To create a demo video:

1. **Show signaling server starting**
2. **Show desktop agent connecting**
3. **Show web viewer opening**
4. **Show device list**
5. **Request and accept session**
6. **Demonstrate mouse control**
7. **Demonstrate keyboard typing**
8. **Show fullscreen mode**
9. **Disconnect cleanly**

**Duration:** 2-3 minutes

---

**Happy Testing! 🚀**

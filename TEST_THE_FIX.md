# Testing Guide - Stream Connection Fix

## ✅ All Builds Successful!

All components have been rebuilt with the fixes applied:
- ✅ Signaling Server - Built successfully
- ✅ Web Viewer - Built successfully  
- ✅ Desktop Agent - Built successfully

## Quick Start Testing

### Option 1: Use the Rebuild Script (Recommended)
```cmd
rebuild-all.bat
```

### Option 2: Manual Build (Already Done!)
The builds are already complete. Skip to "Start Services" below.

## Start Services

### Terminal 1: Signaling Server
```cmd
cd signaling-server
npm start
```
**Expected Output:**
```
Signaling server running on port 8080
```

### Terminal 2: Web Viewer (Development Mode)
```cmd
cd web-viewer
npm run dev
```
**Expected Output:**
```
VITE ready in XXX ms
Local: http://localhost:5173
Network: http://YOUR_IP:5173
```

### Terminal 3: Desktop Agent
```cmd
cd desktop-agent
npm start
```
**Expected Output:**
- FlowLink Agent window opens
- Shows "Disconnected" status

## Testing Steps

### Test 1: Basic Connection (Localhost)

1. **Desktop Agent Window:**
   - Server URL: `ws://localhost:8080`
   - Click "Connect"
   - Status should change to "Connected (ID: xxxxxxxx...)"

2. **Web Viewer (Browser):**
   - Open: http://localhost:5173
   - Should auto-connect
   - Status: "● Connected"
   - Should see desktop agent in device list

3. **Request Session:**
   - In web viewer, click "Connect" on the desktop device
   - Desktop agent shows dialog: "Remote Access Request"
   - Click "Accept"

4. **Verify Stream:**
   - Web viewer should show "Waiting for stream..." for 5-10 seconds
   - Then desktop screen should appear
   - Status indicator: "● Connected"
   - Toolbar shows "End Session" button (RED)

5. **Test Controls:**
   - Move mouse over video - should see cursor movement
   - Click on video - should register clicks
   - Scroll on video - should scroll on desktop

6. **End Session:**
   - Click "End Session" button in web viewer toolbar
   - Should return to device list
   - Desktop agent session card should disappear

### Test 2: Mobile Connection (Network)

1. **Find Your IP Address:**
   ```cmd
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. **Update Desktop Agent:**
   - Server URL: `ws://YOUR_IP:8080`
   - Click "Connect"

3. **Open on Mobile:**
   - Browser: http://YOUR_IP:5173
   - Should auto-connect
   - Should see desktop agent in device list

4. **Test Connection:**
   - Follow same steps as Test 1
   - Stream should appear within 5-10 seconds
   - Touch controls should work

### Test 3: Timeout Handling

1. **Simulate Timeout:**
   - Start session but DON'T accept on desktop agent
   - Or stop desktop agent after accepting
   
2. **Expected Behavior:**
   - "Waiting for stream..." shows for 30 seconds
   - Then shows "Connection Timeout" message
   - Displays troubleshooting tips
   - Shows "Go Back" button

3. **Verify:**
   - Click "Go Back" returns to device list
   - Can try connecting again

## What to Look For

### ✅ Success Indicators

**Desktop Agent:**
- Console: "Sending offer to signaling server"
- Console: "Remote description set"
- Console: "ICE candidate added"
- Session card visible with session ID

**Signaling Server:**
- Console: "Routing offer from host to client"
- Console: "Routing answer from client to host"
- Console: "Routing ICE candidate from..."

**Web Viewer:**
- Console: "Received offer for session"
- Console: "Creating answer"
- Console: "Received remote track: video"
- Console: "Connection state: connected"
- Video element shows desktop screen

### ❌ Failure Indicators

**If Stream Doesn't Appear:**

1. **Check Desktop Agent Console:**
   - Error: "No screen sources available" → Grant screen recording permission
   - Error: "getUserMedia is not available" → Restart desktop agent
   - No "Sending offer" message → Check signaling connection

2. **Check Signaling Server Console:**
   - No "Routing offer" message → Desktop agent not sending offer
   - "Session not found" → Session expired or invalid

3. **Check Web Viewer Console:**
   - No "Received offer" message → Signaling routing issue
   - "Connection state: failed" → Network/firewall issue
   - Timeout message → Desktop agent not streaming

## Common Issues & Solutions

### Issue: "Waiting for stream..." Forever

**Solution:** This was the main bug - now fixed!
- Signaling server was routing messages incorrectly
- Rebuild signaling server: `cd signaling-server && npm run build`
- Restart signaling server

### Issue: No Devices Showing

**Solution:**
- Check both devices connected to same signaling server
- Check signaling server URL matches
- Check network connectivity

### Issue: Connection Timeout

**Solution:**
- Desktop agent: Grant screen recording permission
- Check firewall allows WebRTC (UDP)
- Try localhost first, then network
- Check desktop agent console for errors

### Issue: End Session Button Not Working

**Solution:**
- Button should be RED in toolbar
- Check browser console for errors
- Session should end and return to device list

## Performance Expectations

- **Connection Time:** 5-10 seconds from accept to stream
- **Latency:** 100-500ms depending on network
- **Frame Rate:** 15-30 fps depending on network
- **Resolution:** Up to 1920x1080

## Network Requirements

- **Localhost:** No special requirements
- **LAN:** All devices on same network
- **Firewall:** Allow WebRTC (UDP ports)
- **STUN Server:** Uses Google's public STUN servers

## Next Steps After Testing

If everything works:
1. ✅ Stream appears within 10 seconds
2. ✅ Controls work (mouse, keyboard)
3. ✅ End session button works
4. ✅ Timeout handling works

You're ready to use FlowLink!

If issues persist:
1. Check console logs in all three components
2. Verify network connectivity
3. Check firewall settings
4. Review STREAM_FIX_COMPLETE.md for technical details

## Support

For detailed technical information, see:
- `STREAM_FIX_COMPLETE.md` - Complete fix documentation
- `MOBILE_ACCESS_GUIDE.md` - Mobile setup guide
- Console logs in each component

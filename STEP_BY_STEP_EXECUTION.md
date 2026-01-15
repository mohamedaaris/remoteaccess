# FlowLink - Complete Step-by-Step Execution Guide

## 📋 Prerequisites Check

Before starting, verify you have:
- ✅ Node.js 18+ installed: `node --version`
- ✅ npm installed: `npm --version`
- ✅ Three terminal windows ready
- ✅ A web browser (Chrome/Edge recommended)

---

## 🚀 STEP-BY-STEP EXECUTION

### STEP 1: Start Signaling Server (Terminal 1)

**Open Terminal 1 (PowerShell):**

```powershell
cd "C:\Users\ASUS\Documents\remote access\signaling-server"
npm run dev
```

**✅ EXPECTED OUTPUT:**
```
FlowLink Signaling Server running on port 8080
WebSocket endpoint: ws://localhost:8080
```

**✅ SUCCESS INDICATORS:**
- No errors shown
- Server says "running on port 8080"
- Terminal stays open (server is running)

**❌ IF YOU SEE ERRORS:**
- Check if port 8080 is already in use
- Try: `npm install` first, then `npm run dev`
- Check for TypeScript errors

**⚠️ KEEP THIS TERMINAL OPEN!** Server must stay running.

---

### STEP 2: Start Desktop Agent (Terminal 2)

**Open Terminal 2 (PowerShell):**

```powershell
cd "C:\Users\ASUS\Documents\remote access\desktop-agent"
npm run dev
```

**✅ EXPECTED OUTPUT:**
- Electron window opens (FlowLink Agent)
- Console shows: `⚠ robotjs not available, using mock handler`
- Window shows UI with:
  - "FlowLink Agent" title
  - "Disconnected" status (red)
  - Input field: `ws://localhost:8080`
  - "Connect" button

**✅ SUCCESS INDICATORS:**
- Window is NOT blank
- UI is visible
- No crash

**❌ IF WINDOW IS BLANK:**
- Check DevTools (should open automatically)
- Look for errors in console
- Try: `npm run build` then `npm run dev`

**📝 ACTION REQUIRED:**
1. In the FlowLink Agent window, click **"Connect"** button
2. Status should change to **"Connected (ID: xxxxxxxx...)"**
3. Button changes to **"Disconnect"**

**✅ VERIFY IN TERMINAL 1 (Signaling Server):**
You should see:
```
New WebSocket connection
Device registered: <uuid> (<your-computer-name>)
```

**⚠️ KEEP THIS WINDOW AND TERMINAL OPEN!**

---

### STEP 3: Start Web Viewer (Terminal 3)

**Open Terminal 3 (PowerShell):**

```powershell
cd "C:\Users\ASUS\Documents\remote access\web-viewer"
npm run dev
```

**✅ EXPECTED OUTPUT:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**✅ SUCCESS INDICATORS:**
- Vite dev server starts
- Shows "Local: http://localhost:3000/"
- No build errors

**❌ IF YOU SEE BUILD ERRORS:**
- Try: `npm install` first
- Check for TypeScript errors
- Verify all files are present

**⚠️ KEEP THIS TERMINAL OPEN!**

---

### STEP 4: Open Web Viewer in Browser

**Open your web browser (Chrome/Edge):**

1. Go to: **http://localhost:3000**

**✅ EXPECTED TO SEE:**
```
┌─────────────────────────────────┐
│ FlowLink                        │
│ ● Connected (green)             │
│                                 │
│ Available Devices               │
│ ┌─────────────────────────────┐ │
│ │ DESKTOP-XXXXX               │ │
│ │ desktop • Windows 11        │ │
│ │                   [Connect] │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**✅ SUCCESS INDICATORS:**
- Page loads (not blank)
- Status shows "● Connected" in green
- "Available Devices" section visible
- Your desktop device appears in the list

**❌ IF PAGE IS BLANK:**
- Open DevTools (F12)
- Check Console tab for errors
- Verify web-viewer terminal shows no errors
- Try refreshing the page

**❌ IF NO DEVICES SHOWN:**
- Check Desktop Agent is connected (Step 2)
- Check Signaling Server logs (Terminal 1)
- Verify Desktop Agent shows "Connected" status
- Try disconnecting and reconnecting Desktop Agent

---

### STEP 5: Test Remote Connection

**In Browser (Web Viewer):**

1. Find your desktop device in the list
2. Click the **"Connect"** button next to it

**✅ WHAT HAPPENS:**

**In Desktop Agent Window:**
- A dialog box appears:
  ```
  Remote Access Request
  
  Web Viewer wants to access your device
  
  Device: Web Viewer
  Type: desktop
  Platform: web
  
  [Accept]  [Reject]
  ```

3. Click **"Accept"** button

**✅ EXPECTED RESULT:**

**In Browser:**
- Screen switches to full remote view
- You see your desktop screen in the browser!
- Toolbar at top shows "● Connected"
- Your actual desktop is visible in real-time

**✅ SUCCESS! YOU'RE NOW VIEWING YOUR DESKTOP REMOTELY!** 🎉

---

### STEP 6: Test Screen Streaming

**To verify it's working:**

1. **On your actual desktop** (not in browser):
   - Open Notepad
   - Move a window around
   - Open a folder

2. **In the browser:**
   - You should see these actions in real-time
   - Screen updates as you move things
   - Video is smooth (20-30 FPS)

**✅ SUCCESS INDICATORS:**
- Desktop screen visible in browser
- Updates in real-time
- Smooth video (not choppy)
- Low latency (< 1 second delay)

---

### STEP 7: Test Controls (Limited)

**⚠️ NOTE:** Full control requires robotjs fix (see ROBOTJS_FIX.md)

**In Browser (Remote View):**

1. Try moving your mouse
2. Try clicking
3. Try typing

**✅ WHAT YOU'LL SEE:**

**In Desktop Agent Terminal (Terminal 2):**
```
[Mock] Mouse move to (123, 456)
[Mock] Mouse click left at (123, 456)
[Mock] Key press: a
```

**⚠️ EXPECTED:** Control events are logged but DON'T actually control the desktop yet.

**To enable full control:** Follow [ROBOTJS_FIX.md](ROBOTJS_FIX.md)

---

### STEP 8: Disconnect

**In Browser:**

1. Click the **X** button in the toolbar (top right)

**✅ EXPECTED:**
- Returns to device list
- Desktop Agent shows session ended
- Can reconnect immediately

---

## 📱 MOBILE (ANDROID) SETUP

### Prerequisites:
- Android device (Android 7.0+)
- Android Studio installed
- USB cable
- USB debugging enabled on phone

### Step-by-Step:

#### 1. Find Your Computer's IP Address

**In PowerShell:**
```powershell
ipconfig
```

**Look for:** IPv4 Address (e.g., `192.168.1.100`)

**Write it down:** `_________________`

---

#### 2. Open Android Project

1. Open **Android Studio**
2. Click **"Open"**
3. Navigate to: `C:\Users\ASUS\Documents\remote access\android-agent`
4. Click **"OK"**
5. Wait for Gradle sync to complete

---

#### 3. Update Server URL

1. In Android Studio, open: `app/src/main/java/com/flowlink/agent/MainActivity.kt`
2. Find line: `private val serverUrl = "ws://YOUR_SERVER_IP:8080"`
3. Replace `YOUR_SERVER_IP` with your IP from Step 1
4. Example: `private val serverUrl = "ws://192.168.1.100:8080"`
5. Save file (Ctrl+S)

---

#### 4. Connect Android Device

1. Connect phone via USB
2. Enable USB debugging on phone:
   - Settings → About Phone → Tap "Build Number" 7 times
   - Settings → Developer Options → Enable USB Debugging
3. Allow USB debugging when prompted on phone

---

#### 5. Build and Install

**In Android Studio:**

1. Click **"Run"** button (green play icon) or press Shift+F10
2. Select your device from list
3. Click **"OK"**
4. Wait for build and installation

**✅ EXPECTED:**
- App installs on phone
- App opens automatically
- Shows "FlowLink Agent" screen

---

#### 6. Connect Android to Server

**On Android Phone:**

1. App shows "Disconnected" status
2. Tap **"Connect"** button
3. Status changes to **"Connected"**

**✅ VERIFY:**
- Phone shows "Connected" status
- In web viewer (browser), you should see Android device in list

---

#### 7. View Android Screen

**In Browser (Web Viewer):**

1. Find Android device in list (shows as "mobile")
2. Click **"Connect"**

**On Android Phone:**

3. Permission dialog appears
4. Tap **"Accept"**
5. Grant screen capture permission when prompted

**✅ EXPECTED:**
- Android screen appears in browser!
- You can see phone screen in real-time
- Screen updates as you use phone

---

## ✅ VERIFICATION CHECKLIST

Use this to verify everything is working:

### Signaling Server:
- [ ] Server starts without errors
- [ ] Shows "running on port 8080"
- [ ] Logs device connections
- [ ] Terminal stays open

### Desktop Agent:
- [ ] Window opens (not blank)
- [ ] UI is visible
- [ ] Can click "Connect"
- [ ] Status shows "Connected"
- [ ] Appears in web viewer device list

### Web Viewer:
- [ ] Vite dev server starts
- [ ] Page loads in browser
- [ ] Shows "Connected" status
- [ ] Displays device list
- [ ] Desktop device visible

### Remote Connection:
- [ ] Can click "Connect" on device
- [ ] Permission dialog appears
- [ ] Can accept session
- [ ] Desktop screen appears in browser
- [ ] Video streams smoothly
- [ ] Can disconnect cleanly

### Android (Optional):
- [ ] App installs on phone
- [ ] Can connect to server
- [ ] Appears in device list
- [ ] Permission dialog works
- [ ] Screen capture works
- [ ] Phone screen visible in browser

---

## 🐛 TROUBLESHOOTING

### Issue: Signaling Server Won't Start

**Error:** Port 8080 already in use

**Fix:**
```powershell
# Find what's using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or use different port
# Edit signaling-server/.env: PORT=8081
```

---

### Issue: Desktop Agent Window is Blank

**Fix:**
```powershell
cd desktop-agent
npm run build
npm start
```

**Check DevTools:**
- Should open automatically
- Look for errors in Console tab

---

### Issue: Web Viewer Shows Nothing

**Fix:**
```powershell
cd web-viewer
npm install
npm run dev
```

**Check Browser:**
- Open DevTools (F12)
- Check Console for errors
- Try different browser

---

### Issue: No Devices in List

**Check:**
1. Desktop Agent shows "Connected"?
2. Signaling Server logs show device registered?
3. Web Viewer shows "Connected" status?

**Fix:**
- Disconnect and reconnect Desktop Agent
- Refresh web viewer page
- Check all three terminals for errors

---

### Issue: Can't Connect to Device

**Check:**
1. Device is online (green status)?
2. Signaling Server running?
3. Both devices connected to same server?

**Fix:**
- Restart Desktop Agent
- Refresh web viewer
- Check server logs

---

### Issue: No Video Stream

**Check:**
1. Permission dialog accepted?
2. Screen recording permission granted?
3. Browser console for errors?

**Fix Windows:**
- Run Desktop Agent as Administrator

**Fix macOS:**
- System Preferences → Security & Privacy → Screen Recording
- Add FlowLink Agent
- Restart app

**Fix Linux:**
- Check X11 permissions
- May need to run with sudo

---

### Issue: Control Not Working

**Expected!** This is normal.

**Why:** robotjs needs to be rebuilt for Electron

**Fix:** See [ROBOTJS_FIX.md](ROBOTJS_FIX.md)

**Quick Fix:**
1. Move project to path without spaces
2. `cd desktop-agent`
3. `Remove-Item node_modules -Recurse -Force`
4. `npm install`
5. `npx @electron/rebuild`

---

## 📊 EXPECTED PERFORMANCE

### Local Network:
- **Latency:** < 50ms
- **Frame Rate:** 20-30 FPS
- **Quality:** High (text readable)
- **CPU Usage:** 10-30%

### Video Quality:
- **Resolution:** Matches desktop
- **Clarity:** Text should be readable
- **Smoothness:** No stuttering
- **Delay:** < 1 second

---

## 🎯 SUCCESS CRITERIA

Your FlowLink is working correctly if:

✅ All three components start without errors  
✅ Desktop Agent connects to server  
✅ Web Viewer shows device list  
✅ Can request and accept sessions  
✅ **Desktop screen appears in browser**  
✅ Video streams smoothly  
✅ Can disconnect and reconnect  
✅ Multiple devices can connect  

---

## 📸 SCREENSHOTS TO VERIFY

Take screenshots of:

1. **Terminal 1:** Signaling server running
2. **Terminal 2:** Desktop agent console
3. **Desktop Agent Window:** Connected status
4. **Terminal 3:** Web viewer dev server
5. **Browser:** Device list showing
6. **Browser:** Remote desktop screen visible

---

## 🎉 CONGRATULATIONS!

If you can see your desktop screen in the browser, **IT'S WORKING!**

### What You've Achieved:
✅ Built a complete remote access system  
✅ Real-time screen streaming  
✅ Cross-platform support  
✅ Secure peer-to-peer connections  
✅ Self-hosted solution  

### Next Steps:
1. Fix robotjs for full control (5 min)
2. Test with multiple devices
3. Try Android app
4. Deploy to production

---

## 📞 NEED HELP?

**Check these in order:**

1. **This guide** - Re-read the steps
2. **[ROBOTJS_FIX.md](ROBOTJS_FIX.md)** - Fix control
3. **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Detailed fixes
4. **Terminal logs** - Look for errors
5. **Browser DevTools** - Check console

---

**You're all set! Enjoy your remote access system!** 🚀

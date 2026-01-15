# FlowLink Mobile Access Guide

## 📱 Understanding Device Types

FlowLink has two types of components:

### 1. **Agent (Host)** - Device Being Controlled
- Desktop Agent (Electron app)
- Android Agent (mobile app)
- **Purpose:** Shares screen, accepts control

### 2. **Viewer (Controller)** - Device Doing the Controlling
- Web Viewer (browser)
- Desktop Agent can also view other devices
- **Purpose:** Views and controls remote devices

---

## 🤔 Why You See Two Devices on Same Computer

When testing on one computer, you see:

```
Available Devices:
┌─────────────────────────────┐
│ DESKTOP-ABC (Desktop Agent) │  ← Electron app (can be controlled)
│ desktop • Windows 11        │
│                   [Connect] │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Web Viewer                  │  ← Browser tab (controller only)
│ desktop • web               │
│                   [Connect] │
└─────────────────────────────┘
```

**This is CORRECT!** They are two separate devices:
- **Desktop Agent** = Your computer's screen (what you want to view)
- **Web Viewer** = The browser (the viewer itself)

### Which One to Connect To?

**Connect to "Desktop Agent"** (or your computer name) - This shows your actual desktop.

**Don't connect to "Web Viewer"** - This would try to view the browser tab itself (not useful).

---

## 📱 Mobile Access Scenarios

### Scenario 1: View Your Laptop from Your Phone ⭐ RECOMMENDED

**What:** Control your laptop while away from it using your phone's browser

**Setup:**
```
Laptop (Desktop Agent) ←→ Signaling Server ←→ Phone Browser (Web Viewer)
```

**Steps:**

1. **On Laptop:**
   - Start signaling server
   - Start Desktop Agent
   - Click "Connect"
   - Find your laptop's IP: `ipconfig` (e.g., 192.168.1.100)

2. **On Phone:**
   - Open browser (Chrome/Safari)
   - Go to: `http://192.168.1.100:3000` (use your laptop's IP)
   - You'll see your laptop in the device list
   - Tap "Connect"
   - Accept on laptop
   - **Control your laptop from phone!**

**Use Cases:**
- Control laptop from couch
- Access laptop while in another room
- Remote work from phone

---

### Scenario 2: View Your Phone from Your Laptop

**What:** See your phone's screen on your laptop

**Setup:**
```
Phone (Android Agent) ←→ Signaling Server ←→ Laptop Browser (Web Viewer)
```

**Steps:**

1. **On Laptop:**
   - Start signaling server
   - Start web viewer
   - Find your laptop's IP: `ipconfig`

2. **On Phone:**
   - Install FlowLink Android app (see Android setup below)
   - Update server URL to laptop's IP
   - Open app and tap "Connect"

3. **On Laptop Browser:**
   - You'll see phone in device list
   - Click "Connect"
   - Accept on phone
   - Grant screen capture permission
   - **See your phone screen on laptop!**

**Use Cases:**
- Demo phone apps on big screen
- Record phone screen
- Tech support for phone issues
- Test mobile apps

---

### Scenario 3: View Laptop A from Laptop B

**What:** Control one laptop from another laptop

**Setup:**
```
Laptop A (Desktop Agent) ←→ Signaling Server ←→ Laptop B (Web Viewer)
```

**Steps:**

1. **On Laptop A (to be controlled):**
   - Start Desktop Agent
   - Connect to signaling server

2. **On Laptop B (controller):**
   - Open browser
   - Go to signaling server URL
   - See Laptop A in list
   - Connect and control

**Use Cases:**
- Remote work
- Access home computer from work
- Help someone with their computer

---

## 🚀 Detailed Setup for Each Scenario

### Setup 1: Laptop → Phone Browser (Most Common)

#### Step 1: Prepare Laptop

```powershell
# Terminal 1: Start signaling server
cd signaling-server
npm run dev

# Terminal 2: Start desktop agent
cd desktop-agent
npm run dev
# Click "Connect"

# Terminal 3: Start web viewer (for laptop access)
cd web-viewer
npm run dev
```

#### Step 2: Find Laptop IP

```powershell
ipconfig
```
Look for: **IPv4 Address** (e.g., `192.168.1.100`)

#### Step 3: Access from Phone

**On your phone's browser:**
1. Open Chrome/Safari
2. Go to: `http://YOUR_LAPTOP_IP:3000`
   - Example: `http://192.168.1.100:3000`
3. You'll see your laptop in the device list
4. Tap "Connect"
5. Accept on laptop
6. **Control laptop from phone!**

**✅ What You Can Do:**
- See laptop screen on phone
- Move mouse (tap and drag)
- Type (use phone keyboard)
- Open apps
- Full remote control

---

### Setup 2: Phone → Laptop Browser

#### Step 1: Build Android App

**On Laptop:**

1. Open Android Studio
2. Open: `android-agent` folder
3. Edit `MainActivity.kt`:
   ```kotlin
   private val serverUrl = "ws://YOUR_LAPTOP_IP:8080"
   ```
   Replace with your laptop's IP (from `ipconfig`)

4. Connect phone via USB
5. Enable USB debugging on phone
6. Click Run (green play button)
7. App installs on phone

#### Step 2: Connect Phone

**On Phone:**
1. Open FlowLink app
2. Tap "Connect"
3. Status shows "Connected"

#### Step 3: View on Laptop

**On Laptop Browser:**
1. Go to: `http://localhost:3000`
2. You'll see phone in device list (shows as "mobile")
3. Click "Connect"
4. Accept on phone
5. Grant screen capture permission
6. **See phone screen on laptop!**

**✅ What You Can Do:**
- See phone screen on big screen
- Demo apps
- Record phone screen
- Take screenshots

**⚠️ Note:** Touch control not implemented yet, only viewing.

---

## 🌐 Network Requirements

### Same WiFi Network (Easiest)

**Requirements:**
- All devices on same WiFi
- Use local IP addresses
- No internet required

**Setup:**
- Signaling server on one device
- Other devices connect using local IP
- Example: `ws://192.168.1.100:8080`

### Different Networks (Advanced)

**Requirements:**
- Signaling server on public server (cloud)
- TURN server for NAT traversal
- Public IP or domain name

**Setup:**
1. Deploy signaling server to cloud (AWS, DigitalOcean, etc.)
2. Configure TURN server
3. Update all clients to use public URL
4. Example: `wss://flowlink.yourdomain.com`

---

## 📋 Quick Reference

### To Control Laptop from Phone:

```
1. Laptop: Start Desktop Agent + Signaling Server
2. Phone Browser: Go to http://LAPTOP_IP:3000
3. Phone: Tap "Connect" on laptop device
4. Laptop: Click "Accept"
5. Done! Control laptop from phone
```

### To View Phone on Laptop:

```
1. Laptop: Start Signaling Server + Web Viewer
2. Phone: Install Android app with laptop IP
3. Phone: Tap "Connect" in app
4. Laptop Browser: Click "Connect" on phone device
5. Phone: Accept and grant permission
6. Done! See phone screen on laptop
```

### To Control Laptop A from Laptop B:

```
1. Laptop A: Start Desktop Agent
2. Laptop B: Open browser to signaling server
3. Laptop B: Click "Connect" on Laptop A
4. Laptop A: Click "Accept"
5. Done! Control Laptop A from Laptop B
```

---

## 🎯 Recommended Setups

### For Testing (Same Device):
- Desktop Agent + Web Viewer on same computer
- See both in device list
- Connect to Desktop Agent to see your screen

### For Real Use (Different Devices):
- **Home Setup:** Desktop Agent on PC, control from phone/tablet
- **Work Setup:** Desktop Agent on work PC, control from home laptop
- **Demo Setup:** Android Agent on phone, view on laptop for presentations

---

## 💡 Pro Tips

### For Phone Browser Access:
- Bookmark the URL on phone for quick access
- Use landscape mode for better view
- Enable "Request Desktop Site" if needed
- Use Chrome for best compatibility

### For Android App:
- Keep phone plugged in (screen capture uses battery)
- Use WiFi (not mobile data) for better quality
- Grant all permissions when prompted
- Keep app in foreground for best performance

### For Multiple Devices:
- Give devices descriptive names
- Keep signaling server on always-on device
- Use static IP for server device
- Document your IP addresses

---

## 🔒 Security Notes

### On Local Network:
- ✅ Safe - traffic stays on your network
- ✅ No internet required
- ✅ Fast and low latency

### Over Internet:
- ⚠️ Use HTTPS/WSS (secure WebSocket)
- ⚠️ Use strong passwords
- ⚠️ Consider VPN for extra security
- ⚠️ Keep signaling server updated

---

## 🐛 Troubleshooting Mobile Access

### Can't Access from Phone Browser

**Check:**
- Phone and laptop on same WiFi?
- Using correct IP address?
- Port 3000 accessible?
- Firewall blocking?

**Fix:**
```powershell
# On laptop, allow port 3000
# Windows Firewall → Allow port 3000
# Or temporarily disable firewall for testing
```

### Android App Won't Connect

**Check:**
- Correct server IP in MainActivity.kt?
- Phone on same WiFi as laptop?
- Signaling server running?
- Port 8080 accessible?

**Fix:**
- Verify IP address: `ipconfig` on laptop
- Rebuild app with correct IP
- Check phone WiFi settings

### Phone Screen Not Showing

**Check:**
- Permission granted on phone?
- Screen capture permission allowed?
- Phone app in foreground?

**Fix:**
- Reinstall app
- Grant all permissions
- Keep app open (don't minimize)

---

## 📊 Performance Tips

### For Phone Browser:
- Use WiFi (not mobile data)
- Close other browser tabs
- Use landscape orientation
- Reduce video quality if laggy

### For Android App:
- Keep phone plugged in
- Close background apps
- Use WiFi
- Keep screen on

---

## ✅ Success Checklist

### Laptop → Phone Browser:
- [ ] Laptop Desktop Agent running
- [ ] Found laptop IP address
- [ ] Phone on same WiFi
- [ ] Phone browser can access laptop IP
- [ ] Laptop device shows in phone browser
- [ ] Can connect and control

### Phone → Laptop Browser:
- [ ] Android app built with correct IP
- [ ] App installed on phone
- [ ] Phone connected to server
- [ ] Phone shows in laptop browser
- [ ] Can connect from laptop
- [ ] Phone screen visible on laptop

---

## 🎉 You're Ready for Mobile Access!

**Choose your scenario:**
1. **Control laptop from phone** - Most useful for daily use
2. **View phone on laptop** - Great for demos and testing
3. **Control laptop from another laptop** - Perfect for remote work

**Start with Scenario 1** (laptop → phone browser) - it's the easiest and most useful!

---

**Questions?** Check [STEP_BY_STEP_EXECUTION.md](STEP_BY_STEP_EXECUTION.md) for detailed setup instructions.

# FlowLink Setup for Your Network

## 🌐 Your Network Configuration

**Your Laptop IP:** `192.168.0.109`

All devices on your WiFi network can now access FlowLink using this IP!

---

## 🚀 Start FlowLink on Your Laptop

### Terminal 1: Signaling Server
```powershell
cd "C:\Users\ASUS\Documents\remote access\signaling-server"
npm run dev
```
✅ Server runs on: `http://192.168.0.109:8080`

---

### Terminal 2: Desktop Agent
```powershell
cd "C:\Users\ASUS\Documents\remote access\desktop-agent"
npm run dev
```
✅ Click "Connect" in the window

---

### Terminal 3: Web Viewer
```powershell
cd "C:\Users\ASUS\Documents\remote access\web-viewer"
npm run dev
```
✅ Now accessible from any device on your network!

**You'll see:**
```
VITE ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.0.109:3000/  ← Use this on other devices!
```

---

## 📱 Access from Other Devices

### From Your Phone (Browser)

1. **Make sure phone is on same WiFi**
2. **Open browser** (Chrome/Safari)
3. **Go to:** `http://192.168.0.109:3000`
4. **You'll see your laptop in the device list**
5. **Tap "Connect"**
6. **Accept on laptop**
7. **Control your laptop from phone!** 🎉

---

### From Another Laptop/Computer

1. **Make sure device is on same WiFi**
2. **Open browser**
3. **Go to:** `http://192.168.0.109:3000`
4. **You'll see your laptop in the device list**
5. **Click "Connect"**
6. **Accept on laptop**
7. **Control your laptop remotely!** 🎉

---

### From Tablet (iPad/Android)

1. **Connect tablet to same WiFi**
2. **Open browser**
3. **Go to:** `http://192.168.0.109:3000`
4. **Tap "Connect" on your laptop device**
5. **Accept on laptop**
6. **Control from tablet!** 🎉

---

## 📱 Android App Setup (View Phone on Laptop)

### Step 1: Update Android App

1. **Open Android Studio**
2. **Open:** `android-agent` folder
3. **Edit:** `app/src/main/java/com/flowlink/agent/MainActivity.kt`
4. **Find line 18:**
   ```kotlin
   private val serverUrl = "ws://YOUR_SERVER_IP:8080"
   ```
5. **Change to:**
   ```kotlin
   private val serverUrl = "ws://192.168.0.109:8080"
   ```
6. **Save file** (Ctrl+S)

### Step 2: Build and Install

1. **Connect phone via USB**
2. **Enable USB debugging on phone**
3. **Click Run** (green play button in Android Studio)
4. **App installs on phone**

### Step 3: Connect

1. **On phone:** Open FlowLink app
2. **Tap "Connect"**
3. **On laptop browser:** Go to `http://192.168.0.109:3000`
4. **Click "Connect"** on phone device
5. **On phone:** Accept + Grant permission
6. **See phone screen on laptop!** 🎉

---

## 🔥 Quick Access URLs

Save these for easy access:

### On Your Laptop:
- **Web Viewer:** `http://localhost:3000`
- **Signaling Server Health:** `http://localhost:8080/health`

### On Other Devices (Same WiFi):
- **Web Viewer:** `http://192.168.0.109:3000`
- **Signaling Server:** `ws://192.168.0.109:8080`

---

## 📱 Bookmark on Phone

**For easy access, bookmark this on your phone:**

1. Open browser on phone
2. Go to: `http://192.168.0.109:3000`
3. Bookmark the page
4. Name it: "Control Laptop"
5. Now you can quickly access it anytime!

---

## 🔒 Firewall Settings (If Needed)

If other devices can't connect, allow these ports:

### Windows Firewall:

```powershell
# Allow port 8080 (Signaling Server)
netsh advfirewall firewall add rule name="FlowLink Signaling" dir=in action=allow protocol=TCP localport=8080

# Allow port 3000 (Web Viewer)
netsh advfirewall firewall add rule name="FlowLink Web Viewer" dir=in action=allow protocol=TCP localport=3000
```

**Or temporarily disable firewall for testing:**
1. Windows Security → Firewall & network protection
2. Turn off for Private network (testing only!)
3. Remember to turn back on after testing

---

## ✅ Verification Checklist

### On Your Laptop:
- [ ] All three terminals running
- [ ] Desktop Agent shows "Connected"
- [ ] Web Viewer shows: `Network: http://192.168.0.109:3000/`
- [ ] No firewall blocking ports 3000 and 8080

### On Phone/Other Device:
- [ ] Connected to same WiFi network
- [ ] Can open `http://192.168.0.109:3000` in browser
- [ ] Page loads (not timeout)
- [ ] Can see laptop in device list
- [ ] Can connect and control

---

## 🎯 Test Scenarios

### Scenario 1: Phone → Laptop
```
Phone Browser: http://192.168.0.109:3000
→ See laptop in list
→ Tap "Connect"
→ Control laptop from phone ✅
```

### Scenario 2: Another Laptop → Your Laptop
```
Other Laptop Browser: http://192.168.0.109:3000
→ See your laptop in list
→ Click "Connect"
→ Control your laptop remotely ✅
```

### Scenario 3: Tablet → Laptop
```
Tablet Browser: http://192.168.0.109:3000
→ See laptop in list
→ Tap "Connect"
→ Control laptop from tablet ✅
```

### Scenario 4: Laptop → Phone
```
Phone: FlowLink Android app (server: ws://192.168.0.109:8080)
Laptop Browser: http://192.168.0.109:3000
→ See phone in list
→ Click "Connect"
→ View phone screen on laptop ✅
```

---

## 🐛 Troubleshooting

### Can't Access from Phone

**Problem:** Browser shows "Can't reach this page"

**Solutions:**

1. **Check WiFi:**
   - Phone and laptop on SAME WiFi network?
   - Not using mobile data?

2. **Check IP:**
   - Verify laptop IP: `ipconfig`
   - Should be: `192.168.0.109`
   - If different, update URLs

3. **Check Firewall:**
   - Windows Firewall blocking?
   - Try disabling temporarily
   - Or add firewall rules above

4. **Check Web Viewer:**
   - Terminal 3 running?
   - Shows "Network: http://192.168.0.109:3000/"?
   - Try restarting: Ctrl+C, then `npm run dev`

5. **Test Connection:**
   ```powershell
   # On laptop, test if port is accessible
   netstat -an | findstr :3000
   ```

---

### Phone Shows Empty Device List

**Problem:** Page loads but no devices shown

**Solutions:**

1. **Check Desktop Agent:**
   - Is it connected?
   - Shows "Connected" status?
   - Try disconnect/reconnect

2. **Check Signaling Server:**
   - Terminal 1 running?
   - Shows device registered?

3. **Refresh Page:**
   - Pull down to refresh on phone
   - Or close and reopen browser

---

### Android App Won't Connect

**Problem:** App shows "Disconnected"

**Solutions:**

1. **Check Server URL:**
   - MainActivity.kt has correct IP?
   - Should be: `ws://192.168.0.109:8080`
   - Rebuild app after changing

2. **Check WiFi:**
   - Phone on same WiFi as laptop?
   - Not using mobile data?

3. **Check Signaling Server:**
   - Terminal 1 running on laptop?
   - Port 8080 accessible?

4. **Reinstall App:**
   - Uninstall from phone
   - Rebuild in Android Studio
   - Install again

---

## 💡 Pro Tips

### For Best Performance:
- Keep laptop plugged in
- Use 5GHz WiFi if available
- Close unnecessary apps
- Keep devices close to WiFi router

### For Convenience:
- Bookmark `http://192.168.0.109:3000` on all devices
- Create home screen shortcut on phone
- Keep laptop awake (disable sleep)
- Use static IP for laptop (router settings)

### For Security:
- Only use on trusted WiFi networks
- Don't expose to internet without VPN
- Always accept/reject session requests
- End sessions when done

---

## 📊 Network Diagram

```
                    Your WiFi Network
                    (192.168.0.x)
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────▼────┐       ┌────▼────┐      ┌────▼────┐
   │ Laptop  │       │  Phone  │      │ Tablet  │
   │192.168. │       │192.168. │      │192.168. │
   │ 0.109   │       │ 0.xxx   │      │ 0.xxx   │
   │         │       │         │      │         │
   │Desktop  │       │ Browser │      │ Browser │
   │Agent +  │◄──────┤  View   │◄─────┤  View   │
   │Signaling│       │ Control │      │ Control │
   │Server   │       │         │      │         │
   └─────────┘       └─────────┘      └─────────┘
```

---

## 🎉 You're All Set!

Your FlowLink is now accessible from any device on your network!

### Quick Start:
1. **Laptop:** Start all three terminals
2. **Other Device:** Open `http://192.168.0.109:3000`
3. **Connect and control!**

### URLs to Remember:
- **Web Viewer:** `http://192.168.0.109:3000`
- **Signaling Server:** `ws://192.168.0.109:8080`

---

## 📞 Need Help?

- **Can't connect?** Check firewall and WiFi
- **No devices?** Restart Desktop Agent
- **Slow performance?** Move closer to router
- **More help:** See [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

**Enjoy controlling your laptop from anywhere in your home!** 🚀

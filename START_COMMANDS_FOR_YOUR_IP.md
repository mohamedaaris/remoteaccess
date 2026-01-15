# Quick Start Commands - Your Network (192.168.0.109)

## 🚀 Start Everything (Copy & Paste)

### Terminal 1: Signaling Server
```powershell
cd "C:\Users\ASUS\Documents\remote access\signaling-server"
npm run dev
```
✅ Runs on: `http://192.168.0.109:8080`

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
✅ Accessible at: `http://192.168.0.109:3000`

---

## 📱 Access from Other Devices

### On Phone/Tablet/Another Computer:

**Open browser and go to:**
```
http://192.168.0.109:3000
```

**That's it!** You'll see your laptop in the device list.

---

## 📱 Android App Configuration

**Edit this file:** `android-agent/app/src/main/java/com/flowlink/agent/MainActivity.kt`

**Change line 18 to:**
```kotlin
private val serverUrl = "ws://192.168.0.109:8080"
```

---

## ✅ Quick Test

1. **Start all 3 terminals** (commands above)
2. **On phone:** Open `http://192.168.0.109:3000`
3. **Tap "Connect"** on your laptop device
4. **Accept on laptop**
5. **Control laptop from phone!** 🎉

---

## 🔥 Bookmark These URLs

### On Your Laptop:
- Local access: `http://localhost:3000`

### On Phone/Other Devices:
- Remote access: `http://192.168.0.109:3000`

---

## 🐛 If It Doesn't Work

### Check Firewall:
```powershell
# Allow ports
netsh advfirewall firewall add rule name="FlowLink" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="FlowLink Signal" dir=in action=allow protocol=TCP localport=8080
```

### Check WiFi:
- All devices on same WiFi network?
- Phone not using mobile data?

### Restart Web Viewer:
```powershell
# In Terminal 3, press Ctrl+C, then:
npm run dev
```

---

**Ready? Start Terminal 1, 2, and 3, then access from any device!** 🚀

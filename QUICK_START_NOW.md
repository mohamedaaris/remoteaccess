# ⚡ QUICK START - 3 Minutes to Working Remote Access

## 🎯 The Fix

Fixed race condition in Web Viewer where offer arrived before listener was ready.

---

## 🚀 Run These Commands NOW

### 1. Stop Everything
Press `Ctrl+C` in all terminals. Close Desktop Agent window.

---

### 2. Rebuild (2 commands)

```powershell
# Rebuild Web Viewer (NEW FIX)
cd "C:\Users\ASUS\Documents\remote access\web-viewer"
npm run build

# Rebuild Desktop Agent
cd "C:\Users\ASUS\Documents\remote access\desktop-agent"
npm run build
```

---

### 3. Start Everything (3 terminals)

**Terminal 1:**
```powershell
cd "C:\Users\ASUS\Documents\remote access\signaling-server"
npm run dev
```
Wait for: "FlowLink Signaling Server running on port 8080"

---

**Terminal 2:**
```powershell
cd "C:\Users\ASUS\Documents\remote access\desktop-agent"
npm run dev
```
Click "Connect" in window that opens.

---

**Terminal 3:**
```powershell
cd "C:\Users\ASUS\Documents\remote access\web-viewer"
npm run dev
```
Wait for: "Network: http://192.168.0.109:3000/"

---

### 4. Test on Mobile

1. Open browser on phone
2. Go to: `http://192.168.0.109:3000`
3. Tap "Connect" on laptop device
4. Click "Accept" on laptop
5. **Screen appears in 5 seconds!** 🎉

---

## ✅ Success Signs

**Desktop Agent Console:**
```
✅ Peer connection created
✅ Got screen stream with 1 tracks
✅ Connection state: connected
```

**Mobile Browser:**
```
✅ Laptop screen visible
✅ Video updating in real-time
```

---

## 🐛 If Still Broken

### "RTCPeerConnection is not defined"
```powershell
cd desktop-agent
Remove-Item dist -Recurse -Force
npm run build
npm run dev
```

### "No screen sources available"
Run PowerShell as Administrator, then:
```powershell
cd "C:\Users\ASUS\Documents\remote access\desktop-agent"
npm run dev
```

### "Waiting for stream..." forever
Check Desktop Agent console for errors. If you see "Error setting up peer connection", grant screen recording permission and restart.

---

## 📖 Full Guide

See `FINAL_FIX_AND_TEST.md` for complete troubleshooting.

---

**Now go test it!** 🚀

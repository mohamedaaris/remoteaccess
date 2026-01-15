# FlowLink Quick Reference Card

## 🚀 Start Commands (Copy & Paste)

### Terminal 1: Signaling Server
```powershell
cd "C:\Users\ASUS\Documents\remote access\signaling-server"
npm run dev
```
✅ Look for: "FlowLink Signaling Server running on port 8080"

---

### Terminal 2: Desktop Agent
```powershell
cd "C:\Users\ASUS\Documents\remote access\desktop-agent"
npm run dev
```
✅ Window opens → Click "Connect" → Status shows "Connected"

---

### Terminal 3: Web Viewer
```powershell
cd "C:\Users\ASUS\Documents\remote access\web-viewer"
npm run dev
```
✅ Open browser: **http://localhost:3000**

---

## ✅ Success Checklist

- [ ] Signaling server shows "running on port 8080"
- [ ] Desktop agent window opens (not blank)
- [ ] Desktop agent shows "Connected" status
- [ ] Browser shows "● Connected" (green)
- [ ] Desktop device appears in browser list
- [ ] Click "Connect" → Permission dialog appears
- [ ] Click "Accept" → Desktop screen appears in browser! 🎉

---

## 🐛 Quick Fixes

### Desktop Agent Blank?
```powershell
cd desktop-agent
npm run build
npm start
```

### Web Viewer Not Loading?
```powershell
cd web-viewer
npm install
npm run dev
```

### No Devices Shown?
- Check Desktop Agent shows "Connected"
- Refresh browser page
- Disconnect/reconnect Desktop Agent

---

## 📱 Android Quick Setup

1. **Get your IP:** `ipconfig` (look for IPv4)
2. **Open Android Studio** → Open `android-agent` folder
3. **Edit MainActivity.kt:** Change `YOUR_SERVER_IP` to your IP
4. **Connect phone** via USB (enable USB debugging)
5. **Click Run** (green play button)
6. **On phone:** Tap "Connect"
7. **In browser:** Click "Connect" on Android device
8. **On phone:** Tap "Accept" → Grant permission
9. **See phone screen in browser!** 🎉

---

## 🔧 Enable Full Control (5 min)

```powershell
# Move project (no spaces in path)
cd C:\Users\ASUS\Documents
Move-Item "remote access" "flowlink"
cd flowlink\desktop-agent

# Rebuild
Remove-Item node_modules -Recurse -Force
npm install
npx @electron/rebuild

# Test
npm run dev
```

---

## 📚 Full Guides

- **[STEP_BY_STEP_EXECUTION.md](STEP_BY_STEP_EXECUTION.md)** ⭐ Complete guide
- **[ROBOTJS_FIX.md](ROBOTJS_FIX.md)** - Enable control
- **[START_HERE.md](START_HERE.md)** - Overview

---

## 🎯 What Works Now

✅ Screen streaming (you can see desktop in browser!)  
✅ Device discovery  
✅ Session management  
✅ Multiple devices  
⚠️ Control (needs robotjs fix - 5 min)

---

## 💡 Pro Tips

- Keep all 3 terminals open
- Check browser DevTools (F12) for errors
- Desktop Agent DevTools opens automatically
- Use Chrome/Edge for best results

---

**Ready? Start with Terminal 1!** 🚀

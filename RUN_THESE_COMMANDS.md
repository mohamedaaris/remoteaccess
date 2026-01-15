# 🎯 RUN THESE COMMANDS - Copy & Paste

## ⚡ Quick Fix (Copy all at once)

### Stop Everything First
Press `Ctrl+C` in all terminals. Close Desktop Agent window.

---

## 🔨 Rebuild Commands

**Copy and paste these one by one:**

```powershell
cd "C:\Users\ASUS\Documents\remote access\web-viewer"
npm run build
```

```powershell
cd "C:\Users\ASUS\Documents\remote access\desktop-agent"
npm run build
```

✅ **Both should complete without errors**

---

## 🚀 Start Commands (3 Terminals)

### Terminal 1: Signaling Server

```powershell
cd "C:\Users\ASUS\Documents\remote access\signaling-server"
npm run dev
```

**Wait for:** `FlowLink Signaling Server running on port 8080`

---

### Terminal 2: Desktop Agent

```powershell
cd "C:\Users\ASUS\Documents\remote access\desktop-agent"
npm run dev
```

**Then:** Click "Connect" button in window

---

### Terminal 3: Web Viewer

```powershell
cd "C:\Users\ASUS\Documents\remote access\web-viewer"
npm run dev
```

**Wait for:** `Network: http://192.168.0.109:3000/`

---

## 📱 Mobile Test

1. Open browser on phone
2. Go to: `http://192.168.0.109:3000`
3. Tap "Connect" on laptop device
4. Click "Accept" on laptop
5. **Screen appears!** 🎉

---

## 🐛 If Broken

### Clean Rebuild

```powershell
cd "C:\Users\ASUS\Documents\remote access\desktop-agent"
Remove-Item dist -Recurse -Force
npm run build
npm run dev
```

### Run as Administrator

Right-click PowerShell → Run as Administrator

```powershell
cd "C:\Users\ASUS\Documents\remote access\desktop-agent"
npm run dev
```

---

## ✅ Success = Laptop Screen on Mobile

**That's it!** 🚀

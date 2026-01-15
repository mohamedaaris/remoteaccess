# FlowLink Quick Test - 3 Minutes

## Terminal 1: Signaling Server
```bash
cd signaling-server
npm run dev
```
✅ Look for: "FlowLink Signaling Server running on port 8080"

---

## Terminal 2: Desktop Agent
```bash
cd desktop-agent
npm run dev
```
✅ Look for: Electron window opens with UI
✅ Click "Connect" button
✅ Status shows "Connected (ID: ...)"

---

## Terminal 3: Web Viewer
```bash
cd web-viewer
npm run dev
```
✅ Open browser: http://localhost:3000
✅ Look for: Desktop device in list
✅ Click "Connect" on device

---

## Desktop Agent Window
✅ Permission dialog appears
✅ Click "Accept"

---

## Browser Window
✅ Desktop screen appears
✅ Move mouse → desktop cursor moves
✅ Click → desktop responds
✅ Type → text appears on desktop

---

## Success! 🎉

You now have working remote access!

**Next:** See [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive testing.

# Fixing robotjs for Electron

## The Problem

You're getting this error:
```
The module 'robotjs.node' was compiled against a different Node.js version
```

This happens because:
1. **robotjs** is a native module that needs to be compiled for Electron
2. Your project path has a **space** in it: `"remote access"`
3. Node-gyp (the build tool) has issues with spaces in paths

## Quick Solution: Move Your Project

The easiest fix is to move your project to a path without spaces:

### Option 1: Move to Documents Root (Recommended)

```powershell
# Close all terminals and Electron windows first!

# Move the project
cd C:\Users\ASUS\Documents
Move-Item "remote access" "flowlink"

# Now work from the new location
cd flowlink
```

### Option 2: Move to a Simple Path

```powershell
# Create a simple path
mkdir C:\Projects
cd C:\Users\ASUS\Documents
Move-Item "remote access" C:\Projects\flowlink

# Work from there
cd C:\Projects\flowlink
```

## After Moving: Rebuild robotjs

Once you've moved to a path without spaces:

```powershell
# Go to desktop-agent
cd desktop-agent

# Clean install
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force

# Reinstall
npm install

# Rebuild for Electron
npx electron-rebuild
```

## Alternative: Test Without robotjs (Current Setup)

I've configured the app to work WITHOUT robotjs for now:
- ✅ Screen sharing works
- ✅ Viewing works
- ❌ Remote control (mouse/keyboard) won't work
- ℹ️ Control events are logged to console

### To Test Without Control:

```powershell
cd desktop-agent
npm run dev
```

You can:
- ✅ Connect to signaling server
- ✅ Accept session requests
- ✅ Stream your screen
- ✅ See control events in console (but they won't actually control)

## Full Fix Steps (Recommended)

### Step 1: Close Everything

Close all:
- Terminal windows
- Electron windows
- VS Code (if open)

### Step 2: Move Project

```powershell
# In PowerShell
cd C:\Users\ASUS\Documents
Move-Item "remote access" "flowlink"
cd flowlink
```

### Step 3: Clean and Rebuild

```powershell
# Signaling server
cd signaling-server
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
npm install

# Desktop agent
cd ..\desktop-agent
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
npm install

# Rebuild robotjs for Electron
npx @electron/rebuild

# Web viewer
cd ..\web-viewer
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
npm install
```

### Step 4: Test

```powershell
# Terminal 1: Signaling server
cd signaling-server
npm run dev

# Terminal 2: Desktop agent
cd desktop-agent
npm run dev

# Terminal 3: Web viewer
cd web-viewer
npm run dev
```

## Verify robotjs is Working

When you start the desktop agent, check the console:

**✅ Success:**
```
✓ robotjs loaded successfully
```

**⚠ Still using mock:**
```
⚠ robotjs not available, using mock handler
```

## Alternative Solutions

### Solution 1: Use Different Control Library

Replace robotjs with a different library:
- **nut-js**: Modern alternative to robotjs
- **@nut-tree/nut-js**: TypeScript-first automation

### Solution 2: Use Windows API Directly

For Windows only, use native Windows APIs:
- **ffi-napi**: Call Windows DLL functions
- **node-windows**: Windows-specific automation

### Solution 3: Remote Desktop Protocol

Use existing RDP/VNC libraries instead of custom control.

## Testing Without Full Control

You can still test most features:

### What Works:
- ✅ Device discovery
- ✅ Session management
- ✅ Screen streaming
- ✅ Video quality
- ✅ Connection stability
- ✅ Multiple devices
- ✅ Permission system

### What Doesn't Work:
- ❌ Mouse control
- ❌ Keyboard control
- ❌ Scroll control

### How to Test:

1. **Start all components**
2. **Connect from web viewer**
3. **Accept session**
4. **See your screen streaming** ✅
5. **Try to control** (won't work, but events logged)
6. **Check console** to see control events received

## Recommended Path Forward

### For Testing (Now):
1. Use current setup with mock handler
2. Test screen streaming and video quality
3. Test session management
4. Test multiple devices

### For Production (Later):
1. Move project to path without spaces
2. Rebuild robotjs properly
3. Test full control functionality
4. Deploy

## Common Issues

### Issue: "Cannot find module 'smart-buffer'"

**Fix:**
```powershell
cd desktop-agent
npm install smart-buffer
```

### Issue: "node-gyp not found"

**Fix:**
```powershell
npm install -g node-gyp
npm install -g windows-build-tools  # Windows only
```

### Issue: "Python not found"

**Fix:**
1. Install Python 3.x from python.org
2. Add to PATH
3. Restart terminal

### Issue: Still getting errors after moving

**Fix:**
```powershell
# Nuclear option - complete clean
cd desktop-agent
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
Remove-Item -Recurse -Force $env:USERPROFILE\.electron-gyp
Remove-Item -Recurse -Force $env:USERPROFILE\.node-gyp

npm cache clean --force
npm install
npx @electron/rebuild
```

## Quick Reference

### Move Project (No Spaces)
```powershell
cd C:\Users\ASUS\Documents
Move-Item "remote access" "flowlink"
cd flowlink
```

### Rebuild robotjs
```powershell
cd desktop-agent
npx @electron/rebuild
```

### Test Without Control
```powershell
# Just run as-is, control won't work but streaming will
npm run dev
```

### Check if robotjs Works
Look for this in console when starting:
- ✅ `✓ robotjs loaded successfully`
- ⚠ `⚠ robotjs not available, using mock handler`

## Need Help?

1. **Check console output** for specific errors
2. **Verify path has no spaces**: `pwd` should show no spaces
3. **Check Node version**: `node --version` (should be 18+)
4. **Check Electron version**: `npx electron --version`
5. **Try clean install**: Delete node_modules and reinstall

## Summary

**Immediate Solution:** App works now for screen sharing (no control)

**Permanent Solution:** Move project to path without spaces, rebuild robotjs

**Best Practice:** Always use paths without spaces for Node.js projects!

---

**Current Status:** ✅ App runs, screen sharing works, control is mocked  
**To Enable Control:** Move project, rebuild robotjs  
**Time Required:** 5-10 minutes

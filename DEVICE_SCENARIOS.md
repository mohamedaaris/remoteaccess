# FlowLink Device Scenarios - Visual Guide

## 🎯 Understanding What You're Seeing

### When Testing on ONE Computer:

```
┌─────────────────────────────────────────────────┐
│         YOUR COMPUTER                           │
│                                                 │
│  ┌──────────────┐      ┌──────────────┐       │
│  │ Desktop Agent│      │ Web Viewer   │       │
│  │  (Electron)  │      │  (Browser)   │       │
│  │              │      │              │       │
│  │ "DESKTOP-PC" │      │ "Web Viewer" │       │
│  │ Can be       │      │ Controller   │       │
│  │ controlled   │      │ only         │       │
│  └──────┬───────┘      └──────┬───────┘       │
│         │                     │                │
│         └──────────┬──────────┘                │
│                    │                           │
└────────────────────┼───────────────────────────┘
                     │
              ┌──────▼──────┐
              │  Signaling  │
              │   Server    │
              └─────────────┘
```

**What you see in browser:**
```
Available Devices:
┌─────────────────────────────┐
│ DESKTOP-PC                  │ ← Connect to THIS one
│ desktop • Windows 11        │   (Your actual desktop)
│                   [Connect] │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Web Viewer                  │ ← Don't connect to this
│ desktop • web               │   (Just the browser tab)
│                   [Connect] │
└─────────────────────────────┘
```

**Which to connect to?** → **DESKTOP-PC** (or your computer name)

---

## 📱 Scenario 1: Control Laptop from Phone

### Setup:
```
┌─────────────────┐                    ┌─────────────────┐
│   YOUR LAPTOP   │                    │   YOUR PHONE    │
│                 │                    │                 │
│ ┌─────────────┐ │                    │ ┌─────────────┐ │
│ │Desktop Agent│ │                    │ │   Browser   │ │
│ │  (Shares    │ │                    │ │  (Chrome/   │ │
│ │   screen)   │ │                    │ │   Safari)   │ │
│ └──────┬──────┘ │                    │ └──────┬──────┘ │
│        │        │                    │        │        │
│ ┌──────▼──────┐ │                    │        │        │
│ │  Signaling  │ │                    │        │        │
│ │   Server    │◄┼────────WiFi────────┼────────┘        │
│ └─────────────┘ │                    │                 │
│                 │                    │  You see laptop │
│                 │                    │  screen here!   │
└─────────────────┘                    └─────────────────┘
```

### Steps:
1. **Laptop:** Start Desktop Agent + Signaling Server
2. **Laptop:** Find IP: `ipconfig` → `192.168.1.100`
3. **Phone:** Open browser → `http://192.168.1.100:3000`
4. **Phone:** See laptop in list → Tap "Connect"
5. **Laptop:** Click "Accept"
6. **Phone:** Control laptop! 🎉

### What You Can Do:
- ✅ See laptop screen on phone
- ✅ Move mouse (tap and drag)
- ✅ Type (phone keyboard)
- ✅ Open apps
- ✅ Full control

---

## 📱 Scenario 2: View Phone on Laptop

### Setup:
```
┌─────────────────┐                    ┌─────────────────┐
│   YOUR LAPTOP   │                    │   YOUR PHONE    │
│                 │                    │                 │
│ ┌─────────────┐ │                    │ ┌─────────────┐ │
│ │   Browser   │ │                    │ │Android Agent│ │
│ │  (Viewer)   │ │                    │ │  (Shares    │ │
│ └──────┬──────┘ │                    │ │   screen)   │ │
│        │        │                    │ └──────┬──────┘ │
│ ┌──────▼──────┐ │                    │        │        │
│ │  Signaling  │◄┼────────WiFi────────┼────────┘        │
│ │   Server    │ │                    │                 │
│ └─────────────┘ │                    │                 │
│                 │                    │                 │
│  You see phone  │                    │                 │
│  screen here!   │                    │                 │
└─────────────────┘                    └─────────────────┘
```

### Steps:
1. **Laptop:** Start Signaling Server + Web Viewer
2. **Laptop:** Find IP: `ipconfig` → `192.168.1.100`
3. **Phone:** Install Android app with laptop IP
4. **Phone:** Open app → Tap "Connect"
5. **Laptop:** See phone in list → Click "Connect"
6. **Phone:** Accept + Grant permission
7. **Laptop:** See phone screen! 🎉

### What You Can Do:
- ✅ See phone screen on big screen
- ✅ Demo apps
- ✅ Record phone screen
- ⚠️ Control not implemented yet

---

## 💻 Scenario 3: Laptop to Laptop

### Setup:
```
┌─────────────────┐                    ┌─────────────────┐
│   LAPTOP A      │                    │   LAPTOP B      │
│   (Home)        │                    │   (Work)        │
│                 │                    │                 │
│ ┌─────────────┐ │                    │ ┌─────────────┐ │
│ │Desktop Agent│ │                    │ │   Browser   │ │
│ │  (Shares    │ │                    │ │  (Viewer)   │ │
│ │   screen)   │ │                    │ └──────┬──────┘ │
│ └──────┬──────┘ │                    │        │        │
│        │        │                    │        │        │
│        └────────┼────────Internet────┼────────┘        │
│                 │                    │                 │
│                 │                    │  Control home   │
│                 │                    │  laptop from    │
│                 │                    │  work!          │
└─────────────────┘                    └─────────────────┘
         │
    ┌────▼────┐
    │Signaling│
    │ Server  │
    │ (Cloud) │
    └─────────┘
```

### Steps:
1. **Laptop A:** Start Desktop Agent
2. **Laptop B:** Open browser to signaling server
3. **Laptop B:** Click "Connect" on Laptop A
4. **Laptop A:** Click "Accept"
5. **Laptop B:** Control Laptop A! 🎉

---

## 🎯 Quick Decision Guide

### I want to...

#### "Control my laptop while sitting on the couch"
→ **Scenario 1:** Laptop (Desktop Agent) + Phone (Browser)
- Start Desktop Agent on laptop
- Open phone browser to laptop IP
- Control laptop from phone

#### "Show my phone screen during a presentation"
→ **Scenario 2:** Phone (Android Agent) + Laptop (Browser)
- Install Android app on phone
- Connect phone to laptop's server
- Display phone screen on laptop

#### "Access my home computer from work"
→ **Scenario 3:** Home Laptop (Desktop Agent) + Work Laptop (Browser)
- Desktop Agent on home laptop
- Browser on work laptop
- Control home from work

#### "Help a friend with their computer"
→ **Scenario 3:** Friend's Laptop (Desktop Agent) + Your Laptop (Browser)
- Friend runs Desktop Agent
- You connect via browser
- Control their computer remotely

---

## 🔍 Understanding the Device List

### What Each Device Type Means:

```
┌─────────────────────────────┐
│ DESKTOP-ABC                 │ ← Desktop Agent (Electron)
│ desktop • Windows 11        │   Can be controlled
│                   [Connect] │   Shows actual desktop
└─────────────────────────────┘

┌─────────────────────────────┐
│ Web Viewer                  │ ← Web Viewer (Browser)
│ desktop • web               │   Controller only
│                   [Connect] │   Don't connect to this
└─────────────────────────────┘

┌─────────────────────────────┐
│ Samsung Galaxy S21          │ ← Android Agent
│ mobile • Android 12         │   Can be viewed
│                   [Connect] │   Shows phone screen
└─────────────────────────────┘
```

### Which Ones Can You Control?

- ✅ **Desktop Agent** (desktop • Windows/Mac/Linux) - Full control
- ❌ **Web Viewer** (desktop • web) - Don't connect (it's just the viewer)
- ✅ **Android Agent** (mobile • Android) - View only (no control yet)

---

## 💡 Pro Tips

### For Same-Device Testing:
- You'll see both Desktop Agent and Web Viewer
- Connect to Desktop Agent to test
- Ignore Web Viewer in the list
- This is normal and expected

### For Real Use:
- Use different devices
- Desktop Agent on device to be controlled
- Web Viewer on device doing the controlling
- Much clearer which device is which

### For Multiple Devices:
- Give devices descriptive names
- Edit device name in code before connecting
- Example: "Living Room PC", "Work Laptop", "My Phone"

---

## 📊 Comparison Table

| Scenario | Host Device | Viewer Device | Use Case |
|----------|-------------|---------------|----------|
| Laptop → Phone | Laptop (Desktop Agent) | Phone (Browser) | Control laptop from couch |
| Phone → Laptop | Phone (Android Agent) | Laptop (Browser) | Demo phone apps |
| Laptop → Laptop | Laptop A (Desktop Agent) | Laptop B (Browser) | Remote work |
| Same Device | Desktop Agent | Web Viewer | Testing only |

---

## 🎯 Recommended Setup for You

Based on your question, here's what I recommend:

### For Testing (Now):
```
Same Computer:
- Desktop Agent (shows as "DESKTOP-XXX")
- Web Viewer (shows as "Web Viewer")
→ Connect to "DESKTOP-XXX" to test
```

### For Real Use (Later):
```
Setup 1: Control laptop from phone
- Laptop: Desktop Agent + Signaling Server
- Phone: Browser to laptop IP
→ Most useful for daily use

Setup 2: View phone on laptop
- Phone: Android Agent
- Laptop: Browser + Signaling Server
→ Great for demos and presentations
```

---

## ✅ Quick Checklist

### To Control Laptop from Phone:
- [ ] Laptop: Desktop Agent running
- [ ] Laptop: Signaling Server running
- [ ] Laptop: Found IP address (`ipconfig`)
- [ ] Phone: On same WiFi
- [ ] Phone: Browser open to `http://LAPTOP_IP:3000`
- [ ] Phone: Can see laptop in device list
- [ ] Phone: Tap "Connect" → Laptop: Click "Accept"
- [ ] Phone: Can see and control laptop screen

### To View Phone on Laptop:
- [ ] Laptop: Signaling Server running
- [ ] Laptop: Web Viewer running
- [ ] Laptop: Found IP address
- [ ] Phone: Android app built with laptop IP
- [ ] Phone: App installed and running
- [ ] Phone: Tap "Connect" in app
- [ ] Laptop: Can see phone in device list
- [ ] Laptop: Click "Connect" → Phone: Accept
- [ ] Laptop: Can see phone screen

---

**Need more help?** See [MOBILE_ACCESS_GUIDE.md](MOBILE_ACCESS_GUIDE.md) for detailed instructions!

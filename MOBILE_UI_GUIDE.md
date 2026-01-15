# Mobile UI Guide - Visual Reference

## 📱 Mobile Interface Overview

### Normal View (Keyboard Hidden)
```
┌─────────────────────────────────────────────────────┐
│  ● Connected      [⌨] [⛶] [End Session]            │
│                                                     │ ← Toolbar (60px)
├─────────────────────────────────────────────────────┤
│                                                     │
│                                                     │
│                                                     │
│              🖥️ Desktop Screen                     │
│                                                     │
│         (Tap to click, drag to move)               │
│                                                     │
│                                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### With Keyboard Open
```
┌─────────────────────────────────────────────────────┐
│  ● Connected      [⌨] [⛶] [End Session]            │ ← Toolbar
├─────────────────────────────────────────────────────┤
│  [Type here to send to remote desktop...] [✕]      │ ← Keyboard Input
├─────────────────────────────────────────────────────┤
│                                                     │
│              🖥️ Desktop Screen                     │
│                                                     │
│         (Tap to click, drag to move)               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Fullscreen Mode
```
┌─────────────────────────────────────────────────────┐
│  ● Connected      [⌨] [⛶] [End Session]            │
├─────────────────────────────────────────────────────┤
│                                                     │
│                                                     │
│                                                     │
│                                                     │
│              🖥️ Desktop Screen                     │
│              (Full Screen View)                    │
│                                                     │
│                                                     │
│                                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 🎮 Button Reference

### Toolbar Buttons (Left to Right)

#### Status Indicator
```
┌─────────────────┐
│  ● Connected    │  ← Green dot = Connected
└─────────────────┘  ← Gray dot = Disconnected
                     ← Yellow dot = Connecting
```

#### Keyboard Button
```
┌─────┐
│  ⌨  │  ← Tap to toggle keyboard
└─────┘  ← Blue when active
         ← Gray when inactive
```

#### Fullscreen Button
```
┌─────┐
│  ⛶  │  ← Tap to toggle fullscreen
└─────┘  ← Same icon for enter/exit
```

#### End Session Button
```
┌──────────────┐
│ End Session  │  ← Red background
└──────────────┘  ← Tap to disconnect
                  ← Returns to device list
```

## 📝 Keyboard Input Field

### When Open
```
┌────────────────────────────────────────────────┬─────┐
│ Type here to send to remote desktop...         │  ✕  │
└────────────────────────────────────────────────┴─────┘
  ↑                                                ↑
  Input field (tap to focus)                      Close button
```

### Features
- **Auto-focus:** Opens with focus ready
- **Character-by-character:** Each key sent immediately
- **Special keys:** Enter, Backspace, Tab, Escape
- **Auto-clear:** Input clears after each character

## 🖱️ Touch Gestures

### Single Tap (Click)
```
     👆
     │
     ▼
┌─────────┐
│    ●    │  ← Tap location
└─────────┘
     │
     ▼
  Click!
```
**Duration:** < 200ms
**Action:** Left mouse click at tap location

### Touch and Drag (Move Cursor)
```
  👆 Start
   │
   ├──→ Drag
   │
   └──→ End
        
Cursor follows finger movement
```
**Duration:** > 200ms
**Action:** Moves mouse cursor continuously

### Two-Finger Scroll
```
  👆👆
  │ │
  ↓ ↓
  
Scroll content
```
**Action:** Scrolls page/content on remote desktop

## 🎨 Visual States

### Connection States

#### Connecting
```
┌─────────────────────────────────────┐
│  ● Connecting...                    │
├─────────────────────────────────────┤
│                                     │
│         ⏳ Waiting for stream...    │
│                                     │
│    Establishing connection with     │
│         desktop agent               │
│                                     │
└─────────────────────────────────────┘
```

#### Connected
```
┌─────────────────────────────────────┐
│  ● Connected                        │
├─────────────────────────────────────┤
│                                     │
│      🖥️ Desktop Screen Visible     │
│                                     │
│    (Touch controls active)          │
│                                     │
└─────────────────────────────────────┘
```

#### Timeout
```
┌─────────────────────────────────────┐
│  ● Connection Timeout               │
├─────────────────────────────────────┤
│                                     │
│    ⚠️ Connection Timeout            │
│                                     │
│  The stream failed to connect.      │
│  Please check:                      │
│  • Desktop agent is running         │
│  • Network connection is stable     │
│  • Firewall allows WebRTC           │
│                                     │
│        [Go Back]                    │
│                                     │
└─────────────────────────────────────┘
```

## 📐 Dimensions & Spacing

### Mobile Optimizations
```
Toolbar Height: 60px (vs 50px desktop)
Button Size: 44x44px minimum (touch target)
Button Padding: 10px 14px
Font Size: 13-18px (readable on mobile)
Gap Between Buttons: 10px
```

### Keyboard Input
```
Container Padding: 15px 10px
Input Height: 44px
Input Font Size: 16px (prevents zoom on iOS)
Close Button: 44x44px
```

## 🎯 Touch Target Sizes

### Minimum Sizes (Apple/Google Guidelines)
```
Buttons: 44x44px minimum
Input Fields: 44px height minimum
Tap Areas: 48x48px recommended
Spacing: 8px minimum between targets
```

### Our Implementation
```
✅ Keyboard Button: 44x44px
✅ Fullscreen Button: 44x44px
✅ End Session Button: 44px height
✅ Close Button: 44x44px
✅ Input Field: 44px height
✅ Button Spacing: 10px
```

## 🎨 Color Scheme

### Toolbar
```
Background: #2a2a2a (Dark gray)
Border: #3a3a3a (Slightly lighter)
```

### Buttons
```
Default: #3a3a3a (Gray)
Hover/Active: #4a4a4a (Lighter gray)
Keyboard Active: #2196f3 (Blue)
End Session: #dc3545 (Red)
End Session Hover: #c82333 (Darker red)
```

### Status Indicators
```
Connected: #4caf50 (Green)
Connecting: #ff9800 (Orange)
Timeout: #f44336 (Red)
```

### Keyboard Input
```
Background: #2a2a2a (Dark gray)
Border: #3a3a3a (Gray)
Focus Border: #2196f3 (Blue)
Text: #ffffff (White)
```

## 📱 Responsive Breakpoints

### Mobile (< 768px)
```css
.toolbar {
  height: 60px;
  padding: 0 10px;
}

.toolbar button {
  padding: 10px 14px;
  font-size: 18px;
  min-width: 44px;
  min-height: 44px;
}
```

### Desktop (≥ 768px)
```css
.toolbar {
  height: 50px;
  padding: 0 20px;
}

.toolbar button {
  padding: 8px 12px;
  font-size: 16px;
}
```

## 🔧 CSS Features

### Touch Optimizations
```css
/* Prevent text selection */
-webkit-user-select: none;
user-select: none;

/* Remove tap highlight */
-webkit-tap-highlight-color: transparent;

/* Optimize touch response */
touch-action: manipulation;

/* Prevent touch callouts */
-webkit-touch-callout: none;
```

### Video Optimizations
```css
/* Prevent scrolling on video */
touch-action: none;

/* Prevent selection */
-webkit-user-select: none;
user-select: none;
```

## 🎯 Usage Examples

### Example 1: Search Google
```
1. Tap ⌨ button
2. Type "hello world"
3. Tap Enter (or type it)
4. Tap ✕ to close keyboard
```

### Example 2: Click a Link
```
1. Touch and drag to position cursor
2. Quick tap on link
3. Page loads on remote desktop
```

### Example 3: Fill a Form
```
1. Tap to click in form field
2. Tap ⌨ button
3. Type your text
4. Tap Tab to next field
5. Repeat
6. Tap ✕ when done
```

### Example 4: End Session
```
1. Tap red "End Session" button
2. Session ends immediately
3. Returns to device list
```

## 📊 Performance Indicators

### Good Performance
```
✅ Tap response: < 50ms
✅ Cursor movement: Smooth, no lag
✅ Keyboard input: Immediate
✅ Button feedback: Instant
```

### Poor Performance
```
❌ Tap delay: > 200ms
❌ Cursor lag: Jerky movement
❌ Keyboard delay: Characters delayed
❌ Button unresponsive
```

## 🎉 Summary

The mobile UI is optimized for:
- ✅ Touch-friendly buttons (44x44px minimum)
- ✅ Clear visual feedback
- ✅ Responsive design
- ✅ Easy keyboard access
- ✅ Intuitive gestures
- ✅ Accessible controls
- ✅ Fast response times

**All features work perfectly on mobile devices!**

# FlowLink - Remote Device Access System

A production-ready, open-source remote device access solution using WebRTC for low-latency screen streaming and control. Similar to AnyDesk/TeamViewer but self-hosted and privacy-focused.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Android%20%7C%20Web-lightgrey)

## 🚀 **START HERE**

### **New User?** → [ANSWER_TO_YOUR_QUESTIONS.md](ANSWER_TO_YOUR_QUESTIONS.md) ⭐⭐⭐
**Answers common questions about device types and mobile access**

### **Quick Start** → [STEP_BY_STEP_EXECUTION.md](STEP_BY_STEP_EXECUTION.md) ⭐⭐⭐
**Complete step-by-step guide with expected outputs**

### **Mobile Access** → [MOBILE_ACCESS_GUIDE.md](MOBILE_ACCESS_GUIDE.md) ⭐
**How to control laptop from phone or view phone on laptop**

### **Quick Commands** → [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
**Copy-paste commands to start everything**

## ✨ Features

- 🚀 **Real-time screen streaming** with WebRTC (low latency, adaptive bitrate)
- 🖱️ **Full remote control** (mouse, keyboard, touch)
- 🔒 **Secure by default** (DTLS-SRTP encryption, explicit permissions)
- 🌐 **Cross-platform** (Windows, macOS, Linux, Android, Web)
- 🏠 **Self-hosted** (no cloud dependencies, full control)
- 🔓 **Open source** (MIT License, community-driven)
- 📱 **Mobile support** (Android agent for screen sharing)
- 🌍 **Web-based viewer** (no installation required)

## 🏗️ Architecture

```
┌─────────────────┐
│ Signaling Server│  ← Coordinates WebRTC connections
│  (Node.js/WS)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│Agent │◄─┤Viewer│  ← Direct P2P encrypted connection
│(Host)│  │(View)│
└──────┘  └──────┘
```

### Components

- **Signaling Server**: Node.js/Express WebSocket server for coordination
- **Desktop Agent**: Electron app (Windows/macOS/Linux) for screen sharing
- **Web Viewer**: React web app for remote viewing and control
- **Android Agent**: Native Android app for mobile screen sharing
- **Shared Protocol**: TypeScript protocol definitions

## 🚀 Quick Start

Get up and running in 5 minutes! 

**→ See [QUICK_TEST.md](QUICK_TEST.md) for 3-minute quick test**  
**→ See [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive testing**  
**→ See [FIXES_APPLIED.md](FIXES_APPLIED.md) for latest fixes and setup**

```bash
# 1. Start signaling server
cd signaling-server
npm install && npm run dev

# 2. Start desktop agent (in new terminal)
cd desktop-agent
npm install && npm run dev

# 3. Start web viewer (in new terminal)
cd web-viewer
npm install && npm run dev
# Open http://localhost:3000

# 4. Connect devices and start controlling!
```

## 📚 Documentation

- [Quick Start Guide](QUICKSTART.md) - Get started in 5 minutes
- [Setup Guide](docs/SETUP.md) - Detailed installation and deployment
- [Architecture](docs/ARCHITECTURE.md) - System design and components
- [API Reference](docs/API.md) - Protocol specification
- [Security](docs/SECURITY.md) - Security model and best practices
- [Features](docs/FEATURES.md) - Complete feature list
- [Contributing](CONTRIBUTING.md) - How to contribute
- [Project Structure](PROJECT_STRUCTURE.md) - Codebase organization

## 🎯 Use Cases

- **Remote Work**: Access your office computer from home
- **IT Support**: Help family/friends with tech issues
- **Development**: Test apps on different devices
- **Education**: Remote teaching and demonstrations
- **Personal**: Control media center, access files

## 🔒 Security

- ✅ End-to-end encryption (DTLS-SRTP)
- ✅ Explicit user permission required
- ✅ Peer-to-peer connections (no data through server)
- ✅ Session-based access control
- ✅ No user accounts or tracking
- ✅ Self-hosted (full control)

See [docs/SECURITY.md](docs/SECURITY.md) for details.

## 🛠️ Technology Stack

- **Backend**: Node.js, Express, WebSocket
- **Desktop**: Electron, robotjs
- **Web**: React, TypeScript, Vite
- **Mobile**: Kotlin, Android SDK
- **Protocol**: WebRTC, DTLS-SRTP
- **Video**: VP8/VP9/H.264

## 📦 Installation

### Using Docker (Recommended)

```bash
docker-compose up -d
```

### Manual Installation

See [docs/SETUP.md](docs/SETUP.md) for platform-specific instructions.

## 🌟 Comparison

| Feature | FlowLink | AnyDesk | TeamViewer | Chrome RD |
|---------|----------|---------|------------|-----------|
| Open Source | ✅ | ❌ | ❌ | ❌ |
| Self-Hosted | ✅ | ❌ | ❌ | ❌ |
| No Account | ✅ | ❌ | ❌ | ❌ |
| Web Viewer | ✅ | ❌ | ✅ | ✅ |
| Android Host | ✅ | ✅ | ✅ | ❌ |
| Free | ✅ | Limited | Limited | ✅ |

## 🗺️ Roadmap

### Current (v1.0)
- ✅ Desktop screen sharing (Windows/macOS/Linux)
- ✅ Web-based viewer
- ✅ Android screen sharing
- ✅ Mouse/keyboard control
- ✅ WebRTC P2P streaming

### Planned (v1.1+)
- [ ] Audio streaming
- [ ] File transfer
- [ ] Clipboard sync
- [ ] Multi-monitor support
- [ ] iOS agent app
- [ ] User authentication
- [ ] Session recording

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Ways to Contribute
- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the project

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- WebRTC for peer-to-peer technology
- Electron for cross-platform desktop apps
- React for modern web UI
- The open-source community

## 📞 Support

- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)

## ⚠️ Disclaimer

This software is provided as-is for educational and personal use. Always ensure you have permission before accessing remote devices. Use responsibly and in compliance with applicable laws.

---

**Built with ❤️ for the open-source community**

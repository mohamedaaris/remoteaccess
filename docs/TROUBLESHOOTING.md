# FlowLink Troubleshooting Guide

Common issues and solutions for FlowLink.

## Connection Issues

### Cannot Connect to Signaling Server

**Symptoms**: "Disconnected" status, connection timeout

**Solutions**:
1. Verify server is running:
   ```bash
   curl http://localhost:8080/health
   ```
2. Check firewall settings
3. Verify correct server URL
4. Check server logs for errors
5. Try different port if 8080 is in use

### Devices Not Appearing in List

**Symptoms**: Empty device list, "No devices available"

**Solutions**:
1. Ensure all devices connected to same signaling server
2. Check device registration in server logs
3. Refresh the web viewer
4. Verify WebSocket connection is established
5. Check CORS settings if cross-origin

### WebRTC Connection Fails

**Symptoms**: Session starts but no video, "Waiting for stream..."

**Solutions**:
1. Check ICE candidate exchange in browser console
2. Verify STUN server accessibility
3. Try adding TURN server for strict NAT
4. Check firewall UDP ports
5. Review WebRTC internals: `chrome://webrtc-internals`

### Connection Drops Frequently

**Symptoms**: Intermittent disconnections, reconnection loops

**Solutions**:
1. Check network stability
2. Reduce video quality/frame rate
3. Verify sufficient bandwidth
4. Check for packet loss
5. Use wired connection instead of WiFi
6. Add TURN server for better reliability

## Video/Streaming Issues

### No Video Stream

**Symptoms**: Black screen, "Waiting for stream..."

**Solutions**:
1. **Desktop Agent**:
   - Grant screen recording permission
   - Restart agent after granting permission
   - Check Electron desktopCapturer API
   - Verify screen capture sources available

2. **Android Agent**:
   - Grant MediaProjection permission
   - Ensure not running on emulator
   - Check Android version (7.0+ required)
   - Restart app after permission grant

3. **Web Viewer**:
   - Check browser WebRTC support
   - Enable hardware acceleration
   - Try different browser
   - Check video element in DevTools

### Poor Video Quality

**Symptoms**: Blurry, pixelated, low frame rate

**Solutions**:
1. Check network bandwidth
2. Reduce resolution in capture settings
3. Lower frame rate
4. Enable hardware acceleration
5. Close bandwidth-heavy applications
6. Use wired connection
7. Check CPU usage on host

### Video Lag/Latency

**Symptoms**: Delayed video, input lag

**Solutions**:
1. Check network latency (ping)
2. Reduce video quality
3. Close other network applications
4. Use local network instead of internet
5. Enable hardware encoding/decoding
6. Check CPU usage
7. Reduce screen resolution

### Video Freezes

**Symptoms**: Video stops updating, frozen frame

**Solutions**:
1. Check network connection
2. Review packet loss
3. Check CPU usage
4. Verify WebRTC connection state
5. Check browser/app memory usage
6. Restart session

## Control Issues

### Mouse Control Not Working

**Symptoms**: Mouse movements don't affect remote device

**Solutions**:
1. **Desktop Agent**:
   - Grant accessibility permission (macOS)
   - Run as administrator (Windows)
   - Install X11 libraries (Linux)
   - Verify robotjs installation
   - Check control event logs

2. **Permissions**:
   - macOS: System Preferences → Security & Privacy → Accessibility
   - Windows: Run as Administrator
   - Linux: May need sudo or X11 permissions

3. **DataChannel**:
   - Verify DataChannel is open
   - Check browser console for errors
   - Ensure session is active

### Keyboard Input Not Working

**Symptoms**: Typing doesn't affect remote device

**Solutions**:
1. Same permission checks as mouse control
2. Verify keyboard focus in viewer
3. Check for key mapping issues
4. Test with simple keys first
5. Review control event transmission
6. Check robotjs key mapping

### Control Events Delayed

**Symptoms**: Slow response to input

**Solutions**:
1. Check network latency
2. Reduce control event rate
3. Verify DataChannel state
4. Check CPU usage
5. Reduce video quality to free bandwidth

### Scroll Not Working

**Symptoms**: Mouse wheel doesn't scroll

**Solutions**:
1. Check scroll event capture
2. Verify scroll delta values
3. Test with different scroll speeds
4. Check robotjs scroll implementation
5. Try different scroll directions

## Platform-Specific Issues

### macOS

#### Screen Recording Permission Denied

**Solution**:
```
System Preferences → Security & Privacy → Privacy → Screen Recording
→ Add FlowLink Agent → Restart app
```

#### Accessibility Permission Denied

**Solution**:
```
System Preferences → Security & Privacy → Privacy → Accessibility
→ Add FlowLink Agent → Restart app
```

#### "App is damaged" Error

**Solution**:
```bash
xattr -cr /Applications/FlowLink\ Agent.app
```

### Windows

#### "Windows protected your PC" Warning

**Solution**:
- Click "More info" → "Run anyway"
- Or sign the application with code signing certificate

#### Mouse/Keyboard Control Fails

**Solution**:
- Run as Administrator
- Check Windows Defender settings
- Verify robotjs installation

#### Firewall Blocks Connection

**Solution**:
```
Windows Defender Firewall → Allow an app
→ Add FlowLink Agent → Allow private and public
```

### Linux

#### robotjs Installation Fails

**Solution**:
```bash
sudo apt-get install libx11-dev libxtst-dev libpng-dev
npm install robotjs
```

#### Screen Capture Not Working

**Solution**:
- Wayland: May need to switch to X11
- Check display server: `echo $XDG_SESSION_TYPE`
- Grant screen capture permissions

#### Permission Denied Errors

**Solution**:
```bash
# May need to run with sudo or add user to input group
sudo usermod -a -G input $USER
```

### Android

#### Screen Capture Permission Denied

**Solution**:
1. Uninstall and reinstall app
2. Grant permission when prompted
3. Check Android version (7.0+ required)
4. Ensure not running on emulator

#### App Crashes on Start

**Solution**:
1. Check Android version compatibility
2. Review logcat for errors: `adb logcat`
3. Verify all dependencies installed
4. Clear app data and cache

#### Battery Optimization Kills Service

**Solution**:
```
Settings → Apps → FlowLink Agent → Battery
→ Don't optimize
```

#### Connection Fails on Mobile Network

**Solution**:
- Use WiFi instead
- Configure TURN server
- Check mobile data permissions

## Build/Development Issues

### npm install Fails

**Solution**:
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### TypeScript Compilation Errors

**Solution**:
1. Check TypeScript version compatibility
2. Delete `dist/` and rebuild
3. Verify tsconfig.json settings
4. Check for type definition issues

### Electron Build Fails

**Solution**:
```bash
# Rebuild native modules
npm rebuild

# Clear electron cache
rm -rf ~/.electron

# Reinstall electron
npm install electron --save-dev
```

### robotjs Installation Issues

**Solution**:
```bash
# macOS
xcode-select --install

# Windows
npm install --global windows-build-tools

# Linux
sudo apt-get install libx11-dev libxtst-dev libpng-dev
```

### Android Build Fails

**Solution**:
1. Verify JDK 17 installed
2. Check Android SDK installation
3. Sync Gradle files
4. Clean and rebuild:
   ```bash
   ./gradlew clean
   ./gradlew build
   ```

### Docker Build Fails

**Solution**:
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

## Performance Issues

### High CPU Usage

**Symptoms**: Fan noise, system slowdown

**Solutions**:
1. Reduce video resolution
2. Lower frame rate
3. Enable hardware acceleration
4. Close other applications
5. Check for memory leaks
6. Update graphics drivers

### High Memory Usage

**Symptoms**: System slowdown, out of memory errors

**Solutions**:
1. Restart application
2. Check for memory leaks
3. Reduce video buffer size
4. Close unused sessions
5. Update to latest version

### High Bandwidth Usage

**Symptoms**: Slow internet, data cap concerns

**Solutions**:
1. Reduce video quality
2. Lower frame rate
3. Use local network only
4. Implement bandwidth limiting
5. Monitor network usage

## Browser-Specific Issues

### Chrome/Edge

**Issue**: WebRTC not working

**Solution**:
- Enable hardware acceleration
- Check `chrome://flags` for WebRTC settings
- Clear browser cache
- Try incognito mode

### Firefox

**Issue**: Video codec not supported

**Solution**:
- Update Firefox to latest version
- Check `about:config` for media settings
- Enable H.264 support

### Safari

**Issue**: WebRTC features limited

**Solution**:
- Update to Safari 14+
- Enable WebRTC in Develop menu
- Check for macOS updates

## Debugging Tips

### Enable Verbose Logging

**Signaling Server**:
```javascript
// Add to server.ts
console.log('Debug:', message);
```

**Desktop Agent**:
```javascript
// Open DevTools: View → Toggle Developer Tools
console.log('Debug:', data);
```

**Web Viewer**:
```javascript
// Browser console (F12)
console.log('Debug:', info);
```

### Check WebRTC Stats

**Chrome**:
```
chrome://webrtc-internals
```

**Firefox**:
```
about:webrtc
```

### Monitor Network Traffic

```bash
# Use browser DevTools Network tab
# Or use Wireshark for detailed analysis
```

### Check Server Logs

```bash
# Signaling server logs
cd signaling-server
npm run dev  # Watch console output
```

### Test WebRTC Locally

```javascript
// Test in browser console
navigator.mediaDevices.getUserMedia({video: true})
  .then(stream => console.log('Success:', stream))
  .catch(err => console.error('Error:', err));
```

## Getting Help

If you're still experiencing issues:

1. **Check Documentation**: Review all docs in `docs/` directory
2. **Search Issues**: Look for similar issues on GitHub
3. **Enable Debug Mode**: Collect detailed logs
4. **Create Issue**: Open GitHub issue with:
   - Detailed description
   - Steps to reproduce
   - Environment details
   - Error messages/logs
   - Screenshots if applicable

## Common Error Messages

### "Device not registered"
- Ensure device connected to signaling server
- Check device registration message sent
- Verify WebSocket connection

### "Session not found"
- Session may have expired
- Check session ID is correct
- Verify both peers connected

### "Permission denied"
- Grant required system permissions
- Check accessibility settings
- Run with appropriate privileges

### "ICE connection failed"
- Check firewall settings
- Verify STUN/TURN servers
- Test network connectivity

### "DataChannel closed"
- Session ended or connection lost
- Check network stability
- Verify peer connection state

## Prevention Tips

1. **Keep Updated**: Use latest versions
2. **Test Locally**: Test on local network first
3. **Monitor Resources**: Watch CPU/memory/bandwidth
4. **Grant Permissions**: Ensure all permissions granted
5. **Use Wired**: Prefer wired over WiFi
6. **Check Compatibility**: Verify platform support
7. **Read Logs**: Monitor logs for warnings
8. **Backup Config**: Save working configurations

## Still Need Help?

- 📖 Read [docs/SETUP.md](SETUP.md)
- 🔍 Search [GitHub Issues](https://github.com/your-repo/issues)
- 💬 Ask in [Discussions](https://github.com/your-repo/discussions)
- 🐛 Report [New Issue](https://github.com/your-repo/issues/new)

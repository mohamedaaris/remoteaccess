# FlowLink Security

## Security Model

FlowLink implements multiple layers of security to protect user privacy and prevent unauthorized access.

## Permission System

### Explicit User Consent
- Every remote access session requires explicit user approval
- Permission dialogs show requesting device information
- Users can reject requests at any time
- Active sessions can be terminated instantly

### Session Management
- Unique session IDs for each connection
- Session timeout after inactivity
- Automatic cleanup on disconnect
- No persistent sessions across restarts

## Encryption

### WebRTC Security
- All peer-to-peer connections use DTLS-SRTP encryption
- Automatic key exchange via DTLS handshake
- Perfect forward secrecy
- No plaintext data transmission

### Signaling Security
- WebSocket connections can use WSS (WebSocket Secure)
- Session tokens prevent replay attacks
- Device IDs are randomly generated UUIDs

## Data Privacy

### Peer-to-Peer Architecture
- Screen data never passes through signaling server
- Direct connections between devices
- Signaling server only coordinates connections
- No data logging or storage

### Minimal Data Collection
- No user accounts or personal information required
- Device names are user-configurable
- No analytics or tracking
- Session data deleted after disconnect

## Network Security

### NAT Traversal
- STUN servers for public IP discovery
- TURN servers as fallback (optional)
- ICE framework for optimal routing
- Automatic firewall traversal

### Connection Validation
- ICE candidate validation
- DTLS certificate verification
- Connection state monitoring
- Automatic disconnect on errors

## Access Control

### Device Authentication
- WebSocket connection required for device registration
- Unique device IDs per connection
- Session validation before control events
- Automatic cleanup on disconnect

### Control Event Validation
- Events only processed during active sessions
- Source device verification
- Rate limiting possible (not implemented)
- Malformed event rejection

## Threat Model

### Protected Against

1. **Eavesdropping**: DTLS-SRTP encryption prevents packet inspection
2. **Man-in-the-Middle**: Certificate validation in DTLS handshake
3. **Unauthorized Access**: Explicit permission required for all sessions
4. **Session Hijacking**: Unique session IDs and WebSocket validation
5. **Replay Attacks**: Timestamps and session state validation

### Not Protected Against

1. **Malicious Host**: If host device is compromised, attacker can accept sessions
2. **Malicious Client**: Client can send arbitrary control events during session
3. **Network DoS**: No rate limiting or DDoS protection implemented
4. **Social Engineering**: Users can be tricked into accepting malicious sessions

## Best Practices

### For Users

1. **Verify Requests**: Always verify the requesting device before accepting
2. **Trusted Networks**: Use on trusted networks when possible
3. **Monitor Sessions**: Watch for unexpected control events
4. **End Sessions**: Terminate sessions immediately when done
5. **Update Software**: Keep all components up to date

### For Administrators

1. **Use HTTPS/WSS**: Always use encrypted signaling in production
2. **Deploy TURN Server**: Use authenticated TURN for better security
3. **Network Segmentation**: Isolate signaling server
4. **Monitor Logs**: Watch for suspicious connection patterns
5. **Firewall Rules**: Restrict access to signaling server

### For Developers

1. **Input Validation**: Validate all incoming messages
2. **Error Handling**: Don't leak sensitive information in errors
3. **Dependency Updates**: Keep dependencies current
4. **Security Audits**: Regular code reviews
5. **Penetration Testing**: Test for vulnerabilities

## Compliance Considerations

### GDPR
- No personal data collected by default
- Device names are user-provided
- No data retention
- Right to disconnect (end session)

### Data Residency
- Peer-to-peer connections may cross borders
- Signaling server location matters for metadata
- Consider regional deployment

## Vulnerability Reporting

If you discover a security vulnerability:

1. **Do Not** open a public issue
2. Email security details to [security contact]
3. Include steps to reproduce
4. Allow time for patch before disclosure

## Security Roadmap

### Planned Enhancements

1. **Authentication**: User accounts and device management
2. **Authorization**: Role-based access control
3. **Audit Logging**: Comprehensive session logs
4. **Rate Limiting**: Prevent abuse and DoS
5. **2FA**: Two-factor authentication for sessions
6. **End-to-End Encryption**: Additional encryption layer
7. **Certificate Pinning**: Prevent MITM attacks
8. **Intrusion Detection**: Anomaly detection

## Known Limitations

1. **No User Authentication**: Anyone can register devices
2. **No Rate Limiting**: Potential for abuse
3. **No Audit Trail**: Limited logging of events
4. **Trust on First Use**: No device verification
5. **No Revocation**: Can't block specific devices

## Security Updates

Check for security updates regularly:
- Monitor GitHub releases
- Subscribe to security advisories
- Update all components together
- Test after updates

## Incident Response

If security incident occurs:

1. **Isolate**: Disconnect affected devices
2. **Assess**: Determine scope of breach
3. **Contain**: Stop ongoing attack
4. **Recover**: Restore to secure state
5. **Learn**: Update security measures

## References

- [WebRTC Security Architecture](https://tools.ietf.org/html/rfc8827)
- [DTLS-SRTP](https://tools.ietf.org/html/rfc5764)
- [ICE Security](https://tools.ietf.org/html/rfc8445)
- [WebSocket Security](https://tools.ietf.org/html/rfc6455)

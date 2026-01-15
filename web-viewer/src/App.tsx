import { useState, useEffect } from 'react';
import { SignalingClient } from './services/SignalingClient';
import { Device } from './types';
import DeviceList from './components/DeviceList';
import RemoteViewer from './components/RemoteViewer';
import './App.css';

function App() {
  // Detect if accessing from network or localhost
  const getSignalingServerUrl = () => {
    const hostname = window.location.hostname;
    // If accessing via IP address, use that IP for signaling server
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      console.log(`Connecting to signaling server at: ws://${hostname}:8080`);
      return `ws://${hostname}:8080`;
    }
    console.log('Connecting to signaling server at: ws://localhost:8080');
    return 'ws://localhost:8080';
  };

  const [signalingClient] = useState(() => new SignalingClient(getSignalingServerUrl()));
  const [connected, setConnected] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    let mounted = true;
    
    signalingClient.on('device-registered', (id: string) => {
      if (mounted) {
        setDeviceId(id);
        setConnected(true);
      }
    });

    signalingClient.on('device-list', (deviceList: Device[]) => {
      if (mounted) {
        console.log('Received device list:', deviceList);
        setDevices(deviceList);
      }
    });

    signalingClient.on('session-started', (sessionId: string) => {
      if (mounted) {
        console.log('Session started, setting up peer connection:', sessionId);
        setActiveSession(sessionId);
        setupPeerConnection(sessionId);
      }
    });

    signalingClient.on('session-ended', () => {
      if (mounted) {
        console.log('Session ended, cleaning up');
        setActiveSession(null);
        setRemoteStream(null);
        setDataChannel(null);
        if (peerConnection) {
          peerConnection.close();
          setPeerConnection(null);
        }
      }
    });

    signalingClient.on('disconnected', () => {
      if (mounted) {
        setConnected(false);
        setDeviceId(null);
        setDevices([]);
      }
    });

    // Set up global offer handler BEFORE any session starts
    signalingClient.on('offer', async (data: any) => {
      if (!mounted) return;
      console.log('Received offer for session:', data.sessionId);
      
      // Find or create peer connection for this session
      if (activeSession === data.sessionId && peerConnection) {
        try {
          console.log('Setting remote description (offer)');
          await peerConnection.setRemoteDescription({
            type: 'offer',
            sdp: data.sdp
          });

          console.log('Creating answer');
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          
          console.log('Sending answer');
          signalingClient.sendAnswer(data.sessionId, answer.sdp!);
        } catch (error) {
          console.error('Error handling offer:', error);
        }
      }
    });

    // Set up global ICE candidate handler
    signalingClient.on('ice-candidate', async (data: any) => {
      if (!mounted) return;
      console.log('Received ICE candidate for session:', data.sessionId);
      
      if (activeSession === data.sessionId && peerConnection) {
        try {
          await peerConnection.addIceCandidate(data.candidate);
          console.log('Added ICE candidate');
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    });

    // Auto-connect
    signalingClient.connect({
      name: 'Web Viewer',
      type: 'desktop',
      platform: 'web'
    });

    return () => {
      mounted = false;
      signalingClient.disconnect();
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [signalingClient, activeSession, peerConnection]);

  const setupPeerConnection = async (sessionId: string) => {
    console.log('Creating peer connection for session:', sessionId);
    
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Handle incoming stream
    pc.ontrack = (event) => {
      console.log('Received remote track:', event.track.kind);
      console.log('Remote stream has', event.streams[0].getTracks().length, 'tracks');
      setRemoteStream(event.streams[0]);
    };

    // Handle data channel
    pc.ondatachannel = (event) => {
      console.log('Data channel received');
      setDataChannel(event.channel);
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate');
        signalingClient.sendIceCandidate(sessionId, event.candidate);
      } else {
        console.log('All ICE candidates sent');
      }
    };

    // Connection state monitoring
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'failed') {
        console.error('Connection failed!');
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState);
    };

    pc.onicegatheringstatechange = () => {
      console.log('ICE gathering state:', pc.iceGatheringState);
    };

    setPeerConnection(pc);
    console.log('Peer connection created and ready');
  };

  const handleRequestSession = (targetDeviceId: string) => {
    signalingClient.requestSession(targetDeviceId);
  };

  const handleEndSession = () => {
    if (activeSession) {
      signalingClient.endSession(activeSession);
    }
  };

  return (
    <div className="app">
      {!activeSession ? (
        <div className="sidebar">
          <div className="header">
            <h1>FlowLink</h1>
            <div className="status">
              {connected ? (
                <span className="status-connected">● Connected</span>
              ) : (
                <span className="status-disconnected">● Disconnected</span>
              )}
            </div>
          </div>
          <DeviceList
            devices={devices.filter(d => d.id !== deviceId)}
            onConnect={handleRequestSession}
          />
        </div>
      ) : (
        <RemoteViewer
          stream={remoteStream}
          dataChannel={dataChannel}
          onDisconnect={handleEndSession}
        />
      )}
    </div>
  );
}

export default App;

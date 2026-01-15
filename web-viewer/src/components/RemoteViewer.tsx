import { useEffect, useRef, useState } from 'react';
import './RemoteViewer.css';

interface RemoteViewerProps {
  stream: MediaStream | null;
  dataChannel: RTCDataChannel | null;
  onDisconnect: () => void;
}

function RemoteViewer({ stream, dataChannel, onDisconnect }: RemoteViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const keyboardInputRef = useRef<HTMLInputElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'timeout'>('connecting');
  const connectionTimeoutRef = useRef<number | null>(null);
  const lastTouchRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      setConnectionStatus('connected');
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
    } else {
      // Set timeout for connection
      setConnectionStatus('connecting');
      connectionTimeoutRef.current = window.setTimeout(() => {
        if (!stream) {
          setConnectionStatus('timeout');
        }
      }, 30000); // 30 second timeout
    }

    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, [stream]);

  const sendControlEvent = (event: any) => {
    if (dataChannel && dataChannel.readyState === 'open') {
      dataChannel.send(JSON.stringify(event));
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!videoRef.current) return;
    
    const rect = videoRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / rect.width * videoRef.current.videoWidth);
    const y = Math.floor((e.clientY - rect.top) / rect.height * videoRef.current.videoHeight);

    sendControlEvent({
      type: 'mouse_move',
      timestamp: Date.now(),
      x,
      y
    });
  };

  const handleMouseClick = (e: React.MouseEvent) => {
    if (!videoRef.current) return;
    
    const rect = videoRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / rect.width * videoRef.current.videoWidth);
    const y = Math.floor((e.clientY - rect.top) / rect.height * videoRef.current.videoHeight);

    const button = e.button === 0 ? 'left' : e.button === 2 ? 'right' : 'middle';

    sendControlEvent({
      type: 'mouse_click',
      timestamp: Date.now(),
      button,
      action: 'click',
      x,
      y
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    sendControlEvent({
      type: 'mouse_scroll',
      timestamp: Date.now(),
      deltaX: e.deltaX,
      deltaY: e.deltaY
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    
    sendControlEvent({
      type: 'key_event',
      timestamp: Date.now(),
      action: 'press',
      key: e.key,
      code: e.code,
      modifiers: {
        ctrl: e.ctrlKey,
        alt: e.altKey,
        shift: e.shiftKey,
        meta: e.metaKey
      }
    });
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!videoRef.current || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    const rect = videoRef.current.getBoundingClientRect();
    const x = Math.floor((touch.clientX - rect.left) / rect.width * videoRef.current.videoWidth);
    const y = Math.floor((touch.clientY - rect.top) / rect.height * videoRef.current.videoHeight);

    lastTouchRef.current = { x, y, time: Date.now() };

    // Send mouse move to position cursor
    sendControlEvent({
      type: 'mouse_move',
      timestamp: Date.now(),
      x,
      y
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!videoRef.current || e.touches.length === 0) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = videoRef.current.getBoundingClientRect();
    const x = Math.floor((touch.clientX - rect.left) / rect.width * videoRef.current.videoWidth);
    const y = Math.floor((touch.clientY - rect.top) / rect.height * videoRef.current.videoHeight);

    sendControlEvent({
      type: 'mouse_move',
      timestamp: Date.now(),
      x,
      y
    });
  };

  const handleTouchEnd = (_e: React.TouchEvent) => {
    if (!videoRef.current || !lastTouchRef.current) return;
    
    const touchDuration = Date.now() - lastTouchRef.current.time;
    
    // If touch was quick (< 200ms), treat as click
    if (touchDuration < 200) {
      sendControlEvent({
        type: 'mouse_click',
        timestamp: Date.now(),
        button: 'left',
        action: 'click',
        x: lastTouchRef.current.x,
        y: lastTouchRef.current.y
      });
    }
    
    lastTouchRef.current = null;
  };

  // Keyboard input handler for mobile
  const handleKeyboardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 0) {
      const lastChar = value[value.length - 1];
      
      // Send each character as a key event
      sendControlEvent({
        type: 'key_event',
        timestamp: Date.now(),
        action: 'press',
        key: lastChar,
        code: `Key${lastChar.toUpperCase()}`,
        modifiers: {
          ctrl: false,
          alt: false,
          shift: lastChar === lastChar.toUpperCase() && lastChar !== lastChar.toLowerCase(),
          meta: false
        }
      });
      
      // Clear input for next character
      e.target.value = '';
    }
  };

  const handleKeyboardKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle special keys
    if (e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Tab' || e.key === 'Escape') {
      e.preventDefault();
      
      sendControlEvent({
        type: 'key_event',
        timestamp: Date.now(),
        action: 'press',
        key: e.key,
        code: e.code,
        modifiers: {
          ctrl: e.ctrlKey,
          alt: e.altKey,
          shift: e.shiftKey,
          meta: e.metaKey
        }
      });
    }
  };

  const toggleKeyboard = () => {
    setShowKeyboard(!showKeyboard);
    if (!showKeyboard) {
      // Focus the input when showing keyboard
      setTimeout(() => {
        keyboardInputRef.current?.focus();
      }, 100);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="remote-viewer"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="toolbar">
        <div className="toolbar-left">
          <span className="status-indicator">
            {connectionStatus === 'connected' ? '● Connected' : 
             connectionStatus === 'connecting' ? '● Connecting...' : 
             '● Connection Timeout'}
          </span>
        </div>
        <div className="toolbar-right">
          <button 
            onClick={toggleKeyboard} 
            className={showKeyboard ? 'keyboard-btn active' : 'keyboard-btn'}
            title="Toggle Keyboard"
            onTouchEnd={(e) => {
              e.preventDefault();
              toggleKeyboard();
            }}
          >
            ⌨
          </button>
          <button 
            onClick={toggleFullscreen} 
            title="Toggle Fullscreen"
            onTouchEnd={(e) => {
              e.preventDefault();
              toggleFullscreen();
            }}
          >
            {isFullscreen ? '⛶' : '⛶'}
          </button>
          <button 
            onClick={onDisconnect} 
            className="end-session-btn" 
            title="End Session"
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDisconnect();
            }}
          >
            End Session
          </button>
        </div>
      </div>
      
      {showKeyboard && (
        <div className="keyboard-input-container">
          <input
            ref={keyboardInputRef}
            type="text"
            className="keyboard-input"
            placeholder="Type here to send to remote desktop..."
            onChange={handleKeyboardInput}
            onKeyDown={handleKeyboardKeyDown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <button 
            className="keyboard-close-btn"
            onClick={toggleKeyboard}
            onTouchEnd={(e) => {
              e.preventDefault();
              toggleKeyboard();
            }}
          >
            ✕
          </button>
        </div>
      )}
      
      <div className="video-container">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            onMouseMove={handleMouseMove}
            onClick={handleMouseClick}
            onContextMenu={(e) => e.preventDefault()}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        ) : (
          <div className="loading">
            <div className="spinner"></div>
            {connectionStatus === 'timeout' ? (
              <>
                <p>Connection Timeout</p>
                <p style={{ fontSize: '14px', marginTop: '10px', color: '#666' }}>
                  The stream failed to connect. Please check:
                  <br />• Desktop agent is running and sharing screen
                  <br />• Network connection is stable
                  <br />• Firewall allows WebRTC connections
                </p>
                <button 
                  onClick={onDisconnect}
                  style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Go Back
                </button>
              </>
            ) : (
              <>
                <p>Waiting for stream...</p>
                <p style={{ fontSize: '14px', marginTop: '10px', color: '#666' }}>
                  Establishing connection with desktop agent
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RemoteViewer;

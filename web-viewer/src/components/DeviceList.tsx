import { Device } from '../types';
import './DeviceList.css';

interface DeviceListProps {
  devices: Device[];
  onConnect: (deviceId: string) => void;
}

function DeviceList({ devices, onConnect }: DeviceListProps) {
  return (
    <div className="device-list">
      <h2>Available Devices</h2>
      {devices.length === 0 ? (
        <div className="empty-state">
          <p>No devices available</p>
          <p className="hint">Start the FlowLink agent on another device</p>
        </div>
      ) : (
        <ul>
          {devices.map(device => (
            <li key={device.id} className="device-item">
              <div className="device-info">
                <div className="device-name">{device.name}</div>
                <div className="device-meta">
                  {device.type} • {device.platform}
                </div>
              </div>
              <button
                className="connect-btn"
                onClick={() => onConnect(device.id)}
              >
                Connect
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DeviceList;

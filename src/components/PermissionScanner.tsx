import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  Mic, 
  MapPin, 
  Bell, 
  Clipboard, 
  Bluetooth, 
  HardDrive,
  Eye,
  EyeOff,
  Square,
  Circle,
  X,
  Volume2,
  VolumeX,
  Download,
  Copy,
  Zap,
  Wifi,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface PermissionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const PermissionPopup: React.FC<PermissionPopupProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border-2 border-green-500 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-green-500/20">
        <div className="bg-green-500/10 border-b border-green-500 p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-green-300 font-bold font-mono text-sm sm:text-base">{title}</span>
            <div className="text-xs bg-red-500 text-white px-1 sm:px-2 py-1 rounded-full animate-pulse">ACTIVE</div>
          </div>
          <button
            onClick={onClose}
            className="text-green-400 hover:text-red-400 transition-colors"
          >
            <X size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

const CameraPopup: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch (err) {
      setError('Camera access denied or not available');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <PermissionPopup isOpen={isOpen} onClose={onClose} title="CAMERA ACCESS GRANTED">
      <div className="space-y-4">
        <div className="text-green-400 font-mono text-xs sm:text-sm">
          <p>► Camera stream initialized</p>
          <p>► Video feed: ACTIVE</p>
          <p>► Resolution: 640x480</p>
          <p>► Status: {stream ? 'CONNECTED' : 'DISCONNECTED'}</p>
        </div>

        {error ? (
          <div className="bg-red-500/20 border border-red-500 p-3 sm:p-4 rounded text-red-400 font-mono text-xs sm:text-sm">
            <AlertTriangle size={14} className="inline mr-2 sm:w-4 sm:h-4" />
            {error}
          </div>
        ) : (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full rounded border-2 border-green-500 bg-black"
              style={{ filter: 'hue-rotate(120deg) contrast(1.2)' }}
            />
            {isRecording && (
              <div className="absolute top-2 left-2 flex items-center gap-1 sm:gap-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-mono">
                <Circle size={6} className="fill-current animate-pulse sm:w-2 sm:h-2" />
                REC
              </div>
            )}
            <div className="absolute bottom-2 right-2 bg-black/80 text-green-400 px-2 py-1 rounded text-xs font-mono">
              LIVE FEED
            </div>
          </div>
        )}

        <div className="flex gap-2 sm:gap-4 flex-wrap">
          <button
            onClick={toggleRecording}
            className={`px-3 sm:px-4 py-1 sm:py-2 border rounded font-mono text-xs sm:text-sm transition-all flex items-center gap-1 sm:gap-2 ${
              isRecording 
                ? 'border-red-500 bg-red-500/20 text-red-400' 
                : 'border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20'
            }`}
          >
            {isRecording ? <Square size={12} className="sm:w-4 sm:h-4" /> : <Circle size={12} className="sm:w-4 sm:h-4" />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          <button
            onClick={startCamera}
            className="px-3 sm:px-4 py-1 sm:py-2 border border-blue-500 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded font-mono text-xs sm:text-sm transition-all flex items-center gap-1 sm:gap-2"
          >
            <Camera size={12} className="sm:w-4 sm:h-4" />
            Refresh Feed
          </button>
        </div>

        <div className="bg-green-500/5 border border-green-500/30 p-3 rounded">
          <p className="text-green-400 text-xs font-mono">
            ⚠ SECURITY NOTICE: Camera access granted. Video stream is active and being processed in real-time.
          </p>
        </div>
      </div>
    </PermissionPopup>
  );
};

const MicrophonePopup: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isOpen) {
      startMicrophone();
    } else {
      stopMicrophone();
    }

    return () => stopMicrophone();
  }, [isOpen]);

  const startMicrophone = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(mediaStream);
      
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(mediaStream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      startAudioAnalysis();
      setError('');
    } catch (err) {
      setError('Microphone access denied or not available');
    }
  };

  const stopMicrophone = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const startAudioAnalysis = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const analyze = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average);
      
      animationRef.current = requestAnimationFrame(analyze);
    };
    
    analyze();
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <PermissionPopup isOpen={isOpen} onClose={onClose} title="MICROPHONE ACCESS GRANTED">
      <div className="space-y-4">
        <div className="text-green-400 font-mono text-xs sm:text-sm">
          <p>► Microphone stream initialized</p>
          <p>► Audio input: ACTIVE</p>
          <p>► Sample rate: 44.1kHz</p>
          <p>► Status: {stream ? 'CONNECTED' : 'DISCONNECTED'}</p>
        </div>

        {error ? (
          <div className="bg-red-500/20 border border-red-500 p-3 sm:p-4 rounded text-red-400 font-mono text-xs sm:text-sm">
            <AlertTriangle size={14} className="inline mr-2 sm:w-4 sm:h-4" />
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Audio Level Visualizer */}
            <div className="bg-black border-2 border-green-500 p-3 sm:p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 font-mono text-xs sm:text-sm">Audio Level</span>
                <span className="text-green-400 font-mono text-xs">{Math.round(audioLevel)}/255</span>
              </div>
              <div className="w-full bg-gray-800 h-3 sm:h-4 rounded overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-100"
                  style={{ width: `${(audioLevel / 255) * 100}%` }}
                />
              </div>
              
              {/* Frequency Bars */}
              <div className="flex items-end justify-center gap-1 mt-4 h-16 sm:h-20">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-green-500 w-1 sm:w-2 transition-all duration-100"
                    style={{ 
                      height: `${Math.max(5, (audioLevel + Math.random() * 50) / 255 * 80)}px`,
                      opacity: audioLevel > 10 ? 1 : 0.3
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Recording Status */}
            {isRecording && (
              <div className="bg-red-500/20 border border-red-500 p-3 rounded flex items-center gap-2">
                <Circle size={10} className="fill-red-500 text-red-500 animate-pulse sm:w-3 sm:h-3" />
                <span className="text-red-400 font-mono text-xs sm:text-sm">Recording in progress...</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 sm:gap-4 flex-wrap">
          <button
            onClick={toggleRecording}
            className={`px-3 sm:px-4 py-1 sm:py-2 border rounded font-mono text-xs sm:text-sm transition-all flex items-center gap-1 sm:gap-2 ${
              isRecording 
                ? 'border-red-500 bg-red-500/20 text-red-400' 
                : 'border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20'
            }`}
          >
            {isRecording ? <Square size={12} className="sm:w-4 sm:h-4" /> : <Mic size={12} className="sm:w-4 sm:h-4" />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          <button
            onClick={() => setAudioLevel(0)}
            className="px-3 sm:px-4 py-1 sm:py-2 border border-blue-500 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded font-mono text-xs sm:text-sm transition-all flex items-center gap-1 sm:gap-2"
          >
            <VolumeX size={12} className="sm:w-4 sm:h-4" />
            Reset
          </button>
        </div>

        <div className="bg-green-500/5 border border-green-500/30 p-3 rounded">
          <p className="text-green-400 text-xs font-mono">
            ⚠ SECURITY NOTICE: Microphone access granted. Audio is being monitored and analyzed in real-time.
          </p>
        </div>
      </div>
    </PermissionPopup>
  );
};

const GeolocationPopup: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getCurrentLocation();
    }
  }, [isOpen]);

  const getCurrentLocation = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        reverseGeocode(latitude, longitude);
        setIsLoading(false);
        setError('');
      },
      (err) => {
        setError('Location access denied or not available');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Using a free geocoding service (OpenStreetMap Nominatim)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      setAddress(data.display_name || 'Address not found');
    } catch (err) {
      setAddress('Unable to resolve address');
    }
  };

  const copyCoordinates = () => {
    if (location) {
      navigator.clipboard.writeText(`${location.lat}, ${location.lng}`);
    }
  };

  return (
    <PermissionPopup isOpen={isOpen} onClose={onClose} title="GEOLOCATION ACCESS GRANTED">
      <div className="space-y-4">
        <div className="text-green-400 font-mono text-xs sm:text-sm">
          <p>► GPS coordinates acquired</p>
          <p>► Precision: HIGH</p>
          <p>► Status: {location ? 'LOCKED' : 'SEARCHING'}</p>
        </div>

        {error ? (
          <div className="bg-red-500/20 border border-red-500 p-3 sm:p-4 rounded text-red-400 font-mono text-xs sm:text-sm">
            <AlertTriangle size={14} className="inline mr-2 sm:w-4 sm:h-4" />
            {error}
          </div>
        ) : isLoading ? (
          <div className="bg-yellow-500/20 border border-yellow-500 p-3 sm:p-4 rounded text-yellow-400 font-mono text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              Acquiring GPS coordinates...
            </div>
          </div>
        ) : location ? (
          <div className="space-y-4">
            <div className="bg-black border-2 border-green-500 p-3 sm:p-4 rounded">
              <h3 className="text-green-300 font-bold mb-2 text-sm sm:text-base">Coordinates</h3>
              <div className="space-y-2 font-mono text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-green-400">Latitude:</span>
                  <span className="text-green-300">{location.lat.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">Longitude:</span>
                  <span className="text-green-300">{location.lng.toFixed(6)}</span>
                </div>
              </div>
            </div>

            {address && (
              <div className="bg-black border-2 border-blue-500 p-3 sm:p-4 rounded">
                <h3 className="text-blue-300 font-bold mb-2 text-sm sm:text-base">Resolved Address</h3>
                <p className="text-blue-400 font-mono text-xs sm:text-sm break-words">{address}</p>
              </div>
            )}

            {/* Mock Map Visualization */}
            <div className="bg-black border-2 border-green-500 p-3 sm:p-4 rounded">
              <h3 className="text-green-300 font-bold mb-2 text-sm sm:text-base">Location Visualization</h3>
              <div className="relative bg-gray-900 h-32 sm:h-40 rounded overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20"></div>
                <div 
                  className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse"
                  style={{ 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)' 
                  }}
                >
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping"></div>
                </div>
                <div className="absolute bottom-2 left-2 text-green-400 font-mono text-xs">
                  TARGET ACQUIRED
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex gap-2 sm:gap-4 flex-wrap">
          <button
            onClick={getCurrentLocation}
            className="px-3 sm:px-4 py-1 sm:py-2 border border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded font-mono text-xs sm:text-sm transition-all flex items-center gap-1 sm:gap-2"
          >
            <MapPin size={12} className="sm:w-4 sm:h-4" />
            Refresh Location
          </button>
          {location && (
            <button
              onClick={copyCoordinates}
              className="px-3 sm:px-4 py-1 sm:py-2 border border-blue-500 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded font-mono text-xs sm:text-sm transition-all flex items-center gap-1 sm:gap-2"
            >
              <Copy size={12} className="sm:w-4 sm:h-4" />
              Copy Coords
            </button>
          )}
        </div>

        <div className="bg-green-500/5 border border-green-500/30 p-3 rounded">
          <p className="text-green-400 text-xs font-mono">
            ⚠ SECURITY NOTICE: Location access granted. GPS coordinates have been acquired and processed.
          </p>
        </div>
      </div>
    </PermissionPopup>
  );
};

const NotificationPopup: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      checkPermission();
    }
  }, [isOpen]);

  const checkPermission = async () => {
    const perm = await Notification.requestPermission();
    setPermission(perm);
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      const notification = new Notification('TrackPeek Security Alert', {
        body: 'Notification system has been compromised. Data extraction in progress...',
        icon: '/vite.svg',
        badge: '/vite.svg'
      });
      
      const timestamp = new Date().toLocaleTimeString();
      setNotifications(prev => [...prev, `Notification sent at ${timestamp}`]);
      
      setTimeout(() => notification.close(), 5000);
    }
  };

  return (
    <PermissionPopup isOpen={isOpen} onClose={onClose} title="NOTIFICATION ACCESS GRANTED">
      <div className="space-y-4">
        <div className="text-green-400 font-mono text-xs sm:text-sm">
          <p>► Notification system accessed</p>
          <p>► Permission status: {permission.toUpperCase()}</p>
          <p>► Push capability: ENABLED</p>
        </div>

        {permission === 'granted' ? (
          <div className="space-y-4">
            <div className="bg-black border-2 border-green-500 p-3 sm:p-4 rounded">
              <h3 className="text-green-300 font-bold mb-2 text-sm sm:text-base">Notification Control Panel</h3>
              <button
                onClick={sendTestNotification}
                className="px-3 sm:px-4 py-1 sm:py-2 border border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded font-mono text-xs sm:text-sm transition-all flex items-center gap-1 sm:gap-2"
              >
                <Bell size={12} className="sm:w-4 sm:h-4" />
                Send Test Notification
              </button>
            </div>

            {notifications.length > 0 && (
              <div className="bg-black border-2 border-blue-500 p-3 sm:p-4 rounded">
                <h3 className="text-blue-300 font-bold mb-2 text-sm sm:text-base">Notification Log</h3>
                <div className="space-y-1 max-h-24 sm:max-h-32 overflow-y-auto">
                  {notifications.map((notif, index) => (
                    <div key={index} className="text-blue-400 font-mono text-xs">
                      ► {notif}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-red-500/20 border border-red-500 p-3 sm:p-4 rounded text-red-400 font-mono text-xs sm:text-sm">
            <AlertTriangle size={14} className="inline mr-2 sm:w-4 sm:h-4" />
            Notification permission denied or not available
          </div>
        )}

        <div className="bg-green-500/5 border border-green-500/30 p-3 rounded">
          <p className="text-green-400 text-xs font-mono">
            ⚠ SECURITY NOTICE: Notification access granted. System can now send push notifications to this device.
          </p>
        </div>
      </div>
    </PermissionPopup>
  );
};

const ClipboardPopup: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [clipboardContent, setClipboardContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (isOpen) {
      readClipboard();
    }
  }, [isOpen]);

  const readClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setClipboardContent(text || 'Clipboard is empty');
      setError('');
    } catch (err) {
      setError('Clipboard access denied or not available');
    }
  };

  const writeToClipboard = async () => {
    const hackerText = 'SYSTEM COMPROMISED - TrackPeek has accessed your clipboard';
    try {
      await navigator.clipboard.writeText(hackerText);
      setClipboardContent(hackerText);
    } catch (err) {
      setError('Unable to write to clipboard');
    }
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      const interval = setInterval(readClipboard, 2000);
      setTimeout(() => {
        clearInterval(interval);
        setIsMonitoring(false);
      }, 10000);
    }
  };

  return (
    <PermissionPopup isOpen={isOpen} onClose={onClose} title="CLIPBOARD ACCESS GRANTED">
      <div className="space-y-4">
        <div className="text-green-400 font-mono text-xs sm:text-sm">
          <p>► Clipboard access established</p>
          <p>► Read/Write permissions: ACTIVE</p>
          <p>► Monitoring: {isMonitoring ? 'ENABLED' : 'DISABLED'}</p>
        </div>

        {error ? (
          <div className="bg-red-500/20 border border-red-500 p-3 sm:p-4 rounded text-red-400 font-mono text-xs sm:text-sm">
            <AlertTriangle size={14} className="inline mr-2 sm:w-4 sm:h-4" />
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-black border-2 border-green-500 p-3 sm:p-4 rounded">
              <h3 className="text-green-300 font-bold mb-2 text-sm sm:text-base">Current Clipboard Content</h3>
              <div className="bg-gray-900 p-3 rounded border font-mono text-xs sm:text-sm text-green-400 max-h-24 sm:max-h-32 overflow-y-auto break-all">
                {clipboardContent || 'No content available'}
              </div>
            </div>

            {isMonitoring && (
              <div className="bg-yellow-500/20 border border-yellow-500 p-3 rounded flex items-center gap-2">
                <Eye size={14} className="text-yellow-400 animate-pulse sm:w-4 sm:h-4" />
                <span className="text-yellow-400 font-mono text-xs sm:text-sm">Monitoring clipboard changes...</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 sm:gap-4 flex-wrap">
          <button
            onClick={readClipboard}
            className="px-3 sm:px-4 py-1 sm:py-2 border border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded font-mono text-xs sm:text-sm transition-all flex items-center gap-1 sm:gap-2"
          >
            <Clipboard size={12} className="sm:w-4 sm:h-4" />
            Read Clipboard
          </button>
          <button
            onClick={writeToClipboard}
            className="px-3 sm:px-4 py-1 sm:py-2 border border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded font-mono text-xs sm:text-sm transition-all flex items-center gap-1 sm:gap-2"
          >
            <Copy size={12} className="sm:w-4 sm:h-4" />
            Inject Data
          </button>
          <button
            onClick={toggleMonitoring}
            className={`px-3 sm:px-4 py-1 sm:py-2 border rounded font-mono text-xs sm:text-sm transition-all flex items-center gap-1 sm:gap-2 ${
              isMonitoring 
                ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400' 
                : 'border-blue-500 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
            }`}
          >
            {isMonitoring ? <EyeOff size={12} className="sm:w-4 sm:h-4" /> : <Eye size={12} className="sm:w-4 sm:h-4" />}
            {isMonitoring ? 'Stop Monitor' : 'Start Monitor'}
          </button>
        </div>

        <div className="bg-green-500/5 border border-green-500/30 p-3 rounded">
          <p className="text-green-400 text-xs font-mono">
            ⚠ SECURITY NOTICE: Clipboard access granted. All copy/paste operations can be monitored and modified.
          </p>
        </div>
      </div>
    </PermissionPopup>
  );
};

const PermissionScanner: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [grantedPermissions, setGrantedPermissions] = useState<Set<string>>(new Set());
  const [scanningAnimation, setScanningAnimation] = useState(false);

  const permissions = [
    { id: 'camera', icon: Camera, label: 'Camera Access', description: 'Live video feed monitoring' },
    { id: 'microphone', icon: Mic, label: 'Microphone Access', description: 'Audio recording and analysis' },
    { id: 'geolocation', icon: MapPin, label: 'Location Access', description: 'GPS coordinates tracking' },
    { id: 'notifications', icon: Bell, label: 'Notification Access', description: 'Push notification control' },
    { id: 'clipboard', icon: Clipboard, label: 'Clipboard Access', description: 'Copy/paste monitoring' },
    { id: 'bluetooth', icon: Bluetooth, label: 'Bluetooth Access', description: 'Device scanning (Limited)' },
    { id: 'filesystem', icon: HardDrive, label: 'File System Access', description: 'File operations (Limited)' }
  ];

  const requestPermission = async (permissionId: string) => {
    setScanningAnimation(true);
    
    // Simulate scanning animation
    setTimeout(() => {
      setScanningAnimation(false);
      setGrantedPermissions(prev => new Set([...prev, permissionId]));
      setActivePopup(permissionId);
    }, 1500);
  };

  const renderPopup = () => {
    switch (activePopup) {
      case 'camera':
        return <CameraPopup isOpen={true} onClose={() => setActivePopup(null)} />;
      case 'microphone':
        return <MicrophonePopup isOpen={true} onClose={() => setActivePopup(null)} />;
      case 'geolocation':
        return <GeolocationPopup isOpen={true} onClose={() => setActivePopup(null)} />;
      case 'notifications':
        return <NotificationPopup isOpen={true} onClose={() => setActivePopup(null)} />;
      case 'clipboard':
        return <ClipboardPopup isOpen={true} onClose={() => setActivePopup(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div
              key={i}
              className="border-green-900 border-r border-b animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gray-900 border-b border-green-500 p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 border border-green-500 rounded hover:bg-green-500/10 transition-colors text-sm"
          >
            <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Shield size={16} className="sm:w-5 sm:h-5" />
            <span className="text-green-300 font-bold text-sm sm:text-base">Permission-Based Scanner</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-400 text-xs sm:text-sm">ACTIVE SCAN</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-300 mb-4">
              Advanced Permission Scanner
            </h1>
            <p className="text-green-400 text-sm sm:text-base lg:text-lg">
              Grant permissions to unlock advanced scanning capabilities
            </p>
          </div>

          {/* Scanning Animation Overlay */}
          {scanningAnimation && (
            <div className="fixed inset-0 bg-black/90 z-40 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-green-400 font-mono text-lg sm:text-xl">Initializing secure connection...</p>
                <p className="text-green-300 font-mono text-xs sm:text-sm mt-2">Establishing encrypted channel</p>
              </div>
            </div>
          )}

          {/* Permission Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {permissions.map((permission) => {
              const isGranted = grantedPermissions.has(permission.id);
              const Icon = permission.icon;
              
              return (
                <div
                  key={permission.id}
                  className={`border-2 rounded-lg p-4 sm:p-6 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                    isGranted
                      ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20'
                      : 'border-green-500/30 bg-black/50 hover:border-green-500 hover:bg-green-500/5'
                  }`}
                  onClick={() => {
                    if (isGranted) {
                      setActivePopup(permission.id);
                    } else {
                      requestPermission(permission.id);
                    }
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <Icon size={20} className={`${isGranted ? 'text-green-300' : 'text-green-500'} sm:w-6 sm:h-6 flex-shrink-0`} />
                    <h3 className={`font-bold text-sm sm:text-base ${isGranted ? 'text-green-300' : 'text-green-400'}`}>
                      {permission.label}
                    </h3>
                    {isGranted && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  
                  <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${isGranted ? 'text-green-400' : 'text-green-500'}`}>
                    {permission.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono ${
                      isGranted ? 'text-green-300' : 'text-green-500'
                    }`}>
                      {isGranted ? 'ACCESS GRANTED' : 'CLICK TO GRANT'}
                    </span>
                    {isGranted && (
                      <button className="text-xs bg-green-500 text-black px-2 py-1 rounded font-bold">
                        VIEW DATA
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status Panel */}
          <div className="mt-6 sm:mt-8 bg-black/80 border-2 border-green-500 rounded-lg p-4 sm:p-6">
            <h2 className="text-green-300 font-bold text-lg sm:text-xl mb-4">Scan Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-400">{grantedPermissions.size}</div>
                <div className="text-green-500 text-xs sm:text-sm">Permissions Granted</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-yellow-400">{permissions.length - grantedPermissions.size}</div>
                <div className="text-yellow-500 text-xs sm:text-sm">Pending Access</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">
                  {Math.round((grantedPermissions.size / permissions.length) * 100)}%
                </div>
                <div className="text-blue-500 text-xs sm:text-sm">Scan Complete</div>
              </div>
            </div>
          </div>

          {/* Credit */}
          <div className="text-center pt-6">
            <p className="text-green-500/70 text-xs font-mono">
              Created by Lik Ho N!
            </p>
          </div>
        </div>
      </div>

      {/* Render Active Popup */}
      {renderPopup()}

      {/* Glitch Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-t from-transparent via-green-500/5 to-transparent animate-glitch opacity-30"></div>
      </div>
    </div>
  );
};

export default PermissionScanner;
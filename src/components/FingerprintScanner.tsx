import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Terminal, Smartphone, Monitor, Cpu, HardDrive, Eye, Settings, ChevronDown, ChevronUp, Wifi, Battery, Globe, Clock, Shield, Zap, MousePointer, Keyboard } from 'lucide-react';
import SkeletonLoader from './SkeletonLoader';

interface DeviceInfo {
  operatingSystem: string;
  screenSize: string;
  viewportSize: string;
  devicePixelRatio: string;
  ram: string;
  cpuCores: string;
  touchSupport: string;
}

interface BrowserInfo {
  browserName: string;
  browserVersion: string;
  language: string;
  cookiesEnabled: string;
  doNotTrack: string;
  userAgent: string;
}

interface WebGLInfo {
  gpuVendor: string;
  gpuRenderer: string;
  webglVersion: string;
}

interface NetworkPowerInfo {
  onlineStatus: string;
  batteryLevel: string;
  chargingStatus: string;
  connectionType: string;
}

interface EnvironmentInfo {
  timezone: string;
  currentTime: string;
  preferredColorScheme: string;
  referrerURL: string;
}

interface InteractionData {
  mouseX: string;
  mouseY: string;
  clickPosition: string;
  keyPressed: string;
}

interface FingerprintData {
  deviceInfo: DeviceInfo;
  browserInfo: BrowserInfo;
  webglInfo: WebGLInfo;
  networkPowerInfo: NetworkPowerInfo;
  environmentInfo: EnvironmentInfo;
  interactionData: InteractionData;
}

const FingerprintScanner: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [fingerprintData, setFingerprintData] = useState<FingerprintData | null>(null);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [interactionData, setInteractionData] = useState<InteractionData>({
    mouseX: '0',
    mouseY: '0',
    clickPosition: 'None',
    keyPressed: 'None'
  });
  const [permissionsGranted, setPermissionsGranted] = useState({
    geolocation: false,
    camera: false,
    microphone: false,
    notifications: false
  });
  const terminalRef = useRef<HTMLDivElement>(null);

  // Track user interactions in real-time
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setInteractionData(prev => ({
        ...prev,
        mouseX: e.clientX.toString(),
        mouseY: e.clientY.toString()
      }));
    };

    const handleClick = (e: MouseEvent) => {
      setInteractionData(prev => ({
        ...prev,
        clickPosition: `${e.clientX}, ${e.clientY}`
      }));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      setInteractionData(prev => ({
        ...prev,
        keyPressed: e.key === ' ' ? 'Space' : e.key
      }));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const collectFingerprintData = async (): Promise<FingerprintData> => {
    // Device Information
    const deviceInfo: DeviceInfo = {
      operatingSystem: navigator.platform || 'Unknown',
      screenSize: `${screen.width} × ${screen.height}`,
      viewportSize: `${window.innerWidth} × ${window.innerHeight}`,
      devicePixelRatio: window.devicePixelRatio.toString(),
      ram: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'Unknown',
      cpuCores: navigator.hardwareConcurrency?.toString() || 'Unknown',
      touchSupport: navigator.maxTouchPoints > 0 ? `Yes (${navigator.maxTouchPoints} points)` : 'No'
    };

    // Browser Information
    const getBrowserInfo = (): { name: string; version: string } => {
      const userAgent = navigator.userAgent;
      let browserName = 'Unknown';
      let browserVersion = 'Unknown';

      if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        browserName = 'Google Chrome';
        const match = userAgent.match(/Chrome\/(\d+)/);
        browserVersion = match ? match[1] : 'Unknown';
      } else if (userAgent.includes('Firefox')) {
        browserName = 'Mozilla Firefox';
        const match = userAgent.match(/Firefox\/(\d+)/);
        browserVersion = match ? match[1] : 'Unknown';
      } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        browserName = 'Safari';
        const match = userAgent.match(/Version\/(\d+)/);
        browserVersion = match ? match[1] : 'Unknown';
      } else if (userAgent.includes('Edg')) {
        browserName = 'Microsoft Edge';
        const match = userAgent.match(/Edg\/(\d+)/);
        browserVersion = match ? match[1] : 'Unknown';
      }

      return { name: browserName, version: browserVersion };
    };

    const browser = getBrowserInfo();
    const browserInfo: BrowserInfo = {
      browserName: browser.name,
      browserVersion: browser.version,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled ? 'Yes' : 'No',
      doNotTrack: navigator.doNotTrack === '1' ? 'Enabled' : 'Disabled',
      userAgent: navigator.userAgent
    };

    // WebGL / GPU Info
    const getWebGLInfo = (): WebGLInfo => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          return {
            gpuVendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
            gpuRenderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
            webglVersion: gl.getParameter(gl.VERSION)
          };
        }
      } catch (e) {
        // WebGL not available
      }
      
      return {
        gpuVendor: 'Not Available',
        gpuRenderer: 'Not Available',
        webglVersion: 'Not Available'
      };
    };

    const webglInfo = getWebGLInfo();

    // Network & Power Info
    let batteryLevel = 'Unknown';
    let chargingStatus = 'Unknown';
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        batteryLevel = `${Math.round(battery.level * 100)}%`;
        chargingStatus = battery.charging ? 'Charging' : 'Not Charging';
      } catch (e) {
        batteryLevel = 'Access Denied';
        chargingStatus = 'Access Denied';
      }
    }

    const networkPowerInfo: NetworkPowerInfo = {
      onlineStatus: navigator.onLine ? 'Online' : 'Offline',
      batteryLevel,
      chargingStatus,
      connectionType: (navigator as any).connection?.type || 'Unknown'
    };

    // Environment / Settings Info
    const environmentInfo: EnvironmentInfo = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      currentTime: new Date().toLocaleTimeString(),
      preferredColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light',
      referrerURL: document.referrer || 'Direct visit'
    };

    return {
      deviceInfo,
      browserInfo,
      webglInfo,
      networkPowerInfo,
      environmentInfo,
      interactionData
    };
  };

  const formatScanOutput = (data: FingerprintData): string[] => {
    return [
      'root@trackpeek:~$ ./enhanced_fingerprint_scan --comprehensive',
      'Initializing advanced fingerprint collection...',
      '',
      '╔══════════════════════════════════════════════════════════════╗',
      '║                    DEVICE INFORMATION                        ║',
      '╚══════════════════════════════════════════════════════════════╝',
      `operating_system: ${data.deviceInfo.operatingSystem}`,
      `screen_size: ${data.deviceInfo.screenSize}`,
      `viewport_size: ${data.deviceInfo.viewportSize}`,
      `device_pixel_ratio: ${data.deviceInfo.devicePixelRatio}`,
      `ram_gb: ${data.deviceInfo.ram}`,
      `cpu_cores: ${data.deviceInfo.cpuCores}`,
      `touch_support: ${data.deviceInfo.touchSupport}`,
      '',
      '╔══════════════════════════════════════════════════════════════╗',
      '║                   BROWSER INFORMATION                        ║',
      '╚══════════════════════════════════════════════════════════════╝',
      `browser_name: ${data.browserInfo.browserName}`,
      `browser_version: ${data.browserInfo.browserVersion}`,
      `language: ${data.browserInfo.language}`,
      `cookies_enabled: ${data.browserInfo.cookiesEnabled}`,
      `do_not_track: ${data.browserInfo.doNotTrack}`,
      `user_agent: ${data.browserInfo.userAgent.substring(0, 80)}...`,
      '',
      '╔══════════════════════════════════════════════════════════════╗',
      '║                    WEBGL / GPU INFO                          ║',
      '╚══════════════════════════════════════════════════════════════╝',
      `gpu_vendor: ${data.webglInfo.gpuVendor}`,
      `gpu_renderer: ${data.webglInfo.gpuRenderer}`,
      `webgl_version: ${data.webglInfo.webglVersion}`,
      '',
      '╔══════════════════════════════════════════════════════════════╗',
      '║                  NETWORK & POWER INFO                       ║',
      '╚══════════════════════════════════════════════════════════════╝',
      `online_status: ${data.networkPowerInfo.onlineStatus}`,
      `battery_level: ${data.networkPowerInfo.batteryLevel}`,
      `charging_status: ${data.networkPowerInfo.chargingStatus}`,
      `connection_type: ${data.networkPowerInfo.connectionType}`,
      '',
      '╔══════════════════════════════════════════════════════════════╗',
      '║                 ENVIRONMENT / SETTINGS                      ║',
      '╚══════════════════════════════════════════════════════════════╝',
      `timezone: ${data.environmentInfo.timezone}`,
      `current_time: ${data.environmentInfo.currentTime}`,
      `preferred_color_scheme: ${data.environmentInfo.preferredColorScheme}`,
      `referrer_url: ${data.environmentInfo.referrerURL}`,
      '',
      '╔══════════════════════════════════════════════════════════════╗',
      '║                   INTERACTION DATA (LIVE)                   ║',
      '╚══════════════════════════════════════════════════════════════╝',
      `mouse_x: ${data.interactionData.mouseX}`,
      `mouse_y: ${data.interactionData.mouseY}`,
      `click_position: ${data.interactionData.clickPosition}`,
      `key_pressed: ${data.interactionData.keyPressed}`,
      '',
      'Enhanced fingerprint collection completed successfully.',
      `Total data points collected: ${Object.keys(data).reduce((acc, section) => acc + Object.keys((data as any)[section]).length, 0)}`
    ];
  };

  const startScan = async () => {
    setIsScanning(true);
    setDisplayedLines([]);
    setScanComplete(false);
    
    const data = await collectFingerprintData();
    setFingerprintData(data);
    
    const lines = formatScanOutput(data);
    
    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < lines.length) {
        setDisplayedLines(prev => [...prev, lines[lineIndex]]);
        lineIndex++;
        
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
        setIsScanning(false);
        setScanComplete(true);
      }
    }, 60);
  };

  // Update interaction data in real-time when scan is complete
  useEffect(() => {
    if (scanComplete && fingerprintData) {
      setFingerprintData(prev => prev ? {
        ...prev,
        interactionData
      } : null);
    }
  }, [interactionData, scanComplete]);

  const getLineColor = (line: string) => {
    if (typeof line !== 'string') {
      return '';
    }
    
    if (line.startsWith('root@trackpeek:~$')) return 'text-green-400 font-bold';
    if (line.startsWith('╔') || line.startsWith('║') || line.startsWith('╚')) return 'text-cyan-400';
    if (line.includes('completed successfully') || line.includes('Initializing')) return 'text-green-300';
    if (line === '') return '';
    if (line.includes('Unknown') || line.includes('denied') || line.includes('Denied') || line.includes('Access Denied') || line.includes('Not Available')) {
      return 'text-red-400';
    }
    if (line.includes('Online') || line.includes('Enabled') || line.includes('Yes') || line.includes('Charging')) {
      return 'text-green-300';
    }
    return 'text-green-400';
  };

  const requestPermission = async (type: string) => {
    try {
      switch (type) {
        case 'geolocation':
          navigator.geolocation.getCurrentPosition(
            () => setPermissionsGranted(prev => ({ ...prev, geolocation: true })),
            () => {}
          );
          break;
        case 'camera':
          const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoStream.getTracks().forEach(track => track.stop());
          setPermissionsGranted(prev => ({ ...prev, camera: true }));
          break;
        case 'microphone':
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioStream.getTracks().forEach(track => track.stop());
          setPermissionsGranted(prev => ({ ...prev, microphone: true }));
          break;
        case 'notifications':
          const permission = await Notification.requestPermission();
          setPermissionsGranted(prev => ({ ...prev, notifications: permission === 'granted' }));
          break;
      }
    } catch (error) {
      console.log(`Permission denied: ${type}`);
    }
  };

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName);
      } else {
        newSet.add(sectionName);
      }
      return newSet;
    });
  };

  const PermissionButton = ({ type, label, granted }: { type: string, label: string, granted: boolean }) => (
    <button
      onClick={() => requestPermission(type)}
      className={`px-2 sm:px-3 py-1 sm:py-2 text-xs border rounded transition-all duration-300 flex items-center gap-1 sm:gap-2 ${
        granted 
          ? 'border-green-500 bg-green-500/20 text-green-300' 
          : 'border-yellow-500 text-yellow-400 hover:bg-yellow-500/10'
      }`}
      disabled={granted}
    >
      <Eye size={12} />
      <span className="hidden sm:inline">{granted ? `${label} ✓` : `Grant ${label}`}</span>
      <span className="sm:hidden">{granted ? '✓' : label}</span>
    </button>
  );

  const DataSection = ({ title, icon: Icon, data, live = false }: { 
    title: string, 
    icon: React.ComponentType<any>, 
    data: Record<string, string>,
    live?: boolean 
  }) => {
    const isExpanded = expandedSections.has(title);
    
    return (
      <div className="border border-green-500/30 rounded-lg bg-black/50 backdrop-blur-sm">
        <button
          onClick={() => toggleSection(title)}
          className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-green-500/5 transition-colors"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Icon size={16} className="text-green-400 flex-shrink-0 sm:w-5 sm:h-5" />
            <span className="text-green-300 font-bold text-sm sm:text-base">{title}</span>
            {live && <span className="text-xs bg-red-500 text-white px-1 sm:px-2 py-1 rounded-full animate-pulse">LIVE</span>}
          </div>
          {isExpanded ? <ChevronUp size={14} className="sm:w-4 sm:h-4" /> : <ChevronDown size={14} className="sm:w-4 sm:h-4" />}
        </button>
        
        {isExpanded && (
          <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2 border-t border-green-500/20">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 gap-1 sm:gap-2">
                <span className="text-green-400 text-xs sm:text-sm font-mono">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                <span className={`text-xs sm:text-sm font-mono break-all ${
                  value.includes('Unknown') || value.includes('Not Available') || value.includes('Access Denied') 
                    ? 'text-red-400' 
                    : value.includes('Yes') || value.includes('Online') || value.includes('Enabled')
                    ? 'text-green-300'
                    : 'text-green-400'
                }`}>
                  {value.length > 50 ? `${value.substring(0, 50)}...` : value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    startScan();
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Terminal window header */}
      <div className="bg-gray-900 border-b border-green-500 p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 border border-green-500 rounded hover:bg-green-500/10 transition-colors text-sm"
          >
            <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Terminal size={16} className="sm:w-5 sm:h-5" />
            <span className="text-green-300 text-sm sm:text-base">Enhanced Fingerprint Scanner</span>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Permission buttons */}
      <div className="bg-gray-900/50 border-b border-green-500/30 p-3 sm:p-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-green-300 text-xs sm:text-sm mr-2 sm:mr-4 w-full sm:w-auto mb-2 sm:mb-0">Grant permissions for enhanced data collection:</span>
          <PermissionButton type="geolocation" label="Location" granted={permissionsGranted.geolocation} />
          <PermissionButton type="camera" label="Camera" granted={permissionsGranted.camera} />
          <PermissionButton type="microphone" label="Microphone" granted={permissionsGranted.microphone} />
          <PermissionButton type="notifications" label="Notifications" granted={permissionsGranted.notifications} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)]">
        {/* Terminal output */}
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-green-500/30 h-1/2 lg:h-full">
          <div 
            ref={terminalRef}
            className="h-full overflow-y-auto p-3 sm:p-6 bg-black text-xs sm:text-sm"
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,255,65,0.1) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}
          >
            <div className="space-y-1">
              {displayedLines.map((line, index) => (
                <div key={index} className={getLineColor(line)}>
                  <span className="font-mono break-all">
                    {line}
                    {index === displayedLines.length - 1 && isScanning && (
                      <span className="animate-pulse">_</span>
                    )}
                  </span>
                </div>
              ))}
              
              {isScanning && (
                <div className="flex items-center gap-2 text-green-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Collecting fingerprint data...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interactive data sections */}
        <div className="w-full lg:w-1/2 overflow-y-auto p-3 sm:p-6 bg-gray-900/20 h-1/2 lg:h-full">
          {!scanComplete ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-green-300 mb-2">Analyzing System...</h2>
                <p className="text-green-400 text-xs sm:text-sm">Please wait while we collect your fingerprint data</p>
              </div>
              <SkeletonLoader type="card" count={6} />
            </div>
          ) : fingerprintData && (
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-green-300 mb-2">Interactive Data View</h2>
                <p className="text-green-400 text-xs sm:text-sm">Click sections to expand and explore your fingerprint data</p>
              </div>

              <DataSection 
                title="Device Information" 
                icon={Smartphone} 
                data={fingerprintData.deviceInfo} 
              />
              
              <DataSection 
                title="Browser Information" 
                icon={Globe} 
                data={fingerprintData.browserInfo} 
              />
              
              <DataSection 
                title="WebGL / GPU Info" 
                icon={Monitor} 
                data={fingerprintData.webglInfo} 
              />
              
              <DataSection 
                title="Network & Power Info" 
                icon={Wifi} 
                data={fingerprintData.networkPowerInfo} 
              />
              
              <DataSection 
                title="Environment / Settings" 
                icon={Settings} 
                data={fingerprintData.environmentInfo} 
              />
              
              <DataSection 
                title="Interaction Data" 
                icon={MousePointer} 
                data={fingerprintData.interactionData} 
                live={true}
              />

              <div className="mt-6 sm:mt-8 p-3 sm:p-4 border border-green-500 rounded bg-green-500/5">
                <div className="flex items-center gap-2 text-green-300 mb-2">
                  <Shield size={14} className="sm:w-4 sm:h-4" />
                  <span className="font-bold text-sm sm:text-base">Scan Complete</span>
                </div>
                <p className="text-green-400 text-xs sm:text-sm mb-3 sm:mb-4">
                  Your comprehensive device fingerprint has been collected and organized into sections above. 
                  The interaction data updates in real-time as you move your mouse and interact with the page.
                </p>
                <div className="flex gap-2 sm:gap-4 flex-wrap">
                  <button
                    onClick={startScan}
                    className="px-3 sm:px-4 py-1 sm:py-2 border border-green-500 rounded hover:bg-green-500/10 transition-colors text-xs sm:text-sm"
                  >
                    Rescan Device
                  </button>
                  <button
                    onClick={() => {
                      if (fingerprintData) {
                        const dataStr = JSON.stringify(fingerprintData, null, 2);
                        const blob = new Blob([dataStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'device-fingerprint.json';
                        a.click();
                      }
                    }}
                    className="px-3 sm:px-4 py-1 sm:py-2 border border-green-500 rounded hover:bg-green-500/10 transition-colors text-xs sm:text-sm"
                  >
                    Export Data
                  </button>
                  <button
                    onClick={() => setExpandedSections(new Set(['Device Information', 'Browser Information', 'WebGL / GPU Info', 'Network & Power Info', 'Environment / Settings', 'Interaction Data']))}
                    className="px-3 sm:px-4 py-1 sm:py-2 border border-blue-500 text-blue-400 rounded hover:bg-blue-500/10 transition-colors text-xs sm:text-sm"
                  >
                    Expand All
                  </button>
                  <button
                    onClick={() => setExpandedSections(new Set())}
                    className="px-3 sm:px-4 py-1 sm:py-2 border border-red-500 text-red-400 rounded hover:bg-red-500/10 transition-colors text-xs sm:text-sm"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              {/* Credit */}
              <div className="text-center pt-4">
                <p className="text-green-500/70 text-xs font-mono">
                  Created by Lik Ho N!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Glitch overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-t from-transparent via-green-500/5 to-transparent animate-glitch opacity-30"></div>
      </div>
    </div>
  );
};

export default FingerprintScanner;
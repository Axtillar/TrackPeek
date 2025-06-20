import React, { useState, useEffect } from 'react';
import { ArrowLeft, Cpu, HardDrive, Zap, Activity, MemoryStick, Monitor, Thermometer, Clock } from 'lucide-react';
import SkeletonLoader from './SkeletonLoader';

interface SystemInfo {
  performance: {
    memoryUsage: number;
    cpuUsage: number;
    loadTime: number;
    renderTime: number;
  };
  hardware: {
    cpuCores: number;
    deviceMemory: number;
    maxTouchPoints: number;
    screenResolution: string;
    colorDepth: number;
    pixelRatio: number;
  };
  capabilities: {
    webgl: boolean;
    webgl2: boolean;
    webrtc: boolean;
    serviceWorker: boolean;
    indexedDB: boolean;
    localStorage: boolean;
    sessionStorage: boolean;
    webAssembly: boolean;
  };
  sensors: {
    deviceOrientation: boolean;
    deviceMotion: boolean;
    ambientLight: boolean;
    proximity: boolean;
    battery: {
      level: number;
      charging: boolean;
      chargingTime: number;
      dischargingTime: number;
    } | null;
  };
}

const SystemScanner: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanStep, setCurrentScanStep] = useState('');
  const [realTimeData, setRealTimeData] = useState({
    memoryUsage: 0,
    timestamp: Date.now()
  });

  const scanSteps = [
    'Initializing system probe...',
    'Analyzing hardware capabilities...',
    'Measuring performance metrics...',
    'Testing browser capabilities...',
    'Scanning sensor availability...',
    'Monitoring resource usage...',
    'Compiling system profile...',
    'System exploitation complete'
  ];

  const performSystemScan = async (): Promise<SystemInfo> => {
    // Performance metrics
    const performanceStart = performance.now();
    const memoryInfo = (performance as any).memory;
    
    // Hardware detection
    const hardware = {
      cpuCores: navigator.hardwareConcurrency || 0,
      deviceMemory: (navigator as any).deviceMemory || 0,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio
    };

    // Capability testing
    const capabilities = {
      webgl: !!document.createElement('canvas').getContext('webgl'),
      webgl2: !!document.createElement('canvas').getContext('webgl2'),
      webrtc: !!(navigator as any).getUserMedia || !!(navigator as any).webkitGetUserMedia,
      serviceWorker: 'serviceWorker' in navigator,
      indexedDB: 'indexedDB' in window,
      localStorage: 'localStorage' in window,
      sessionStorage: 'sessionStorage' in window,
      webAssembly: 'WebAssembly' in window
    };

    // Sensor detection
    const sensors = {
      deviceOrientation: 'DeviceOrientationEvent' in window,
      deviceMotion: 'DeviceMotionEvent' in window,
      ambientLight: 'AmbientLightSensor' in window,
      proximity: 'ProximitySensor' in window,
      battery: null as any
    };

    // Battery API
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        sensors.battery = {
          level: Math.round(battery.level * 100),
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
      } catch (e) {
        sensors.battery = null;
      }
    }

    const performanceEnd = performance.now();
    
    return {
      performance: {
        memoryUsage: memoryInfo ? Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024) : 0,
        cpuUsage: Math.random() * 100, // Simulated
        loadTime: performanceEnd - performanceStart,
        renderTime: performance.now()
      },
      hardware,
      capabilities,
      sensors
    };
  };

  const startSystemScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    for (let i = 0; i < scanSteps.length; i++) {
      setCurrentScanStep(scanSteps[i]);
      setScanProgress((i / (scanSteps.length - 1)) * 100);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    const systemData = await performSystemScan();
    setSystemInfo(systemData);
    setIsScanning(false);
    setScanComplete(true);
  };

  // Real-time monitoring
  useEffect(() => {
    if (scanComplete) {
      const interval = setInterval(() => {
        const memoryInfo = (performance as any).memory;
        setRealTimeData({
          memoryUsage: memoryInfo ? Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024) : 0,
          timestamp: Date.now()
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [scanComplete]);

  useEffect(() => {
    startSystemScan();
  }, []);

  const CapabilityIndicator = ({ name, supported }: { name: string; supported: boolean }) => (
    <div className={`flex items-center justify-between p-2 rounded text-xs sm:text-sm ${
      supported ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
    }`}>
      <span className="font-mono">{name}</span>
      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${supported ? 'bg-green-500' : 'bg-red-500'}`}></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-purple-400 font-mono relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div
              key={i}
              className="border-purple-900 border-r border-b animate-pulse"
              style={{ animationDelay: `${i * 0.03}s` }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gray-900 border-b border-purple-500 p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 border border-purple-500 rounded hover:bg-purple-500/10 transition-colors text-sm"
          >
            <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Cpu size={16} className="sm:w-5 sm:h-5" />
            <span className="text-purple-300 text-sm sm:text-base">System Exploitation Scanner</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-400 text-xs sm:text-sm">CRITICAL</span>
        </div>
      </div>

      <div className="relative z-10 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Scanning Progress */}
          {isScanning && (
            <div className="mb-6 sm:mb-8">
              <div className="bg-black/80 border-2 border-purple-500 rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  <h2 className="text-purple-300 font-bold text-lg sm:text-xl">Deep System Analysis</h2>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span className="text-purple-400">{currentScanStep}</span>
                    <span className="text-purple-300">{Math.round(scanProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-400 transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {!scanComplete ? (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-2">Exploiting System...</h1>
                <p className="text-purple-400 text-sm sm:text-base">Performing deep system analysis and resource enumeration</p>
              </div>
              <SkeletonLoader type="card" count={4} />
            </div>
          ) : systemInfo && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-2">System Compromised</h1>
                <p className="text-purple-400 text-sm sm:text-base">Complete hardware and software profile extracted</p>
              </div>

              {/* Real-time Performance */}
              <div className="bg-black/80 border-2 border-red-500 rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <Activity size={20} className="text-red-400 animate-pulse sm:w-6 sm:h-6" />
                  <h2 className="text-red-300 font-bold text-lg sm:text-xl">Live Performance Monitor</h2>
                  <div className="ml-auto text-xs bg-red-500 text-white px-2 py-1 rounded animate-pulse">
                    LIVE
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded p-3 sm:p-4 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-red-400 mb-1">{realTimeData.memoryUsage}MB</div>
                    <div className="text-red-500 text-xs sm:text-sm">Memory Usage</div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded p-3 sm:p-4 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-red-400 mb-1">{Math.round(systemInfo.performance.cpuUsage)}%</div>
                    <div className="text-red-500 text-xs sm:text-sm">CPU Load</div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded p-3 sm:p-4 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-red-400 mb-1">{systemInfo.performance.loadTime.toFixed(2)}ms</div>
                    <div className="text-red-500 text-xs sm:text-sm">Scan Time</div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded p-3 sm:p-4 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-red-400 mb-1">{Date.now() - realTimeData.timestamp < 2000 ? 'ACTIVE' : 'IDLE'}</div>
                    <div className="text-red-500 text-xs sm:text-sm">Status</div>
                  </div>
                </div>
              </div>

              {/* Hardware Profile */}
              <div className="bg-black/80 border-2 border-yellow-500 rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <HardDrive size={20} className="text-yellow-400 sm:w-6 sm:h-6" />
                  <h2 className="text-yellow-300 font-bold text-lg sm:text-xl">Hardware Profile</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex justify-between">
                        <span className="text-yellow-400 text-sm">CPU Cores:</span>
                        <span className="text-yellow-300 text-sm">{systemInfo.hardware.cpuCores}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-400 text-sm">Device Memory:</span>
                        <span className="text-yellow-300 text-sm">{systemInfo.hardware.deviceMemory || 'Unknown'} GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-400 text-sm">Touch Points:</span>
                        <span className="text-yellow-300 text-sm">{systemInfo.hardware.maxTouchPoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-400 text-sm">Resolution:</span>
                        <span className="text-yellow-300 text-sm">{systemInfo.hardware.screenResolution}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-400 text-sm">Color Depth:</span>
                        <span className="text-yellow-300 text-sm">{systemInfo.hardware.colorDepth}-bit</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-400 text-sm">Pixel Ratio:</span>
                        <span className="text-yellow-300 text-sm">{systemInfo.hardware.pixelRatio}x</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 sm:p-4">
                    <div className="text-center">
                      <Monitor size={24} className="text-yellow-400 mx-auto mb-2 sm:w-8 sm:h-8" />
                      <p className="text-yellow-300 text-xs sm:text-sm">Hardware Profiled</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Browser Capabilities */}
              <div className="bg-black/80 border-2 border-blue-500 rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <Zap size={20} className="text-blue-400 sm:w-6 sm:h-6" />
                  <h2 className="text-blue-300 font-bold text-lg sm:text-xl">Browser Capabilities</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                  {Object.entries(systemInfo.capabilities).map(([key, value]) => (
                    <CapabilityIndicator 
                      key={key} 
                      name={key.replace(/([A-Z])/g, ' $1').toUpperCase()} 
                      supported={value} 
                    />
                  ))}
                </div>
              </div>

              {/* Sensor Access */}
              <div className="bg-black/80 border-2 border-green-500 rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <Thermometer size={20} className="text-green-400 sm:w-6 sm:h-6" />
                  <h2 className="text-green-300 font-bold text-lg sm:text-xl">Sensor Access</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2 sm:space-y-3">
                    <CapabilityIndicator name="Device Orientation" supported={systemInfo.sensors.deviceOrientation} />
                    <CapabilityIndicator name="Device Motion" supported={systemInfo.sensors.deviceMotion} />
                    <CapabilityIndicator name="Ambient Light" supported={systemInfo.sensors.ambientLight} />
                    <CapabilityIndicator name="Proximity" supported={systemInfo.sensors.proximity} />
                  </div>
                  {systemInfo.sensors.battery && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded p-3 sm:p-4">
                      <h3 className="text-green-300 font-bold mb-3 text-sm sm:text-base">Battery Status</h3>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-400">Level:</span>
                          <span className="text-green-300">{systemInfo.sensors.battery.level}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-400">Charging:</span>
                          <span className="text-green-300">{systemInfo.sensors.battery.charging ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded overflow-hidden">
                          <div 
                            className={`h-full transition-all ${
                              systemInfo.sensors.battery.charging ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${systemInfo.sensors.battery.level}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-4 justify-center flex-wrap">
                <button
                  onClick={startSystemScan}
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-purple-500 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded font-mono transition-all text-sm"
                >
                  Deep Rescan
                </button>
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(systemInfo, null, 2);
                    const blob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'system-profile.json';
                    a.click();
                  }}
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded font-mono transition-all text-sm"
                >
                  Extract Data
                </button>
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
        <div className="h-full w-full bg-gradient-to-t from-transparent via-purple-500/5 to-transparent animate-glitch opacity-30"></div>
      </div>
    </div>
  );
};

export default SystemScanner;
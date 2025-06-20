import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wifi, Globe, MapPin, Shield, Zap, Server, Router, Signal } from 'lucide-react';
import SkeletonLoader from './SkeletonLoader';

interface NetworkInfo {
  publicIP: string;
  localIP: string;
  userAgent: string;
  connectionType: string;
  downlink: string;
  effectiveType: string;
  rtt: string;
  timezone: string;
  language: string;
  dnsServers: string[];
  geolocation: {
    country: string;
    region: string;
    city: string;
    isp: string;
    org: string;
    lat: number;
    lon: number;
  } | null;
}

const NetworkScanner: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanStep, setCurrentScanStep] = useState('');

  const scanSteps = [
    'Detecting network interfaces...',
    'Probing connection parameters...',
    'Resolving public IP address...',
    'Performing geolocation lookup...',
    'Analyzing connection quality...',
    'Fingerprinting network stack...',
    'Scan complete - Network profile acquired'
  ];

  const getLocalIP = async (): Promise<string> => {
    return new Promise((resolve) => {
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');
      pc.createOffer().then(offer => pc.setLocalDescription(offer));
      
      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) return;
        const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)?.[1];
        if (myIP) {
          pc.close();
          resolve(myIP);
        }
      };
      
      setTimeout(() => resolve('Unable to detect'), 3000);
    });
  };

  const getPublicIPAndGeo = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        ip: data.ip,
        geolocation: {
          country: data.country_name,
          region: data.region,
          city: data.city,
          isp: data.org,
          org: data.org,
          lat: data.latitude,
          lon: data.longitude
        }
      };
    } catch (error) {
      return {
        ip: 'Unable to detect',
        geolocation: null
      };
    }
  };

  const performNetworkScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    for (let i = 0; i < scanSteps.length; i++) {
      setCurrentScanStep(scanSteps[i]);
      setScanProgress((i / (scanSteps.length - 1)) * 100);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Gather network information
    const localIP = await getLocalIP();
    const { ip: publicIP, geolocation } = await getPublicIPAndGeo();
    
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    const networkData: NetworkInfo = {
      publicIP,
      localIP,
      userAgent: navigator.userAgent,
      connectionType: connection?.type || 'Unknown',
      downlink: connection?.downlink ? `${connection.downlink} Mbps` : 'Unknown',
      effectiveType: connection?.effectiveType || 'Unknown',
      rtt: connection?.rtt ? `${connection.rtt}ms` : 'Unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      dnsServers: ['8.8.8.8', '1.1.1.1', 'Auto-detected'], // Simulated
      geolocation
    };

    setNetworkInfo(networkData);
    setIsScanning(false);
    setScanComplete(true);
  };

  useEffect(() => {
    performNetworkScan();
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div
              key={i}
              className="border-blue-900 border-r border-b animate-pulse"
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gray-900 border-b border-blue-500 p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 border border-blue-500 rounded hover:bg-blue-500/10 transition-colors text-sm"
          >
            <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Wifi size={16} className="sm:w-5 sm:h-5" />
            <span className="text-blue-300 text-sm sm:text-base">Network Analysis Scanner</span>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>

      <div className="relative z-10 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Scanning Progress */}
          {isScanning && (
            <div className="mb-6 sm:mb-8">
              <div className="bg-black/80 border-2 border-blue-500 rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <h2 className="text-blue-300 font-bold text-lg sm:text-xl">Network Reconnaissance Active</h2>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span className="text-blue-400">{currentScanStep}</span>
                    <span className="text-blue-300">{Math.round(scanProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
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
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-300 mb-2">Analyzing Network...</h1>
                <p className="text-blue-400 text-sm sm:text-base">Gathering network intelligence and connection data</p>
              </div>
              <SkeletonLoader type="card" count={4} />
            </div>
          ) : networkInfo && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-300 mb-2">Network Profile Acquired</h1>
                <p className="text-blue-400 text-sm sm:text-base">Complete network fingerprint and connection analysis</p>
              </div>

              {/* IP Information */}
              <div className="bg-black/80 border-2 border-blue-500 rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <Globe size={20} className="text-blue-400 sm:w-6 sm:h-6" />
                  <h2 className="text-blue-300 font-bold text-lg sm:text-xl">IP Address Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 sm:p-4">
                    <h3 className="text-blue-300 font-bold mb-2 text-sm sm:text-base">Public IP</h3>
                    <p className="text-blue-400 font-mono text-base sm:text-lg break-all">{networkInfo.publicIP}</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 sm:p-4">
                    <h3 className="text-blue-300 font-bold mb-2 text-sm sm:text-base">Local IP</h3>
                    <p className="text-blue-400 font-mono text-base sm:text-lg break-all">{networkInfo.localIP}</p>
                  </div>
                </div>
              </div>

              {/* Geolocation */}
              {networkInfo.geolocation && (
                <div className="bg-black/80 border-2 border-green-500 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4">
                    <MapPin size={20} className="text-green-400 sm:w-6 sm:h-6" />
                    <h2 className="text-green-300 font-bold text-lg sm:text-xl">Geolocation Data</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex justify-between">
                          <span className="text-green-400 text-sm">Country:</span>
                          <span className="text-green-300 text-sm">{networkInfo.geolocation.country}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-400 text-sm">Region:</span>
                          <span className="text-green-300 text-sm">{networkInfo.geolocation.region}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-400 text-sm">City:</span>
                          <span className="text-green-300 text-sm">{networkInfo.geolocation.city}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-400 text-sm">ISP:</span>
                          <span className="text-green-300 text-sm break-all">{networkInfo.geolocation.isp}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-400 text-sm">Latitude:</span>
                          <span className="text-green-300 text-sm">{networkInfo.geolocation.lat}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-400 text-sm">Longitude:</span>
                          <span className="text-green-300 text-sm">{networkInfo.geolocation.lon}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded p-3 sm:p-4">
                      <div className="text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <MapPin size={20} className="text-green-400 sm:w-6 sm:h-6" />
                        </div>
                        <p className="text-green-300 text-xs sm:text-sm">Location Acquired</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Connection Details */}
              <div className="bg-black/80 border-2 border-yellow-500 rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <Signal size={20} className="text-yellow-400 sm:w-6 sm:h-6" />
                  <h2 className="text-yellow-300 font-bold text-lg sm:text-xl">Connection Analysis</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 sm:p-4 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-yellow-400 mb-1 break-all">{networkInfo.connectionType}</div>
                    <div className="text-yellow-500 text-xs sm:text-sm">Connection Type</div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 sm:p-4 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-yellow-400 mb-1">{networkInfo.downlink}</div>
                    <div className="text-yellow-500 text-xs sm:text-sm">Downlink Speed</div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 sm:p-4 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-yellow-400 mb-1">{networkInfo.effectiveType}</div>
                    <div className="text-yellow-500 text-xs sm:text-sm">Network Quality</div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 sm:p-4 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-yellow-400 mb-1">{networkInfo.rtt}</div>
                    <div className="text-yellow-500 text-xs sm:text-sm">Round Trip Time</div>
                  </div>
                </div>
              </div>

              {/* System Information */}
              <div className="bg-black/80 border-2 border-purple-500 rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <Server size={20} className="text-purple-400 sm:w-6 sm:h-6" />
                  <h2 className="text-purple-300 font-bold text-lg sm:text-xl">System Environment</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-purple-500/20 gap-1">
                    <span className="text-purple-400 text-sm">Timezone:</span>
                    <span className="text-purple-300 text-sm break-all">{networkInfo.timezone}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-purple-500/20 gap-1">
                    <span className="text-purple-400 text-sm">Language:</span>
                    <span className="text-purple-300 text-sm">{networkInfo.language}</span>
                  </div>
                  <div className="py-2">
                    <span className="text-purple-400 block mb-2 text-sm">User Agent:</span>
                    <span className="text-purple-300 text-xs sm:text-sm font-mono break-all">{networkInfo.userAgent}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-4 justify-center flex-wrap">
                <button
                  onClick={performNetworkScan}
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-blue-500 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded font-mono transition-all text-sm"
                >
                  Rescan Network
                </button>
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(networkInfo, null, 2);
                    const blob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'network-analysis.json';
                    a.click();
                  }}
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded font-mono transition-all text-sm"
                >
                  Export Data
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
        <div className="h-full w-full bg-gradient-to-t from-transparent via-blue-500/5 to-transparent animate-glitch opacity-30"></div>
      </div>
    </div>
  );
};

export default NetworkScanner;
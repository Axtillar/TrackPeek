import React, { useState, useEffect } from 'react';
import { Shield, Eye, Terminal, Zap, Network, Database, Lock, Skull } from 'lucide-react';
import LoadingScreen from './components/LoadingScreen';
import MatrixRain from './components/MatrixRain';
import FingerprintScanner from './components/FingerprintScanner';
import PermissionScanner from './components/PermissionScanner';
import NetworkScanner from './components/NetworkScanner';
import SystemScanner from './components/SystemScanner';

function App() {
  const [displayText, setDisplayText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [activeScanner, setActiveScanner] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const fullText = "TrackPeek";

  // Loading simulation
  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    return () => clearInterval(loadingInterval);
  }, []);

  // Typing effect after loading
  useEffect(() => {
    if (!isLoading) {
      let index = 0;
      const timer = setInterval(() => {
        if (index <= fullText.length) {
          setDisplayText(fullText.slice(0, index));
          index++;
        } else {
          clearInterval(timer);
          setTimeout(() => setShowContent(true), 500);
        }
      }, 120);

      return () => clearInterval(timer);
    }
  }, [isLoading]);

  const scannerOptions = [
    {
      id: 'basic',
      title: 'Basic Fingerprint Scan',
      subtitle: 'Device & Browser Analysis',
      description: 'Extract comprehensive device information, browser details, and system specifications',
      icon: Terminal,
      color: 'green',
      threat: 'LOW',
      component: FingerprintScanner
    },
    {
      id: 'permission',
      title: 'Permission-Based Scan',
      subtitle: 'Advanced Access Control',
      description: 'Request sensitive permissions for camera, microphone, location, and clipboard access',
      icon: Shield,
      color: 'red',
      threat: 'HIGH',
      component: PermissionScanner
    },
    {
      id: 'network',
      title: 'Network Analysis',
      subtitle: 'Connection Profiling',
      description: 'Analyze network connections, IP geolocation, and connection fingerprinting',
      icon: Network,
      color: 'blue',
      threat: 'MEDIUM',
      component: NetworkScanner
    },
    {
      id: 'system',
      title: 'System Exploitation',
      subtitle: 'Deep System Probe',
      description: 'Advanced system analysis, performance monitoring, and resource enumeration',
      icon: Database,
      color: 'purple',
      threat: 'CRITICAL',
      component: SystemScanner
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'border-green-500 text-green-400 hover:bg-green-500/10 hover:shadow-green-500/50',
      red: 'border-red-500 text-red-400 hover:bg-red-500/10 hover:shadow-red-500/50',
      blue: 'border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:shadow-blue-500/50',
      purple: 'border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:shadow-purple-500/50'
    };
    return colors[color as keyof typeof colors] || colors.green;
  };

  const getThreatColor = (threat: string) => {
    const colors = {
      LOW: 'text-green-400 bg-green-500/20',
      MEDIUM: 'text-yellow-400 bg-yellow-500/20',
      HIGH: 'text-red-400 bg-red-500/20',
      CRITICAL: 'text-purple-400 bg-purple-500/20'
    };
    return colors[threat as keyof typeof colors] || colors.LOW;
  };

  if (isLoading) {
    return (
      <LoadingScreen 
        progress={loadingProgress} 
        onComplete={() => setIsLoading(false)} 
      />
    );
  }

  if (activeScanner) {
    const scanner = scannerOptions.find(s => s.id === activeScanner);
    if (scanner) {
      const Component = scanner.component;
      return <Component onBack={() => setActiveScanner(null)} />;
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Optimized Matrix Rain Background */}
      <MatrixRain intensity={0.02} />

      {/* Scanlines Effect */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="h-full w-full opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff41 2px, #00ff41 4px)',
          animation: 'scanlines 0.1s linear infinite'
        }}></div>
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Main Title with Improved Glitch Effect */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 sm:mb-4 relative">
            <span className="text-green-400 relative z-10 glitch-container">
              {displayText}
              <span className="animate-blink">_</span>
              {/* Improved glitch layers */}
              <span 
                className="absolute top-0 left-0 text-red-500 opacity-60 pointer-events-none"
                style={{ 
                  transform: 'translateX(1px) translateY(-1px)',
                  animation: 'glitch-red 3s infinite linear'
                }}
              >
                {displayText}
              </span>
              <span 
                className="absolute top-0 left-0 text-blue-500 opacity-60 pointer-events-none"
                style={{ 
                  transform: 'translateX(-1px) translateY(1px)',
                  animation: 'glitch-blue 3s infinite linear reverse'
                }}
              >
                {displayText}
              </span>
            </span>
          </h1>
          
          {showContent && (
            <div className="animate-fadeIn">
              <p className="text-green-300 text-lg sm:text-xl md:text-2xl font-bold mb-4">
                Digital Fingerprint Tracker
              </p>
              <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
                <Skull size={20} className="text-red-500 animate-pulse" />
                <p className="text-red-400 text-sm sm:text-base md:text-lg font-bold">SYSTEM INFILTRATION TOOLKIT</p>
                <Skull size={20} className="text-red-500 animate-pulse" />
              </div>
              <p className="text-green-300 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed px-4">
                Advanced digital reconnaissance platform designed to demonstrate browser security vulnerabilities 
                and data exposure vectors through comprehensive fingerprinting techniques.
              </p>
            </div>
          )}
        </div>

        {showContent && (
          <div className="animate-fadeIn w-full max-w-6xl">
            {/* Warning Banner */}
            <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8 text-center backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lock size={16} className="text-red-400 sm:w-5 sm:h-5" />
                <span className="text-red-400 font-bold text-sm sm:text-base">SECURITY ASSESSMENT ACTIVE</span>
                <Lock size={16} className="text-red-400 sm:w-5 sm:h-5" />
              </div>
              <p className="text-red-300 text-xs sm:text-sm">
                The following modules will attempt to extract sensitive information from your browser and system.
                Proceed only if you understand the implications.
              </p>
            </div>

            {/* Scanner Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {scannerOptions.map((scanner) => {
                const Icon = scanner.icon;
                return (
                  <div
                    key={scanner.id}
                    className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105`}
                    onClick={() => setActiveScanner(scanner.id)}
                  >
                    <div className={`border-2 rounded-lg p-4 sm:p-6 bg-black/80 backdrop-blur-sm ${getColorClasses(scanner.color)} hover:shadow-2xl`}>
                      {/* Threat Level Badge */}
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getThreatColor(scanner.threat)}`}>
                          {scanner.threat}
                        </span>
                      </div>

                      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="p-2 sm:p-3 rounded-lg bg-black/50 border border-current flex-shrink-0">
                          <Icon size={24} className="sm:w-8 sm:h-8" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold mb-1 leading-tight">{scanner.title}</h3>
                          <p className="text-xs sm:text-sm opacity-80 mb-2">{scanner.subtitle}</p>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm opacity-90 mb-3 sm:mb-4 leading-relaxed">
                        {scanner.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                          <span className="text-xs font-mono">READY</span>
                        </div>
                        <button className="px-3 sm:px-4 py-1 sm:py-2 bg-current/20 rounded font-bold text-xs hover:bg-current/30 transition-colors">
                          INITIATE SCAN
                        </button>
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-current/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* System Status Panel */}
            <div className="bg-black/90 border-2 border-green-500 rounded-lg p-4 sm:p-6 mb-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <Eye size={20} className="text-green-400 flex-shrink-0" />
                <h2 className="text-green-300 font-bold text-lg sm:text-xl">SYSTEM STATUS</h2>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs sm:text-sm">OPERATIONAL</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
                <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
                  <div className="text-xl sm:text-2xl font-bold text-green-400">4</div>
                  <div className="text-green-500 text-xs sm:text-sm">Scan Modules</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                  <div className="text-xl sm:text-2xl font-bold text-blue-400">∞</div>
                  <div className="text-blue-500 text-xs sm:text-sm">Data Points</div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-400">0ms</div>
                  <div className="text-yellow-500 text-xs sm:text-sm">Latency</div>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                  <div className="text-xl sm:text-2xl font-bold text-red-400">HIGH</div>
                  <div className="text-red-500 text-xs sm:text-sm">Threat Level</div>
                </div>
              </div>
            </div>

            {/* Credit */}
            <div className="text-center">
              <p className="text-green-500/70 text-xs sm:text-sm font-mono">
                Created by Lik Ho N!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Additional Effects */}
      <div className="fixed inset-0 pointer-events-none z-30">
        <div className="h-full w-full bg-gradient-to-t from-transparent via-green-500/2 to-transparent animate-glitch opacity-50"></div>
      </div>
    </div>
  );
}

export default App;
# 🔒 TrackPeek - Digital Fingerprint Tracker

<div align="center">

![TrackPeek Logo](https://via.placeholder.com/400x200/000000/00ff41?text=TrackPeek)

**Advanced Digital Reconnaissance Platform**

[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](#changelog)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()
[![Security](https://img.shields.io/badge/Security-High%20Risk-critical.svg)]()

</div>

---

## 🔒⚠️ Copyright & Legal Notice

> **Copyright © 2025 AxtillaR (Lik Ho N!)**
> 
> This software is proprietary and confidential. Unauthorized reproduction, distribution, or use is strictly prohibited and may result in severe civil and criminal penalties. All rights reserved under international copyright law.

---

## 🌟 What is TrackPeek?

TrackPeek is an advanced digital fingerprint tracker designed to demonstrate browser security vulnerabilities and data exposure vectors through comprehensive fingerprinting techniques. This cybersecurity educational tool showcases how websites can collect extensive information about users' devices, browsers, and system configurations without explicit consent.

**Target Audience:**
- Cybersecurity professionals and researchers
- Privacy advocates and educators
- Web developers learning about browser security
- Security auditors and penetration testers

---

## ✨ Key Features

### 🔍 **Core Functionality**
- **Basic Fingerprint Scanning** - Device & browser analysis with real-time data collection
- **Permission-Based Scanning** - Advanced access control for camera, microphone, location, and clipboard
- **Network Analysis** - IP geolocation, connection profiling, and network fingerprinting
- **System Exploitation** - Deep system probe with performance monitoring and resource enumeration

### ⚡ **Technical Highlights**
- Real-time interaction tracking (mouse movement, clicks, keystrokes)
- WebGL/GPU information extraction
- Battery API monitoring
- Comprehensive browser capability detection
- Live performance metrics and memory usage monitoring
- Advanced sensor access (orientation, motion, ambient light)

### 🎨 **Design & UX**
- Matrix-inspired hacker aesthetic with green terminal theme
- Animated loading screens with security protocol simulation
- Interactive data visualization with expandable sections
- Responsive design optimized for all devices
- Glitch effects and scanline animations
- Real-time status indicators and threat level badges

---

## 📁 Project Structure

```
TrackPeek/
├── 📄 index.html                 # Main HTML entry point
├── 📄 package.json              # Dependencies and scripts
├── 📄 vite.config.ts            # Vite configuration
├── 📄 tailwind.config.js        # Tailwind CSS configuration
├── 📄 tsconfig.json             # TypeScript configuration
├── 📂 src/
│   ├── 📄 main.tsx              # React application entry
│   ├── 📄 App.tsx               # Main application component
│   ├── 📄 index.css             # Global styles and animations
│   └── 📂 components/
│       ├── 📄 LoadingScreen.tsx      # Animated loading interface
│       ├── 📄 MatrixRain.tsx         # Matrix background effect
│       ├── 📄 FingerprintScanner.tsx # Basic device fingerprinting
│       ├── 📄 PermissionScanner.tsx  # Advanced permission requests
│       ├── 📄 NetworkScanner.tsx     # Network analysis module
│       ├── 📄 SystemScanner.tsx      # System exploitation scanner
│       └── 📄 SkeletonLoader.tsx     # Loading state components
├── 📄 README.md                 # Project documentation
└── 📄 LICENSE                   # Proprietary license
```

---

## ⚙️ Tech Stack

### **Frontend Framework**
- **React 18.3.1** - Modern UI library with hooks
- **TypeScript 5.5.3** - Type-safe JavaScript development
- **Vite 5.4.2** - Fast build tool and development server

### **Styling & UI**
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React 0.344.0** - Beautiful icon library
- **Custom CSS Animations** - Matrix effects, glitch animations, scanlines

### **Browser APIs**
- **WebGL/WebGL2** - GPU information extraction
- **MediaDevices API** - Camera and microphone access
- **Geolocation API** - GPS coordinate tracking
- **Battery API** - Power status monitoring
- **Clipboard API** - Copy/paste operations
- **Performance API** - System metrics collection

### **Development Tools**
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm/yarn
- Modern web browser with JavaScript enabled
- HTTPS connection (required for some APIs)

### **Installation**
```bash
# Clone the repository
git clone https://github.com/AxtillaR/TrackPeek.git
cd TrackPeek

# Install dependencies
npm install
```

### **Development**
```bash
# Start development server
npm run dev

# Access at http://localhost:5173
```

### **Production Build**
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### **Deployment**
```bash
# Deploy to static hosting (Netlify, Vercel, etc.)
npm run build
# Upload dist/ folder to your hosting provider
```

---

## 🎯 Usage Guide

### **Getting Started**
1. Launch the application and wait for the loading sequence
2. Choose from four scanning modules based on threat level
3. Grant permissions when prompted for enhanced data collection
4. View real-time data extraction and system analysis

### **Scanning Modules**

#### 🟢 **Basic Fingerprint Scan (LOW THREAT)**
- Device information and browser details
- Screen resolution and hardware specs
- Real-time interaction tracking
- Export fingerprint data as JSON

#### 🔴 **Permission-Based Scan (HIGH THREAT)**
- Camera access with live video feed
- Microphone monitoring with audio visualization
- GPS location tracking with address resolution
- Clipboard access and content monitoring

#### 🔵 **Network Analysis (MEDIUM THREAT)**
- Public and local IP detection
- Geolocation with ISP information
- Connection quality metrics
- Network fingerprinting

#### 🟣 **System Exploitation (CRITICAL THREAT)**
- Hardware capability enumeration
- Browser feature detection
- Sensor access testing
- Real-time performance monitoring

### **Data Export**
- Click "Export Data" to download JSON files
- Use "Rescan" to refresh information
- Toggle sections to view detailed breakdowns

---

## 🔧 Configuration

### **Theme Customization**
Modify colors in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      'matrix-green': '#00ff41',
      'terminal-black': '#000000'
    }
  }
}
```

### **Animation Settings**
Adjust effects in `src/index.css`:
```css
@keyframes glitch {
  /* Customize glitch intensity */
}
```

### **Security Settings**
Configure permission requests in component files:
- Camera resolution in `PermissionScanner.tsx`
- Geolocation accuracy in location handlers
- Data collection intervals for real-time monitoring

---

## 🚀 Performance Features

### **Optimization Techniques**
- **Lazy Loading** - Components load on demand
- **Memory Management** - Automatic cleanup of media streams
- **Animation Optimization** - CSS transforms for smooth effects
- **Bundle Splitting** - Vite code splitting for faster loads

### **Browser Compatibility**
- Modern browsers with ES2020+ support
- WebGL-enabled devices for GPU detection
- HTTPS required for sensitive APIs
- Mobile-responsive design

---

## 🛠️ Development

### **Available Scripts**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### **Code Style**
- TypeScript strict mode enabled
- ESLint with React hooks rules
- Consistent component structure
- Modular CSS with Tailwind utilities

### **Adding New Scanners**
1. Create component in `src/components/`
2. Add to scanner options in `App.tsx`
3. Implement scanning logic and UI
4. Add appropriate threat level and styling

---

## 🔒 Legal & Licensing

This software is protected under a **Proprietary License**. See the [LICENSE](LICENSE) file for complete terms and conditions.

**Key Restrictions:**
- No unauthorized use, copying, or distribution
- No reverse engineering or derivative works
- Commercial use strictly prohibited
- All rights reserved by AxtillaR (Lik Ho N!)

For licensing inquiries, contact: AxtillaR@Duck.com

---

## 📞 Contact & Support

### **Developer**
- **Name:** AxtillaR (Lik Ho N!)
- **Email:** AxtillaR@Duck.com
- **Portfolio:** https://AxtillaR.Github.io
- **Twitter:** @AxtillaR

### **Support**
For technical support, bug reports, or feature requests, please contact via email with detailed information about your issue.

---

## 📈 Changelog

### **Version 1.0.0** (2025-01-XX)
- 🎉 Initial release
- ✨ Four comprehensive scanning modules
- 🔒 Advanced permission-based data collection
- 🎨 Matrix-inspired UI with animations
- 📱 Full responsive design
- 🚀 Real-time monitoring capabilities
- 📊 Data export functionality
- 🔧 Modular component architecture

---

## 🙏 Acknowledgments

### **Frameworks & Libraries**
- **React Team** - For the excellent React framework
- **Tailwind Labs** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon library
- **Vite Team** - For the fast build tool

### **Design Inspiration**
- **The Matrix** - Visual aesthetic and terminal themes
- **Cyberpunk Genre** - Color schemes and typography
- **Security Tools** - UI patterns and data visualization

### **Browser APIs**
- **W3C Standards** - For comprehensive web APIs
- **Browser Vendors** - For implementing modern web standards

---

<div align="center">

**Made with ❤️ by AxtillaR (Lik Ho N!)**

*Demonstrating the importance of digital privacy and browser security*

</div>

# 🛡️ AuthGuard - Email Authentication Checker

A comprehensive email security toolkit for analyzing and validating **SPF**, **DKIM**, and **DMARC** records. Protect your domain from email spoofing and phishing attacks with real-time DNS authentication analysis.

## ✨ Features

### Core Functionality
- ✅ **SPF Record Analysis** - Validate Sender Policy Framework configurations
- ✅ **DKIM Validation** - Check DomainKeys Identified Mail signatures
- ✅ **DMARC Policy Review** - Analyze Domain-based Message Authentication policies
- ✅ **Security Scoring** - Get instant security grades (A+ to F)
- ✅ **Exploit Scenarios** - See how attackers could abuse misconfigurations
- ✅ **Remediation Recommendations** - Step-by-step fixes with code examples

### UI/UX Enhancements (v1.0)
- 🎨 **Professional Cybersecurity Theme** - Dark mode with neon cyan accents
- ✨ **Animated Progress Indicators** - Real-time scanning with glow effects
- 🌟 **Neon Glow Effects** - Status indicators with cybersecurity aesthetics
- 📊 **Interactive Cards** - Hover effects and smooth transitions
- 🔍 **Detailed Findings** - Comprehensive analysis with severity indicators
- 🗂️ **Tabbed Interface** - Organized data presentation
- 📱 **Fully Responsive** - Optimized for mobile, tablet, desktop, and ultra-wide displays
- 🖨️ **Print-Friendly** - Optimized layouts for report printing
- ⚡ **Smooth Animations** - 60fps transitions and micro-interactions
- ♿ **Accessibility** - Keyboard navigation and reduced motion support

### 🤖 AI Automation Features (v2.0 - NEW!)
- **🧠 AI Security Insights** - Intelligent analysis with executive summaries
- **⚠️ AI Threat Intelligence** - Real-time threat level assessment & attack scenarios
- **💬 AI Chatbot Assistant** - Interactive Q&A about email security
- **🗣️ Natural Language Explanations** - Technical findings in simple terms
- **📄 AI Security Reports** - Comprehensive downloadable reports (PDF & JSON)
- **📥 Download Reports** - Export analysis in PDF or JSON format
- **🎯 Smart Recommendations** - Context-aware remediation guidance
- **🤖 Automation Mode** - Paste email headers for enhanced analysis
- **📊 Risk Scoring** - 0-100 point scale with confidence levels
- **🔍 Header Parsing** - Auto-detect authentication results & mismatches
- **Powered by Anthropic Claude AI** - Latest AI technology for security analysis

> 📖 **Full AI setup guide:** [AI_INTEGRATION.md](./AI_INTEGRATION.md)  
> 📖 **Automation Mode guide:** [AUTOMATION_MODE.md](./AUTOMATION_MODE.md)  
> 📖 **Download Reports guide:** [DOWNLOAD_REPORT_GUIDE.md](./DOWNLOAD_REPORT_GUIDE.md)


## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:5173
```

### 🤖 Enable AI Features (Optional)

1. Get an API key from [Anthropic Console](https://console.anthropic.com/)
2. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
3. Add your API key to `.env`:
   ```env
   VITE_ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
   ```
4. Restart the dev server

> 📖 **Detailed AI setup:** [AI_INTEGRATION.md](./AI_INTEGRATION.md)

### Production Build

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

## 🌐 Deploy for Public Viewing

### Option 1: Deploy to Vercel (Recommended - 1 Minute)
```bash
npm i -g vercel
vercel --prod
```
Or visit: [vercel.com/new](https://vercel.com/new)

### Option 2: Deploy to Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```
Or visit: [app.netlify.com](https://app.netlify.com)

### Option 3: Manual Deployment
Upload the `dist` folder to any static hosting:
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Surge.sh

📖 **Full deployment guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📱 Responsive Design

Fully optimized for all screen sizes:

| Device | Breakpoint | Layout |
|--------|-----------|---------|
| 📱 Extra Small Mobile | 360px - 479px | Single column |
| 📱 Small Mobile | 480px - 599px | Optimized touch targets |
| 📱 Mobile Portrait | 600px - 767px | Stacked layout |
| 📲 Tablet Portrait | 768px - 959px | 2-column grid |
| 📲 Tablet Landscape | 960px - 1023px | Enhanced spacing |
| 💻 Small Desktop | 1024px - 1399px | 3-column grid |
| 🖥️ Desktop | 1400px - 1599px | Max-width 1600px |
| 🖥️ Ultra-wide | 1600px+ | Max-width 1800px |

**Special Features:**
- 🔄 Landscape orientation support for mobile devices
- 🖨️ Print-optimized layouts for reports
- ♿ Accessibility features (reduced motion, focus states)

## 🛠️ Tech Stack

- **React 18** - Modern UI library with hooks
- **Vite 7** - Lightning-fast build tool with HMR
- **CSS3** - Custom properties, animations, Grid, Flexbox
- **IBM Plex Sans & Mono** - Professional typography
- **JetBrains Mono** - Monospace code font

### Design System
- **Color Palette**: Dark cybersecurity theme (#0a0e27 base)
- **Accent Colors**: Neon cyan (#00d4ff), green (#00ff9f), red (#ff3366)
- **Typography**: IBM Plex (UI), JetBrains Mono (code)
- **Effects**: Glow shadows, smooth transitions, backdrop blur
- **Animations**: Fade-slide, pulse, shimmer, ripple effects

## 📦 Project Structure

```
email-security-toolkit/
├── src/
│   ├── AuthChecker.jsx      # Main component (576 lines)
│   ├── AuthChecker.css       # Cybersecurity theme styles (2100+ lines)
│   ├── App.jsx               # Root component
│   ├── App.css               # Minimal wrapper styles
│   ├── main.jsx              # React entry point
│   └── index.css             # Global base styles
├── public/
│   ├── robots.txt            # SEO configuration
│   └── _redirects            # SPA routing rules
├── dist/                     # Production build output
├── vercel.json               # Vercel deployment config
├── netlify.toml              # Netlify deployment config
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies
└── DEPLOYMENT.md             # Comprehensive deployment guide
```

## 🔒 Security Features

- Security headers configured (CSP, X-Frame-Options, etc.)
- No sensitive data in client-side code
- DNS simulation (no real API calls - demo purposes)
- HTTPS recommended for production

## 💡 Usage

1. **Enter a domain** (e.g., example.com) in the input field
2. **Click "Run Check"** or press Enter to start analysis
3. **Watch real-time progress** through SPF → DKIM → DMARC → SCORE steps
4. **View results** across tabbed interface:
   - **Overview**: Security grade, record cards, exploit scenarios
   - **Findings**: Detailed analysis with pass/warn/fail indicators
   - **Recommendations**: Prioritized remediation steps with code
   - **DNS Records**: Raw DNS TXT record inspector
5. **Use sample domains** for quick testing:
   - google.com (A+ grade)
   - microsoft.com (A+ grade) 
   - amazon.com (B grade)
   - weak-domain.com (D grade)
   - phishing-lookalike.net (F grade)

### Understanding Results

**Grade System:**
- 🟢 **A+** - Excellent (No issues)
- 🟢 **B** - Good (Minor improvements)
- 🟡 **C** - Fair (Some gaps)
- 🟠 **D** - Poor (Significant issues)
- 🔴 **F** - Critical (Immediate action required)

**Status Icons:**
- ✓ **Pass** - Meets security standards
- ⚠ **Warn** - Suboptimal configuration
- ✗ **Fail** - Critical misconfiguration

## 🎨 Customization

### Modify DNS Database
Edit the `DNS_DATABASE` object in [src/AuthChecker.jsx](./src/AuthChecker.jsx):

```javascript
const DNS_DATABASE = {
  'yourdomain.com': {
    spf: { /* SPF config */ },
    dkim: { /* DKIM config */ },
    dmarc: { /* DMARC config */ }
  }
};
```

### Update Styling
Modify [src/AuthChecker.css](./src/AuthChecker.css) - includes comprehensive CSS custom properties:

```css
:root {
  /* Background Colors */
  --bg: #0a0e27;
  --surface: #1a1f3a;
  --surface-2: #242b4a;
  
  /* Accent Colors */
  --accent: #00d4ff;
  --pass: #00ff9f;
  --fail: #ff3366;
  --warn: #ffaa00;
  
  /* Text Colors */
  --text: #e4e7f0;
  --text-2: #a0a8c5;
  
  /* Glow Effects */
  --accent-glow: rgba(0, 212, 255, 0.4);
  --pass-glow: rgba(0, 255, 159, 0.4);
  
  /* Shadows */
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
}
```

### Key Features to Customize
- **Colors**: Modify color variables for different themes
- **Fonts**: Change font-family declarations
- **Animations**: Adjust timing, duration in keyframes
- **Spacing**: Update padding/margin values
- **Border Radius**: Modify roundness of cards/buttons

## 📄 License

This project is available for educational and demonstration purposes.

## 👥 Contributing

Contributions are welcome! Please ensure:
- Code follows existing style conventions
- Responsive design is maintained across all breakpoints
- Accessibility features are preserved

## 🐛 Troubleshooting

**Build errors?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Blank page after deployment?**
- Check browser console for errors
- Verify SPA redirect rules are configured
- Ensure base URL matches deployment path

**Development server not accessible on network?**
- Check firewall settings
- Verify `vite.config.js` has `server.host: '0.0.0.0'`

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
3. Verify all dependencies are installed (`npm install`)

## 🎉 What's New in v1.0

### Major UI/UX Overhaul
- ✨ **Dark Cybersecurity Theme** - Professional aesthetic with #0a0e27 background
- 🌟 **Neon Glow Effects** - Cyan, green, and red status indicators with shadows
- 🎨 **Enhanced Animations** - Smooth transitions, pulse effects, ripple buttons
- 📱 **Improved Responsiveness** - Better mobile layouts and touch targets
- 🖼️ **Card Hover Effects** - Elevated cards with border glow on hover
- ⚡ **Progress Animations** - Real-time step indicators with colored progress bars
- 🎯 **Better Typography** - JetBrains Mono for code, IBM Plex for UI
- 🔄 **Interactive Elements** - Shimmer effects, backdrop blur, gradient overlays
- 🎭 **Professional Polish** - Box shadows, border gradients, animated backgrounds

### Enhanced Features
- 🛡️ **Exploit Scenarios Panel** - Shows attack vectors for vulnerabilities
- 📋 **Priority-based Recommendations** - Critical/High/Medium severity levels
- 🔍 **Enhanced DNS Viewer** - Color-coded record types with better formatting
- 📊 **Improved Score Display** - Animated ring with glowing effects
- 🎨 **Visual Hierarchy** - Better spacing, contrast, and information architecture

---

**Built with ❤️ using React + Vite** | **Ready for production deployment** | **100% Responsive** | **v1.0 - Cybersecurity Theme**

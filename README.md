# 🔐 AuthGuard — Email Authentication Security Checker

<div align="center">

**Professional DKIM, SPF, and DMARC Vulnerability Scanner with AI Automation**

[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)]()
[![Version](https://img.shields.io/badge/Version-2.0.0-blue?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)]()
[![AI](https://img.shields.io/badge/AI-Claude%20Powered-purple?style=for-the-badge)]()

*Identify email authentication gaps before attackers do — now with AI intelligence*

[Features](#features) • [AI Features](#-ai-automation-new) • [Demo](#demo) • [Installation](#installation) • [Usage](#usage) • [Contributing](#contributing)

</div>

---

## 📖 Overview

**AuthGuard** is a professional-grade email authentication security scanner that analyzes domains for SPF, DKIM, and DMARC misconfigurations. Built with a modern cybersecurity-focused UI and powered by **Anthropic's Claude AI**, it helps security professionals, system administrators, and domain owners identify vulnerabilities that could be exploited for email spoofing and phishing attacks.

### 🆕 What's New in v2.0

**AI Automation Integration** — AuthGuard now features cutting-edge AI capabilities:
- 🤖 **AI Security Insights** with executive summaries
- 💬 **Interactive AI Chatbot** for security questions
- ⚠️ **AI Threat Intelligence** with attack scenario generation
- 📄 **Automated Report Generation** with AI analysis
- 🗣️ **Natural Language Explanations** of technical findings
- 🎯 **Smart Recommendations** with context-aware guidance

### Why AuthGuard?

Email authentication protocols (SPF, DKIM, DMARC) are critical for preventing domain spoofing and phishing. However, misconfigurations are common and can leave domains vulnerable to:

- 📧 **Email Spoofing** — Attackers impersonating your domain
- 🎣 **Phishing Campaigns** — Using your domain for malicious emails
- 🔓 **Brand Reputation Damage** — Loss of customer trust
- ⚠️ **Delivery Issues** — Legitimate emails marked as spam

AuthGuard provides instant analysis with actionable recommendations to secure your email infrastructure.

---

## ✨ Features

### 🔍 **Comprehensive Analysis**
- **SPF (Sender Policy Framework)** validation and policy analysis
- **DKIM (DomainKeys Identified Mail)** signature verification
- **DMARC (Domain-based Message Authentication)** policy enforcement checks
- Real-time DNS record lookup and parsing
- Policy strength assessment with security grading (A+ to F)

### 🎨 **Modern Cybersecurity UI**
- **Dark theme** optimized for extended use
- **Neon glow effects** on status indicators
- **Animated progress tracking** with visual feedback
- **Interactive cards** with hover effects
- **Responsive design** for all devices (mobile to 4K)
- **Professional typography** using IBM Plex & JetBrains Mono fonts

### 📊 **Detailed Reporting**
- **Visual grade system** (A+ to F) with percentage scores
- **Finding categorization** (Pass/Warn/Fail)
- **Exploit scenarios** showing potential attack vectors
- **Remediation recommendations** with code examples
- **DNS record viewer** with formatted output

### 🛡️ **Security Insights**
- Identifies weak SPF policies (+all, ~all)
- Detects missing or revoked DKIM keys
- Highlights DMARC policy gaps (none, quarantine)
- Warns about DNS lookup limits
- Provides alignment strictness analysis

### 🚀 **User Experience**
- **One-click domain scanning**
- **Sample domains** for quick testing
- **Tabbed interface** for organized data
- **Copy-paste ready** configuration fixes
- **Mobile-optimized** touch controls
- **Keyboard navigation** support

---

## 🤖 AI Automation (NEW)

### **Powered by Anthropic Claude AI**

AuthGuard v2.0 introduces comprehensive AI automation features that transform your security analysis experience:

#### 🧠 **AI Security Insights**
- **Executive Summaries** — High-level security assessment in plain language
- **Top Security Risks** — AI-identified critical vulnerabilities ranked by priority
- **Smart Recommendations** — Context-aware remediation guidance
- **Threat Level Assessment** — Critical/High/Medium/Low risk rating

#### 💬 **Interactive AI Chatbot**
- **24/7 Security Assistant** — Ask questions about email authentication
- **Context-Aware Responses** — Understands your current domain analysis
- **Educational Content** — Learn about SPF, DKIM, DMARC concepts
- **Natural Conversations** — Maintains chat history for follow-up questions

**Example Questions:**
- "What is SPF and why is it important?"
- "How do I fix DMARC policy for my domain?"
- "What are the risks if I don't have DKIM?"
- "Explain email spoofing in simple terms"

#### ⚠️ **AI Threat Intelligence**
- **Attack Scenario Generation** — Specific exploitation methods attackers could use
- **Business Impact Analysis** — Real-world consequences explained clearly
- **Remediation Timeline** — How quickly you should address each issue
- **Vulnerability Chaining** — How multiple gaps compound risks

#### 📄 **Automated Report Generation**
- **Professional Documentation** — Executive + technical sections
- **Downloadable Reports** — Markdown format for easy sharing
- **Compliance Ready** — Suitable for audits and stakeholder reviews
- **AI-Enhanced Insights** — Goes beyond basic scan results

#### 🎨 **Beautiful AI Interface**
- **Floating Chatbot Button** — Always-accessible AI assistant
- **Cyberpunk-Themed Panels** — Consistent with AuthGuard design
- **Smooth Animations** — Professional visual feedback
- **Fully Responsive** — Perfect on mobile, tablet, desktop

### 🔧 **AI Setup** (Optional)

AI features work out-of-the-box with fallback data, but for full functionality:

1. **Get API Key** — Sign up at [console.anthropic.com](https://console.anthropic.com/)
2. **Configure Environment**:
   ```bash
   # Run setup script
   setup-ai.bat          # Windows
   ./setup-ai.sh         # Mac/Linux
   
   # Or manually create .env file
   VITE_ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
   ```
3. **Restart Dev Server** — AI features activate automatically

📖 **Full AI Documentation**: [AI_INTEGRATION.md](email-security-toolkit/AI_INTEGRATION.md)

💰 **Cost**: ~$0.01-0.03 per domain analysis (Anthropic API pricing)

---

## 🎯 Demo

### Sample Domains for Testing

Try these pre-configured domains to see AuthGuard in action:

- **google.com** — Excellent configuration (A+)
- **microsoft.com** — Strong security (A+)
- **amazon.com** — Good setup (B)
- **weak-domain.com** — Vulnerable configuration (D)
- **phishing-lookalike.net** — Critical risks (F)

### Screenshots

```
🔒 Header with Animated Logo → Input Card with Domain Search → Progress Indicator
                                        ↓
          Score Banner (A+ to F) → Record Cards (SPF/DKIM/DMARC)
                                        ↓
         🤖 AI Insights Tab (NEW) → Findings → Recommendations → DNS Records
                                        ↓
               💬 Floating AI Chatbot → Interactive Q&A Assistant
```

### Try AI Features

1. **Run a domain check** (e.g., google.com)
2. **Click "🤖 AI Insights" tab** — See AI-powered security analysis
3. **Click "Ask AI" floating button** — Chat with security assistant
4. **Download AI Report** — Get comprehensive markdown documentation

---

## 🛠️ Installation

### Prerequisites

- **Node.js** 18.x or later
- **npm** 9.x or later

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AuthGuard.git
   cd AuthGuard
   ```

2. **Navigate to the project directory**
   ```bash
   cd email-security-toolkit
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### 🤖 Optional: Enable AI Features

6. **Get Anthropic API Key**
   - Visit [console.anthropic.com](https://console.anthropic.com/)
   - Sign up and create an API key

7. **Configure AI**
   ```bash
   # Windows
   setup-ai.bat
   
   # Mac/Linux
   chmod +x setup-ai.sh
   ./setup-ai.sh
   
   # Or manually:
   cp .env.example .env
   # Edit .env and add: VITE_ANTHROPIC_API_KEY=your-key-here
   ```

8. **Restart server** to activate AI features

📖 **Detailed AI Setup**: See [AI_INTEGRATION.md](email-security-toolkit/AI_INTEGRATION.md)

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📱 Usage

### Basic Scan

1. Enter a domain name (e.g., `example.com`)
2. Click **"Run Check"** or press Enter
3. Watch the real-time progress indicator
4. Review results across multiple tabs:
   - **Overview** — Summary cards and exploit scenarios
   - **🤖 AI Insights (NEW)** — AI-powered security analysis and threat intelligence
   - **Findings** — Detailed analysis of all checks
   - **Recommendations** — Step-by-step remediation guides
   - **DNS Records** — Raw DNS TXT records

### AI-Enhanced Workflow (v2.0)

1. **Run domain scan** as usual
2. **View AI Insights tab** for:
   - Executive summary of security posture
   - Top 3 risks identified by AI
   - Priority actions with smart recommendations
   - Threat level assessment and attack scenarios
3. **Ask AI questions** via floating chatbot:
   - Click "Ask AI" button (bottom-right)
   - Type security questions
   - Get context-aware explanations
4. **Download AI Report**:
   - Click "📄 Download Full Report" in AI Insights
   - Get professional markdown documentation

### Understanding Results

#### Grade System
- **A+** — Excellent: Full protection, no issues
- **B** — Good: Minor improvements recommended
- **C** — Fair: Some gaps exist, moderate risk
- **D** — Poor: Significant misconfigurations
- **F** — Critical: Severe vulnerabilities, immediate action required

#### Status Icons
- ✓ **Green (Pass)** — Configuration meets security standards
- ⚠ **Yellow (Warn)** — Suboptimal but functional
- ✗ **Red (Fail)** — Critical misconfiguration or missing

---

## 🏗️ Project Structure

```
AuthGuard/
├── email-security-toolkit/
│   ├── src/
│   │   ├── services/
│   │   │   └── aiService.js         # 🆕 AI API integration (Claude)
│   │   ├── components/
│   │   │   ├── AIChatbot.jsx        # 🆕 AI chatbot component
│   │   │   └── AIChatbot.css        # 🆕 AI chatbot styles
│   │   ├── App.jsx                  # Root component
│   │   ├── App.css                  # Global app styles
│   │   ├── AuthChecker.jsx          # Main checker (enhanced with AI)
│   │   ├── AuthChecker.css          # Component styles + AI features
│   │   ├── main.jsx                 # Application entry point
│   │   └── index.css                # Base styles
│   ├── public/                      # Static assets
│   ├── .env.example                 # 🆕 Environment config template
│   ├── setup-ai.sh                  # 🆕 AI setup script (Unix)
│   ├── setup-ai.bat                 # 🆕 AI setup script (Windows)
│   ├── AI_INTEGRATION.md            # 🆕 AI setup documentation
│   ├── QUICKSTART_AI.md             # 🆕 AI quick start guide
│   ├── RESPONSIVE_DESIGN.md         # 🆕 Responsive design guide
│   ├── package.json                 # Dependencies
│   ├── vite.config.js               # Vite configuration
│   └── index.html                   # HTML template
├── index.html                       # Root redirect
└── README.md                        # Documentation (this file)
```

---

## 🎨 Design System

### Color Palette (Dark Theme)

```css
Background:    #0a0e27  (Deep space blue)
Surface:       #1a1f3a  (Dark surface)
Accent:        #00d4ff  (Cyan blue)
Success:       #00ff9f  (Neon green)
Warning:       #ffaa00  (Amber)
Error:         #ff3366  (Red)
Text Primary:  #e4e7f0  (Light gray)
Text Secondary:#a0a8c5  (Medium gray)
```

### Typography

- **Headers**: IBM Plex Sans (700-900 weight)
- **Body**: IBM Plex Sans (400-600 weight)
- **Code**: JetBrains Mono (400-700 weight)

---

## 🔧 Technologies

### Frontend Stack
- **React 18** — UI framework
- **Vite** — Build tool
- **CSS3** — Styling with custom properties
- **JavaScript ES6+** — Modern syntax

### Key Packages
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "vite": "^7.3.1"
}
```

### AI Integration
- **Anthropic Claude API** — AI-powered security analysis
- **Native Fetch API** — No additional HTTP libraries needed
- **Environment Variables** — Secure API key management

---

## 🔒 Security Analysis Details

### SPF Validation
- Checks for record existence
- Validates `all` mechanism (pass_all, soft_fail, hard_fail)
- Counts DNS lookups (RFC 7208 limit: 10)
- Identifies authorized mail servers
- Recommends policy hardening

### DKIM Verification
- Locates public key records
- Validates key type (RSA, Ed25519)
- Checks for revoked keys
- Confirms selector configuration
- Suggests key rotation practices

### DMARC Policy Analysis
- Verifies policy existence
- Checks enforcement level (none, quarantine, reject)
- Validates percentage application
- Reviews reporting configuration
- Analyzes alignment modes (relaxed vs strict)

---

## 🚦 Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Desktop (Large) | 1920px+ | 3-column grid |
| Desktop | 1400-1920px | 3-column grid |
| Laptop | 1024-1400px | 2-column grid |
| Tablet Landscape | 768-1024px | 2-column grid |
| Tablet Portrait | 600-768px | 1-column stack |
| Mobile Landscape | 480-600px | Compact layout |
| Mobile Portrait | 320-480px | Minimal layout |

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/YourFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add YourFeature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/YourFeature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test on multiple devices
- Update README for new features

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Anthropic** — Claude AI for intelligent security analysis
- **IBM Plex Fonts** — Typography
- **JetBrains Mono** — Monospace font
- **React Team** — Framework
- **Vite Team** — Build tool
- **Email Authentication Community** — Standards and best practices

---

## 📞 Support

### Issues & Bugs
Found a bug? [Open an issue](https://github.com/yourusername/AuthGuard/issues)

### Feature Requests
Have an idea? [Submit a feature request](https://github.com/yourusername/AuthGuard/issues/new)

### Questions
Need help? Check our [Wiki](https://github.com/yourusername/AuthGuard/wiki)

---

## 🗺️ Roadmap

### ✅ Completed (v2.0)
- [x] **AI Security Insights** — Powered by Claude AI
- [x] **Interactive AI Chatbot** — 24/7 security assistant
- [x] **AI Threat Intelligence** — Attack scenario generation
- [x] **Automated Report Generation** — AI-enhanced documentation
- [x] **Natural Language Explanations** — Complex concepts simplified
- [x] **Fully Responsive Design** — Mobile to 4K support
- [x] **Touch Optimization** — Perfect mobile experience

### Planned Features
- [ ] Real DNS API integration (Cloudflare DNS-over-HTTPS)
- [ ] Historical scan tracking with AI trend analysis
- [ ] Export reports (PDF, JSON)
- [ ] Bulk domain scanning with AI batch analysis
- [ ] Email notification system
- [ ] API endpoint for integrations
- [ ] Domain reputation scoring with AI
- [ ] Multi-language AI support
- [ ] Team collaboration features
- [ ] Automated monitoring with AI alerts

---

## 📊 Status

**Current Version**: 2.0.0 (AI-Powered Edition)  
**Status**: Active Development  
**Last Updated**: February 2026  
**New in v2.0**: Comprehensive AI Automation with Claude AI

---

<div align="center">

**Built with ❤️ for the Cybersecurity Community**

[⬆ Back to Top](#-authguard--email-authentication-security-checker)

</div>

# AI Automation Feature Completion - Design Document

## Overview

This design document outlines the technical approach for completing the AI automation features in AuthGuard, focusing on mobile responsiveness, error handling, loading states, accessibility, and production readiness. The design follows a mobile-first approach with progressive enhancement for larger screens.

## Architecture

### Component Structure

```
AuthGuard Application
├── AuthChecker (Main Component)
│   ├── Input Card
│   │   ├── Mode Toggle (Domain Check / Automation Mode)
│   │   ├── Email Headers Input (Automation Mode)
│   │   ├── Domain Input
│   │   └── Action Buttons
│   ├── Progress Indicator (Loading State)
│   ├── Results Section
│   │   ├── Score Banner
│   │   ├── Tab Navigation
│   │   ├── Overview Tab
│   │   ├── AI Insights Tab
│   │   │   ├── Risk Score Card
│   │   │   ├── AI Security Insights
│   │   │   └── Threat Intelligence
│   │   ├── Findings Tab
│   │   ├── Recommendations Tab
│   │   └── DNS Records Tab
│   └── Error Display
├── AIChatbot (Modal Component)
└── Floating Chatbot Button
```

### State Management

```javascript
// Core State
const [domain, setDomain] = useState("");
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// AI State
const [aiInsights, setAiInsights] = useState(null);
const [threatAnalysis, setThreatAnalysis] = useState(null);
const [loadingAI, setLoadingAI] = useState(false);
const [aiError, setAiError] = useState(null);

// Automation Mode State
const [automationMode, setAutomationMode] = useState(false);
const [emailHeaders, setEmailHeaders] = useState("");
const [parsedHeaders, setParsedHeaders] = useState(null);
const [riskScore, setRiskScore] = useState(null);

// UI State
const [activeTab, setActiveTab] = useState("overview");
const [chatbotOpen, setChatbotOpen] = useState(false);
```

## Mobile-First Responsive Design

### Breakpoint Strategy

```css
/* Mobile First - Base styles for 360px+ */
.container { padding: 12px; }
.input-card { flex-direction: column; }
.btn-check { width: 100%; }

/* Tablet Portrait - 768px+ */
@media (min-width: 768px) {
  .container { padding: 24px; }
  .input-row { flex-direction: row; }
  .btn-check { width: auto; }
}

/* Tablet Landscape - 1024px+ */
@media (min-width: 1024px) {
  .container { max-width: 1200px; margin: 0 auto; }
  .records-grid { grid-template-columns: repeat(3, 1fr); }
}

/* Desktop - 1440px+ */
@media (min-width: 1440px) {
  .container { max-width: 1400px; }
}
```

### Touch Target Sizing

All interactive elements will have minimum 44x44px touch targets:

```css
.btn-check,
.btn-reset,
.mode-btn,
.tab-btn,
.sample-chip,
.floating-chatbot-btn {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 20px;
}
```

### Preventing Horizontal Scroll

```css
* {
  box-sizing: border-box;
}

body {
  overflow-x: hidden;
  max-width: 100vw;
}

.container,
.input-card,
.result-card {
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

pre, code {
  overflow-x: auto;
  max-width: 100%;
}
```

## Error Handling System

### Error Types and Messages

```javascript
const ERROR_MESSAGES = {
  INVALID_DOMAIN: "Please enter a valid domain name (e.g., example.com)",
  DNS_NETWORK_ERROR: "Unable to reach DNS servers. Check your connection and try again.",
  DNS_TIMEOUT: "DNS lookup timed out. Please try again.",
  AI_API_ERROR: "AI analysis unavailable. Results shown without AI insights.",
  AI_API_KEY_MISSING: "Configure VITE_ANTHROPIC_API_KEY in .env to enable AI features",
  AI_RATE_LIMIT: "API rate limit reached. Please wait and try again.",
  HEADER_PARSE_ERROR: "Unable to parse email headers. Please check format.",
  GENERIC_ERROR: "An unexpected error occurred. Please try again."
};
```

### Error Handler Implementation

```javascript
function handleError(error, context) {
  console.error(`[${new Date().toISOString()}] Error in ${context}:`, error);
  
  let userMessage = ERROR_MESSAGES.GENERIC_ERROR;
  
  if (error.message?.includes('domain')) {
    userMessage = ERROR_MESSAGES.INVALID_DOMAIN;
  } else if (error.message?.includes('network')) {
    userMessage = ERROR_MESSAGES.DNS_NETWORK_ERROR;
  } else if (error.message?.includes('timeout')) {
    userMessage = ERROR_MESSAGES.DNS_TIMEOUT;
  } else if (error.message?.includes('API key')) {
    userMessage = ERROR_MESSAGES.AI_API_KEY_MISSING;
  } else if (error.message?.includes('rate limit')) {
    userMessage = ERROR_MESSAGES.AI_RATE_LIMIT;
  }
  
  setError({ message: userMessage, context, timestamp: Date.now() });
}
```

### Error Display Component

```jsx
{error && (
  <div className="error-banner" role="alert" aria-live="assertive">
    <div className="error-icon">⚠️</div>
    <div className="error-content">
      <div className="error-title">Error</div>
      <div className="error-message">{error.message}</div>
    </div>
    <button 
      className="error-close" 
      onClick={() => setError(null)}
      aria-label="Dismiss error"
    >
      ✕
    </button>
  </div>
)}
```

## Loading State Management

### Loading State Types

1. **DNS Lookup Loading**: Shows progress through SPF, DKIM, DMARC, SCORE steps
2. **AI Analysis Loading**: Shows spinner with "AI is analyzing..." message
3. **Report Generation Loading**: Shows "Generating report..." on download button

### Loading State Implementation

```javascript
// DNS Lookup with Progress
const runCheck = useCallback(async (domain) => {
  setLoading(true);
  setError(null);
  setStepIdx(0);
  
  try {
    // Simulate step-by-step progress
    const steps = ['SPF', 'DKIM', 'DMARC', 'SCORE'];
    for (let i = 0; i < steps.length; i++) {
      setStepIdx(i + 1);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const result = await performDNSLookup(domain);
    setResult(result);
    
    // Trigger AI analysis asynchronously
    generateAIAnalysis(domain, result);
  } catch (error) {
    handleError(error, 'DNS Lookup');
  } finally {
    setLoading(false);
  }
}, []);

// AI Analysis with Loading State
const generateAIAnalysis = async (domain, result) => {
  setLoadingAI(true);
  setAiError(null);
  
  try {
    const [insights, threats] = await Promise.all([
      generateSecurityInsights(domain, result, parsedHeaders),
      generateThreatAnalysis(domain, result)
    ]);
    
    setAiInsights(insights);
    setThreatAnalysis(threats);
  } catch (error) {
    setAiError(ERROR_MESSAGES.AI_API_ERROR);
    console.error('AI Analysis error:', error);
  } finally {
    setLoadingAI(false);
  }
};
```

### Loading UI Components

```jsx
{/* DNS Loading State */}
{loading && (
  <div className="progress-card fade-in" role="status" aria-live="polite">
    <div className="progress-title">
      QUERYING DNS RECORDS FOR {domain.toUpperCase()}
    </div>
    <div className="progress-steps">
      {STEPS.map((step, i) => (
        <div key={step} className="progress-step">
          <div className={`step-dot ${i < stepIdx ? "done" : i === stepIdx ? "active" : ""}`}>
            {i < stepIdx ? "✓" : i + 1}
          </div>
        </div>
      ))}
    </div>
    <span className="sr-only">Loading DNS records, step {stepIdx} of {STEPS.length}</span>
  </div>
)}

{/* AI Loading State */}
{loadingAI && !aiInsights && (
  <div className="ai-loading-panel" role="status" aria-live="polite">
    <div className="ai-loading-spinner" aria-hidden="true"></div>
    <div className="ai-loading-text">🤖 AI is analyzing security posture...</div>
    <span className="sr-only">AI analysis in progress</span>
  </div>
)}
```

## Accessibility Implementation

### ARIA Labels and Roles

```jsx
// Interactive Elements
<button 
  className="btn-check" 
  onClick={runCheck}
  disabled={loading || !domain.trim()}
  aria-label="Run email authentication check"
  aria-busy={loading}
>
  {loading ? "Checking..." : "Run Check →"}
</button>

// Tab Navigation
<nav className="tab-nav" role="tablist" aria-label="Analysis results">
  {tabs.map(tab => (
    <button
      key={tab.id}
      role="tab"
      aria-selected={activeTab === tab.id}
      aria-controls={`${tab.id}-panel`}
      className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
      onClick={() => setActiveTab(tab.id)}
    >
      {tab.label}
    </button>
  ))}
</nav>

// Tab Panels
<div 
  id="overview-panel"
  role="tabpanel"
  aria-labelledby="overview-tab"
  hidden={activeTab !== 'overview'}
>
  {/* Overview content */}
</div>
```

### Keyboard Navigation

```javascript
// Handle keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (e) => {
    // Enter to submit
    if (e.key === 'Enter' && !loading && domain.trim()) {
      runCheck();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
      if (chatbotOpen) setChatbotOpen(false);
      if (error) setError(null);
    }
    
    // Tab navigation with arrow keys
    if (result && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      const currentIndex = tabs.findIndex(t => t.id === activeTab);
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1].id);
      } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1].id);
      }
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [loading, domain, chatbotOpen, error, result, activeTab]);
```

### Focus Management

```css
/* Visible focus indicators */
*:focus-visible {
  outline: 2px solid #0052cc;
  outline-offset: 2px;
}

button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid #0052cc;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(0, 82, 204, 0.1);
}

/* Skip to main content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #0052cc;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

## Production Configuration

### Environment Variables

```bash
# .env.example
# Anthropic API Configuration
VITE_ANTHROPIC_API_KEY=your_api_key_here

# Optional: Custom API Base URL
VITE_API_BASE_URL=https://api.yourdomain.com

# Optional: Enable Debug Logging
VITE_DEBUG_MODE=false
```

### Environment Validation

```javascript
// src/config.js
export const config = {
  anthropicApiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Validate configuration at startup
export function validateConfig() {
  const warnings = [];
  
  if (!config.anthropicApiKey) {
    warnings.push('VITE_ANTHROPIC_API_KEY not set - AI features will be disabled');
  }
  
  if (config.isDevelopment && warnings.length > 0) {
    console.warn('Configuration warnings:', warnings);
  }
  
  return warnings;
}
```

### Build Configuration

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ai-service': ['./src/services/aiService.js'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true, // Allow external connections
  },
});
```

## Performance Optimizations

### Code Splitting

```javascript
// Lazy load chatbot component
const AIChatbot = lazy(() => import('./components/AIChatbot'));

// Lazy load AI service
const loadAIService = () => import('./services/aiService');
```

### Request Debouncing

```javascript
// Debounce AI analysis requests
const debouncedAIAnalysis = useMemo(
  () => debounce(generateAIAnalysis, 500),
  []
);
```

### Caching Strategy

```javascript
// Cache DNS results for 5 minutes
const dnsCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedDNS(domain) {
  const cached = dnsCache.get(domain);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function cacheDNS(domain, data) {
  dnsCache.set(domain, { data, timestamp: Date.now() });
}
```

## Testing Strategy

### Unit Tests

```javascript
// Email Header Parser Tests
describe('parseEmailHeaders', () => {
  it('should extract SPF result', () => {
    const headers = 'Authentication-Results: mx.google.com; spf=pass';
    const result = parseEmailHeaders(headers);
    expect(result.spf).toBe('pass');
  });
  
  it('should detect header mismatch', () => {
    const headers = 'From: user@example.com\nReturn-Path: user@different.com';
    const result = parseEmailHeaders(headers);
    expect(result.hasHeaderMismatch).toBe(true);
  });
});

// Risk Scorer Tests
describe('calculateRiskScore', () => {
  it('should score missing SPF as 30 points', () => {
    const analysis = { spf: null, dkim: {}, dmarc: {} };
    const result = calculateRiskScore(analysis);
    expect(result.riskScore).toBeGreaterThanOrEqual(30);
  });
});
```

### Responsive Design Tests

```javascript
describe('Responsive Layout', () => {
  it('should display mobile layout at 360px', () => {
    cy.viewport(360, 640);
    cy.visit('/');
    cy.get('.input-card').should('have.css', 'flex-direction', 'column');
  });
  
  it('should display desktop layout at 1440px', () => {
    cy.viewport(1440, 900);
    cy.visit('/');
    cy.get('.records-grid').should('have.css', 'grid-template-columns');
  });
});
```

### Accessibility Tests

```javascript
describe('Accessibility', () => {
  it('should have no accessibility violations', () => {
    cy.visit('/');
    cy.injectAxe();
    cy.checkA11y();
  });
  
  it('should support keyboard navigation', () => {
    cy.visit('/');
    cy.get('body').tab();
    cy.focused().should('have.class', 'domain-input');
  });
});
```

## Implementation Phases

### Phase 1: Critical Fixes (Bugfix Spec)
- Fix blank page JSX error
- Verify application loads

### Phase 2: Error Handling & Loading States
- Implement error handler system
- Add loading states for all async operations
- Add error boundaries

### Phase 3: Mobile Responsiveness
- Implement mobile-first CSS
- Add touch target sizing
- Test at all breakpoints
- Fix horizontal scroll issues

### Phase 4: Accessibility
- Add ARIA labels and roles
- Implement keyboard navigation
- Add focus management
- Test with screen readers

### Phase 5: Production Configuration
- Set up environment variables
- Add configuration validation
- Update build configuration
- Create deployment documentation

### Phase 6: Performance & Polish
- Implement code splitting
- Add caching
- Optimize bundle size
- Final UI polish

## Success Criteria

1. ✅ Application loads without errors
2. ✅ All features work on mobile (360px+)
3. ✅ No horizontal scrolling at any breakpoint
4. ✅ All async operations have error handling
5. ✅ All async operations have loading states
6. ✅ Touch targets are 44x44px minimum
7. ✅ Keyboard navigation works throughout
8. ✅ ARIA labels on all interactive elements
9. ✅ Environment variables configured
10. ✅ Build completes successfully
11. ✅ No console errors in production
12. ✅ Passes accessibility audit (axe-core)

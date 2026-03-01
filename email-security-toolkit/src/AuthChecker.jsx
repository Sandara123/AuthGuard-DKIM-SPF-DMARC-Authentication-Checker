import { useState, useCallback } from "react";
import "./AuthChecker.css";
import AIChatbot from "./components/AIChatbot";
import { 
  generateSecurityInsights, 
  generateThreatAnalysis, 
  generateSecurityReport, 
  explainFinding,
  parseEmailHeaders,
  calculateRiskScore 
} from "./services/aiService";

// ─── Simulated DNS Database ───────────────────────────────────────────────────
// In production this would call a real DNS API (e.g. Cloudflare DNS-over-HTTPS)

const DNS_DATABASE = {
  "google.com": {
    spf:  { raw: "v=spf1 include:_spf.google.com ~all", exists: true },
    dkim: { selector: "google", raw: "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...(truncated)", exists: true },
    dmarc:{ raw: "v=DMARC1; p=reject; rua=mailto:mailauth-reports@google.com; ruf=mailto:mailauth-reports@google.com; sp=reject; adkim=s; aspf=s", exists: true },
  },
  "microsoft.com": {
    spf:  { raw: "v=spf1 include:_spf-a.microsoft.com include:_spf-b.microsoft.com include:_spf-c.microsoft.com include:_spf-ssg-a.msft.net include:spf-a.hotmail.com ~all", exists: true },
    dkim: { selector: "selector1", raw: "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...(truncated)", exists: true },
    dmarc:{ raw: "v=DMARC1; p=reject; pct=100; rua=mailto:d@rua.agari.com; ruf=mailto:d@ruf.agari.com; fo=1", exists: true },
  },
  "amazon.com": {
    spf:  { raw: "v=spf1 include:spf1.amazon.com include:spf2.amazon.com include:amazonses.com -all", exists: true },
    dkim: { selector: "7nqadf3n5bsstvomfzf5rzojtb6oab5k", raw: "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ...(truncated)", exists: true },
    dmarc:{ raw: "v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@amazon.com; pct=100", exists: true },
  },
  "weak-domain.com": {
    spf:  { raw: "v=spf1 +all", exists: true },
    dkim: { selector: "default", raw: "", exists: false },
    dmarc:{ raw: "v=DMARC1; p=none; rua=mailto:admin@weak-domain.com", exists: true },
  },
  "nodmarc-example.com": {
    spf:  { raw: "v=spf1 include:mailgun.org ~all", exists: true },
    dkim: { selector: "mailgun", raw: "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb...(truncated)", exists: true },
    dmarc:{ raw: "", exists: false },
  },
  "phishing-lookalike.net": {
    spf:  { raw: "v=spf1 +all", exists: true },
    dkim: { selector: "default", raw: "", exists: false },
    dmarc:{ raw: "", exists: false },
  },
};

// ─── Analysis Logic ───────────────────────────────────────────────────────────

function parseSPF(raw) {
  if (!raw) return null;
  const mechanisms = [];
  const parts = raw.split(/\s+/);
  parts.forEach(p => {
    if (p.startsWith("v=")) return;
    mechanisms.push(p);
  });
  const qualifier = raw.includes("-all") ? "hard_fail" : raw.includes("~all") ? "soft_fail" : raw.includes("?all") ? "neutral" : raw.includes("+all") ? "pass_all" : "unknown";
  const includeCount = mechanisms.filter(m => m.startsWith("include:")).length;
  return { raw, mechanisms, qualifier, includeCount, lookupCount: includeCount + 1 };
}

function parseDKIM(raw, selector) {
  if (!raw) return null;
  const keyType = raw.includes("k=rsa") ? "RSA" : raw.includes("k=ed25519") ? "Ed25519" : "Unknown";
  const hasKey = raw.includes("p=") && !raw.includes("p=;") && !raw.includes("p= ");
  return { raw, selector, keyType, hasKey, valid: hasKey };
}

function parseDMARC(raw) {
  if (!raw) return null;
  const get = (key) => { const m = raw.match(new RegExp(`${key}=([^;\\s]+)`)); return m ? m[1] : null; };
  const policy = get("p") || "none";
  const sp     = get("sp") || policy;
  const pct    = parseInt(get("pct") || "100", 10);
  const rua    = get("rua");
  const adkim  = get("adkim") || "r";
  const aspf   = get("aspf")  || "r";
  return { raw, policy, subdomainPolicy: sp, percentage: pct, reportingEmail: rua, dkimAlignment: adkim, spfAlignment: aspf };
}

function analyzeAuth(domain, data) {
  const spf   = data.spf.exists   ? parseSPF(data.spf.raw)     : null;
  const dkim  = data.dkim.exists  ? parseDKIM(data.dkim.raw, data.dkim.selector) : null;
  const dmarc = data.dmarc.exists ? parseDMARC(data.dmarc.raw) : null;

  const findings = [];
  const recommendations = [];
  const exploits = [];

  // ── SPF Findings ──
  if (!spf) {
    findings.push({ type: "fail", category: "SPF", title: "No SPF record found", desc: "Anyone can send email claiming to be from this domain. No sender validation exists." });
    recommendations.push({ priority: "critical", category: "SPF", title: "Create an SPF record", desc: "Add a TXT record to your DNS to specify authorized mail servers.", code: `v=spf1 include:_spf.yourmailprovider.com -all` });
    exploits.push("Send spoofed emails from @" + domain + " — no SPF to block it");
  } else {
    if (spf.qualifier === "pass_all") {
      findings.push({ type: "fail", category: "SPF", title: "SPF uses +all (allows everyone)", desc: "+all means any server on the internet is authorized to send mail for this domain. This completely defeats SPF." });
      exploits.push("SPF +all allows any attacker server to send as @" + domain);
      recommendations.push({ priority: "critical", category: "SPF", title: "Replace +all with -all or ~all", desc: "~all (SoftFail) or -all (HardFail) will reject unauthorized senders.", code: `v=spf1 include:yourprovider.com -all` });
    } else if (spf.qualifier === "soft_fail") {
      findings.push({ type: "warn", category: "SPF", title: "SPF uses ~all (SoftFail — not enforced)", desc: "~all marks unauthorized senders as suspicious but doesn't reject them. Upgrade to -all for full protection." });
      recommendations.push({ priority: "medium", category: "SPF", title: "Upgrade SPF to -all (HardFail)", desc: "Change ~all to -all to actively reject unauthorized mail servers.", code: spf.raw.replace("~all", "-all") });
    } else if (spf.qualifier === "hard_fail") {
      findings.push({ type: "pass", category: "SPF", title: "SPF configured with -all (HardFail)", desc: "Unauthorized senders will be rejected. Good enforcement." });
    }
    if (spf.lookupCount > 10) {
      findings.push({ type: "warn", category: "SPF", title: `SPF exceeds 10 DNS lookups (${spf.lookupCount})`, desc: "RFC 7208 limits SPF to 10 DNS lookups. Exceeding this causes SPF to permerror and fail." });
      recommendations.push({ priority: "high", category: "SPF", title: "Reduce SPF DNS lookup count", desc: "Flatten your SPF record or use an SPF flattening service to stay under 10 lookups." });
    } else {
      findings.push({ type: "pass", category: "SPF", title: `SPF lookup count within limit (${spf.lookupCount}/10)`, desc: "SPF record complies with RFC 7208 DNS lookup limit." });
    }
  }

  // ── DKIM Findings ──
  if (!dkim) {
    findings.push({ type: "fail", category: "DKIM", title: "No DKIM record found", desc: "Emails from this domain carry no cryptographic signature. Attackers can tamper with email content in transit." });
    exploits.push("Modify email content mid-transit — no DKIM signature to detect tampering");
    recommendations.push({ priority: "critical", category: "DKIM", title: "Enable DKIM signing", desc: "Generate a DKIM keypair and publish the public key in DNS. Configure your mail server to sign outbound emails.", code: `selector._domainkey.${domain} TXT "v=DKIM1; k=rsa; p=<your-public-key>"` });
  } else {
    if (!dkim.hasKey) {
      findings.push({ type: "fail", category: "DKIM", title: "DKIM public key is revoked or empty", desc: "The DKIM record exists but has no public key (p=). This revokes the key and emails won't validate." });
      exploits.push("DKIM key is revoked — impersonation emails won't be detected by signature checks");
      recommendations.push({ priority: "critical", category: "DKIM", title: "Republish a valid DKIM public key", desc: "Generate a new keypair and update the DNS TXT record with the new public key." });
    } else {
      findings.push({ type: "pass", category: "DKIM", title: `DKIM record present (selector: ${dkim.selector})`, desc: `${dkim.keyType} public key published. Emails signed with this key can be cryptographically verified.` });
    }
  }

  // ── DMARC Findings ──
  if (!dmarc) {
    findings.push({ type: "fail", category: "DMARC", title: "No DMARC record found", desc: "Without DMARC, there's no policy to instruct receivers what to do when SPF/DKIM fail. Phishing emails slip through." });
    exploits.push("Phishing emails pass through mail servers since there's no DMARC policy to enforce rejection");
    recommendations.push({ priority: "critical", category: "DMARC", title: "Create a DMARC record", desc: "Start with p=none for monitoring, then escalate to quarantine and reject.", code: `_dmarc.${domain} TXT "v=DMARC1; p=none; rua=mailto:dmarc@${domain}"` });
  } else {
    if (dmarc.policy === "none") {
      findings.push({ type: "warn", category: "DMARC", title: "DMARC policy is 'none' (monitor only)", desc: "p=none collects reports but takes no action on failing mail. Attackers are not blocked." });
      exploits.push("DMARC p=none means phishing emails are delivered without quarantine or rejection");
      recommendations.push({ priority: "high", category: "DMARC", title: "Escalate DMARC to p=quarantine or p=reject", desc: "Review your DMARC aggregate reports, then escalate policy to quarantine, then reject.", code: dmarc.raw.replace("p=none", "p=quarantine") });
    } else if (dmarc.policy === "quarantine") {
      findings.push({ type: "warn", category: "DMARC", title: "DMARC policy is 'quarantine'", desc: "Failing emails go to spam. Good, but p=reject offers stronger protection by outright blocking them." });
      recommendations.push({ priority: "medium", category: "DMARC", title: "Consider escalating to p=reject", desc: "After confirming legitimate mail flows pass DMARC, upgrade to p=reject for full protection.", code: dmarc.raw.replace("p=quarantine", "p=reject") });
    } else if (dmarc.policy === "reject") {
      findings.push({ type: "pass", category: "DMARC", title: "DMARC policy is 'reject' — fully enforced", desc: "Emails that fail SPF/DKIM alignment are outright rejected. This is the strongest protection." });
    }
    if (dmarc.percentage < 100) {
      findings.push({ type: "warn", category: "DMARC", title: `DMARC pct=${dmarc.percentage}% (partial enforcement)`, desc: `Only ${dmarc.percentage}% of mail is subject to the DMARC policy. The remaining ${100 - dmarc.percentage}% is unprotected.` });
    } else {
      findings.push({ type: "pass", category: "DMARC", title: "DMARC applies to 100% of mail (pct=100)", desc: "Full coverage. All emails from this domain are subject to the DMARC policy." });
    }
    if (!dmarc.reportingEmail) {
      findings.push({ type: "warn", category: "DMARC", title: "No DMARC aggregate reporting configured", desc: "Without rua=, you won't receive reports about who is sending mail as your domain." });
      recommendations.push({ priority: "medium", category: "DMARC", title: "Add a DMARC reporting address (rua)", desc: "Add rua=mailto:dmarc@yourdomain.com to receive aggregate reports.", code: dmarc.raw + "; rua=mailto:dmarc@" + domain });
    } else {
      findings.push({ type: "pass", category: "DMARC", title: "DMARC aggregate reports configured", desc: `Reports sent to ${dmarc.reportingEmail}` });
    }
    if (dmarc.dkimAlignment === "s") {
      findings.push({ type: "pass", category: "DMARC", title: "DKIM alignment is strict (adkim=s)", desc: "The DKIM 'd=' domain must exactly match the From: domain. Strong protection against subdomain spoofing." });
    }
    if (dmarc.spfAlignment === "s") {
      findings.push({ type: "pass", category: "DMARC", title: "SPF alignment is strict (aspf=s)", desc: "The SPF envelope-from must exactly match the From: domain." });
    }
  }

  // ── Overall Score ──
  const passCount = findings.filter(f => f.type === "pass").length;
  const failCount = findings.filter(f => f.type === "fail").length;
  const warnCount = findings.filter(f => f.type === "warn").length;
  const total = findings.length;
  const score = Math.round((passCount / total) * 100);

  let grade, gradeLabel, gradeDesc, gradeColor, gradeBg, gradeBorder;
  if (failCount === 0 && warnCount === 0) {
    grade = "A+"; gradeLabel = "Excellent"; gradeColor = "#006644"; gradeBg = "#e3fcef"; gradeBorder = "#abf5d1";
    gradeDesc = "All authentication records are properly configured. This domain has strong protection against spoofing and phishing.";
  } else if (failCount === 0 && warnCount <= 2) {
    grade = "B"; gradeLabel = "Good"; gradeColor = "#006644"; gradeBg = "#e3fcef"; gradeBorder = "#abf5d1";
    gradeDesc = "Authentication is mostly configured. Minor improvements recommended to reach full protection.";
  } else if (failCount <= 1 && warnCount <= 3) {
    grade = "C"; gradeLabel = "Fair"; gradeColor = "#974f0c"; gradeBg = "#fffae6"; gradeBorder = "#ffe380";
    gradeDesc = "Some authentication gaps exist. Attackers may be able to spoof this domain under certain conditions.";
  } else if (failCount <= 2) {
    grade = "D"; gradeLabel = "Poor"; gradeColor = "#bf2600"; gradeBg = "#ffebe6"; gradeBorder = "#ffbdad";
    gradeDesc = "Significant authentication misconfigurations detected. This domain is at risk of being used in phishing campaigns.";
  } else {
    grade = "F"; gradeLabel = "Critical Risk"; gradeColor = "#bf2600"; gradeBg = "#ffebe6"; gradeBorder = "#ffbdad";
    gradeDesc = "Authentication is severely lacking. This domain can be easily spoofed by attackers to send phishing emails.";
  }

  const dnsLookups = buildDNSLookups(domain, data);

  return { spf, dkim, dmarc, findings, recommendations, exploits, score, grade, gradeLabel, gradeDesc, gradeColor, gradeBg, gradeBorder, passCount, failCount, warnCount, dnsLookups };
}

function buildDNSLookups(domain, data) {
  const records = [];
  records.push({ name: domain, type: "TXT", value: data.spf.exists ? data.spf.raw : "(no record)", tag: "SPF" });
  records.push({ name: `${data.dkim.selector || "selector"}._domainkey.${domain}`, type: "TXT", value: data.dkim.exists ? data.dkim.raw : "(no record)", tag: "DKIM" });
  records.push({ name: `_dmarc.${domain}`, type: "TXT", value: data.dmarc.exists ? data.dmarc.raw : "(no record)", tag: "DMARC" });
  return records;
}

const SAMPLE_DOMAINS = ["google.com", "microsoft.com", "amazon.com", "weak-domain.com", "nodmarc-example.com", "phishing-lookalike.net"];

const STEPS = ["SPF", "DKIM", "DMARC", "SCORE"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuthChecker() {
  const [domain,    setDomain]    = useState("");
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [stepIdx,   setStepIdx]   = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [error,     setError]     = useState("");
  
  // AI-powered features
  const [aiInsights, setAiInsights] = useState(null);
  const [threatAnalysis, setThreatAnalysis] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [_selectedFinding, _setSelectedFinding] = useState(null);
  const [_aiReport, _setAiReport] = useState(null);
  
  // Automation Mode - Email Header Input
  const [automationMode, setAutomationMode] = useState(false);
  const [emailHeaders, setEmailHeaders] = useState("");
  const [parsedHeaders, setParsedHeaders] = useState(null);
  const [riskScore, setRiskScore] = useState(null);

  const runCheck = useCallback((d) => {
    const clean = (d || domain).toLowerCase().trim().replace(/^https?:\/\//, "").replace(/\/.*/, "");
    if (!clean) return;
    setError("");
    setResult(null);
    setLoading(true);
    setStepIdx(0);
    setActiveTab("overview");

    const data = DNS_DATABASE[clean];
    if (!data) {
      // Simulate a domain not in the DB — generate a random weak config
      const synth = {
        spf:   Math.random() > 0.4 ? { raw: "v=spf1 include:mailprovider.com ~all", exists: true } : { raw: "", exists: false },
        dkim:  Math.random() > 0.5 ? { selector: "mail", raw: "v=DKIM1; k=rsa; p=MIGfMA...(truncated)", exists: true } : { raw: "", exists: false },
        dmarc: Math.random() > 0.6 ? { raw: "v=DMARC1; p=none; rua=mailto:admin@" + clean, exists: true } : { raw: "", exists: false },
      };
      simulateSteps(clean, synth);
    } else {
      simulateSteps(clean, data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);

  const simulateSteps = (clean, data) => {
    let s = 0;
    const tick = () => {
      s++;
      setStepIdx(s);
      if (s < STEPS.length) {
        setTimeout(tick, 500);
      } else {
        const r = analyzeAuth(clean, data);
        setResult({ ...r, domain: clean });
        setLoading(false);
        
        // Trigger AI analysis asynchronously
        generateAIAnalysis(clean, { ...r, domain: clean });
      }
    };
    setTimeout(tick, 500);
  };
  
  // Generate AI-powered analysis
  const generateAIAnalysis = async (domain, analysisResult) => {
    setLoadingAI(true);
    setAiInsights(null);
    setThreatAnalysis(null);
    _setAiReport(null);
    
    // Calculate risk score
    const riskAnalysis = calculateRiskScore(analysisResult, parsedHeaders);
    setRiskScore(riskAnalysis);
    
    try {
      // Generate insights and threat analysis in parallel
      const [insights, threats] = await Promise.all([
        generateSecurityInsights(domain, analysisResult, parsedHeaders),
        generateThreatAnalysis(domain, analysisResult),
      ]);
      
      setAiInsights(insights);
      setThreatAnalysis(threats);
    } catch (error) {
      console.error('AI Analysis error:', error);
    } finally {
      setLoadingAI(false);
    }
  };
  
  // Generate and download AI security report
  const downloadAIReport = async () => {
    if (!result) return;
    
    try {
      // Create JSON report
      const report = {
        metadata: {
          reportType: 'AuthGuard Email Security Analysis',
          version: '2.0',
          generatedAt: new Date().toISOString(),
          domain: result.domain,
        },
        summary: {
          grade: result.grade,
          gradeLabel: result.gradeLabel,
          score: result.score,
          riskLevel: riskScore?.riskLevel || 'N/A',
          riskScore: riskScore?.riskScore || 0,
        },
        authentication: {
          spf: result.spf || { exists: false },
          dkim: result.dkim || { exists: false },
          dmarc: result.dmarc || { exists: false },
        },
        findings: result.findings || [],
        recommendations: result.recommendations || [],
        aiInsights: aiInsights || null,
      };
      
      // Download JSON
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AuthGuard_Report_${result.domain}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Report download error:', error);
    }
  };
  
  // Explain finding with AI (future feature)
  const _explainWithAI = async (finding) => {
    if (!result) return;
    _setSelectedFinding(finding);
    setLoadingAI(true);
    
    try {
      const explanation = await explainFinding(finding, result.domain);
      _setSelectedFinding({ ...finding, aiExplanation: explanation });
    } catch (error) {
      console.error('AI explanation error:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") runCheck(); };
  const reset = () => { 
    setDomain(""); 
    setResult(null); 
    setError(""); 
    setLoading(false); 
    setStepIdx(0);
    setAiInsights(null);
    setThreatAnalysis(null);
    _setAiReport(null);
    _setSelectedFinding(null);
    setEmailHeaders("");
    setParsedHeaders(null);
    setRiskScore(null);
  };
  
  // Parse email headers when automation mode is enabled
  const handleEmailHeadersChange = (value) => {
    setEmailHeaders(value);
    if (value.trim()) {
      const parsed = parseEmailHeaders(value);
      setParsedHeaders(parsed);
      // Auto-extract domain from headers if available
      if (parsed?.fromDomain && !domain) {
        setDomain(parsed.fromDomain);
      }
    } else {
      setParsedHeaders(null);
    }
  };

  const tabs = [
    { id: "overview",       label: "Overview"         },
    { id: "ai-insights",    label: "🤖 AI Insights"   },
    { id: "findings",       label: "Findings"         },
    { id: "recommendations",label: "Recommendations"  },
    { id: "dns",            label: "DNS Records"      },
  ];

  return (
    <div className="app">

      {/* ── Header ── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-mark">DK</div>
            <div>
              <div className="logo-name">AuthGuard</div>
              <div className="logo-tag">DKIM · SPF · DMARC CHECKER</div>
            </div>
          </div>
          <div className="header-badge">EMAIL AUTH ANALYZER v1.0</div>
        </div>
      </header>

      <main className="main">

        {/* ── Page Title ── */}
        <div className="page-title">
          <h1>Email Authentication Checker</h1>
          <p>Validate SPF, DKIM, and DMARC records for any domain. Identify misconfigurations that attackers can exploit for spoofing and phishing.</p>
        </div>

        {/* ── Input Card ── */}
        <div className="input-card">
          <div className="mode-toggle">
            <button 
              className={`mode-btn ${!automationMode ? 'active' : ''}`}
              onClick={() => setAutomationMode(false)}
            >
              🔍 Domain Check
            </button>
            <button 
              className={`mode-btn ${automationMode ? 'active' : ''}`}
              onClick={() => setAutomationMode(true)}
            >
              🤖 Automation Mode
            </button>
          </div>
          
          {automationMode && (
            <div className="automation-panel">
              <label className="input-label">📧 Paste Email Headers (Optional)</label>
              <textarea
                className="email-headers-input"
                placeholder="Paste full email headers here for enhanced analysis...&#10;&#10;Example:&#10;Authentication-Results: mx.google.com;&#10;       spf=pass smtp.mailfrom=example.com;&#10;       dkim=pass header.i=@example.com;&#10;       dmarc=pass header.from=example.com"
                value={emailHeaders}
                onChange={(e) => handleEmailHeadersChange(e.target.value)}
                rows={6}
                disabled={loading}
              />
              {parsedHeaders && (
                <div className="parsed-headers-preview">
                  <div className="preview-title">✓ Headers Parsed Successfully</div>
                  <div className="preview-grid">
                    {parsedHeaders.fromDomain && (
                      <div className="preview-item">
                        <span className="preview-label">From Domain:</span>
                        <span className="preview-value">{parsedHeaders.fromDomain}</span>
                      </div>
                    )}
                    {parsedHeaders.spf && (
                      <div className="preview-item">
                        <span className="preview-label">SPF:</span>
                        <span className={`preview-value status-${parsedHeaders.spf}`}>{parsedHeaders.spf}</span>
                      </div>
                    )}
                    {parsedHeaders.dkim && (
                      <div className="preview-item">
                        <span className="preview-label">DKIM:</span>
                        <span className={`preview-value status-${parsedHeaders.dkim}`}>{parsedHeaders.dkim}</span>
                      </div>
                    )}
                    {parsedHeaders.dmarc && (
                      <div className="preview-item">
                        <span className="preview-label">DMARC:</span>
                        <span className={`preview-value status-${parsedHeaders.dmarc}`}>{parsedHeaders.dmarc}</span>
                      </div>
                    )}
                    {parsedHeaders.hasHeaderMismatch && (
                      <div className="preview-item warning">
                        <span className="preview-label">⚠ Warning:</span>
                        <span className="preview-value">From/Return-Path mismatch detected</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">Domain Name</label>
              <input
                className="domain-input"
                placeholder="e.g. google.com or your-company.com"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
              />
            </div>
            <button className="btn-check" onClick={() => runCheck()} disabled={loading || !domain.trim()}>
              {loading ? "Checking..." : "Run Check →"}
            </button>
            {(result || error) && (
              <button className="btn-reset" onClick={reset}>Reset</button>
            )}
          </div>
          <div className="sample-row">
            <span className="sample-label">try:</span>
            {SAMPLE_DOMAINS.map(d => (
              <span key={d} className="sample-chip" onClick={() => { setDomain(d); runCheck(d); }}>{d}</span>
            ))}
          </div>
        </div>

        {/* ── Progress ── */}
        {loading && (
          <div className="progress-card fade-in">
            <div className="progress-title">QUERYING DNS RECORDS FOR {domain.toUpperCase()}</div>
            <div className="progress-steps">
              {STEPS.map((s, i) => (
                <div key={s} className="progress-step">
                  <div className={`step-dot ${i < stepIdx ? "done" : i === stepIdx ? "active" : ""}`}>
                    {i < stepIdx ? "✓" : i + 1}
                  </div>
                  {i < STEPS.length - 1 && <div className={`step-line ${i < stepIdx ? "done" : ""}`} />}
                </div>
              ))}
            </div>
            <div className="step-labels">
              {STEPS.map((s, i) => (
                <div key={s} className={`step-label-item ${i < stepIdx ? "done" : i === stepIdx ? "active" : ""}`}>{s}</div>
              ))}
            </div>
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !result && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Enter a domain to begin</div>
            <div className="empty-desc">
              AuthGuard will query SPF, DKIM, and DMARC DNS records, simulate authentication checks,<br />
              and identify any misconfigurations that could be exploited by attackers.
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {!loading && result && (
          <div className="fade-in">

            {/* Score Banner */}
            <div className="score-banner" style={{ background: result.gradeBg, borderColor: result.gradeBorder, color: result.gradeColor }}>
              <div className="score-grade">{result.grade}</div>
              <div className="score-info">
                <div className="score-label">AUTHENTICATION GRADE — {result.domain}</div>
                <div className="score-title">{result.gradeLabel}</div>
                <div className="score-desc">{result.gradeDesc}</div>
              </div>
              <div className="score-meter">
                <div className="score-ring-wrap">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke={result.gradeBorder} strokeWidth="6" />
                    <circle cx="40" cy="40" r="34" fill="none" stroke={result.gradeColor}
                      strokeWidth="6" strokeDasharray={`${2 * Math.PI * 34}`}
                      strokeDashoffset={`${2 * Math.PI * 34 * (1 - result.score / 100)}`}
                      strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
                  </svg>
                  <div className="score-num-overlay" style={{ color: result.gradeColor }}>{result.score}%</div>
                </div>
                <div className="score-meter-label" style={{ color: result.gradeColor }}>
                  {result.passCount}✓ {result.warnCount}⚠ {result.failCount}✗
                </div>
              </div>
            </div>

            {/* Tab Nav */}
            <nav className="tab-nav">
              {tabs.map(t => (
                <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
                  onClick={() => setActiveTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </nav>

            {/* ── AI Insights Tab ── */}
            {activeTab === "ai-insights" && (
              <div className="fade-in">
                {loadingAI && !aiInsights ? (
                  <div className="ai-loading-panel">
                    <div className="ai-loading-spinner"></div>
                    <div className="ai-loading-text">🤖 AI is analyzing security posture...</div>
                  </div>
                ) : (
                  <>
                    {/* Risk Score Card */}
                    {riskScore && (
                      <div className="risk-score-card">
                        <div className="risk-score-header">
                          <span className="risk-badge">⚠️ Risk Assessment</span>
                          <span className={`risk-level-badge risk-${riskScore.riskLevel.toLowerCase()}`} style={{ backgroundColor: riskScore.riskColor + '20', color: riskScore.riskColor, borderColor: riskScore.riskColor }}>
                            {riskScore.riskLevel} Risk
                          </span>
                        </div>
                        <div className="risk-score-body">
                          <div className="risk-score-visual">
                            <div className="risk-score-meter">
                              <div className="risk-score-fill" style={{ width: `${riskScore.riskScore}%`, backgroundColor: riskScore.riskColor }}></div>
                            </div>
                            <div className="risk-score-labels">
                              <span className="risk-score-value" style={{ color: riskScore.riskColor }}>{riskScore.riskScore}/100</span>
                              <span className="risk-confidence">Confidence: {riskScore.confidence}%</span>
                            </div>
                          </div>
                          <div className="risk-summary">{riskScore.summary}</div>
                          {riskScore.indicators.length > 0 && (
                            <div className="risk-indicators">
                              <div className="risk-indicators-title">Key Risk Indicators:</div>
                              {riskScore.indicators.map((ind, i) => (
                                <div key={i} className={`risk-indicator-item risk-${ind.type}`}>
                                  <span className="risk-indicator-icon">
                                    {ind.type === 'critical' ? '🔴' : ind.type === 'high' ? '🟠' : ind.type === 'medium' ? '🟡' : '🟢'}
                                  </span>
                                  <span className="risk-indicator-text">{ind.message}</span>
                                  <span className="risk-indicator-impact">+{ind.impact}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* AI Security Insights */}
                    {aiInsights && (
                      <div className="ai-panel">
                        <div className="ai-panel-header">
                          <span className="ai-badge">✨ AI-Powered Insights</span>
                          <button className="btn-download-report" onClick={downloadAIReport}>
                            📄 Download Report
                          </button>
                        </div>
                        
                        <div className="ai-section">
                          <h3 className="ai-section-title">Executive Summary</h3>
                          <p className="ai-summary-text">{aiInsights.executiveSummary}</p>
                        </div>

                        {aiInsights.topRisks && aiInsights.topRisks.length > 0 && (
                          <div className="ai-section">
                            <h3 className="ai-section-title">🎯 Top Security Risks</h3>
                            <div className="ai-risks-grid">
                              {aiInsights.topRisks.map((risk, i) => (
                                <div key={i} className="ai-risk-card">
                                  <span className="ai-risk-number">{i + 1}</span>
                                  <span className="ai-risk-text">{risk}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {aiInsights.priorityActions && aiInsights.priorityActions.length > 0 && (
                          <div className="ai-section">
                            <h3 className="ai-section-title">⚡ Priority Actions</h3>
                            <div className="ai-actions-list">
                              {aiInsights.priorityActions.map((action, i) => (
                                <div key={i} className="ai-action-item">
                                  <span className="ai-action-bullet">→</span>
                                  <span>{action}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* AI Threat Analysis */}
                    {threatAnalysis && (
                      <div className="ai-panel threat-panel">
                        <div className="ai-panel-header">
                          <span className="ai-badge threat-badge">⚠️ Threat Intelligence</span>
                          <span className={`threat-level-badge threat-${threatAnalysis.threatLevel?.toLowerCase()}`}>
                            {threatAnalysis.threatLevel || "Medium"} Threat Level
                          </span>
                        </div>

                        {threatAnalysis.attackScenarios && threatAnalysis.attackScenarios.length > 0 && (
                          <div className="ai-section">
                            <h3 className="ai-section-title">🎭 Potential Attack Scenarios</h3>
                            <div className="threat-scenarios">
                              {threatAnalysis.attackScenarios.map((scenario, i) => (
                                <div key={i} className="threat-scenario-card">
                                  <div className="threat-scenario-number">Scenario {i + 1}</div>
                                  <div className="threat-scenario-text">{scenario}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {threatAnalysis.businessImpact && (
                          <div className="ai-section">
                            <h3 className="ai-section-title">💼 Business Impact</h3>
                            <p className="ai-summary-text">{threatAnalysis.businessImpact}</p>
                          </div>
                        )}

                        {threatAnalysis.timeline && (
                          <div className="ai-section">
                            <h3 className="ai-section-title">⏱️ Recommended Timeline</h3>
                            <p className="ai-timeline-text">{threatAnalysis.timeline}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {!aiInsights && !threatAnalysis && (
                      <div className="ai-empty-state">
                        <div className="ai-empty-icon">🤖</div>
                        <div className="ai-empty-title">AI Analysis Unavailable</div>
                        <div className="ai-empty-desc">
                          Configure your Anthropic API key in the .env file to enable AI-powered insights.
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── Overview Tab ── */}
            {activeTab === "overview" && (
              <div className="fade-in">
                <div className="records-grid">
                  {/* SPF Card */}
                  <RecordCard
                    type="SPF"
                    color="#0052cc"
                    exists={!!result.spf}
                    status={result.spf ? (result.spf.qualifier === "hard_fail" ? "pass" : result.spf.qualifier === "soft_fail" ? "warn" : "fail") : "fail"}
                    statusLabel={result.spf ? (result.spf.qualifier === "hard_fail" ? "PASS" : result.spf.qualifier === "soft_fail" ? "WARN" : "FAIL") : "MISSING"}
                    raw={result.spf?.raw || "(no record found)"}
                    fields={result.spf ? [
                      { key: "qualifier", val: result.spf.qualifier.replace("_", " "), cls: result.spf.qualifier === "hard_fail" ? "pass" : result.spf.qualifier === "soft_fail" ? "warn" : "fail" },
                      { key: "mechanisms", val: result.spf.mechanisms.join(", ") || "none" },
                      { key: "dns lookups", val: `${result.spf.lookupCount} / 10`, cls: result.spf.lookupCount > 10 ? "fail" : "pass" },
                    ] : [
                      { key: "status", val: "Record not found", cls: "fail" },
                      { key: "risk", val: "Domain can be spoofed" },
                    ]}
                  />

                  {/* DKIM Card */}
                  <RecordCard
                    type="DKIM"
                    color="#00875a"
                    exists={!!result.dkim}
                    status={result.dkim?.valid ? "pass" : "fail"}
                    statusLabel={result.dkim ? (result.dkim.valid ? "PASS" : "FAIL") : "MISSING"}
                    raw={result.dkim?.raw || "(no record found)"}
                    fields={result.dkim ? [
                      { key: "selector", val: result.dkim.selector },
                      { key: "key type", val: result.dkim.keyType },
                      { key: "key present", val: result.dkim.hasKey ? "Yes" : "No (revoked)", cls: result.dkim.hasKey ? "pass" : "fail" },
                    ] : [
                      { key: "status", val: "Record not found", cls: "fail" },
                      { key: "risk", val: "No signature verification" },
                    ]}
                  />

                  {/* DMARC Card */}
                  <RecordCard
                    type="DMARC"
                    color="#6554c0"
                    exists={!!result.dmarc}
                    status={result.dmarc ? (result.dmarc.policy === "reject" ? "pass" : result.dmarc.policy === "quarantine" ? "warn" : "warn") : "fail"}
                    statusLabel={result.dmarc ? result.dmarc.policy.toUpperCase() : "MISSING"}
                    raw={result.dmarc?.raw || "(no record found)"}
                    fields={result.dmarc ? [
                      { key: "policy", val: result.dmarc.policy, cls: result.dmarc.policy === "reject" ? "pass" : result.dmarc.policy === "quarantine" ? "warn" : "warn" },
                      { key: "pct", val: `${result.dmarc.percentage}%`, cls: result.dmarc.percentage === 100 ? "pass" : "warn" },
                      { key: "reporting", val: result.dmarc.reportingEmail || "not set", cls: result.dmarc.reportingEmail ? "pass" : "warn" },
                      { key: "dkim align", val: result.dmarc.dkimAlignment === "s" ? "strict" : "relaxed" },
                    ] : [
                      { key: "status", val: "Record not found", cls: "fail" },
                      { key: "risk", val: "No enforcement policy" },
                    ]}
                  />
                </div>

                {/* Exploit Panel */}
                {result.exploits.length > 0 && (
                  <div className="exploit-panel">
                    <div className="exploit-title">⚠ How an Attacker Could Exploit These Gaps</div>
                    <div className="exploit-list">
                      {result.exploits.map((e, i) => (
                        <div key={i} className="exploit-item">
                          <span className="exploit-bullet">→</span>
                          <span>{e}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Findings Tab ── */}
            {activeTab === "findings" && (
              <div className="fade-in findings-section">
                <div className="findings-section-header">
                  <span className="findings-section-title">All Detection Findings</span>
                  <span className="findings-count">{result.findings.length} findings · {result.passCount} pass · {result.warnCount} warn · {result.failCount} fail</span>
                </div>
                {result.findings.map((f, i) => (
                  <div key={i} className="finding-row">
                    <div className={`finding-icon ${f.type}`}>
                      {f.type === "pass" ? "✓" : f.type === "warn" ? "⚠" : "✗"}
                    </div>
                    <div className="finding-content">
                      <div className="finding-title">{f.title}</div>
                      <div className="finding-desc">{f.desc}</div>
                    </div>
                    <div className={`finding-tag badge-${f.type === "pass" ? "pass" : f.type === "warn" ? "warn" : "fail"}`}
                      style={{ background: f.type === "pass" ? "var(--pass-bg)" : f.type === "warn" ? "var(--warn-bg)" : "var(--fail-bg)",
                               color:      f.type === "pass" ? "var(--pass)"    : f.type === "warn" ? "var(--warn)"    : "var(--fail)",
                               border:     `1px solid ${f.type === "pass" ? "var(--pass-border)" : f.type === "warn" ? "var(--warn-border)" : "var(--fail-border)"}` }}>
                      {f.category}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Recommendations Tab ── */}
            {activeTab === "recommendations" && (
              <div className="fade-in">
                {result.recommendations.length === 0 ? (
                  <div className="findings-section">
                    <div className="finding-row">
                      <div className="finding-icon pass">✓</div>
                      <div className="finding-content">
                        <div className="finding-title">No recommendations — authentication is fully configured</div>
                        <div className="finding-desc">This domain has excellent email authentication. Keep monitoring DMARC reports regularly.</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rec-section">
                    <div className="rec-header">Remediation Recommendations ({result.recommendations.length})</div>
                    {result.recommendations.map((r, i) => (
                      <div key={i} className="rec-item">
                        <div className={`rec-priority ${r.priority}`}>{r.priority.toUpperCase()}</div>
                        <div className="rec-body">
                          <div className="rec-title">{r.title}</div>
                          <div className="rec-desc">{r.desc}</div>
                          {r.code && <div className="rec-code">{r.code}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── DNS Records Tab ── */}
            {activeTab === "dns" && (
              <div className="fade-in">
                {result.dnsLookups.map((lookup, i) => (
                  <div key={i} className="dns-section">
                    <div className="dns-header">
                      <span className="dns-type-pill" style={{
                        background: lookup.tag === "SPF" ? "#e8f0fe" : lookup.tag === "DKIM" ? "#e3fcef" : "#f3f0ff",
                        color:      lookup.tag === "SPF" ? "#0052cc" : lookup.tag === "DKIM" ? "#006644"  : "#6554c0",
                        border:     `1px solid ${lookup.tag === "SPF" ? "#cce0ff" : lookup.tag === "DKIM" ? "#abf5d1" : "#ddd4ff"}`,
                      }}>{lookup.tag}</span>
                      <span className="dns-query">{lookup.type} lookup: {lookup.name}</span>
                    </div>
                    <div className="dns-body">
                      <div className="dns-record-line">
                        <span className="dns-col-name">{lookup.name}</span>
                        <span className="dns-col-type">{lookup.type}</span>
                        <span className="dns-col-value">{lookup.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </main>
      
      {/* Floating AI Chatbot Button */}
      {result && (
        <button 
          className="floating-chatbot-btn"
          onClick={() => setChatbotOpen(true)}
          aria-label="Open AI Assistant"
        >
          <span className="chatbot-btn-icon">🤖</span>
          <span className="chatbot-btn-text">Ask AI</span>
        </button>
      )}
      
      {/* AI Chatbot Modal */}
      <AIChatbot 
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        analysisContext={result ? { 
          domain: result.domain, 
          grade: result.grade, 
          score: result.score,
          fullResult: result,
          aiInsights: aiInsights,
          riskScore: riskScore
        } : null}
      />
    </div>
  );
}

// ─── RecordCard Sub-component ─────────────────────────────────────────────────

function RecordCard({ type, color, status, statusLabel, raw, fields }) {
  return (
    <div className="record-card">
      <div className="record-header">
        <span className="record-type-label" style={{ color }}>{type}</span>
        <span className={`record-status-badge badge-${status}`}>{statusLabel}</span>
      </div>
      <div className="record-body">
        <div className="record-raw">{raw}</div>
        <div className="record-fields">
          {fields.map((f, i) => (
            <div key={i} className="field-row">
              <span className="field-key">{f.key}</span>
              <span className={`field-val ${f.cls || ""}`}>{f.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

# 🎬 Feature Demo - Visual Guide

A visual walkthrough of AuthGuard v2.0's new automation features.

---

## 🎯 Demo Scenario: Analyzing a Suspicious Email

Let's walk through a real-world scenario where you receive a suspicious email and want to verify its authenticity.

---

## Step 1: Initial View

When you first open AuthGuard, you'll see:

```
┌─────────────────────────────────────────────────────────┐
│  🛡️ AuthGuard - Email Authentication Checker           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┬──────────────┐                       │
│  │ 🔍 Domain    │ 🤖 Automation│  ← Mode Toggle        │
│  │    Check     │     Mode     │                       │
│  └──────────────┴──────────────┘                       │
│                                                         │
│  Domain Name: [example.com____________]  [Run Check →] │
│                                                         │
│  try: google.com  microsoft.com  amazon.com            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Step 2: Enable Automation Mode

Click the **"🤖 Automation Mode"** button:

```
┌─────────────────────────────────────────────────────────┐
│  ┌──────────────┬──────────────┐                       │
│  │ 🔍 Domain    │ 🤖 Automation│  ← Active!            │
│  │    Check     │     Mode ✓   │                       │
│  └──────────────┴──────────────┘                       │
│                                                         │
│  📧 Paste Email Headers (Optional)                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Paste full email headers here...                │   │
│  │                                                  │   │
│  │ Example:                                         │   │
│  │ Authentication-Results: mx.google.com;          │   │
│  │        spf=pass smtp.mailfrom=example.com;      │   │
│  │        dkim=pass header.i=@example.com;         │   │
│  │        dmarc=pass header.from=example.com       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Domain Name: [example.com____________]  [Run Check →] │
└─────────────────────────────────────────────────────────┘
```

---

## Step 3: Paste Email Headers

After pasting headers, you'll see a preview:

```
┌─────────────────────────────────────────────────────────┐
│  📧 Paste Email Headers                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Authentication-Results: mx.google.com;          │   │
│  │        spf=fail smtp.mailfrom=suspicious.com;   │   │
│  │        dkim=fail header.i=@suspicious.com;      │   │
│  │        dmarc=fail header.from=bank.com          │   │
│  │ From: security@bank.com                         │   │
│  │ Return-Path: <phisher@suspicious.com>           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ✓ Headers Parsed Successfully                   │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ From Domain:    bank.com                        │   │
│  │ SPF:            fail 🔴                          │   │
│  │ DKIM:           fail 🔴                          │   │
│  │ DMARC:          fail 🔴                          │   │
│  │ ⚠ Warning:      From/Return-Path mismatch       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Domain Name: [bank.com_______________]  [Run Check →] │
└─────────────────────────────────────────────────────────┘
```

---

## Step 4: Analysis Results

After clicking "Run Check", you'll see the progress:

```
┌─────────────────────────────────────────────────────────┐
│  QUERYING DNS RECORDS FOR BANK.COM                      │
│                                                         │
│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  ✓    ●    ○    ○                                      │
│  SPF  DKIM DMARC SCORE                                  │
└─────────────────────────────────────────────────────────┘
```

---

## Step 5: Risk Score Display

Navigate to **"🤖 AI Insights"** tab:

```
┌─────────────────────────────────────────────────────────┐
│  ⚠️ Risk Assessment              🔴 CRITICAL RISK       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Risk Score:                                            │
│  ████████████████████████████████░░░░░░░░░░░░░░░░░░░░  │
│  85/100                                  Confidence: 100%│
│                                                         │
│  Critical risk (85/100 points) with 100% confidence    │
│                                                         │
│  Key Risk Indicators:                                   │
│  🔴 No DMARC policy configured                    +40  │
│  🔴 DKIM signature verification failed            +25  │
│  🟠 From/Return-Path mismatch detected            +10  │
│  🟠 SPF check failed in email headers             +10  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Step 6: AI Insights

Below the risk score, you'll see AI analysis:

```
┌─────────────────────────────────────────────────────────┐
│  ✨ AI-Powered Insights          [📄 Download Report]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Executive Summary                                      │
│  ─────────────────                                      │
│  The domain bank.com has a security grade of F with    │
│  critical risk level. Multiple authentication failures  │
│  detected including SPF, DKIM, and DMARC. The From and │
│  Return-Path mismatch strongly indicates a phishing    │
│  attempt. Immediate action required.                    │
│                                                         │
│  🎯 Top Security Risks                                  │
│  ─────────────────────                                  │
│  1️⃣ Email failed all authentication checks - likely    │
│     spoofed from a malicious server                    │
│                                                         │
│  2️⃣ From domain (bank.com) doesn't match Return-Path  │
│     (suspicious.com) - classic phishing indicator      │
│                                                         │
│  3️⃣ No DMARC policy means legitimate bank.com emails  │
│     can't be distinguished from fake ones              │
│                                                         │
│  ⚡ Priority Actions                                     │
│  ──────────────────                                     │
│  → Report this email as phishing immediately           │
│  → Do not click any links or download attachments      │
│  → Contact bank.com through official channels          │
│  → Alert your IT security team                         │
│  → Block sender suspicious.com                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Step 7: Threat Analysis

Scroll down to see threat intelligence:

```
┌─────────────────────────────────────────────────────────┐
│  ⚠️ Threat Intelligence          🔴 CRITICAL THREAT     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🎭 Potential Attack Scenarios                          │
│  ─────────────────────────────                          │
│  Scenario 1                                             │
│  Attacker is impersonating bank.com to steal           │
│  credentials. Email likely contains fake login page    │
│  designed to capture usernames and passwords.          │
│                                                         │
│  Scenario 2                                             │
│  Phishing email may contain malware attachments        │
│  disguised as account statements or security alerts.   │
│                                                         │
│  Scenario 3                                             │
│  Social engineering attempt to create urgency and      │
│  bypass normal security awareness training.            │
│                                                         │
│  💼 Business Impact                                     │
│  ──────────────────                                     │
│  If successful, this attack could lead to:             │
│  • Compromised user credentials                        │
│  • Unauthorized account access                         │
│  • Financial fraud                                     │
│  • Data breach                                         │
│  • Reputational damage                                 │
│                                                         │
│  ⏱️ Recommended Timeline                                │
│  ───────────────────────                                │
│  IMMEDIATE ACTION REQUIRED (within 1 hour)             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Step 8: Download Report

Click **"📄 Download Full Report"** to get:

```markdown
# Email Authentication Security Report
## bank.com

**Report Date:** February 25, 2026
**Security Grade:** F (15%)
**Risk Level:** Critical (85/100 points)
**Confidence:** 100%

---

## Executive Summary

Domain **bank.com** has been assessed with a security grade of **F** 
and a **critical risk level**. Multiple authentication failures were 
detected including SPF, DKIM, and DMARC. The From/Return-Path mismatch 
strongly indicates a phishing attempt. Immediate action is required.

---

## Current Security Posture

### Authentication Protocols

| Protocol | Status | Configuration | Assessment |
|----------|--------|---------------|------------|
| **SPF** | ✗ Missing | N/A | ✗ Critical Gap |
| **DKIM** | ✗ Missing | N/A | ✗ Critical Gap |
| **DMARC** | ✗ Missing | N/A | ✗ Critical Gap |

### Email Header Analysis

- **From Domain:** bank.com
- **Return-Path:** suspicious.com
- **Header Alignment:** ✗ Mismatch Detected (Suspicious)
- **SPF Check:** fail
- **DKIM Verification:** fail
- **DMARC Evaluation:** fail

---

## Critical Vulnerabilities

### 1. No SPF record found

**Category:** SPF
**Severity:** Critical

Anyone can send email claiming to be from this domain. 
No sender validation exists.

[... continues with full report ...]
```

---

## 📊 Comparison: Legitimate vs Phishing

### Legitimate Email Example

```
┌─────────────────────────────────────────────────────────┐
│  Risk Score: 5/100 (Low) 🟢                             │
│  Confidence: 100%                                       │
│                                                         │
│  ✓ SPF: pass                                            │
│  ✓ DKIM: pass                                           │
│  ✓ DMARC: pass                                          │
│  ✓ Headers aligned                                      │
│                                                         │
│  Executive Summary:                                     │
│  All authentication checks passed. This email is from   │
│  a properly configured mail server and can be trusted.  │
└─────────────────────────────────────────────────────────┘
```

### Phishing Email Example

```
┌─────────────────────────────────────────────────────────┐
│  Risk Score: 85/100 (Critical) 🔴                       │
│  Confidence: 100%                                       │
│                                                         │
│  ✗ SPF: fail                                            │
│  ✗ DKIM: fail                                           │
│  ✗ DMARC: fail                                          │
│  ⚠ Header mismatch detected                            │
│                                                         │
│  Executive Summary:                                     │
│  Multiple authentication failures detected. This email  │
│  is likely a phishing attempt. Do not interact with it.│
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Visual Elements

### Mode Toggle
```
┌──────────────┬──────────────┐
│ 🔍 Domain    │ 🤖 Automation│
│    Check     │     Mode     │
└──────────────┴──────────────┘
     ↑ Default      ↑ New Feature
```

### Risk Meter
```
Low Risk (0-29):
████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 25/100 🟢

Medium Risk (30-49):
████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 40/100 🟡

High Risk (50-69):
████████████████████████████████░░░░░░░░░░░░░░░░░░ 60/100 🟠

Critical Risk (70-100):
████████████████████████████████████████████░░░░░░░ 85/100 🔴
```

### Risk Indicators
```
🔴 Critical Issue (+40 points)
🟠 High Priority (+25 points)
🟡 Medium Concern (+15 points)
🟢 Low Risk Item (+5 points)
```

---

## 📱 Mobile View

On mobile devices, the layout adapts:

```
┌─────────────────┐
│ 🔍 Domain Check │  ← Full width
├─────────────────┤
│ 🤖 Automation   │  ← Stacked
│     Mode        │
├─────────────────┤
│                 │
│ [Email Headers] │  ← Full width
│                 │
├─────────────────┤
│ Domain: [____]  │  ← Full width
│ [Run Check →]   │
├─────────────────┤
│ Risk: 85/100 🔴 │  ← Compact
│ ████████████░░░ │
├─────────────────┤
│ AI Insights     │  ← Scrollable
│ • Risk 1        │
│ • Risk 2        │
│ • Risk 3        │
└─────────────────┘
```

---

## 🎯 Key Takeaways

### What to Look For

**🟢 Safe Email Indicators:**
- All authentication checks pass
- Headers align properly
- Risk score below 30
- Green status indicators

**🔴 Phishing Indicators:**
- Authentication failures
- Header mismatches
- High risk score (70+)
- Red status indicators

### Quick Decision Guide

```
Risk Score < 30  → ✅ Safe to interact
Risk Score 30-49 → ⚠️ Be cautious
Risk Score 50-69 → 🚨 High suspicion
Risk Score 70+   → 🛑 Do not interact
```

---

## 🚀 Try It Yourself

### Test Domains

**Good Examples:**
- google.com (A+ grade, low risk)
- microsoft.com (A+ grade, low risk)
- amazon.com (B grade, low risk)

**Poor Examples:**
- weak-domain.com (D grade, high risk)
- phishing-lookalike.net (F grade, critical risk)

### Sample Headers

**Legitimate Email:**
```
Authentication-Results: mx.google.com;
       spf=pass smtp.mailfrom=google.com;
       dkim=pass header.i=@google.com;
       dmarc=pass header.from=google.com
From: noreply@google.com
Return-Path: <noreply@google.com>
```

**Suspicious Email:**
```
Authentication-Results: mx.google.com;
       spf=fail smtp.mailfrom=suspicious.com;
       dkim=fail header.i=@suspicious.com;
       dmarc=fail header.from=google.com
From: security@google.com
Return-Path: <phisher@suspicious.com>
```

---

## 📖 Next Steps

1. **Try Standard Mode**
   - Enter a domain
   - View basic results
   - Check AI insights

2. **Enable Automation Mode**
   - Toggle to automation
   - Paste sample headers
   - See enhanced analysis

3. **Download a Report**
   - Generate full report
   - Review all sections
   - Share with team

4. **Test Real Emails**
   - Extract headers from emails
   - Analyze suspicious messages
   - Verify legitimate senders

---

**Ready to start?** Open AuthGuard and try these features! 🚀


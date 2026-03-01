# 🚀 Quick Start - Automation Mode

Get started with AuthGuard's Automation Mode in 5 minutes!

---

## Step 1: Run the App

```bash
cd email-security-toolkit
npm install
npm run dev
```

Open http://localhost:5173

---

## Step 2: Try Standard Mode First

1. Enter a domain: `google.com`
2. Click **"Run Check"**
3. View results in tabs
4. Check **"🤖 AI Insights"** tab

You'll see:
- Security grade (A+ to F)
- SPF, DKIM, DMARC status
- AI-generated insights
- Risk assessment

---

## Step 3: Enable Automation Mode

1. Click **"🤖 Automation Mode"** toggle
2. You'll see a text area for email headers

---

## Step 4: Paste Email Headers

### Get Headers from Gmail:
1. Open any email
2. Click ⋮ (three dots)
3. Select "Show original"
4. Copy all text

### Paste into AuthGuard:
1. Paste headers in the text area
2. Watch it auto-parse:
   - ✓ Domain extracted
   - ✓ SPF result detected
   - ✓ DKIM result detected
   - ✓ DMARC result detected

---

## Step 5: Run Enhanced Analysis

1. Click **"Run Check"**
2. Wait for DNS analysis
3. AI automatically analyzes with headers

---

## Step 6: View Risk Score

Navigate to **"🤖 AI Insights"** tab:

You'll see:
- **Risk Score**: 0-100 points with visual meter
- **Risk Level**: Critical/High/Medium/Low
- **Confidence**: Percentage based on data
- **Key Indicators**: Specific issues found
- **AI Summary**: Executive overview

---

## Step 7: Download Report

1. In AI Insights tab
2. Click **"📄 Download Full Report"**
3. Report downloads as markdown
4. Open in any text editor

Report includes:
- Executive summary
- Security posture table
- Critical vulnerabilities
- Risk indicators
- Attack scenarios
- Recommended actions
- Compliance assessment
- Timeline

---

## Example: Analyzing a Suspicious Email

### Scenario
You received a suspicious email claiming to be from your bank.

### Steps:

1. **Get Headers**
   - Open the email
   - Extract full headers
   - Copy to clipboard

2. **Enable Automation Mode**
   - Click toggle
   - Paste headers

3. **Check Preview**
   - Look for mismatches
   - Check authentication results
   - Note any warnings

4. **Run Analysis**
   - Click "Run Check"
   - Wait for results

5. **Review Risk Score**
   - High risk? Likely phishing
   - Check indicators
   - Look for header mismatches

6. **Read AI Insights**
   - Executive summary explains risk
   - Attack scenarios show how it works
   - Actions tell you what to do

7. **Take Action**
   - Report as phishing
   - Block sender
   - Alert security team
   - Download report for documentation

---

## Understanding Your Results

### Risk Levels

**🟢 Low (0-29 points)**
- Authentication is strong
- No critical issues
- Maintain current security

**🟡 Medium (30-49 points)**
- Some gaps exist
- Improvements recommended
- Address within 1 week

**🟠 High (50-69 points)**
- Significant vulnerabilities
- Action needed soon
- Fix within 48 hours

**🔴 Critical (70-100 points)**
- Severe security gaps
- Immediate action required
- Fix within 24 hours

### Key Indicators

Each indicator shows:
- **Severity**: Critical/High/Medium/Low
- **Issue**: What's wrong
- **Impact**: Risk points added

Example:
```
🔴 No DMARC policy configured (+40 points)
🟠 From/Return-Path mismatch detected (+10 points)
🟡 SPF uses soft fail (~all) (+15 points)
```

---

## Common Patterns

### ✅ Legitimate Email
```
Risk Score: 5/100 (Low)
Confidence: 100%

✓ SPF: pass
✓ DKIM: pass
✓ DMARC: pass
✓ Headers aligned
```

### ⚠️ Misconfigured Domain
```
Risk Score: 45/100 (Medium)
Confidence: 90%

✓ SPF: pass
✓ DKIM: pass
⚠ DMARC: none (monitoring only)
✓ Headers aligned
```

### 🚨 Phishing Attempt
```
Risk Score: 85/100 (Critical)
Confidence: 100%

✗ SPF: fail
✗ DKIM: fail
✗ DMARC: fail
⚠ Header mismatch detected
```

---

## Tips & Tricks

### 1. **Test Your Own Domain**
- Send yourself an email
- Extract headers
- Verify authentication passes
- Check for any warnings

### 2. **Compare Domains**
- Analyze multiple domains
- Compare risk scores
- Identify patterns
- Learn from good examples

### 3. **Track Improvements**
- Save reports with dates
- Make configuration changes
- Re-analyze after changes
- Verify risk score decreases

### 4. **Use for Training**
- Show team how to check emails
- Demonstrate phishing indicators
- Explain authentication concepts
- Share reports as examples

---

## Troubleshooting

### Headers Not Parsing?
- Make sure you copied complete headers
- Include the `Authentication-Results:` line
- Try pasting more of the header

### Domain Not Auto-Filled?
- Manually type the domain
- Check headers have `From:` field
- Verify domain format (no http://)

### AI Not Working?
- Check `.env` file exists
- Verify API key is set
- See [AI_INTEGRATION.md](./AI_INTEGRATION.md)

### Risk Score Unexpected?
- Review key indicators
- Check confidence level
- Consider all factors
- Read AI explanation

---

## Next Steps

1. **Read Full Documentation**
   - [AUTOMATION_MODE.md](./AUTOMATION_MODE.md) - Complete guide
   - [AI_INTEGRATION.md](./AI_INTEGRATION.md) - AI setup
   - [RESPONSIVE_DESIGN.md](./RESPONSIVE_DESIGN.md) - Mobile usage

2. **Configure AI (Optional)**
   - Get Anthropic API key
   - Add to `.env` file
   - Restart dev server
   - Enjoy enhanced insights

3. **Deploy to Production**
   - See [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Deploy to Vercel/Netlify
   - Share with your team
   - Use for security audits

---

## Need Help?

- 📖 Check documentation files
- 🔍 Review browser console
- ⚙️ Verify configuration
- 🧪 Test with sample domains

---

**Ready to secure your email?** Start analyzing now! 🚀


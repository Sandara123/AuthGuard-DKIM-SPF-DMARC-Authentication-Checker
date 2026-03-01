# Download Report Feature - User Guide

## Overview

AuthGuard now includes a comprehensive report download feature that allows you to export your email authentication analysis in both PDF and JSON formats.

---

## How to Download Reports

### Step 1: Run a Domain Analysis
1. Open AuthGuard in your browser
2. Enter a domain name (e.g., `google.com`)
3. Click "Run Check" button
4. Wait for the analysis to complete

### Step 2: Open the AI Chatbot
1. After the analysis completes, click the floating "Ask AI" button (🤖) in the bottom-right corner
2. The AuthGuard AI chatbot will open

### Step 3: Download Your Report
1. In the chatbot header, look for the download button (📥)
2. Click the download button to open the menu
3. Choose your preferred format:
   - **📄 Download PDF** - Opens print dialog for PDF export
   - **📊 Download JSON** - Downloads raw analysis data

---

## Report Formats

### PDF Report
- **Format:** Printable HTML that opens in print dialog
- **Filename:** `AuthGuard_Report_<domain>_<date>.pdf`
- **Contents:**
  - Executive summary with security grade
  - Risk assessment with score and indicators
  - Authentication protocol status (SPF, DKIM, DMARC)
  - AI-generated security insights
  - Detailed findings (passed, warnings, failures)
  - Prioritized recommendations with implementation code
  - Priority actions from AI analysis

**How to Save as PDF:**
1. Click "📄 Download PDF"
2. Print dialog opens automatically
3. Select "Save as PDF" or "Microsoft Print to PDF" as destination
4. Choose save location and click Save

### JSON Report
- **Format:** Structured JSON data
- **Filename:** `AuthGuard_Report_<domain>_<YYYY-MM-DD>.json`
- **Contents:**
  - Metadata (report type, version, timestamp, domain)
  - Summary (grade, score, risk level, confidence)
  - Authentication details (SPF, DKIM, DMARC with full records)
  - Findings array with all detection results
  - Recommendations array with priority levels
  - Risk indicators with impact scores
  - AI insights (executive summary, risks, actions)
  - Exploit scenarios

**Use Cases for JSON:**
- Integration with other security tools
- Automated processing and monitoring
- Historical tracking and comparison
- Custom report generation
- API integration

---

## Report Contents Explained

### 1. Metadata Section
- Domain analyzed
- Report generation date and time
- Security grade (A+ to F)
- Risk level (Low, Medium, High, Critical)

### 2. Risk Assessment
- **Risk Score:** 0-100 points (lower is better)
- **Risk Level:** Critical (70+), High (50-69), Medium (30-49), Low (<30)
- **Confidence:** Percentage based on data completeness
- **Key Indicators:** Specific issues contributing to risk score

### 3. Authentication Protocols
- **SPF Status:** Pass/Warn/Fail with qualifier and DNS lookup count
- **DKIM Status:** Pass/Fail with selector and key type
- **DMARC Status:** Policy level (none/quarantine/reject) and coverage percentage

### 4. AI Security Insights (if API key configured)
- Executive summary in plain language
- Top 3 security risks identified
- Priority actions recommended

### 5. Detailed Findings
- All checks performed (SPF, DKIM, DMARC, alignment, etc.)
- Status for each: ✓ Pass, ⚠ Warning, ✗ Failure
- Technical explanation for each finding

### 6. Recommendations
- Prioritized by severity: Critical, High, Medium
- Step-by-step remediation instructions
- DNS record examples and implementation code
- Expected security improvements

---

## Requirements

### For PDF Download
- Modern web browser with print functionality
- Chrome, Firefox, Safari, or Edge recommended
- Print-to-PDF capability (built into most browsers)

### For JSON Download
- Any modern web browser
- JavaScript enabled
- No additional software required

### For AI Insights in Reports
- Valid Anthropic API key configured in `.env`
- Set `VITE_ANTHROPIC_API_KEY=your_key_here`
- Without API key, reports will include standard analysis only

---

## Troubleshooting

### "No analysis data available" Error
**Problem:** Clicked download before running analysis  
**Solution:** Run a domain check first, then open chatbot and download

### PDF Print Dialog Doesn't Open
**Problem:** Browser blocked popup  
**Solution:** Allow popups for this site in browser settings

### JSON File Not Downloading
**Problem:** Browser download blocked  
**Solution:** Check browser download settings and allow downloads

### Report Missing AI Insights
**Problem:** API key not configured  
**Solution:** Add `VITE_ANTHROPIC_API_KEY` to `.env` file and restart server

### Report Shows "N/A" for Risk Level
**Problem:** Risk scoring not calculated  
**Solution:** Ensure analysis completed fully before downloading

---

## File Naming Convention

### PDF Reports
```
AuthGuard_Report_<domain>_<YYYY-MM-DD>.pdf
```
Example: `AuthGuard_Report_google.com_2026-02-25.pdf`

### JSON Reports
```
AuthGuard_Report_<domain>_<YYYY-MM-DD>.json
```
Example: `AuthGuard_Report_google.com_2026-02-25.json`

---

## Sample Report Structure (JSON)

```json
{
  "metadata": {
    "reportType": "AuthGuard Email Security Analysis",
    "version": "2.0",
    "generatedAt": "2026-02-25T15:30:00.000Z",
    "domain": "example.com"
  },
  "summary": {
    "grade": "B",
    "gradeLabel": "Good",
    "score": 75,
    "riskLevel": "Medium",
    "riskScore": 35,
    "confidence": 100
  },
  "authentication": {
    "spf": {
      "exists": true,
      "qualifier": "soft_fail",
      "raw": "v=spf1 include:_spf.example.com ~all",
      "mechanisms": ["include:_spf.example.com", "~all"],
      "lookupCount": 2
    },
    "dkim": {
      "exists": true,
      "selector": "default",
      "keyType": "RSA",
      "valid": true,
      "raw": "v=DKIM1; k=rsa; p=MIGfMA0GCS..."
    },
    "dmarc": {
      "exists": true,
      "policy": "quarantine",
      "subdomainPolicy": "quarantine",
      "percentage": 100,
      "reportingEmail": "dmarc@example.com",
      "raw": "v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com"
    }
  },
  "findings": [...],
  "recommendations": [...],
  "riskIndicators": [...],
  "aiInsights": {...}
}
```

---

## Best Practices

### When to Download Reports

1. **After Initial Assessment**
   - Document baseline security posture
   - Share with team for review
   - Create action plan from recommendations

2. **After Making Changes**
   - Verify improvements
   - Compare before/after results
   - Document compliance progress

3. **For Compliance Audits**
   - Provide evidence of security measures
   - Show remediation progress
   - Demonstrate due diligence

4. **Regular Monitoring**
   - Weekly or monthly snapshots
   - Track security posture over time
   - Identify configuration drift

### Report Storage Recommendations

- Store reports in version control (JSON format)
- Keep PDF reports for stakeholder presentations
- Archive reports for compliance requirements
- Compare reports over time to track improvements

---

## Integration Examples

### Using JSON Reports in Scripts

```javascript
// Load and parse JSON report
const report = JSON.parse(fs.readFileSync('report.json', 'utf8'));

// Check if domain passes all checks
const allPassed = report.findings.every(f => f.type === 'pass');

// Get critical recommendations
const critical = report.recommendations.filter(r => r.priority === 'critical');

// Calculate improvement needed
const targetScore = 90;
const improvement = targetScore - report.summary.score;
```

### Automated Monitoring

```bash
# Download report via API (if implemented)
curl -X POST https://your-authguard.com/api/analyze \
  -d '{"domain":"example.com"}' \
  -o report.json

# Check score and alert if below threshold
score=$(jq '.summary.score' report.json)
if [ $score -lt 80 ]; then
  echo "Security score below threshold: $score"
  # Send alert
fi
```

---

## Privacy & Security

### What's Included in Reports
- Domain name and DNS records (public information)
- Analysis results and recommendations
- AI-generated insights (if enabled)
- Timestamp and metadata

### What's NOT Included
- Your API keys or credentials
- Personal information
- Internal system details
- Email content or headers (unless you pasted them)

### Sharing Reports
- PDF reports are safe to share with stakeholders
- JSON reports contain technical details - share with technical team
- Redact domain names if needed for confidentiality
- Reports contain no sensitive authentication credentials

---

## Support

### Need Help?
- Check browser console for errors
- Verify analysis completed successfully
- Ensure popup blockers are disabled
- Try different browser if issues persist

### Feature Requests
- Request additional report formats
- Suggest new report sections
- Propose integration options

---

**Version:** 2.0  
**Last Updated:** 2026-02-25  
**Status:** ✅ Production Ready

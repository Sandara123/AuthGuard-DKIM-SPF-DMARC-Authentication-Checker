# 🚀 Quick Start Guide - AI Features

## 5-Minute Setup

### 1. Get API Key (2 minutes)
```
→ Visit: https://console.anthropic.com/
→ Sign up/Login
→ Click "Create Key"
→ Copy key (sk-ant-api03-...)
```

### 2. Configure (1 minute)
**Windows:**
```bash
setup-ai.bat
```

**Mac/Linux:**
```bash
chmod +x setup-ai.sh
./setup-ai.sh
```

**Manual:**
```bash
cp .env.example .env
# Edit .env and add your API key
```

### 3. Run (2 minutes)
```bash
npm install
npm run dev
```

Open: http://localhost:5173

---

## 🎯 Using AI Features

### View AI Insights
1. Enter domain → Click "Run Check"
2. Click **"🤖 AI Insights"** tab
3. View:
   - Executive Summary
   - Security Risks
   - Priority Actions
   - Threat Analysis

### Chat with AI
1. After domain check, click **"Ask AI"** button (bottom-right)
2. Ask questions:
   - "What is SPF?"
   - "How do I fix DMARC?"
   - "What should I do first?"

### Download Report
1. Go to **"AI Insights"** tab
2. Click **"📄 Download Full Report"**
3. Get markdown report with full analysis

---

## 💰 Cost Estimate

| Usage Level | Checks/Month | Est. Cost |
|-------------|--------------|-----------|
| Personal    | 50           | $0.50-1   |
| Small Team  | 500          | $5-15     |
| Enterprise  | 5000         | $50-150   |

*Prices approximate, varies with AI usage*

---

## 🔧 Troubleshooting

### "AI Analysis Unavailable"
- ✓ Check `.env` file exists
- ✓ Verify API key is set
- ✓ Restart dev server

### "API Error 401"
- ✗ Invalid API key
- → Generate new key at console.anthropic.com

### "API Error 429"
- ⏱️ Rate limit reached
- → Wait 1-2 minutes
- → Consider API upgrade

---

## 📚 Learn More

- **Full Documentation:** [AI_INTEGRATION.md](./AI_INTEGRATION.md)
- **Main README:** [README.md](./README.md)
- **Anthropic Docs:** https://docs.anthropic.com/

---

## 💡 Pro Tips

1. **Try Sample Domains First**
   - Click suggested domains (google.com, microsoft.com)
   - See how AI analyzes well-configured domains

2. **Ask Specific Questions**
   - Instead of "What's wrong?"
   - Ask "How do I implement SPF -all policy?"

3. **Use Context**
   - AI knows the current domain analysis
   - Reference it: "What's the biggest risk here?"

4. **Download Reports**
   - Save AI reports for documentation
   - Share with team for compliance

5. **Monitor Costs**
   - Check usage: console.anthropic.com/usage
   - Set budget alerts

---

**Need Help?** See [AI_INTEGRATION.md](./AI_INTEGRATION.md) for detailed troubleshooting.

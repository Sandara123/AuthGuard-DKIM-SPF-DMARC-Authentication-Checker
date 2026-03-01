/**
 * Report Generator - Download analysis reports in PDF and JSON formats
 */

// Generate JSON report
export function downloadJSONReport(domain, analysisResult, aiInsights, riskScore) {
  const report = {
    metadata: {
      reportType: 'AuthGuard Email Security Analysis',
      version: '2.0',
      generatedAt: new Date().toISOString(),
      domain: domain,
    },
    summary: {
      grade: analysisResult.grade,
      gradeLabel: analysisResult.gradeLabel,
      score: analysisResult.score,
      riskLevel: riskScore?.riskLevel || 'N/A',
      riskScore: riskScore?.riskScore || 0,
      confidence: riskScore?.confidence || 0,
    },
    authentication: {
      spf: analysisResult.spf || { exists: false },
      dkim: analysisResult.dkim || { exists: false },
      dmarc: analysisResult.dmarc || { exists: false },
    },
    findings: analysisResult.findings || [],
    recommendations: analysisResult.recommendations || [],
    riskIndicators: riskScore?.indicators || [],
    aiInsights: aiInsights || null,
    exploits: analysisResult.exploits || [],
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AuthGuard_Report_${domain}_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Generate and download PDF report
export function downloadPDFReport(domain, analysisResult, aiInsights, riskScore) {
  const date = new Date().toLocaleDateString();
  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>AuthGuard Report - ${domain}</title>
<style>
body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#1a1d2e}
h1{color:#1a1d2e;border-bottom:3px solid #00ffff;padding-bottom:10px}
.meta{background:#f5f5f5;padding:15px;border-radius:8px;margin:20px 0}
.grade{font-size:48px;font-weight:bold;color:${analysisResult.gradeColor}}
.section{margin:30px 0}
.finding{padding:10px;margin:10px 0;border-left:4px solid #ccc}
.pass{border-left-color:#006644;background:#f9fdfb}
.warn{border-left-color:#974f0c;background:#fffef9}
.fail{border-left-color:#bf2600;background:#fffaf9}
</style></head><body>
<h1>🛡️ AuthGuard Security Report</h1>
<div class="meta">
<p><strong>Domain:</strong> ${domain}</p>
<p><strong>Date:</strong> ${date}</p>
<p><strong>Grade:</strong> <span class="grade">${analysisResult.grade}</span> (${analysisResult.score}%)</p>
${riskScore ? `<p><strong>Risk:</strong> ${riskScore.riskLevel} (${riskScore.riskScore}/100)</p>` : ''}
</div>
<div class="section"><h2>Authentication</h2>
<p><strong>SPF:</strong> ${analysisResult.spf ? 'Configured' : 'Missing'}</p>
<p><strong>DKIM:</strong> ${analysisResult.dkim ? 'Configured' : 'Missing'}</p>
<p><strong>DMARC:</strong> ${analysisResult.dmarc ? 'Configured' : 'Missing'}</p>
</div>
${aiInsights ? `<div class="section"><h2>AI Insights</h2><p>${aiInsights.executiveSummary}</p></div>` : ''}
<div class="section"><h2>Findings</h2>
${analysisResult.findings.map(f => `<div class="finding ${f.type}"><strong>${f.title}</strong><br>${f.desc}</div>`).join('')}
</div></body></html>`;
  
  const w = window.open('', '_blank');
  if (w) {
    w.document.write(html);
    w.document.close();
    w.onload = () => setTimeout(() => w.print(), 250);
  }
}

/**
 * AI Service Module - Anthropic Claude Integration
 * Provides AI-powered security analysis, threat intelligence, and chatbot functionality
 * Enhanced with email header parsing and risk scoring with confidence levels
 */

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-3-5-sonnet-20241022'; // Latest Claude model

/**
 * Parse email headers to extract authentication results
 */
export function parseEmailHeaders(headerText) {
  if (!headerText || typeof headerText !== 'string') {
    return null;
  }

  const headers = {};
  const lines = headerText.split('\n');
  
  // Extract key authentication headers
  const authHeaders = [
    'Authentication-Results',
    'Received-SPF',
    'DKIM-Signature',
    'ARC-Authentication-Results',
    'From',
    'Return-Path',
    'Message-ID',
  ];

  lines.forEach(line => {
    authHeaders.forEach(header => {
      if (line.toLowerCase().startsWith(header.toLowerCase() + ':')) {
        headers[header] = line.substring(header.length + 1).trim();
      }
    });
  });

  // Parse authentication results
  const authResults = {
    spf: extractAuthResult(headers['Authentication-Results'], 'spf'),
    dkim: extractAuthResult(headers['Authentication-Results'], 'dkim'),
    dmarc: extractAuthResult(headers['Authentication-Results'], 'dmarc'),
    fromDomain: extractDomain(headers['From']),
    returnPath: extractDomain(headers['Return-Path']),
    hasHeaderMismatch: false,
  };

  // Check for header mismatches
  if (authResults.fromDomain && authResults.returnPath) {
    authResults.hasHeaderMismatch = authResults.fromDomain !== authResults.returnPath;
  }

  return authResults;
}

function extractAuthResult(authHeader, protocol) {
  if (!authHeader) return null;
  
  const regex = new RegExp(`${protocol}=(\\w+)`, 'i');
  const match = authHeader.match(regex);
  return match ? match[1].toLowerCase() : null;
}

function extractDomain(header) {
  if (!header) return null;
  
  const match = header.match(/@([a-zA-Z0-9.-]+)/);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Calculate risk level with confidence score
 */
export function calculateRiskScore(analysisResult, emailHeaders = null) {
  let riskScore = 0;
  let maxScore = 100;
  const indicators = [];

  // SPF Analysis (30 points)
  if (!analysisResult.spf) {
    riskScore += 30;
    indicators.push({ type: 'critical', message: 'No SPF record found', impact: 30 });
  } else if (analysisResult.spf.qualifier === 'pass_all') {
    riskScore += 30;
    indicators.push({ type: 'critical', message: 'SPF allows all senders (+all)', impact: 30 });
  } else if (analysisResult.spf.qualifier === 'soft_fail') {
    riskScore += 15;
    indicators.push({ type: 'medium', message: 'SPF uses soft fail (~all)', impact: 15 });
  }

  // DKIM Analysis (30 points)
  if (!analysisResult.dkim) {
    riskScore += 30;
    indicators.push({ type: 'critical', message: 'No DKIM signature configured', impact: 30 });
  } else if (!analysisResult.dkim.valid) {
    riskScore += 25;
    indicators.push({ type: 'critical', message: 'DKIM key is invalid or revoked', impact: 25 });
  }

  // DMARC Analysis (40 points)
  if (!analysisResult.dmarc) {
    riskScore += 40;
    indicators.push({ type: 'critical', message: 'No DMARC policy configured', impact: 40 });
  } else if (analysisResult.dmarc.policy === 'none') {
    riskScore += 30;
    indicators.push({ type: 'high', message: 'DMARC policy is "none" (monitoring only)', impact: 30 });
  } else if (analysisResult.dmarc.policy === 'quarantine') {
    riskScore += 15;
    indicators.push({ type: 'medium', message: 'DMARC policy is "quarantine" (not reject)', impact: 15 });
  }

  // Email header analysis (bonus indicators)
  if (emailHeaders) {
    if (emailHeaders.hasHeaderMismatch) {
      riskScore += 10;
      indicators.push({ type: 'high', message: 'From/Return-Path domain mismatch detected', impact: 10 });
    }
    if (emailHeaders.spf === 'fail') {
      indicators.push({ type: 'critical', message: 'SPF check failed in email headers', impact: 0 });
    }
    if (emailHeaders.dkim === 'fail') {
      indicators.push({ type: 'critical', message: 'DKIM verification failed in email headers', impact: 0 });
    }
  }

  // Calculate confidence score (based on data completeness)
  let confidence = 100;
  if (!emailHeaders) confidence -= 20; // Less confident without actual email headers
  if (!analysisResult.dmarc?.reportingEmail) confidence -= 10; // No reporting means less visibility

  // Determine risk level
  let riskLevel, riskColor;
  if (riskScore >= 70) {
    riskLevel = 'Critical';
    riskColor = '#ff3366';
  } else if (riskScore >= 50) {
    riskLevel = 'High';
    riskColor = '#ff6b35';
  } else if (riskScore >= 30) {
    riskLevel = 'Medium';
    riskColor = '#ffaa00';
  } else {
    riskLevel = 'Low';
    riskColor = '#00ff9f';
  }

  return {
    riskScore: Math.min(riskScore, maxScore),
    riskLevel,
    riskColor,
    confidence: Math.max(confidence, 0),
    indicators,
    summary: `${riskLevel} risk (${riskScore}/${maxScore} points) with ${confidence}% confidence`,
  };
}

/**
 * Make a request to Claude API
 */
async function callClaude(messages, systemPrompt, maxTokens = 2000) {
  if (!ANTHROPIC_API_KEY) {
    // Silently return null - AI features are optional
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: messages,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        console.warn('[AI Service] Invalid API key');
        return null;
      } else if (response.status === 429) {
        console.warn('[AI Service] Rate limit exceeded');
        return null;
      } else if (response.status >= 500) {
        console.warn('[AI Service] API temporarily unavailable');
        return null;
      } else {
        console.warn('[AI Service] API error:', response.status);
        return null;
      }
    }

    const data = await response.json();
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.warn('[AI Service] Invalid response format');
      return null;
    }
    
    return data.content[0].text;
  } catch (error) {
    // Log errors internally but don't throw
    console.warn('[AI Service]', error.message);
    return null;
  }
}

/**
 * Generate AI-powered security insights for domain analysis results
 * Enhanced with risk scoring and structured analysis
 */
export async function generateSecurityInsights(domain, analysisResult, emailHeaders = null) {
  // Calculate risk score first
  const riskAnalysis = calculateRiskScore(analysisResult, emailHeaders);
  
  const systemPrompt = `You are a cybersecurity expert specializing in email authentication (SPF, DKIM, DMARC).
Provide concise, actionable security insights based on the email authentication analysis.
Focus on real-world attack scenarios and practical remediation steps.
Format your response as:
SUMMARY: [2-3 sentence executive summary]
RISKS: [List 3 top risks, one per line]
ACTIONS: [List 3-5 priority actions, one per line]`;

  const userMessage = `Analyze this email authentication scan for ${domain}:

Security Grade: ${analysisResult.grade} (${analysisResult.gradeLabel})
Score: ${analysisResult.score}%
Risk Level: ${riskAnalysis.riskLevel} (${riskAnalysis.riskScore}/100 points, ${riskAnalysis.confidence}% confidence)
Findings: ${analysisResult.passCount} passed, ${analysisResult.warnCount} warnings, ${analysisResult.failCount} failures

SPF: ${analysisResult.spf ? `Present (${analysisResult.spf.qualifier})` : 'Missing'}
DKIM: ${analysisResult.dkim ? `Present (${analysisResult.dkim.keyType})` : 'Missing'}
DMARC: ${analysisResult.dmarc ? `Present (policy: ${analysisResult.dmarc.policy})` : 'Missing'}

Key Risk Indicators:
${riskAnalysis.indicators.map(ind => `- [${ind.type.toUpperCase()}] ${ind.message} (Impact: ${ind.impact} points)`).join('\n')}

Critical Issues:
${analysisResult.findings.filter(f => f.type === 'fail').map(f => `- ${f.title}: ${f.desc}`).join('\n')}

${emailHeaders ? `Email Header Analysis:
- From Domain: ${emailHeaders.fromDomain || 'N/A'}
- Return-Path: ${emailHeaders.returnPath || 'N/A'}
- Header Mismatch: ${emailHeaders.hasHeaderMismatch ? 'YES (suspicious)' : 'No'}
- SPF Result: ${emailHeaders.spf || 'N/A'}
- DKIM Result: ${emailHeaders.dkim || 'N/A'}
- DMARC Result: ${emailHeaders.dmarc || 'N/A'}` : ''}

Provide clear, actionable insights.`;

  const response = await callClaude(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    1500
  );

  // Fallback mock response if API fails
  if (!response) {
    return {
      executiveSummary: `The domain ${domain} has a security grade of ${analysisResult.grade} with ${riskAnalysis.riskLevel.toLowerCase()} risk level. ${analysisResult.failCount > 0 ? 'Critical vulnerabilities detected in email authentication configuration that could allow domain spoofing and phishing attacks.' : 'Email authentication is properly configured with minor improvements needed.'}`,
      topRisks: riskAnalysis.indicators.slice(0, 3).map(ind => ind.message),
      priorityActions: analysisResult.recommendations.slice(0, 5).map(r => r.title),
      riskAnalysis,
    };
  }

  // Parse AI response
  const parsed = parseAIInsights(response);
  parsed.riskAnalysis = riskAnalysis;
  return parsed;
}

/**
 * Generate natural language explanation of technical findings
 */
export async function explainFinding(finding, domain) {
  const systemPrompt = `You are a cybersecurity educator. Explain technical email authentication concepts in simple, clear language that non-technical users can understand. Use analogies when helpful.`;

  const userMessage = `Explain this email security finding in simple terms:

Domain: ${domain}
Finding: ${finding.title}
Technical Description: ${finding.desc}
Category: ${finding.category}
Severity: ${finding.type}

Provide:
1. What this means in simple language (2-3 sentences)
2. Real-world analogy to help understand it
3. Why it matters for this domain`;

  const response = await callClaude(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    800
  );

  if (!response) {
    return `${finding.title}: ${finding.desc}`;
  }

  return response;
}

/**
 * AI-powered threat analysis and attack scenario generation
 */
export async function generateThreatAnalysis(domain, analysisResult) {
  const systemPrompt = `You are a threat intelligence analyst specializing in email-based attacks.
Generate realistic attack scenarios based on email authentication weaknesses.
Be specific about exploitation techniques and potential impact.`;

  const userMessage = `Generate a threat analysis for ${domain} based on these authentication gaps:

SPF Status: ${analysisResult.spf ? analysisResult.spf.qualifier : 'missing'}
DKIM Status: ${analysisResult.dkim ? (analysisResult.dkim.valid ? 'valid' : 'invalid') : 'missing'}
DMARC Status: ${analysisResult.dmarc ? analysisResult.dmarc.policy : 'missing'}

Critical Issues:
${analysisResult.findings.filter(f => f.type === 'fail').map(f => f.title).join('\n')}

Provide:
1. Overall threat level (Critical/High/Medium/Low)
2. Three specific attack scenarios an attacker could execute
3. Potential business impact
4. Timeline: How quickly should this be fixed?`;

  const response = await callClaude(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    1200
  );

  if (!response) {
    return {
      threatLevel: analysisResult.failCount >= 3 ? 'Critical' : analysisResult.failCount >= 2 ? 'High' : analysisResult.failCount >= 1 ? 'Medium' : 'Low',
      attackScenarios: analysisResult.exploits.slice(0, 3),
      businessImpact: 'Email security vulnerabilities can lead to phishing attacks, brand damage, and data breaches.',
      timeline: analysisResult.failCount >= 2 ? 'Immediate (within 24 hours)' : 'Within 1 week',
    };
  }

  return parseThreatAnalysis(response);
}

/**
 * AI chatbot for answering email security questions
 */
export async function chatWithAI(userQuestion, conversationHistory = [], context = null) {
  const systemPrompt = `You are AuthGuard AI, an expert assistant for email authentication and security.
You help users understand SPF, DKIM, DMARC, email spoofing, phishing, and related security concepts.
Provide clear, accurate, and actionable advice. Keep responses concise (2-4 paragraphs).
If asked about specific domains, reference the analysis context when available.`;

  const messages = [
    ...conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
    {
      role: 'user',
      content: context 
        ? `[Context: Currently analyzing ${context.domain} - Grade: ${context.grade}]\n\nUser question: ${userQuestion}`
        : userQuestion,
    },
  ];

  const response = await callClaude(messages, systemPrompt, 1000);

  if (!response) {
    return "I'm currently unable to process your question. Please check your API configuration or try again later.";
  }

  return response;
}

/**
 * Generate comprehensive AI security report with enhanced formatting
 */
export async function generateSecurityReport(domain, analysisResult, emailHeaders = null) {
  const riskAnalysis = calculateRiskScore(analysisResult, emailHeaders);
  
  const systemPrompt = `You are a security consultant writing a professional email authentication security report.
Create a comprehensive but concise report suitable for both technical and executive audiences.
Use clear markdown formatting with sections, bullet points, and emphasis.`;

  const userMessage = `Create a detailed security report for ${domain}:

Overall Grade: ${analysisResult.grade} (${analysisResult.score}%)
Risk Level: ${riskAnalysis.riskLevel} (${riskAnalysis.riskScore}/100, ${riskAnalysis.confidence}% confidence)

Authentication Status:
- SPF: ${analysisResult.spf ? `Configured (${analysisResult.spf.qualifier})` : 'Missing'}
- DKIM: ${analysisResult.dkim ? `Configured (${analysisResult.dkim.keyType})` : 'Missing'}
- DMARC: ${analysisResult.dmarc ? `Policy: ${analysisResult.dmarc.policy}` : 'Missing'}

Issues: ${analysisResult.failCount} critical, ${analysisResult.warnCount} warnings, ${analysisResult.passCount} passed

Key Risk Indicators:
${riskAnalysis.indicators.map(ind => `- ${ind.message} (${ind.impact} risk points)`).join('\n')}

${emailHeaders ? `Email Header Analysis:
- From/Return-Path Match: ${!emailHeaders.hasHeaderMismatch ? 'Yes' : 'No (MISMATCH)'}
- Authentication Results: SPF=${emailHeaders.spf || 'N/A'}, DKIM=${emailHeaders.dkim || 'N/A'}, DMARC=${emailHeaders.dmarc || 'N/A'}` : ''}

Create a professional report with:
1. Executive Summary (3-4 sentences for leadership)
2. Current Security Posture (what's working, what's not)
3. Critical Vulnerabilities (specific issues found)
4. Attack Scenarios (how attackers could exploit gaps)
5. Recommended Actions (prioritized, with implementation steps)
6. Compliance & Best Practices Assessment
7. Next Steps & Timeline

Use markdown formatting for readability.`;

  const response = await callClaude(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    2500
  );

  if (!response) {
    return generateEnhancedMockReport(domain, analysisResult, riskAnalysis, emailHeaders);
  }

  return response;
}

function generateEnhancedMockReport(domain, analysisResult, riskAnalysis, emailHeaders) {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  return `# Email Authentication Security Report
## ${domain}

**Report Date:** ${date}  
**Security Grade:** ${analysisResult.grade} (${analysisResult.score}%)  
**Risk Level:** ${riskAnalysis.riskLevel} (${riskAnalysis.riskScore}/100 points)  
**Confidence:** ${riskAnalysis.confidence}%

---

## Executive Summary

Domain **${domain}** has been assessed with a security grade of **${analysisResult.grade}** and a **${riskAnalysis.riskLevel.toLowerCase()} risk level**. ${analysisResult.failCount > 0 ? `Critical authentication gaps were identified that could allow attackers to spoof emails from this domain, potentially leading to phishing attacks, brand damage, and security breaches.` : `The domain has strong email authentication configured with ${analysisResult.warnCount > 0 ? 'minor improvements recommended' : 'excellent security posture'}.`}

${analysisResult.failCount >= 2 ? 'Immediate action is required to prevent email-based attacks.' : analysisResult.failCount === 1 ? 'Action should be taken within 48 hours to address critical gaps.' : 'Continue monitoring and maintain current security standards.'}

---

## Current Security Posture

### Authentication Protocols

| Protocol | Status | Configuration | Assessment |
|----------|--------|---------------|------------|
| **SPF** | ${analysisResult.spf ? '✓ Configured' : '✗ Missing'} | ${analysisResult.spf ? analysisResult.spf.qualifier : 'N/A'} | ${analysisResult.spf ? (analysisResult.spf.qualifier === 'hard_fail' ? '✓ Strong' : analysisResult.spf.qualifier === 'soft_fail' ? '⚠ Weak' : '✗ Vulnerable') : '✗ Critical Gap'} |
| **DKIM** | ${analysisResult.dkim ? '✓ Configured' : '✗ Missing'} | ${analysisResult.dkim ? analysisResult.dkim.keyType : 'N/A'} | ${analysisResult.dkim?.valid ? '✓ Valid' : '✗ Invalid/Missing'} |
| **DMARC** | ${analysisResult.dmarc ? '✓ Configured' : '✗ Missing'} | ${analysisResult.dmarc ? `p=${analysisResult.dmarc.policy}` : 'N/A'} | ${analysisResult.dmarc ? (analysisResult.dmarc.policy === 'reject' ? '✓ Strong' : analysisResult.dmarc.policy === 'quarantine' ? '⚠ Moderate' : '⚠ Weak') : '✗ Critical Gap'} |

${emailHeaders ? `### Email Header Analysis

- **From Domain:** ${emailHeaders.fromDomain || 'N/A'}
- **Return-Path:** ${emailHeaders.returnPath || 'N/A'}
- **Header Alignment:** ${!emailHeaders.hasHeaderMismatch ? '✓ Matched' : '✗ Mismatch Detected (Suspicious)'}
- **SPF Check:** ${emailHeaders.spf || 'N/A'}
- **DKIM Verification:** ${emailHeaders.dkim || 'N/A'}
- **DMARC Evaluation:** ${emailHeaders.dmarc || 'N/A'}
` : ''}

---

## Critical Vulnerabilities

${analysisResult.findings.filter(f => f.type === 'fail').length > 0 ? 
  analysisResult.findings.filter(f => f.type === 'fail').map((f, i) => 
    `### ${i + 1}. ${f.title}\n\n**Category:** ${f.category}  \n**Severity:** Critical  \n\n${f.desc}\n`
  ).join('\n') : 
  '✓ No critical vulnerabilities detected.\n'}

${analysisResult.findings.filter(f => f.type === 'warn').length > 0 ? 
  `### Warnings\n\n${analysisResult.findings.filter(f => f.type === 'warn').map(f => `- **${f.title}:** ${f.desc}`).join('\n')}\n` : 
  ''}

---

## Risk Indicators

${riskAnalysis.indicators.map((ind, i) => 
  `${i + 1}. **[${ind.type.toUpperCase()}]** ${ind.message} *(Impact: ${ind.impact} points)*`
).join('\n')}

**Total Risk Score:** ${riskAnalysis.riskScore}/100  
**Assessment Confidence:** ${riskAnalysis.confidence}%

---

## Attack Scenarios

${analysisResult.exploits.length > 0 ? 
  `Based on the identified vulnerabilities, attackers could:\n\n${analysisResult.exploits.map((e, i) => `${i + 1}. ${e}`).join('\n')}` : 
  'No significant attack vectors identified with current configuration.'}

---

## Recommended Actions

${analysisResult.recommendations.length > 0 ? 
  analysisResult.recommendations.map((r, i) => 
    `### ${i + 1}. [${r.priority.toUpperCase()}] ${r.title}\n\n${r.desc}\n\n${r.code ? `**Implementation:**\n\`\`\`\n${r.code}\n\`\`\`\n` : ''}`
  ).join('\n') : 
  '✓ No immediate actions required. Continue monitoring DMARC reports and maintain current configuration.\n'}

---

## Compliance & Best Practices

- **RFC 7208 (SPF):** ${analysisResult.spf ? (analysisResult.spf.lookupCount <= 10 ? '✓ Compliant' : '✗ Exceeds DNS lookup limit') : '✗ Not implemented'}
- **RFC 6376 (DKIM):** ${analysisResult.dkim?.valid ? '✓ Compliant' : '✗ Not properly implemented'}
- **RFC 7489 (DMARC):** ${analysisResult.dmarc ? '✓ Implemented' : '✗ Not implemented'}
- **Industry Standards:** ${analysisResult.grade === 'A+' ? '✓ Exceeds standards' : analysisResult.grade.startsWith('A') || analysisResult.grade.startsWith('B') ? '✓ Meets standards' : '⚠ Below recommended standards'}

---

## Next Steps & Timeline

${analysisResult.failCount >= 3 ? 
  '**IMMEDIATE ACTION REQUIRED (Within 24 hours)**\n\n1. Address all critical vulnerabilities listed above\n2. Implement missing authentication protocols\n3. Test configuration with email authentication tools\n4. Monitor DMARC reports for 48 hours\n5. Escalate to reject policy once validated' : 
  analysisResult.failCount >= 1 ? 
  '**ACTION REQUIRED (Within 48-72 hours)**\n\n1. Review and address critical findings\n2. Implement recommended fixes\n3. Test email delivery after changes\n4. Monitor authentication reports' : 
  '**MAINTENANCE MODE**\n\n1. Continue monitoring DMARC aggregate reports\n2. Review authentication logs weekly\n3. Update SPF records when adding new mail servers\n4. Rotate DKIM keys annually'}

---

## Report Metadata

- **Generated:** ${date}
- **Analysis Engine:** AuthGuard v2.0 with AI Enhancement
- **Confidence Level:** ${riskAnalysis.confidence}%
- **Protocols Analyzed:** SPF, DKIM, DMARC${emailHeaders ? ', Email Headers' : ''}

---

*This report was generated automatically. For questions or assistance with implementation, consult your IT security team or email authentication specialist.*
`;
}

/**
 * AI-enhanced remediation recommendations
 */
export async function enhanceRecommendations(recommendations, domain) {
  if (recommendations.length === 0) return recommendations;

  const systemPrompt = `You are a security engineer providing step-by-step remediation guidance.
Enhance each recommendation with specific implementation steps and common pitfalls to avoid.`;

  const userMessage = `Enhance these recommendations for ${domain}:

${recommendations.map((r, i) => `${i + 1}. [${r.priority}] ${r.title}\n   ${r.desc}\n   Code: ${r.code || 'N/A'}`).join('\n\n')}

For each recommendation, add:
- Specific implementation steps (numbered list)
- Estimated time to implement
- Common mistakes to avoid
- Testing verification steps

Format as JSON array with same structure plus new fields.`;

  const response = await callClaude(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    2000
  );

  if (!response) return recommendations;

  try {
    // Try to parse enhanced recommendations
    const enhanced = JSON.parse(response);
    return enhanced;
  } catch {
    // If parsing fails, return original recommendations
    return recommendations;
  }
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

function parseAIInsights(aiResponse) {
  // Enhanced parsing of AI response into structured format
  const lines = aiResponse.split('\n').filter(l => l.trim());
  
  let executiveSummary = '';
  const topRisks = [];
  const priorityActions = [];
  
  // Try to parse structured format
  let currentSection = '';
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('SUMMARY:')) {
      currentSection = 'summary';
      executiveSummary = trimmed.substring(8).trim();
    } else if (trimmed.startsWith('RISKS:')) {
      currentSection = 'risks';
    } else if (trimmed.startsWith('ACTIONS:')) {
      currentSection = 'actions';
    } else if (trimmed.startsWith('-') || trimmed.match(/^\d+\./)) {
      const content = trimmed.replace(/^[-\d.]\s*/, '').trim();
      if (currentSection === 'risks' && topRisks.length < 3) {
        topRisks.push(content);
      } else if (currentSection === 'actions' && priorityActions.length < 5) {
        priorityActions.push(content);
      }
    } else if (currentSection === 'summary' && trimmed) {
      executiveSummary += ' ' + trimmed;
    }
  });
  
  // Fallback to simple parsing if structured format not found
  if (!executiveSummary) {
    executiveSummary = lines.slice(0, 3).join(' ');
  }
  if (topRisks.length === 0) {
    topRisks.push(...lines.filter(l => 
      l.toLowerCase().includes('risk') || 
      l.toLowerCase().includes('vulnerability') ||
      l.toLowerCase().includes('missing')
    ).slice(0, 3));
  }
  if (priorityActions.length === 0) {
    priorityActions.push(...lines.filter(l => 
      l.toLowerCase().includes('recommend') || 
      l.toLowerCase().includes('action') || 
      l.toLowerCase().includes('fix') ||
      l.toLowerCase().includes('implement')
    ).slice(0, 5));
  }
  
  return {
    executiveSummary: executiveSummary.trim(),
    topRisks,
    priorityActions,
    fullAnalysis: aiResponse,
  };
}

function parseThreatAnalysis(aiResponse) {
  const lines = aiResponse.split('\n').filter(l => l.trim());
  
  // Extract threat level
  const threatLevelLine = lines.find(l => l.toLowerCase().includes('threat level'));
  const threatLevel = threatLevelLine 
    ? (threatLevelLine.includes('Critical') ? 'Critical' : 
       threatLevelLine.includes('High') ? 'High' : 
       threatLevelLine.includes('Medium') ? 'Medium' : 'Low')
    : 'Medium';

  return {
    threatLevel,
    attackScenarios: lines.filter(l => l.match(/^\d+\./)).slice(0, 3),
    businessImpact: lines.find(l => l.toLowerCase().includes('impact')) || '',
    timeline: lines.find(l => l.toLowerCase().includes('timeline')) || '',
    fullAnalysis: aiResponse,
  };
}

export default {
  parseEmailHeaders,
  calculateRiskScore,
  generateSecurityInsights,
  explainFinding,
  generateThreatAnalysis,
  chatWithAI,
  generateSecurityReport,
  enhanceRecommendations,
};

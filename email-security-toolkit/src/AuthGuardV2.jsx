/**
 * AuthGuard v2.0 — Single-File React Artifact
 * Professional Email Authentication Security Scanner
 * Cyberpunk / Dark Security Theme
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/* ─── INJECTED GLOBAL STYLES ─────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg-void:        #020408;
  --bg-deep:        #060d14;
  --bg-space:       #0a1628;
  --bg-card:        #0d1f38;
  --bg-surface:     #112240;
  --bg-elevated:    #162a4a;
  --border-dim:     rgba(0,229,255,0.12);
  --border-glow:    rgba(0,229,255,0.35);
  --border-hot:     rgba(0,229,255,0.65);
  --cyan:           #00e5ff;
  --cyan-dim:       rgba(0,229,255,0.15);
  --cyan-mid:       rgba(0,229,255,0.4);
  --green:          #00ff9f;
  --green-dim:      rgba(0,255,159,0.12);
  --amber:          #ffb300;
  --amber-dim:      rgba(255,179,0,0.12);
  --red:            #ff1744;
  --red-dim:        rgba(255,23,68,0.12);
  --purple:         #e040fb;
  --purple-dim:     rgba(224,64,251,0.12);
  --text-primary:   #e2eaf6;
  --text-secondary: #6b8cae;
  --text-muted:     #3a5470;
  --font-head:      'Orbitron', monospace;
  --font-ui:        'Rajdhani', sans-serif;
  --font-mono:      'Share Tech Mono', monospace;
  --radius-sm:      6px;
  --radius-md:      10px;
  --radius-lg:      16px;
  --radius-xl:      24px;
  --glow-cyan:      0 0 20px rgba(0,229,255,0.4), 0 0 60px rgba(0,229,255,0.15);
  --glow-green:     0 0 20px rgba(0,255,159,0.4), 0 0 60px rgba(0,255,159,0.15);
  --glow-red:       0 0 20px rgba(255,23,68,0.4),  0 0 60px rgba(255,23,68,0.15);
  --glow-amber:     0 0 20px rgba(255,179,0,0.4),  0 0 60px rgba(255,179,0,0.15);
}

html { font-size: 16px; }
body {
  background: var(--bg-void);
  color: var(--text-primary);
  font-family: var(--font-ui);
  min-height: 100vh;
  overflow-x: hidden;
  font-size: 15px;
  line-height: 1.6;
}

::selection { background: var(--cyan-dim); color: var(--cyan); }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-deep); }
::-webkit-scrollbar-thumb { background: var(--border-glow); border-radius: 3px; }

/* ── ANIMATIONS ── */
@keyframes scanline {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
@keyframes pulse-dot {
  0%,100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.4; transform: scale(0.8); }
}
@keyframes glow-pulse {
  0%,100% { text-shadow: var(--glow-cyan); }
  50%      { text-shadow: none; }
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes barFill {
  from { width: 0; }
}
@keyframes float {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}
@keyframes typewriter {
  from { opacity: 0; } to { opacity: 1; }
}
@keyframes neonFlicker {
  0%,100% { opacity: 1; }
  92%      { opacity: 1; }
  93%      { opacity: 0.4; }
  94%      { opacity: 1; }
  96%      { opacity: 0.7; }
  97%      { opacity: 1; }
}
@keyframes progressStep {
  0%   { width: 0; }
  100% { width: 100%; }
}
@keyframes chatSlide {
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes typing-bounce {
  0%,60%,100% { transform: translateY(0); }
  30%          { transform: translateY(-6px); }
}

/* ── LAYOUT ── */
.ag-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,229,255,0.06) 0%, transparent 70%),
    var(--bg-void);
}

/* ── HEADER ── */
.ag-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(6,13,20,0.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-dim);
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ag-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}
.ag-logo-icon {
  width: 38px; height: 38px;
  background: linear-gradient(135deg, var(--cyan), #0080c8);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  box-shadow: var(--glow-cyan);
}
.ag-logo-text {
  font-family: var(--font-head);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--cyan);
  animation: neonFlicker 6s ease infinite;
}
.ag-logo-version {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 1px;
}
.ag-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--green);
  letter-spacing: 1px;
}
.ag-status-dot {
  width: 8px; height: 8px;
  background: var(--green);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--green);
  animation: pulse-dot 2s ease infinite;
}
.ag-header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}
.ag-api-badge {
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 4px 10px;
  border: 1px solid var(--border-dim);
  border-radius: 20px;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}

/* ── MAIN ── */
.ag-main {
  flex: 1;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  padding: 40px 24px 120px;
}

/* ── SCANNER CARD ── */
.ag-scanner-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-lg);
  padding: 36px;
  margin-bottom: 32px;
  overflow: hidden;
}
.ag-scanner-card::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0,229,255,0.03), transparent);
  animation: scanline 4s linear infinite;
  pointer-events: none;
}
.ag-scanner-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  background: linear-gradient(180deg, rgba(0,229,255,0.04) 0%, transparent 60%);
  pointer-events: none;
}
.ag-scanner-title {
  font-family: var(--font-head);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--text-primary);
  margin-bottom: 6px;
}
.ag-scanner-title span { color: var(--cyan); }
.ag-scanner-sub {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 28px;
  font-family: var(--font-mono);
  letter-spacing: 0.5px;
}

.ag-input-row {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
}
.ag-domain-input {
  flex: 1;
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-md);
  padding: 13px 18px;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 15px;
  letter-spacing: 0.5px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  min-width: 0;
}
.ag-domain-input:focus {
  border-color: var(--border-glow);
  box-shadow: 0 0 0 3px var(--cyan-dim);
}
.ag-domain-input::placeholder { color: var(--text-muted); }

.ag-btn-scan {
  background: linear-gradient(135deg, var(--cyan), #0095c8);
  border: none;
  border-radius: var(--radius-md);
  padding: 13px 28px;
  color: #000;
  font-family: var(--font-head);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1.5px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  box-shadow: var(--glow-cyan);
}
.ag-btn-scan:hover { transform: translateY(-2px); filter: brightness(1.1); }
.ag-btn-scan:active { transform: translateY(0); }
.ag-btn-scan:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.ag-samples {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.ag-samples-label {
  font-size: 12px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  letter-spacing: 0.5px;
}
.ag-sample-chip {
  padding: 5px 13px;
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  border-radius: 20px;
  color: var(--text-secondary);
  font-size: 12px;
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.3px;
}
.ag-sample-chip:hover {
  border-color: var(--border-glow);
  color: var(--cyan);
  background: var(--cyan-dim);
}

/* ── PROGRESS BAR ── */
.ag-progress {
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-md);
  padding: 24px;
  margin-bottom: 32px;
  animation: fadeSlideUp 0.3s ease;
}
.ag-progress-steps {
  display: flex;
  align-items: flex-start;
  gap: 0;
  margin-bottom: 20px;
  position: relative;
}
.ag-progress-steps::before {
  content: '';
  position: absolute;
  top: 16px; left: 0; right: 0;
  height: 2px;
  background: var(--border-dim);
  z-index: 0;
}
.ag-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}
.ag-step-dot {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--bg-space);
  border: 2px solid var(--border-dim);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px;
  transition: all 0.3s;
  font-family: var(--font-mono);
  color: var(--text-muted);
}
.ag-step.done .ag-step-dot {
  background: var(--green-dim);
  border-color: var(--green);
  color: var(--green);
  box-shadow: 0 0 12px rgba(0,255,159,0.4);
}
.ag-step.active .ag-step-dot {
  background: var(--cyan-dim);
  border-color: var(--cyan);
  color: var(--cyan);
  box-shadow: 0 0 12px rgba(0,229,255,0.5);
  animation: pulse-dot 1s ease infinite;
}
.ag-step-label {
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--text-muted);
  text-align: center;
  letter-spacing: 0.5px;
  white-space: nowrap;
}
.ag-step.done .ag-step-label { color: var(--green); }
.ag-step.active .ag-step-label { color: var(--cyan); }

.ag-progress-bar-wrap {
  height: 4px;
  background: var(--border-dim);
  border-radius: 4px;
  overflow: hidden;
}
.ag-progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--cyan), var(--green));
  border-radius: 4px;
  transition: width 0.5s ease;
  box-shadow: 0 0 12px var(--cyan);
}
.ag-progress-status {
  margin-top: 10px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--cyan);
  letter-spacing: 0.5px;
  text-align: center;
}

/* ── SCORE BANNER ── */
.ag-score-banner {
  background: linear-gradient(135deg, var(--bg-surface), var(--bg-elevated));
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-lg);
  padding: 28px 32px;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  gap: 32px;
  animation: fadeSlideUp 0.4s ease;
  flex-wrap: wrap;
}
.ag-score-bar-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.ag-score-bar-track {
  flex: 1;
  height: 6px;
  background: var(--bg-deep);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--border-dim);
}
.ag-score-bar-fill {
  height: 100%;
  border-radius: 6px;
  animation: barFill 1s ease forwards;
  box-shadow: 0 0 8px currentColor;
}
.ag-score-bar-label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
  min-width: 32px;
  text-align: right;
}
.ag-btn-dl-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 14px 18px;
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  min-width: 80px;
}
.ag-btn-dl-banner:hover {
  border-color: var(--border-glow);
  background: var(--cyan-dim);
  box-shadow: var(--glow-cyan);
}
.ag-btn-dl-icon {
  font-size: 20px;
  line-height: 1;
}
.ag-btn-dl-text {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
  text-align: center;
  line-height: 1.4;
}
.ag-btn-dl-banner:hover .ag-btn-dl-text {
  color: var(--cyan);
}
.ag-dl-wrap { position: relative; flex-shrink: 0; }
.ag-dl-menu {
  position: absolute; bottom: calc(100% + 10px); right: 0;
  background: #0a1628; border: 1px solid rgba(0,229,255,0.35);
  border-radius: 12px; padding: 8px; min-width: 200px;
  z-index: 200; box-shadow: 0 0 20px rgba(0,229,255,0.15);
  animation: fadeSlideUp 0.2s ease;
}
.ag-dl-menu-label {
  font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 1.5px;
  color: #3a5470; padding: 6px 10px 4px; text-transform: uppercase;
}
.ag-dl-item {
  display: flex; align-items: center; gap: 10px; width: 100%;
  background: transparent; border: none; padding: 10px 12px;
  border-radius: 8px; cursor: pointer; transition: background 0.15s;
  text-align: left;
}
.ag-dl-item:hover { background: rgba(0,229,255,0.08); }
.ag-dl-item-icon { font-size: 16px; flex-shrink: 0; }
.ag-dl-item-title {
  display: block; font-family: 'Rajdhani', sans-serif;
  font-size: 13px; font-weight: 600; color: #e2eaf6;
}
.ag-dl-item-sub {
  display: block; font-family: 'Share Tech Mono', monospace;
  font-size: 10px; color: #6b8cae;
}
.ag-grade-circle {
  width: 90px; height: 90px;
  border-radius: 50%;
  border: 3px solid var(--cyan);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ag-grade-letter {
  font-family: var(--font-head);
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
  animation: glow-pulse 3s ease infinite;
}
.ag-grade-score {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-secondary);
}
.grade-A { color: var(--green); border-color: var(--green); box-shadow: var(--glow-green); }
.grade-B { color: var(--cyan);  border-color: var(--cyan);  box-shadow: var(--glow-cyan);  }
.grade-C { color: var(--amber); border-color: var(--amber); box-shadow: var(--glow-amber); }
.grade-D { color: #ff6d00;      border-color: #ff6d00;      box-shadow: 0 0 20px rgba(255,109,0,0.4); }
.grade-F { color: var(--red);   border-color: var(--red);   box-shadow: var(--glow-red);   }

.ag-score-center {
  flex: 1;
  min-width: 180px;
}
.ag-score-domain {
  font-family: var(--font-mono);
  font-size: 18px;
  color: var(--text-primary);
  margin-bottom: 4px;
}
.ag-score-domain span { color: var(--cyan); }
.ag-score-meta {
  font-size: 12px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  margin-bottom: 14px;
}
.ag-protocol-badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.ag-proto-badge {
  padding: 5px 14px;
  border-radius: 20px;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 5px;
}
.proto-pass { background: var(--green-dim);  border: 1px solid rgba(0,255,159,0.35); color: var(--green); }
.proto-warn { background: var(--amber-dim);  border: 1px solid rgba(255,179,0,0.35);  color: var(--amber); }
.proto-fail { background: var(--red-dim);    border: 1px solid rgba(255,23,68,0.35);  color: var(--red);   }

/* ── TABS ── */
.ag-tabs {
  margin-bottom: 24px;
}
.ag-tab-list {
  display: flex;
  gap: 0;
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-md);
  padding: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}
.ag-tab-list::-webkit-scrollbar { display: none; }
.ag-tab-btn {
  flex: 1;
  min-width: max-content;
  padding: 9px 16px;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.ag-tab-btn:hover { color: var(--text-primary); background: var(--bg-card); }
.ag-tab-btn.active {
  background: var(--bg-surface);
  color: var(--cyan);
  box-shadow: 0 0 12px var(--cyan-dim);
}

/* ── PANEL ── */
.ag-panel { animation: fadeSlideUp 0.3s ease; }

/* ── PROTOCOL CARDS ── */
.ag-proto-grid {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 16px;
  margin-bottom: 28px;
}
.ag-proto-card {
  background: var(--bg-card);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-lg);
  padding: 22px;
  transition: border-color 0.2s;
}
.ag-proto-card:hover { border-color: var(--border-glow); }
.ag-proto-card.status-pass { border-top: 2px solid var(--green); }
.ag-proto-card.status-warn { border-top: 2px solid var(--amber); }
.ag-proto-card.status-fail { border-top: 2px solid var(--red); }
.ag-proto-card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}
.ag-proto-name {
  font-family: var(--font-head);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-primary);
}
.ag-proto-status {
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 10px;
  font-weight: 600;
}
.ag-proto-record {
  margin-bottom: 12px;
}
.ag-proto-record-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 1px;
  margin-bottom: 5px;
}
.ag-record-code {
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--cyan);
  word-break: break-all;
  line-height: 1.5;
  max-height: 70px;
  overflow-y: auto;
}
.ag-record-none {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--red);
  font-style: italic;
}
.ag-proto-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ── ATTACK VECTORS ── */
.ag-attack-section { margin-top: 8px; }
.ag-section-title {
  font-family: var(--font-head);
  font-size: 13px;
  letter-spacing: 2px;
  color: var(--amber);
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ag-attack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}
.ag-attack-card {
  background: var(--bg-deep);
  border: 1px solid rgba(255,23,68,0.2);
  border-left: 3px solid var(--red);
  border-radius: var(--radius-md);
  padding: 16px;
  animation: fadeSlideUp 0.3s ease;
}
.ag-attack-title {
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 700;
  color: var(--red);
  margin-bottom: 6px;
}
.ag-attack-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}
.ag-attack-severity {
  display: inline-block;
  margin-top: 8px;
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--red-dim);
  color: var(--red);
  border: 1px solid rgba(255,23,68,0.3);
}

/* ── AI INSIGHTS ── */
.ag-ai-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}
.ag-ai-title {
  font-family: var(--font-head);
  font-size: 14px;
  letter-spacing: 2px;
  color: var(--cyan);
  display: flex;
  align-items: center;
  gap: 8px;
}
.ag-btn-analyze {
  background: linear-gradient(135deg, var(--cyan-dim), var(--bg-surface));
  border: 1px solid var(--border-glow);
  border-radius: var(--radius-md);
  padding: 10px 22px;
  color: var(--cyan);
  font-family: var(--font-head);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ag-btn-analyze:hover { background: var(--cyan-dim); box-shadow: var(--glow-cyan); }
.ag-btn-analyze:disabled { opacity: 0.4; cursor: not-allowed; }

.ag-btn-download {
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-md);
  padding: 10px 20px;
  color: var(--text-secondary);
  font-family: var(--font-ui);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 7px;
}
.ag-btn-download:hover { border-color: var(--border-glow); color: var(--cyan); }

.ag-ai-no-domain {
  text-align: center;
  padding: 60px 24px;
  color: var(--text-muted);
}
.ag-ai-no-domain-icon { font-size: 48px; margin-bottom: 16px; }
.ag-ai-no-domain-text { font-family: var(--font-mono); font-size: 13px; }

.ag-ai-loading {
  text-align: center;
  padding: 60px;
}
.ag-spinner {
  width: 48px; height: 48px;
  border: 3px solid var(--border-dim);
  border-top-color: var(--cyan);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 20px;
}
.ag-loading-text {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--cyan);
  letter-spacing: 1px;
}

.ag-ai-result {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeSlideUp 0.4s ease;
}
.ag-ai-card {
  background: var(--bg-card);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-lg);
  padding: 24px;
}
.ag-ai-card-title {
  font-family: var(--font-head);
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--text-muted);
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ag-threat-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: var(--radius-md);
  font-family: var(--font-head);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
}
.threat-CRITICAL { background: var(--red-dim);    border: 1px solid rgba(255,23,68,0.4);  color: var(--red);   }
.threat-HIGH     { background: rgba(255,109,0,.12); border: 1px solid rgba(255,109,0,.4);  color: #ff6d00;      }
.threat-MEDIUM   { background: var(--amber-dim);  border: 1px solid rgba(255,179,0,0.4); color: var(--amber); }
.threat-LOW      { background: var(--green-dim);  border: 1px solid rgba(0,255,159,0.4); color: var(--green); }

.ag-ai-summary {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
  font-family: var(--font-ui);
}
.ag-risk-list { display: flex; flex-direction: column; gap: 12px; }
.ag-risk-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-md);
  padding: 14px;
}
.ag-risk-num {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: var(--red-dim);
  border: 1px solid rgba(255,23,68,0.35);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--red);
  flex-shrink: 0;
}
.ag-risk-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}
.ag-risk-title {
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 3px;
  font-size: 14px;
}

/* ── FINDINGS ── */
.ag-findings { display: flex; flex-direction: column; gap: 10px; }
.ag-finding-card {
  background: var(--bg-card);
  border: 1px solid var(--border-dim);
  border-left: 3px solid transparent;
  border-radius: var(--radius-md);
  padding: 16px 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  animation: fadeSlideUp 0.3s ease;
}
.ag-finding-card.pass { border-left-color: var(--green); }
.ag-finding-card.warn { border-left-color: var(--amber); }
.ag-finding-card.fail { border-left-color: var(--red); }
.ag-finding-icon {
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 1px;
}
.ag-finding-card.pass .ag-finding-icon { background: var(--green-dim); color: var(--green); }
.ag-finding-card.warn .ag-finding-icon { background: var(--amber-dim); color: var(--amber); }
.ag-finding-card.fail .ag-finding-icon { background: var(--red-dim);   color: var(--red);   }
.ag-finding-title {
  font-weight: 700;
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 4px;
}
.ag-finding-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}
.ag-finding-meta {
  margin-top: 5px;
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
}
.ag-finding-card.pass .ag-finding-meta { background: var(--green-dim); color: var(--green);  border: 1px solid rgba(0,255,159,0.2); }
.ag-finding-card.warn .ag-finding-meta { background: var(--amber-dim); color: var(--amber);  border: 1px solid rgba(255,179,0,0.2); }
.ag-finding-card.fail .ag-finding-meta { background: var(--red-dim);   color: var(--red);    border: 1px solid rgba(255,23,68,0.2);  }

/* ── RECOMMENDATIONS ── */
.ag-recs { display: flex; flex-direction: column; gap: 16px; }
.ag-rec-card {
  background: var(--bg-card);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-lg);
  padding: 22px;
  animation: fadeSlideUp 0.3s ease;
}
.ag-rec-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.ag-rec-protocol {
  font-family: var(--font-head);
  font-size: 13px;
  color: var(--cyan);
  letter-spacing: 1.5px;
}
.ag-rec-priority {
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
}
.priority-HIGH     { background: var(--red-dim);   color: var(--red);   border: 1px solid rgba(255,23,68,0.3);  }
.priority-MEDIUM   { background: var(--amber-dim); color: var(--amber); border: 1px solid rgba(255,179,0,0.3); }
.priority-LOW      { background: var(--green-dim); color: var(--green); border: 1px solid rgba(0,255,159,0.3); }
.ag-rec-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 14px;
  line-height: 1.6;
}
.ag-rec-code-block {
  position: relative;
}
.ag-rec-code-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 1px;
  margin-bottom: 6px;
}
.ag-code-area {
  background: var(--bg-void);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-sm);
  padding: 14px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--green);
  word-break: break-all;
  line-height: 1.7;
  position: relative;
}
.ag-copy-btn {
  position: absolute;
  top: 8px; right: 8px;
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-sm);
  padding: 4px 10px;
  font-size: 11px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}
.ag-copy-btn:hover { border-color: var(--border-glow); color: var(--cyan); }
.ag-copy-btn.copied { color: var(--green); border-color: rgba(0,255,159,0.4); }

/* ── DNS RECORDS ── */
.ag-dns-list { display: flex; flex-direction: column; gap: 16px; }
.ag-dns-item {
  background: var(--bg-card);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-lg);
  padding: 22px;
  animation: fadeSlideUp 0.3s ease;
}
.ag-dns-proto {
  font-family: var(--font-head);
  font-size: 13px;
  letter-spacing: 2px;
  color: var(--cyan);
  margin-bottom: 6px;
}
.ag-dns-name {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 10px;
}
.ag-dns-record {
  background: var(--bg-void);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-sm);
  padding: 14px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--green);
  word-break: break-all;
  line-height: 1.7;
}
.ag-dns-record.missing {
  color: var(--red);
  font-style: italic;
}

/* ── CHATBOT FLOATING BUTTON ── */
.ag-fab {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 900;
  width: 58px; height: 58px;
  background: linear-gradient(135deg, var(--cyan), #0080c8);
  border: none;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px;
  cursor: pointer;
  box-shadow: var(--glow-cyan);
  animation: float 3s ease-in-out infinite;
  transition: transform 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.ag-fab:hover { transform: scale(1.1); }
.ag-fab-label {
  position: absolute;
  right: 68px;
  background: var(--bg-card);
  border: 1px solid var(--border-dim);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  white-space: nowrap;
}

/* ── CHATBOT PANEL ── */
.ag-chat-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(6px);
  z-index: 950;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 24px;
}
.ag-chat-panel {
  width: 100%;
  max-width: 420px;
  height: min(680px, 90vh);
  background: var(--bg-space);
  border: 1px solid var(--border-glow);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--glow-cyan);
  animation: chatSlide 0.3s ease;
}
.ag-chat-header {
  padding: 16px 20px;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border-dim);
  display: flex;
  align-items: center;
  gap: 12px;
}
.ag-chat-avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--cyan), #0080c8);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  box-shadow: 0 0 12px rgba(0,229,255,0.4);
}
.ag-chat-title { font-family: var(--font-head); font-size: 13px; letter-spacing: 1px; color: var(--text-primary); }
.ag-chat-sub { font-family: var(--font-mono); font-size: 10px; color: var(--cyan); }
.ag-chat-dl-btn {
  margin-left: auto;
  margin-right: 8px;
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-sm);
  padding: 6px 12px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 11px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  flex-shrink: 0;
}
.ag-chat-dl-btn:hover {
  border-color: var(--border-glow);
  color: var(--cyan);
  background: var(--cyan-dim);
}
.ag-chat-close {
  margin-left: auto;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s;
  line-height: 1;
}
.ag-chat-close:hover { color: var(--cyan); }
.ag-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}
.ag-chat-msg {
  display: flex;
  gap: 10px;
  animation: chatSlide 0.25s ease;
}
.ag-chat-msg.user { flex-direction: row-reverse; }
.ag-msg-avatar {
  width: 30px; height: 30px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  background: var(--bg-elevated);
}
.ag-msg-bubble {
  max-width: 78%;
  padding: 11px 15px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-word;
  overflow-wrap: break-word;
}
.ag-chat-msg.assistant .ag-msg-bubble {
  background: var(--bg-elevated);
  border: 1px solid var(--border-dim);
  border-radius: 14px 14px 14px 4px;
  color: var(--text-primary);
}
.ag-chat-msg.user .ag-msg-bubble {
  background: linear-gradient(135deg, var(--cyan), #0095c8);
  color: #000;
  border-radius: 14px 14px 4px 14px;
  font-weight: 500;
}
.ag-msg-time {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-muted);
  margin-top: 4px;
  text-align: right;
}
.ag-chat-msg.user .ag-msg-time { text-align: left; color: rgba(0,0,0,0.45); }

.ag-typing-indicator {
  padding: 12px 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-dim);
  border-radius: 14px 14px 14px 4px;
  display: inline-flex;
  gap: 4px;
  align-items: center;
}
.ag-typing-indicator span {
  width: 7px; height: 7px;
  background: var(--cyan);
  border-radius: 50%;
  animation: typing-bounce 1.4s ease infinite;
}
.ag-typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.ag-typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

.ag-chat-suggestions {
  padding: 10px 16px;
  border-top: 1px solid var(--border-dim);
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}
.ag-chat-suggestions::-webkit-scrollbar { display: none; }
.ag-sugg-chip {
  padding: 6px 13px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-dim);
  border-radius: 14px;
  color: var(--text-secondary);
  font-size: 11px;
  font-family: var(--font-mono);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  flex-shrink: 0;
}
.ag-sugg-chip:hover { border-color: var(--border-glow); color: var(--cyan); background: var(--cyan-dim); }

.ag-chat-input-row {
  padding: 14px 16px;
  background: var(--bg-elevated);
  border-top: 1px solid var(--border-dim);
  display: flex;
  gap: 10px;
  align-items: flex-end;
}
.ag-chat-input {
  flex: 1;
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  color: var(--text-primary);
  font-family: var(--font-ui);
  font-size: 14px;
  resize: none;
  max-height: 110px;
  outline: none;
  transition: border-color 0.2s;
  -webkit-overflow-scrolling: touch;
}
.ag-chat-input:focus { border-color: var(--border-glow); }
.ag-chat-input::placeholder { color: var(--text-muted); }
.ag-chat-send {
  width: 42px; height: 42px;
  background: linear-gradient(135deg, var(--cyan), #0080c8);
  border: none;
  border-radius: var(--radius-md);
  color: #000;
  font-size: 18px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}
.ag-chat-send:hover:not(:disabled) { box-shadow: var(--glow-cyan); transform: translateY(-2px); }
.ag-chat-send:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── EMPTY STATE ── */
.ag-empty-state {
  text-align: center;
  padding: 70px 24px;
  animation: fadeIn 0.4s ease;
}
.ag-empty-icon { font-size: 52px; margin-bottom: 18px; }
.ag-empty-title {
  font-family: var(--font-head);
  font-size: 16px;
  letter-spacing: 2px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}
.ag-empty-sub {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-muted);
}

/* ── FOOTER ── */
.ag-footer {
  text-align: center;
  padding: 20px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
  border-top: 1px solid var(--border-dim);
}

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .ag-proto-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .ag-main { padding: 24px 16px 100px; }
  .ag-scanner-card { padding: 22px 18px; }
  .ag-scanner-title { font-size: 16px; letter-spacing: 2px; }
  .ag-input-row { flex-direction: column; }
  .ag-btn-scan { width: 100%; }
  .ag-proto-grid { grid-template-columns: 1fr; }
  .ag-score-banner { padding: 20px; gap: 18px; }
  .ag-header { padding: 0 16px; }
  .ag-logo-text { font-size: 14px; letter-spacing: 1px; }
  .ag-chat-overlay { padding: 0; }
  .ag-chat-panel { max-width: 100%; height: 100vh; border-radius: 0; }
  .ag-fab { bottom: 16px; right: 16px; width: 52px; height: 52px; font-size: 20px; }
  .ag-tab-btn { font-size: 12px; padding: 8px 12px; }
}
@media (max-width: 480px) {
  .ag-proto-grid { grid-template-columns: 1fr; }
  .ag-score-banner { flex-direction: column; text-align: center; }
  .ag-protocol-badges { justify-content: center; }
  .ag-score-bar-wrap { max-width: 320px; margin: 0 auto 12px; }
  .ag-btn-dl-banner { flex-direction: row; gap: 8px; min-width: unset; width: 100%; padding: 12px 16px; justify-content: center; }
  .ag-btn-dl-text { text-align: left; }
  .ag-header-right .ag-api-badge { display: none; }
  .ag-chat-input { font-size: 16px; }
}
@media (max-width: 360px) {
  .ag-scanner-title { font-size: 14px; }
  .ag-main { padding: 16px 12px 90px; }
}
@supports (padding: max(0px)) {
  .ag-fab { bottom: max(16px, env(safe-area-inset-bottom)); right: max(16px, env(safe-area-inset-right)); }
  .ag-chat-input-row { padding-bottom: max(14px, env(safe-area-inset-bottom)); }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
`;

/* ─── DOMAIN DATA ENGINE ─────────────────────────────────────────────── */
const DOMAIN_DB = {
  'google.com': {
    spf:   { status: 'pass', record: 'v=spf1 include:_spf.google.com ~all', description: 'Google uses a comprehensive SPF record with multiple authorized sending mechanisms.' },
    dkim:  { status: 'pass', record: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQ...AQAB', description: 'Strong 2048-bit RSA key with valid DKIM signature setup.' },
    dmarc: { status: 'pass', record: 'v=DMARC1; p=reject; rua=mailto:mailauth-reports@google.com; ruf=mailto:mailauth-reports@google.com; pct=100', description: 'Strict DMARC reject policy with full aggregate and forensic reporting.' },
    score: 98, grade: 'A+',
  },
  'microsoft.com': {
    spf:   { status: 'pass', record: 'v=spf1 include:spf.protection.outlook.com include:_spf-a.microsoft.com ~all', description: 'Microsoft employs SPF with Outlook and internal mail server authorizations.' },
    dkim:  { status: 'pass', record: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADIC...', description: '2048-bit DKIM key properly configured for all outbound mail.' },
    dmarc: { status: 'pass', record: 'v=DMARC1; p=reject; fo=1; rua=mailto:d@rua.agari.com; ruf=mailto:d@ruf.agari.com', description: 'Enterprise-grade DMARC with third-party monitoring.' },
    score: 96, grade: 'A+',
  },
  'weak-domain.com': {
    spf:   { status: 'warn', record: 'v=spf1 +all', description: 'Critical: SPF "+all" allows ANY server to send as this domain — effectively no protection.' },
    dkim:  { status: 'fail', record: null, description: 'No DKIM record found. Emails cannot be cryptographically verified.' },
    dmarc: { status: 'fail', record: null, description: 'No DMARC record found. No policy to handle unauthorized emails.' },
    score: 8, grade: 'F',
  },
};

function getSimulatedResult(domain) {
  const known = DOMAIN_DB[domain.toLowerCase()];
  if (known) return known;

  // Generate deterministic pseudo-random results for unknown domains
  const hash = domain.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const hasSpf   = hash % 5 !== 0;
  const hasDkim  = hash % 7 !== 1;
  const hasDmarc = hash % 11 !== 2;
  const spfStrict = hash % 3 === 0;
  const dmarcStrict = hasDmarc && hash % 4 === 0;

  let score = 0;
  if (hasSpf)   score += hasSpf ? (spfStrict ? 30 : 22) : 0;
  if (hasDkim)  score += 35;
  if (hasDmarc) score += dmarcStrict ? 35 : 25;

  const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : score >= 35 ? 'D' : 'F';

  return {
    spf:   hasSpf
      ? { status: spfStrict ? 'pass' : 'warn', record: spfStrict ? `v=spf1 include:mail.${domain} -all` : `v=spf1 include:mail.${domain} ~all`, description: spfStrict ? 'SPF record with strict "-all" qualifier. Unauthorized sending is rejected.' : 'SPF uses "~all" (soft fail). Consider upgrading to "-all" for stricter enforcement.' }
      : { status: 'fail', record: null, description: 'No SPF record found. Anyone can spoof email from this domain.' },
    dkim:  hasDkim
      ? { status: 'pass', record: `v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQ...${hash.toString(36).toUpperCase()}==`, description: 'DKIM record present. Emails can be cryptographically verified by recipients.' }
      : { status: 'fail', record: null, description: 'No DKIM record found. Email integrity cannot be verified.' },
    dmarc: hasDmarc
      ? { status: dmarcStrict ? 'pass' : 'warn', record: dmarcStrict ? `v=DMARC1; p=reject; rua=mailto:dmarc@${domain}` : `v=DMARC1; p=none; rua=mailto:dmarc@${domain}`, description: dmarcStrict ? 'DMARC reject policy active — emails failing SPF/DKIM are rejected.' : 'DMARC set to "none" (monitoring only). Upgrade to "quarantine" or "reject".' }
      : { status: 'fail', record: null, description: 'No DMARC record found. Failed authentication attempts are not handled.' },
    score, grade,
  };
}

function buildAttackVectors(result) {
  const vectors = [];
  if (result.spf?.status === 'fail' || result.spf?.record?.includes('+all')) {
    vectors.push({ title: 'Email Spoofing', severity: 'CRITICAL', desc: 'Without a valid SPF record, any attacker can forge emails from this domain to target users, partners, or customers.' });
  }
  if (result.dkim?.status === 'fail') {
    vectors.push({ title: 'Message Tampering', severity: 'HIGH', desc: 'Without DKIM signatures, emails in transit can be modified by man-in-the-middle attackers without detection by recipients.' });
  }
  if (result.dmarc?.status === 'fail') {
    vectors.push({ title: 'Phishing Campaigns', severity: 'CRITICAL', desc: 'No DMARC policy means spoofed emails reach inboxes. Attackers can impersonate this domain in large-scale phishing attacks.' });
  }
  if (result.dmarc?.record?.includes('p=none')) {
    vectors.push({ title: 'Policy Bypass', severity: 'MEDIUM', desc: 'DMARC "p=none" provides visibility but no enforcement. Spoofed emails still reach recipients\' inboxes.' });
  }
  if (result.spf?.record?.includes('~all')) {
    vectors.push({ title: 'Soft-Fail Exploitation', severity: 'MEDIUM', desc: 'SPF "~all" marks unauthorized senders as soft-fail. Many mail servers still deliver these messages.' });
  }
  if (vectors.length === 0) {
    vectors.push({ title: 'Credential Harvesting via Look-alikes', severity: 'LOW', desc: 'Even with strong configuration, attackers may use lookalike domains. Monitor domain variations.' });
  }
  return vectors;
}

function buildFindings(result) {
  const f = [];
  // SPF
  if (result.spf?.status === 'pass') {
    f.push({ status: 'pass', proto: 'SPF', title: 'SPF Record Present & Valid', desc: result.spf.description, meta: 'PASS' });
    if (result.spf.record?.includes('-all')) {
      f.push({ status: 'pass', proto: 'SPF', title: 'SPF Strict Mode Enabled', desc: 'SPF uses "-all" — unauthorized senders are rejected, not soft-failed.', meta: 'STRICT' });
    }
  } else if (result.spf?.status === 'warn') {
    f.push({ status: 'warn', proto: 'SPF', title: 'SPF Configured With Warnings', desc: result.spf.description, meta: 'WARNING' });
    if (result.spf.record?.includes('+all')) {
      f.push({ status: 'fail', proto: 'SPF', title: 'SPF +all: Open Relay Risk', desc: `"v=spf1 +all" authorizes every server in the world — this is worse than having no SPF at all.`, meta: 'CRITICAL' });
    }
  } else {
    f.push({ status: 'fail', proto: 'SPF', title: 'No SPF Record Found', desc: 'Email spoofing from this domain is trivially possible. Publish an SPF TXT record immediately.', meta: 'MISSING' });
  }
  // DKIM
  if (result.dkim?.status === 'pass') {
    f.push({ status: 'pass', proto: 'DKIM', title: 'DKIM Signing Active', desc: result.dkim.description, meta: 'PASS' });
  } else {
    f.push({ status: 'fail', proto: 'DKIM', title: 'No DKIM Record Found', desc: 'Email integrity cannot be verified. Set up DKIM with your mail provider.', meta: 'MISSING' });
  }
  // DMARC
  if (result.dmarc?.status === 'pass') {
    f.push({ status: 'pass', proto: 'DMARC', title: 'DMARC Policy Active', desc: result.dmarc.description, meta: 'PASS' });
    if (result.dmarc.record?.includes('rua=')) {
      f.push({ status: 'pass', proto: 'DMARC', title: 'DMARC Aggregate Reporting Enabled', desc: 'Aggregate reports (rua=) allow monitoring of email authentication results across all sending sources.', meta: 'REPORTING' });
    }
  } else if (result.dmarc?.status === 'warn') {
    f.push({ status: 'warn', proto: 'DMARC', title: 'DMARC Monitor Mode Only', desc: result.dmarc.description, meta: 'WARNING' });
  } else {
    f.push({ status: 'fail', proto: 'DMARC', title: 'No DMARC Record Found', desc: 'Phishing emails appear to come from this domain and reach inboxes unchallenged.', meta: 'MISSING' });
  }
  return f;
}

function buildRecommendations(domain, result) {
  const recs = [];
  if (result.spf?.status !== 'pass' || result.spf?.record?.includes('+all') || result.spf?.record?.includes('~all')) {
    recs.push({
      protocol: 'SPF',
      priority: result.spf?.status === 'fail' || result.spf?.record?.includes('+all') ? 'HIGH' : 'MEDIUM',
      desc: 'Add or update your SPF TXT record to restrict authorized senders to your mail servers only.',
      code: `@ IN TXT "v=spf1 include:_spf.${domain} -all"`,
    });
  }
  if (result.dkim?.status === 'fail') {
    recs.push({
      protocol: 'DKIM',
      priority: 'HIGH',
      desc: 'Generate a DKIM key pair and publish the public key as a DNS TXT record. Your mail server signs outgoing messages with the private key.',
      code: `default._domainkey IN TXT "v=DKIM1; k=rsa; p=<YOUR_PUBLIC_KEY>"`,
    });
  }
  if (result.dmarc?.status === 'fail') {
    recs.push({
      protocol: 'DMARC',
      priority: 'HIGH',
      desc: 'Start with a monitoring DMARC policy (p=none) to gather reports, then escalate to quarantine and finally reject.',
      code: `_dmarc IN TXT "v=DMARC1; p=reject; rua=mailto:dmarc@${domain}; pct=100"`,
    });
  }
  if (result.dmarc?.record?.includes('p=none')) {
    recs.push({
      protocol: 'DMARC',
      priority: 'MEDIUM',
      desc: 'Upgrade DMARC policy from "none" to "quarantine" or "reject" to actively block spoofed emails.',
      code: `_dmarc IN TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain}; pct=100"`,
    });
  }
  if (recs.length === 0) {
    recs.push({
      protocol: 'ALL',
      priority: 'LOW',
      desc: 'Your email authentication is well configured. Consider enabling forensic reports (ruf=) for detailed failure analysis.',
      code: `_dmarc IN TXT "v=DMARC1; p=reject; rua=mailto:dmarc@${domain}; ruf=mailto:dmarc@${domain}; pct=100"`,
    });
  }
  return recs;
}

/* ─── SMALL HELPERS ──────────────────────────────────────────────────── */
const statusIcon = s => s === 'pass' ? '✓' : s === 'warn' ? '⚠' : '✗';
const gradeClass = g => `grade-${g?.[0] ?? 'F'}`;
const fmtTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const STEPS = ['DNS Lookup', 'SPF Analysis', 'DKIM Check', 'DMARC Validation', 'Scoring'];

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────── */
export default function AuthGuardV2() {
  const [domain,      setDomain]      = useState('');
  const [scanning,    setScanning]    = useState(false);
  const [stepIdx,     setStepIdx]     = useState(-1);
  const [result,      setResult]      = useState(null);
  const [activeTab,   setActiveTab]   = useState('overview');
  const [aiState,     setAiState]     = useState('idle');  // idle | loading | done | error
  const [aiData,      setAiData]      = useState(null);
  const [copiedKey,   setCopiedKey]   = useState(null);
  const [dlMenuOpen,  setDlMenuOpen]  = useState(false);
  const [chatOpen,    setChatOpen]    = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: '👋 Hi! I\'m AuthGuard AI. I can help you understand email authentication, SPF, DKIM, DMARC, and security best practices. What would you like to know?', time: fmtTime() },
  ]);
  const [chatInput,   setChatInput]   = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const chatEndRef = useRef(null);
  const dlWrapRef   = useRef(null);
  const apiKey = typeof import.meta !== 'undefined' ? (import.meta.env?.VITE_ANTHROPIC_API_KEY ?? '') : '';

  // Inject CSS once
  useEffect(() => {
    const id = 'ag-styles';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = CSS;
      document.head.appendChild(style);
    }
    return () => { /* keep styles */ };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  useEffect(() => {
    if (!dlMenuOpen) return;
    const handler = e => { if (dlWrapRef.current && !dlWrapRef.current.contains(e.target)) setDlMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dlMenuOpen]);

  /* ── SCAN ── */
  const runScan = useCallback(async (d = domain) => {
    const target = d.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!target) return;
    setDomain(target);
    setResult(null);
    setAiData(null);
    setAiState('idle');
    setActiveTab('overview');
    setScanning(true);
    setStepIdx(0);

    for (let i = 0; i < STEPS.length; i++) {
      setStepIdx(i);
      await new Promise(r => setTimeout(r, 480 + Math.random() * 350));
    }

    const data = getSimulatedResult(target);
    setResult({ domain: target, ...data, timestamp: new Date().toISOString() });
    setScanning(false);
    setStepIdx(STEPS.length);
  }, [domain]);

  /* ── AI INSIGHTS ── */
  const fetchAiInsights = useCallback(async () => {
    if (!result) return;
    setAiState('loading');
    setAiData(null);

    if (!apiKey) {
      await new Promise(r => setTimeout(r, 1400));
      setAiData({
        threatLevel: result.score < 30 ? 'CRITICAL' : result.score < 60 ? 'HIGH' : result.score < 80 ? 'MEDIUM' : 'LOW',
        summary: `Security assessment for **${result.domain}** (Score: ${result.score}/100):\n\nThe domain demonstrates ${result.score >= 80 ? 'strong' : result.score >= 50 ? 'moderate' : 'critically weak'} email authentication posture. ${result.dmarc?.status === 'fail' ? 'The absence of a DMARC record is the most severe gap — it leaves the domain fully exposed to impersonation in phishing campaigns.' : 'DMARC policy provides enforcement coverage.'} ${result.dkim?.status === 'fail' ? 'Missing DKIM prevents message integrity verification.' : 'DKIM signing is active.'} ${result.spf?.status === 'fail' ? 'No SPF record means any server may claim to send from this domain.' : 'SPF record provides sender authorization controls.'}\n\nImmediate remediation is ${result.score < 50 ? 'urgently required' : result.score < 80 ? 'recommended' : 'optional for further hardening'}.`,
        risks: [
          result.dmarc?.status !== 'pass'
            ? { title: 'No DMARC Enforcement', desc: 'Emails impersonating this domain bypass recipient security filters and land in inboxes. Phishing attacks using this domain are trivially executable.' }
            : { title: 'DMARC Monitoring vs Enforcement', desc: 'DMARC is active but may allow some spoofed emails through depending on the policy and ISP strictness.' },
          result.dkim?.status !== 'pass'
            ? { title: 'Email Integrity Unverifiable', desc: 'Without DKIM, messages can be tampered in transit. Recipients cannot cryptographically verify email authenticity.' }
            : { title: 'Key Rotation Schedule', desc: 'Ensure DKIM keys are rotated every 6-12 months to limit the blast radius of any key compromise.' },
          result.spf?.status !== 'pass' || result.spf?.record?.includes('+all')
            ? { title: 'Unrestricted Sending Permissions', desc: 'SPF configuration allows unauthorized servers to send as this domain, providing a direct vector for spoofing attacks.' }
            : { title: 'SPF Lookup Limit', desc: 'Monitor that include: mechanisms don\'t exceed 10 DNS lookups — this can cause SPF failures in some MTAs.' },
        ],
      });
      setAiState('done');
      return;
    }

    try {
      const prompt = `You are a cybersecurity expert specializing in email authentication (SPF, DKIM, DMARC). Analyze this domain scan result and respond in JSON only.

Domain: ${result.domain}
SPF Status: ${result.spf?.status} — Record: ${result.spf?.record ?? 'MISSING'}
DKIM Status: ${result.dkim?.status} — Record: ${result.dkim?.record ? 'PRESENT' : 'MISSING'}
DMARC Status: ${result.dmarc?.status} — Record: ${result.dmarc?.record ?? 'MISSING'}
Security Score: ${result.score}/100
Grade: ${result.grade}

Return this exact JSON structure:
{
  "threatLevel": "CRITICAL|HIGH|MEDIUM|LOW",
  "summary": "Executive summary (2-3 sentences, professional tone)",
  "risks": [
    {"title": "Risk #1 Title", "desc": "Detailed explanation"},
    {"title": "Risk #2 Title", "desc": "Detailed explanation"},
    {"title": "Risk #3 Title", "desc": "Detailed explanation"}
  ]
}`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!res.ok) throw new Error(`API ${res.status}`);
      const json = await res.json();
      const text = json.content?.[0]?.text ?? '{}';
      const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? '{}');
      setAiData(parsed);
      setAiState('done');
    } catch {
      setAiState('error');
    }
  }, [result, apiKey]);

  /* ── DOWNLOAD REPORT ── */
  const downloadReport = useCallback(() => {
    if (!result) return;
    const hr = '---';
    const statusEmoji = s => s === 'pass' ? '✅' : s === 'warn' ? '⚠️' : '❌';
    const findings  = buildFindings(result);
    const recs      = buildRecommendations(result.domain, result);
    const attacks   = buildAttackVectors(result);
    const scanDate  = new Date(result.timestamp).toLocaleString();
    const gradeDesc = result.grade === 'A+' || result.grade === 'A' ? 'Excellent' : result.grade === 'B' ? 'Good' : result.grade === 'C' ? 'Fair' : result.grade === 'D' ? 'Poor' : 'Critical';

    const lines = [
      `# 🛡️ AuthGuard Security Report`,
      `## Domain: \`${result.domain}\``,
      '',
      `| Field | Value |`,
      `|-------|-------|`,
      `| **Scan Date** | ${scanDate} |`,
      `| **Overall Grade** | ${result.grade} (${gradeDesc}) |`,
      `| **Security Score** | ${result.score} / 100 |`,
      `| **SPF** | ${statusEmoji(result.spf?.status)} ${result.spf?.status?.toUpperCase()} |`,
      `| **DKIM** | ${statusEmoji(result.dkim?.status)} ${result.dkim?.status?.toUpperCase()} |`,
      `| **DMARC** | ${statusEmoji(result.dmarc?.status)} ${result.dmarc?.status?.toUpperCase()} |`,
      '',
      hr,
      '',
      '## 🤖 AI Analysis',
      '',
      aiData
        ? [
            `**Threat Level:** ${aiData.threatLevel}`,
            '',
            '### Executive Summary',
            '',
            aiData.summary ?? '',
            '',
            '### Top 3 Risks',
            '',
            ...(aiData.risks ?? []).map((r, i) => [
              `#### ${i + 1}. ${r.title}`,
              '',
              r.desc,
              '',
            ]).flat(),
          ].join('\n')
        : '_AI analysis not generated. Open the \u{1F916} AI Insights tab and click Analyze Domain to enrich this report._',
      '',
      hr,
      '',
      '## 📄 Protocol Details',
      '',
      '### SPF (Sender Policy Framework)',
      '',
      `**Status:** ${statusEmoji(result.spf?.status)} ${result.spf?.status?.toUpperCase()}`,
      '',
      `**DNS Record:**`,
      '```',
      result.spf?.record ?? 'No SPF record found',
      '```',
      '',
      result.spf?.description ?? '',
      '',
      '### DKIM (DomainKeys Identified Mail)',
      '',
      `**Status:** ${statusEmoji(result.dkim?.status)} ${result.dkim?.status?.toUpperCase()}`,
      '',
      `**DNS Record:**`,
      '```',
      result.dkim?.record ?? 'No DKIM record found',
      '```',
      '',
      result.dkim?.description ?? '',
      '',
      '### DMARC (Domain-based Message Authentication)',
      '',
      `**Status:** ${statusEmoji(result.dmarc?.status)} ${result.dmarc?.status?.toUpperCase()}`,
      '',
      `**DNS Record:**`,
      '```',
      result.dmarc?.record ?? 'No DMARC record found',
      '```',
      '',
      result.dmarc?.description ?? '',
      '',
      hr,
      '',
      '## 🔍 Findings',
      '',
      ...findings.map(f => [
        `### ${f.status === 'pass' ? '✅' : f.status === 'warn' ? '⚠️' : '❌'} ${f.proto} — ${f.title}`,
        '',
        f.desc,
        '',
        `> **Status:** \`${f.meta}\``,
        '',
      ]).flat(),
      hr,
      '',
      '## 🛠️ Remediation Recommendations',
      '',
      recs.length === 0
        ? '_No critical fixes required. Email authentication is well configured._\n'
        : recs.map((r, i) => [
            `### ${i + 1}. ${r.protocol} — Priority: ${r.priority}`,
            '',
            r.desc,
            '',
            '**DNS Record to Add:**',
            '```dns',
            r.code,
            '```',
            '',
          ]).flat().join('\n'),
      '',
      hr,
      '',
      '## ⚠️ Attack Vectors',
      '',
      ...attacks.map(a => [
        `### ${a.title}`,
        '',
        `**Severity:** \`${a.severity}\``,
        '',
        a.desc,
        '',
      ]).flat(),
      hr,
      '',
      '## 🗂️ Raw DNS Records',
      '',
      `**SPF** \`${result.domain} TXT\``,
      '```',
      result.spf?.record ?? '; No SPF record found',
      '```',
      '',
      `**DKIM** \`default._domainkey.${result.domain} TXT\``,
      '```',
      result.dkim?.record ?? '; No DKIM record found',
      '```',
      '',
      `**DMARC** \`_dmarc.${result.domain} TXT\``,
      '```',
      result.dmarc?.record ?? '; No DMARC record found',
      '```',
      '',
      hr,
      '',
      `*Report generated by [AuthGuard v2.0](https://github.com) on ${scanDate}*`,
      '*AI-Powered Email Authentication Security Scanner*',
    ];

    const content = lines.join('\n');
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `authguard-${result.domain}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result, aiData]);

  /* ── EXPORT – JSON ── */
  const exportJSON = useCallback(() => {
    if (!result) return;
    const payload = {
      meta: { tool: 'AuthGuard v2.0', generatedAt: new Date().toISOString() },
      domain:    result.domain,
      timestamp: result.timestamp,
      grade:     result.grade,
      score:     result.score,
      protocols: {
        spf:   { status: result.spf?.status,   record: result.spf?.record   ?? null, description: result.spf?.description   ?? '' },
        dkim:  { status: result.dkim?.status,  record: result.dkim?.record  ?? null, description: result.dkim?.description  ?? '' },
        dmarc: { status: result.dmarc?.status, record: result.dmarc?.record ?? null, description: result.dmarc?.description ?? '' },
      },
      findings:        buildFindings(result),
      recommendations: buildRecommendations(result.domain, result),
      attackVectors:   buildAttackVectors(result),
      aiInsights: aiData ?? null,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: `authguard-${result.domain}-${Date.now()}.json` });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDlMenuOpen(false);
  }, [result, aiData]);

  /* ── EXPORT – CSV ── */
  const exportCSV = useCallback(() => {
    if (!result) return;
    const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [
      ['Protocol', 'Status', 'Record', 'Detail', 'Recommendation'],
      ['SPF',   result.spf?.status,   result.spf?.record   ?? 'MISSING', result.spf?.description   ?? '', ''],
      ['DKIM',  result.dkim?.status,  result.dkim?.record  ?? 'MISSING', result.dkim?.description  ?? '', ''],
      ['DMARC', result.dmarc?.status, result.dmarc?.record ?? 'MISSING', result.dmarc?.description ?? '', ''],
      ...buildRecommendations(result.domain, result).map(r => [r.protocol, 'RECOMMENDATION', r.code, r.desc, `Priority: ${r.priority}`]),
      ...buildFindings(result).map(f => [f.proto, f.status.toUpperCase(), f.meta, f.title, f.desc]),
    ];
    const csv = rows.map(r => r.map(esc).join(',')).join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: `authguard-${result.domain}-${Date.now()}.csv` });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDlMenuOpen(false);
  }, [result]);

  /* ── EXPORT – PDF ── */
  const exportPDF = useCallback(async () => {
    if (!result) return;
    setDlMenuOpen(false);

    // Dynamically load jsPDF from CDN
    const loadJsPDF = () => new Promise((resolve, reject) => {
      if (window.jspdf?.jsPDF) { resolve(window.jspdf.jsPDF); return; }
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      s.onload  = () => resolve(window.jspdf.jsPDF);
      s.onerror = reject;
      document.head.appendChild(s);
    });

    let JsPDF;
    try { JsPDF = await loadJsPDF(); }
    catch { alert('Failed to load PDF library. Check your internet connection.'); return; }

    const doc = new JsPDF({ unit: 'pt', format: 'a4' });
    const PW  = doc.internal.pageSize.getWidth();
    const PH  = doc.internal.pageSize.getHeight();
    const M   = 40;   // margin
    const CW  = PW - M * 2;
    let   y   = M;

    // Theme colours (PDF uses RGB hex strings)
    const BG     = '#060d14';
    const CARD   = '#0d1f38';
    const CYAN   = '#00e5ff';
    const GREEN  = '#00ff9f';
    const AMBER  = '#ffb300';
    const RED    = '#ff1744';
    const WHITE  = '#e2eaf6';
    const MUTED  = '#6b8cae';

    const newPage = () => {
      doc.addPage();
      doc.setFillColor(BG);
      doc.rect(0, 0, PW, PH, 'F');
      y = M;
    };

    const checkPage = (needed = 40) => { if (y + needed > PH - M) newPage(); };

    const setFont = (size, color = WHITE, style = 'normal') => {
      doc.setFontSize(size);
      doc.setTextColor(color);
      doc.setFont('helvetica', style);
    };

    const drawLine = (col = CYAN, lw = 0.5) => {
      doc.setDrawColor(col); doc.setLineWidth(lw);
      doc.line(M, y, PW - M, y);
      y += 8;
    };

    const text = (str, x, size = 11, color = WHITE, style = 'normal', maxW = CW) => {
      setFont(size, color, style);
      const lines = doc.splitTextToSize(String(str ?? ''), maxW);
      checkPage(lines.length * (size * 1.4));
      doc.text(lines, x, y);
      y += lines.length * (size * 1.4);
    };

    const badge = (label, col) => {
      const w = doc.getTextWidth(label) + 12;
      doc.setFillColor(col + '28'); // ~16% alpha
      doc.setDrawColor(col);
      doc.setLineWidth(0.5);
      doc.roundedRect(M, y - 2, w, 16, 3, 3, 'FD');
      setFont(9, col, 'bold');
      doc.text(label, M + 6, y + 10);
      y += 22;
    };

    const statusColor = s => s === 'pass' ? GREEN : s === 'warn' ? AMBER : RED;
    const statusLabel = s => s === 'pass' ? '✓ PASS' : s === 'warn' ? '⚠ WARN' : '✗ FAIL';

    // ── Page background
    doc.setFillColor(BG);
    doc.rect(0, 0, PW, PH, 'F');

    // ── Header bar
    doc.setFillColor(CARD);
    doc.rect(0, 0, PW, 70, 'F');
    doc.setDrawColor(CYAN); doc.setLineWidth(1);
    doc.line(0, 70, PW, 70);

    setFont(22, CYAN, 'bold');
    doc.text('AUTHGUARD', M, 34);
    setFont(10, MUTED);
    doc.text('v2.0  //  AI-POWERED EMAIL AUTHENTICATION SCANNER', M, 50);
    setFont(9, MUTED);
    doc.text(`Generated: ${new Date().toLocaleString()}`, PW - M, 34, { align: 'right' });
    doc.text('authguard-security.app', PW - M, 50, { align: 'right' });
    y = 88;

    // ── Title
    text(`Security Report: ${result.domain}`, M, 16, WHITE, 'bold');
    y += 4;
    drawLine(CYAN, 1);

    // ── Summary card
    checkPage(90);
    doc.setFillColor(CARD);
    doc.setDrawColor(CYAN + '50');
    doc.setLineWidth(0.5);
    doc.roundedRect(M, y, CW, 76, 6, 6, 'FD');
    y += 14;

    setFont(9, MUTED);
    doc.text('DOMAIN', M + 12, y);
    doc.text('GRADE', M + 130, y);
    doc.text('SCORE', M + 210, y);
    doc.text('SPF', M + 300, y);
    doc.text('DKIM', M + 360, y);
    doc.text('DMARC', M + 420, y);
    y += 14;

    setFont(12, CYAN, 'bold'); doc.text(result.domain, M + 12, y);
    const gc = result.grade.startsWith('A') ? GREEN : result.grade === 'B' ? CYAN : result.grade === 'C' ? AMBER : RED;
    setFont(18, gc, 'bold'); doc.text(result.grade, M + 130, y + 2);
    setFont(12, WHITE, 'bold'); doc.text(`${result.score}/100`, M + 210, y);
    setFont(11, statusColor(result.spf?.status),   'bold'); doc.text(statusLabel(result.spf?.status),   M + 295, y);
    setFont(11, statusColor(result.dkim?.status),  'bold'); doc.text(statusLabel(result.dkim?.status),  M + 355, y);
    setFont(11, statusColor(result.dmarc?.status), 'bold'); doc.text(statusLabel(result.dmarc?.status), M + 415, y);
    y += 30;

    // ── AI Insights
    if (aiData) {
      y += 8; checkPage(80);
      text('AI INSIGHTS', M, 11, CYAN, 'bold');
      drawLine(CYAN + '60');
      const tlColor = aiData.threatLevel === 'CRITICAL' ? RED : aiData.threatLevel === 'HIGH' ? AMBER : aiData.threatLevel === 'MEDIUM' ? AMBER : GREEN;
      badge(`THREAT: ${aiData.threatLevel}`, tlColor);
      text(aiData.summary ?? '', M, 10, MUTED, 'normal', CW);
      y += 4;
      if (aiData.risks?.length) {
        text('Top Risks:', M, 10, WHITE, 'bold');
        aiData.risks.forEach((r, i) => {
          checkPage(36);
          text(`${i + 1}. ${r.title}`, M + 8, 10, WHITE, 'bold', CW - 8);
          text(r.desc, M + 16, 9, MUTED, 'normal', CW - 16);
        });
      }
    }

    // ── Protocol Details
    y += 8; checkPage(40);
    text('PROTOCOL DETAILS', M, 11, CYAN, 'bold');
    drawLine(CYAN + '60');
    [['SPF', result.spf], ['DKIM', result.dkim], ['DMARC', result.dmarc]].forEach(([name, p]) => {
      checkPage(70);
      doc.setFillColor(CARD);
      doc.setDrawColor(statusColor(p?.status) + '60');
      doc.setLineWidth(0.5);
      doc.roundedRect(M, y, CW, 62, 4, 4, 'FD');
      // left colour bar
      doc.setFillColor(statusColor(p?.status));
      doc.roundedRect(M, y, 4, 62, 2, 2, 'F');
      y += 12;
      setFont(12, WHITE, 'bold'); doc.text(name, M + 14, y);
      setFont(9, statusColor(p?.status), 'bold'); doc.text(statusLabel(p?.status), M + 70, y);
      y += 14;
      setFont(8, MUTED); doc.text('RECORD:', M + 14, y); y += 11;
      const rec = p?.record ?? 'No record found';
      setFont(8, p?.record ? GREEN : RED);
      const recLines = doc.splitTextToSize(rec, CW - 28);
      checkPage(recLines.length * 11 + 20);
      doc.text(recLines, M + 14, y); y += recLines.length * 11;
      text(p?.description ?? '', M + 14, 8, MUTED, 'normal', CW - 28);
      y += 8;
    });

    // ── Findings
    const findings = buildFindings(result);
    y += 8; checkPage(40);
    text('FINDINGS', M, 11, CYAN, 'bold');
    drawLine(CYAN + '60');
    findings.forEach(f => {
      checkPage(44);
      const fc = statusColor(f.status);
      doc.setFillColor(CARD);
      doc.setDrawColor(fc + '40');
      doc.setLineWidth(0.4);
      doc.roundedRect(M, y, CW, 36, 3, 3, 'FD');
      doc.setFillColor(fc); doc.rect(M, y, 3, 36, 'F');
      y += 10;
      setFont(9, fc, 'bold');   doc.text(`[${f.meta}]`, M + 10, y);
      setFont(9, WHITE, 'bold'); doc.text(f.title, M + 60, y);
      y += 12;
      text(f.desc, M + 10, 8, MUTED, 'normal', CW - 20);
      y += 6;
    });

    // ── Recommendations
    const recs = buildRecommendations(result.domain, result);
    y += 8; checkPage(40);
    text('REMEDIATION RECOMMENDATIONS', M, 11, CYAN, 'bold');
    drawLine(CYAN + '60');
    recs.forEach((r, i) => {
      checkPage(80);
      const pc = r.priority === 'HIGH' ? RED : r.priority === 'MEDIUM' ? AMBER : GREEN;
      doc.setFillColor(CARD);
      doc.setDrawColor(pc + '60');
      doc.setLineWidth(0.5);
      doc.roundedRect(M, y, CW, 72, 4, 4, 'FD');
      y += 12;
      setFont(10, WHITE, 'bold'); doc.text(`${i + 1}. ${r.protocol}`, M + 10, y);
      setFont(8,  pc, 'bold');    doc.text(r.priority, M + 80, y);
      y += 14;
      text(r.desc, M + 10, 9, MUTED, 'normal', CW - 20);
      setFont(8, MUTED); doc.text('DNS FIX:', M + 10, y); y += 11;
      setFont(8, GREEN);
      const codeLines = doc.splitTextToSize(r.code, CW - 30);
      doc.text(codeLines, M + 18, y); y += codeLines.length * 11 + 8;
    });

    // ── Footer on every page
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFillColor(CARD);
      doc.rect(0, PH - 28, PW, 28, 'F');
      doc.setDrawColor(CYAN + '40'); doc.setLineWidth(0.5);
      doc.line(0, PH - 28, PW, PH - 28);
      setFont(8, MUTED);
      doc.text('AuthGuard v2.0  //  AI-Powered Email Authentication Scanner', M, PH - 10);
      doc.text(`Page ${i} of ${totalPages}`, PW - M, PH - 10, { align: 'right' });
    }

    doc.save(`authguard-${result.domain}-${Date.now()}.pdf`);
  }, [result, aiData]);

  const copyCode = useCallback((text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  }, []);

  /* ── CHAT ── */
  const sendChat = useCallback(async (msg = chatInput) => {
    const text = msg.trim();
    if (!text || chatLoading) return;
    setChatInput('');
    const userMsg = { role: 'user', content: text, time: fmtTime() };
    setChatHistory(h => [...h, userMsg]);
    setChatLoading(true);

    if (!apiKey) {
      await new Promise(r => setTimeout(r, 700 + Math.random() * 500));
      const lower = text.toLowerCase();

      // Smart keyword-based response engine
      let reply = '';

      if (lower.includes('spf') && (lower.includes('what') || lower.includes('explain') || lower.includes('how') || lower.includes('work'))) {
        reply = 'SPF (Sender Policy Framework) is a DNS TXT record that lists every server authorized to send email for your domain.\n\nWhen a receiving mail server gets a message claiming to be from your domain, it checks your SPF record. If the sending IP isn\'t in the list, the email fails SPF.\n\nExample record:\n  v=spf1 include:_spf.google.com -all\n\nThe "-all" at the end means: reject anything not on the list. "~all" is soft-fail (still delivered but marked).';
      } else if (lower.includes('dkim') && (lower.includes('what') || lower.includes('explain') || lower.includes('how') || lower.includes('work'))) {
        reply = 'DKIM (DomainKeys Identified Mail) adds a cryptographic digital signature to every outgoing email.\n\nHow it works:\n1. Your mail server signs outgoing emails with a private key\n2. The public key is published in DNS\n3. Receiving servers verify the signature — proving the email wasn\'t tampered with in transit\n\nExample DNS record:\n  default._domainkey IN TXT "v=DKIM1; k=rsa; p=<PUBLIC_KEY>"\n\nWithout DKIM, emails can be modified mid-flight by attackers without detection.';
      } else if (lower.includes('dmarc') && (lower.includes('what') || lower.includes('explain') || lower.includes('how') || lower.includes('work'))) {
        reply = 'DMARC (Domain-based Message Authentication, Reporting & Conformance) is the enforcement layer on top of SPF and DKIM.\n\nIt tells receiving servers what to do when an email fails authentication:\n• p=none — take no action, just report\n• p=quarantine — send to spam\n• p=reject — block completely\n\nExample record:\n  _dmarc IN TXT "v=DMARC1; p=reject; rua=mailto:dmarc@yourdomain.com"\n\nDMARC also enables aggregate reports (rua=) so you can monitor all senders claiming to be your domain.';
      } else if (lower.includes('fix') || lower.includes('recommend') || lower.includes('priorit') || lower.includes('should i')) {
        if (result) {
          const fixes = [];
          if (result.spf?.status === 'fail') fixes.push('1. 🔴 Add an SPF record — highest priority. Any server can currently spoof your domain.');
          else if (result.spf?.record?.includes('+all')) fixes.push('1. 🔴 Fix your SPF — "v=spf1 +all" authorizes every server on the internet. Replace with "-all".');
          else if (result.spf?.record?.includes('~all')) fixes.push('1. 🟡 Harden SPF — change "~all" to "-all" for strict rejection of unauthorized senders.');
          if (result.dkim?.status === 'fail') fixes.push(`${fixes.length + 1}. 🔴 Set up DKIM signing — contact your email provider to generate and publish a DKIM key pair.`);
          if (result.dmarc?.status === 'fail') fixes.push(`${fixes.length + 1}. 🔴 Add a DMARC record — start with p=none to monitor, then escalate to p=reject.`);
          else if (result.dmarc?.record?.includes('p=none')) fixes.push(`${fixes.length + 1}. 🟡 Upgrade DMARC policy from p=none to p=quarantine or p=reject to actively block spoofed emails.`);
          reply = fixes.length > 0
            ? `Priority fixes for **${result.domain}** (Score: ${result.score}/100):\n\n${fixes.join('\n\n')}\n\nSwitch to the Recommendations tab for copy-paste DNS records.`
            : `**${result.domain}** has a strong authentication setup (Score: ${result.score}/100, Grade: ${result.grade}). No critical fixes needed — consider enabling forensic DMARC reports (ruf=) for deeper visibility.`;
        } else {
          reply = 'Run a domain scan first, then ask me for specific recommendations. I can prioritize fixes based on your actual SPF, DKIM, and DMARC results.';
        }
      } else if (lower.includes('attack') || lower.includes('spoof') || lower.includes('phish') || lower.includes('risk') || lower.includes('danger') || lower.includes('exploit')) {
        if (result) {
          const risks = [];
          if (result.spf?.status === 'fail' || result.spf?.record?.includes('+all')) risks.push('• Email Spoofing: Any attacker can forge emails appearing to come from ' + result.domain);
          if (result.dkim?.status === 'fail') risks.push('• Message Tampering: Emails can be modified in transit without detection');
          if (result.dmarc?.status === 'fail') risks.push('• Phishing Campaigns: Spoofed emails reach inboxes with no enforcement blocking them');
          reply = risks.length > 0
            ? `Active attack vectors for **${result.domain}**:\n\n${risks.join('\n')}\n\nThese gaps make it trivial for attackers to run Business Email Compromise (BEC) or phishing campaigns impersonating your domain. The Overview tab shows detailed exploit scenarios.`
            : `**${result.domain}** has solid authentication — common spoofing attacks are blocked. The main residual risk is lookalike domains (e.g. ${result.domain.replace('.', '-sec.')}). Monitor domain registrations and consider BIMI for brand verification.`;
        } else {
          reply = 'Without SPF, DKIM, and DMARC, attackers can:\n\n• Send phishing emails appearing to come from your domain\n• Modify emails in transit (man-in-the-middle)\n• Run Business Email Compromise (BEC) attacks\n• Bypass spam filters on some providers\n\nScan a domain to see its specific attack surface.';
        }
      } else if (lower.includes('score') || lower.includes('grade') || lower.includes('result') || lower.includes('analysis') || lower.includes('status')) {
        if (result) {
          const details = [
            `SPF: ${result.spf?.status?.toUpperCase()} ${result.spf?.record ? '— "' + result.spf.record.substring(0, 50) + (result.spf.record.length > 50 ? '...' : '') + '"' : '— no record found'}`,
            `DKIM: ${result.dkim?.status?.toUpperCase()} ${result.dkim?.record ? '— key present' : '— no record found'}`,
            `DMARC: ${result.dmarc?.status?.toUpperCase()} ${result.dmarc?.record ? '— "' + result.dmarc.record.substring(0, 50) + (result.dmarc.record.length > 50 ? '...' : '') + '"' : '— no record found'}`,
          ];
          reply = `**${result.domain}** Security Summary:\n\nGrade: ${result.grade} | Score: ${result.score}/100\n\n${details.join('\n')}\n\n${result.score >= 80 ? '✅ Strong email authentication posture.' : result.score >= 50 ? '⚠️ Moderate — some gaps need attention.' : '🔴 Critical vulnerabilities — immediate action required.'}`;
        } else {
          reply = 'No domain has been scanned yet. Enter a domain in the scanner above and click RUN CHECK to get a full authentication analysis.';
        }
      } else if (lower.includes('report') || lower.includes('download') || lower.includes('export')) {
        if (result) {
          reply = `You can download a full markdown report for **${result.domain}** using the **⬇ Download Report** button at the top of this chat panel. The report includes:\n\n• Executive summary\n• Threat level assessment\n• Protocol status (SPF, DKIM, DMARC)\n• Top security risks\n• Scan metadata\n\nYou can also generate AI-enhanced analysis first via the 🤖 AI Insights tab, then the report will include AI commentary.`;
        } else {
          reply = 'Scan a domain first, then you can download a full security report using the ⬇ Download Report button at the top of this chat panel.';
        }
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('help')) {
        reply = `Hi! I'm AuthGuard AI — your email security assistant. I can help you with:\n\n• 📋 Explaining SPF, DKIM, and DMARC\n• 🔍 Analyzing your domain scan results\n• 🛠️ Prioritizing security fixes\n• ⚠️ Identifying attack vectors\n• 📥 Downloading security reports\n\n${result ? `I can see you've scanned **${result.domain}** (Score: ${result.score}/100, Grade: ${result.grade}). Ask me anything about the results!` : 'Try scanning a domain first, then ask me about your specific results.'}`;
      } else if (lower.includes('bimi') || lower.includes('brand indicator')) {
        reply = 'BIMI (Brand Indicators for Message Identification) lets companies display their logo in email clients that support it (Yahoo, Gmail, Apple Mail).\n\nRequirements:\n• A verified DMARC policy of p=quarantine or p=reject\n• A Verified Mark Certificate (VMC) from a CA\n• A BIMI DNS record pointing to your SVG logo\n\nExample:\n  default._bimi IN TXT "v=BIMI1; l=https://yourdomain.com/logo.svg"\n\nBIMI is primarily a trust signal — recipients can visually verify your brand identity.';
      } else if (lower.includes('mta-sts') || lower.includes('tls') || lower.includes('encrypt')) {
        reply = 'MTA-STS (Mail Transfer Agent Strict Transport Security) forces email providers to only deliver mail to your server over encrypted TLS connections — preventing downgrade attacks.\n\nIt works alongside SMTP TLS Reporting (TLS-RPT) to alert you about delivery failures due to TLS issues.\n\nPublish a policy file at:\n  https://mta-sts.yourdomain.com/.well-known/mta-sts.txt\n\nAnd add a DNS record:\n  _mta-sts IN TXT "v=STSv1; id=20240101"';
      } else if (lower.includes('lookup') || lower.includes('limit') || lower.includes('10')) {
        reply = 'SPF has a hard limit of 10 DNS lookups per evaluation. Each "include:", "a", "mx", "ptr", and "exists" mechanism counts as one lookup.\n\nExceeding 10 causes a PermError, which means SPF evaluation fails — effectively the same as having no SPF.\n\nTo fix SPF lookup limits:\n• Use SPF flattening tools to resolve includes to IPs\n• Remove unused includes\n• Use "ip4:" and "ip6:" mechanisms directly instead of includes where possible';
      } else {
        // Context-aware default — analyze current scan if available
        if (result) {
          const weak = [];
          if (result.spf?.status !== 'pass') weak.push('SPF');
          if (result.dkim?.status !== 'pass') weak.push('DKIM');
          if (result.dmarc?.status !== 'pass') weak.push('DMARC');
          reply = weak.length > 0
            ? `Based on the scan of **${result.domain}** (Grade: ${result.grade}, Score: ${result.score}/100), the weakest areas are: **${weak.join(', ')}**.\n\nYou can ask me to:\n• Explain any of these protocols\n• Prioritize your fixes\n• Describe the attack risks\n• Help you understand the recommendations\n\nOr use the tabs above for detailed findings and DNS fix examples.`
            : `**${result.domain}** has excellent email authentication (Grade: ${result.grade}, Score: ${result.score}/100) — SPF, DKIM, and DMARC are all passing.\n\nAsk me about hardening further with BIMI, MTA-STS, or DKIM key rotation schedules.`;
        } else {
          reply = `I can answer questions about:\n\n• SPF, DKIM, DMARC — how they work and how to set them up\n• Email spoofing and phishing attack vectors\n• Security recommendations and DNS record syntax\n• BIMI, MTA-STS, and advanced email hardening\n\nTry scanning a domain first, then ask me to analyze the results or prioritize your fixes!`;
        }
      }

      setChatHistory(h => [...h, { role: 'assistant', content: reply, time: fmtTime() }]);
      setChatLoading(false);
      return;
    }

    try {
      const systemPrompt = `You are AuthGuard AI, an expert email security assistant specializing in SPF, DKIM, and DMARC authentication protocols. Be concise, technical but approachable, and security-focused.${result ? `\n\nCurrent scan context:\nDomain: ${result.domain}\nSPF: ${result.spf?.status} (${result.spf?.record ?? 'missing'})\nDKIM: ${result.dkim?.status}\nDMARC: ${result.dmarc?.status} (${result.dmarc?.record ?? 'missing'})\nScore: ${result.score}/100 Grade: ${result.grade}` : ''}`;

      const messages = chatHistory
        .filter(m => m.role !== 'assistant' || chatHistory.indexOf(m) > 0)
        .map(m => ({ role: m.role, content: m.content }));
      messages.push({ role: 'user', content: text });

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 512,
          system: systemPrompt,
          messages,
        }),
      });

      if (!res.ok) throw new Error(`API ${res.status}`);
      const json = await res.json();
      const reply = json.content?.[0]?.text ?? 'Unable to process response.';
      setChatHistory(h => [...h, { role: 'assistant', content: reply, time: fmtTime() }]);
    } catch {
      setChatHistory(h => [...h, { role: 'assistant', content: "I'm currently unable to process your question. Please check your API configuration or try again later.", time: fmtTime() }]);
    }
    setChatLoading(false);
  }, [chatInput, chatLoading, chatHistory, result, apiKey]);

  const handleChatKey = useCallback(e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
  }, [sendChat]);

  /* ─── RENDER ─────────────────────────────────────────────────────── */
  const attacks = result ? buildAttackVectors(result) : [];
  const findings = result ? buildFindings(result) : [];
  const recs = result ? buildRecommendations(result.domain, result) : [];

  const TABS = [
    { id: 'overview',  label: '⊹ Overview' },
    { id: 'ai',        label: '🤖 AI Insights' },
    { id: 'findings',  label: '◈ Findings' },
    { id: 'recs',      label: '◉ Recs' },
    { id: 'dns',       label: '</> DNS' },
  ];

  const SUGGESTIONS = result
    ? [`Explain ${result.domain}'s risks`, 'How to fix DMARC?', 'Prioritize fixes', 'What can attackers do?']
    : ['What is SPF?', 'How does DKIM work?', 'DMARC explained', 'Setup email auth'];

  return (
    <div className="ag-root">
      {/* ── HEADER ── */}
      <header className="ag-header">
        <div className="ag-logo">
          <div className="ag-logo-icon">🛡️</div>
          <div>
            <div className="ag-logo-text">AUTHGUARD</div>
            <div className="ag-logo-version">v2.0 // AI-POWERED</div>
          </div>
        </div>
        <div className="ag-header-right">
          <div className="ag-api-badge">{apiKey ? '⚡ AI ACTIVE' : '◌ AI OFFLINE'}</div>
          <div className="ag-status">
            <div className="ag-status-dot" />
            SYSTEM ONLINE
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="ag-main">

        {/* ── SCANNER ── */}
        <div className="ag-scanner-card">
          <div className="ag-scanner-title">EMAIL AUTH <span>SCANNER</span></div>
          <div className="ag-scanner-sub">// Identify vulnerabilities before attackers do</div>
          <div className="ag-input-row">
            <input
              className="ag-domain-input"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !scanning && runScan()}
              placeholder="enter target domain (e.g. example.com)"
              disabled={scanning}
            />
            <button className="ag-btn-scan" onClick={() => runScan()} disabled={scanning || !domain.trim()}>
              {scanning ? '◌ SCANNING...' : 'RUN CHECK'}
            </button>
          </div>
          <div className="ag-samples">
            <span className="ag-samples-label">SAMPLE_DOMAINS:</span>
            {['google.com', 'microsoft.com', 'weak-domain.com'].map(d => (
              <button key={d} className="ag-sample-chip" onClick={() => runScan(d)} disabled={scanning}>{d}</button>
            ))}
          </div>
        </div>

        {/* ── PROGRESS ── */}
        {scanning && (
          <div className="ag-progress">
            <div className="ag-progress-steps">
              {STEPS.map((step, i) => (
                <div key={step} className={`ag-step ${i < stepIdx ? 'done' : i === stepIdx ? 'active' : ''}`}>
                  <div className="ag-step-dot">{i < stepIdx ? '✓' : i + 1}</div>
                  <div className="ag-step-label">{step}</div>
                </div>
              ))}
            </div>
            <div className="ag-progress-bar-wrap">
              <div className="ag-progress-bar-fill" style={{ width: `${(stepIdx / (STEPS.length - 1)) * 100}%` }} />
            </div>
            <div className="ag-progress-status">
              [{STEPS[Math.min(stepIdx, STEPS.length - 1)]}] · Querying DNS records...
            </div>
          </div>
        )}

        {/* ── SCORE BANNER ── */}
        {result && !scanning && (
          <div className="ag-score-banner">
            <div className={`ag-grade-circle ${gradeClass(result.grade)}`}>
              <div className="ag-grade-letter">{result.grade}</div>
              <div className="ag-grade-score">{result.score}/100</div>
            </div>
            <div className="ag-score-center">
              <div className="ag-score-domain">TARGET: <span>{result.domain}</span></div>
              <div className="ag-score-meta">Scanned {new Date(result.timestamp).toLocaleString()} · 3 protocols checked</div>
              <div className="ag-score-bar-wrap">
                <div className="ag-score-bar-track">
                  <div
                    className="ag-score-bar-fill"
                    style={{
                      width: `${result.score}%`,
                      background: result.score >= 80
                        ? 'linear-gradient(90deg, var(--green), #00d4a0)'
                        : result.score >= 50
                        ? 'linear-gradient(90deg, var(--amber), #ffcc44)'
                        : 'linear-gradient(90deg, var(--red), #ff5555)',
                    }}
                  />
                </div>
                <span className="ag-score-bar-label">{result.score}%</span>
              </div>
              <div className="ag-protocol-badges">
                {[
                  { label: 'SPF',   s: result.spf?.status },
                  { label: 'DKIM',  s: result.dkim?.status },
                  { label: 'DMARC', s: result.dmarc?.status },
                ].map(({ label, s }) => (
                  <span key={label} className={`ag-proto-badge proto-${s}`}>
                    {statusIcon(s)} {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="ag-dl-wrap" ref={dlWrapRef}>
              <button
                className="ag-btn-dl-banner"
                onClick={() => setDlMenuOpen(o => !o)}
                title="Download security report"
              >
                <span className="ag-btn-dl-icon">📄</span>
                <span className="ag-btn-dl-text">Export<br/>Report ▾</span>
              </button>
              {dlMenuOpen && (
                <div className="ag-dl-menu">
                  <div className="ag-dl-menu-label">EXPORT FORMAT</div>
                  <button className="ag-dl-item" onClick={exportPDF}>
                    <span className="ag-dl-item-icon">📰</span>
                    <span>
                      <span className="ag-dl-item-title">PDF</span>
                      <span className="ag-dl-item-sub">Styled security report</span>
                    </span>
                  </button>
                  <button className="ag-dl-item" onClick={() => { downloadReport(); setDlMenuOpen(false); }}>
                    <span className="ag-dl-item-icon">📝</span>
                    <span>
                      <span className="ag-dl-item-title">Markdown</span>
                      <span className="ag-dl-item-sub">Full .md report</span>
                    </span>
                  </button>
                  <button className="ag-dl-item" onClick={exportJSON}>
                    <span className="ag-dl-item-icon">🗂️</span>
                    <span>
                      <span className="ag-dl-item-title">JSON</span>
                      <span className="ag-dl-item-sub">Raw structured data</span>
                    </span>
                  </button>
                  <button className="ag-dl-item" onClick={exportCSV}>
                    <span className="ag-dl-item-icon">📊</span>
                    <span>
                      <span className="ag-dl-item-title">CSV</span>
                      <span className="ag-dl-item-sub">Spreadsheet-ready</span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TABS ── */}
        {result && !scanning && (
          <div className="ag-tabs">
            <div className="ag-tab-list">
              {TABS.map(t => (
                <button key={t.id} className={`ag-tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PANELS ── */}
        {result && !scanning && activeTab === 'overview' && (
          <div className="ag-panel">
            <div className="ag-proto-grid">
              {[
                { key: 'spf', label: 'SPF' },
                { key: 'dkim', label: 'DKIM' },
                { key: 'dmarc', label: 'DMARC' },
              ].map(({ key, label }) => {
                const p = result[key];
                return (
                  <div key={key} className={`ag-proto-card status-${p?.status}`}>
                    <div className="ag-proto-card-head">
                      <div className="ag-proto-name">{label}</div>
                      <span className={`ag-proto-badge proto-${p?.status} ag-proto-status`}>
                        {statusIcon(p?.status)} {p?.status?.toUpperCase()}
                      </span>
                    </div>
                    <div className="ag-proto-record">
                      <div className="ag-proto-record-label">DNS RECORD</div>
                      {p?.record
                        ? <div className="ag-record-code">{p.record}</div>
                        : <div className="ag-record-none">⚠ No record found</div>}
                    </div>
                    <div className="ag-proto-desc">{p?.description}</div>
                  </div>
                );
              })}
            </div>
            <div className="ag-attack-section">
              <div className="ag-section-title">⚠ ATTACK VECTORS</div>
              <div className="ag-attack-grid">
                {attacks.map((a, i) => (
                  <div key={i} className="ag-attack-card">
                    <div className="ag-attack-title">◈ {a.title}</div>
                    <div className="ag-attack-desc">{a.desc}</div>
                    <span className="ag-attack-severity">{a.severity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {result && !scanning && activeTab === 'ai' && (
          <div className="ag-panel">
            <div className="ag-ai-header">
              <div className="ag-ai-title">🤖 AI SECURITY ANALYSIS</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {aiState === 'done' && (
                  <button className="ag-btn-download" onClick={downloadReport}>
                    ⬇ Download Report
                  </button>
                )}
                <button
                  className="ag-btn-analyze"
                  onClick={fetchAiInsights}
                  disabled={aiState === 'loading'}
                >
                  {aiState === 'loading' ? '◌ Analyzing...' : aiState === 'done' ? '↺ Re-analyze' : '⚡ Analyze Domain'}
                </button>
              </div>
            </div>

            {aiState === 'idle' && (
              <div className="ag-ai-no-domain">
                <div className="ag-ai-no-domain-icon">🔍</div>
                <div className="ag-ai-no-domain-text">
                  Click "Analyze Domain" to generate AI-powered security insights{!apiKey ? ' (running in demo mode — add VITE_ANTHROPIC_API_KEY for live AI)' : ''}
                </div>
              </div>
            )}
            {aiState === 'loading' && (
              <div className="ag-ai-loading">
                <div className="ag-spinner" />
                <div className="ag-loading-text">QUERYING CLAUDE AI · ANALYZING THREATS...</div>
              </div>
            )}
            {aiState === 'error' && (
              <div className="ag-ai-no-domain">
                <div className="ag-ai-no-domain-icon">⚠️</div>
                <div className="ag-ai-no-domain-text">API error — check your VITE_ANTHROPIC_API_KEY in .env</div>
              </div>
            )}
            {aiState === 'done' && aiData && (
              <div className="ag-ai-result">
                <div className="ag-ai-card">
                  <div className="ag-ai-card-title">◈ THREAT LEVEL</div>
                  <div className={`ag-threat-badge threat-${aiData.threatLevel}`}>
                    {aiData.threatLevel === 'CRITICAL' ? '🔴' : aiData.threatLevel === 'HIGH' ? '🟠' : aiData.threatLevel === 'MEDIUM' ? '🟡' : '🟢'}
                    &nbsp;{aiData.threatLevel}
                  </div>
                  <div className="ag-ai-card-title" style={{ marginTop: 16 }}>◈ EXECUTIVE SUMMARY</div>
                  <div className="ag-ai-summary">{aiData.summary}</div>
                </div>
                <div className="ag-ai-card">
                  <div className="ag-ai-card-title">◈ TOP 3 RANKED RISKS</div>
                  <div className="ag-risk-list">
                    {(aiData.risks ?? []).map((r, i) => (
                      <div key={i} className="ag-risk-item">
                        <div className="ag-risk-num">#{i + 1}</div>
                        <div className="ag-risk-text">
                          <div className="ag-risk-title">{r.title}</div>
                          {r.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {result && !scanning && activeTab === 'findings' && (
          <div className="ag-panel">
            <div className="ag-findings">
              {findings.map((f, i) => (
                <div key={i} className={`ag-finding-card ${f.status}`}>
                  <div className="ag-finding-icon">{statusIcon(f.status)}</div>
                  <div>
                    <div className="ag-finding-title">{f.proto} · {f.title}</div>
                    <div className="ag-finding-desc">{f.desc}</div>
                    <span className="ag-finding-meta">{f.meta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && !scanning && activeTab === 'recs' && (
          <div className="ag-panel">
            {recs.length === 0 ? (
              <div className="ag-empty-state">
                <div className="ag-empty-icon">✅</div>
                <div className="ag-empty-title">NO CRITICAL FIXES NEEDED</div>
                <div className="ag-empty-sub">Email authentication is well configured.</div>
              </div>
            ) : (
              <div className="ag-recs">
                {recs.map((r, i) => (
                  <div key={i} className="ag-rec-card">
                    <div className="ag-rec-head">
                      <span className="ag-rec-protocol">{r.protocol}</span>
                      <span className={`ag-rec-priority priority-${r.priority}`}>{r.priority} PRIORITY</span>
                    </div>
                    <div className="ag-rec-desc">{r.desc}</div>
                    <div className="ag-rec-code-block">
                      <div className="ag-rec-code-label">DNS RECORD</div>
                      <div className="ag-code-area">
                        {r.code}
                        <button
                          className={`ag-copy-btn ${copiedKey === i ? 'copied' : ''}`}
                          onClick={() => copyCode(r.code, i)}
                        >
                          {copiedKey === i ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {result && !scanning && activeTab === 'dns' && (
          <div className="ag-panel">
            <div className="ag-dns-list">
              {[
                { proto: 'SPF', name: `${result.domain} TXT`, data: result.spf },
                { proto: 'DKIM', name: `default._domainkey.${result.domain} TXT`, data: result.dkim },
                { proto: 'DMARC', name: `_dmarc.${result.domain} TXT`, data: result.dmarc },
              ].map(({ proto, name, data }) => (
                <div key={proto} className="ag-dns-item">
                  <div className="ag-dns-proto">{proto}</div>
                  <div className="ag-dns-name">{name}</div>
                  <div className={`ag-dns-record ${data?.record ? '' : 'missing'}`}>
                    {data?.record ?? `; No ${proto} record found at ${name}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!result && !scanning && (
          <div className="ag-empty-state">
            <div className="ag-empty-icon">🛡️</div>
            <div className="ag-empty-title">AWAITING TARGET DOMAIN</div>
            <div className="ag-empty-sub">Enter a domain above and click RUN CHECK to begin authentication analysis</div>
          </div>
        )}

      </main>

      {/* ── FOOTER ── */}
      <footer className="ag-footer">
        AUTHGUARD v2.0 // AI-POWERED EMAIL AUTHENTICATION SCANNER // BUILT WITH REACT + CLAUDE AI
      </footer>

      {/* ── FLOATING CHAT BUTTON ── */}
      <button className="ag-fab" onClick={() => setChatOpen(true)} title="Open AI Assistant" aria-label="Open AI Chat">
        🤖
      </button>

      {/* ── CHAT PANEL ── */}
      {chatOpen && (
        <div className="ag-chat-overlay" onClick={e => e.target === e.currentTarget && setChatOpen(false)}>
          <div className="ag-chat-panel" role="dialog" aria-label="AuthGuard AI Chat">
            <div className="ag-chat-header">
              <div className="ag-chat-avatar">🤖</div>
              <div>
                <div className="ag-chat-title">AUTHGUARD AI</div>
                <div className="ag-chat-sub">Email Security Assistant</div>
              </div>
              {result && (
                <button className="ag-chat-dl-btn" onClick={downloadReport} title={`Download report for ${result.domain}`}>
                  ⬇ Report
                </button>
              )}
              <button className="ag-chat-close" onClick={() => setChatOpen(false)} aria-label="Close chat">✕</button>
            </div>

            <div className="ag-chat-messages" ref={chatEndRef}>
              {chatHistory.map((m, i) => (
                <div key={i} className={`ag-chat-msg ${m.role}`}>
                  <div className="ag-msg-avatar">{m.role === 'assistant' ? '🤖' : '👤'}</div>
                  <div>
                    <div className="ag-msg-bubble">{m.content}</div>
                    <div className="ag-msg-time">{m.time}</div>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="ag-chat-msg assistant">
                  <div className="ag-msg-avatar">🤖</div>
                  <div className="ag-typing-indicator">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="ag-chat-suggestions">
              {SUGGESTIONS.map(s => (
                <button key={s} className="ag-sugg-chip" onClick={() => sendChat(s)} disabled={chatLoading}>{s}</button>
              ))}
            </div>

            <div className="ag-chat-input-row">
              <textarea
                className="ag-chat-input"
                rows={1}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={handleChatKey}
                placeholder="Ask about email security..."
                disabled={chatLoading}
              />
              <button className="ag-chat-send" onClick={() => sendChat()} disabled={chatLoading || !chatInput.trim()} aria-label="Send message">
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

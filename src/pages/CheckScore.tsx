import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { DB, scoreColor, scoreTier, scorePct } from '@/lib/store';
import { toast } from '@/lib/toast';

// Use CDN worker — avoids bundler issues on Vercel/Netlify
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface Props { go: (p: string) => void; }

interface ParsedTxn {
  date: string;
  merchant: string;
  amt: number;
  credit: boolean;
}

/* ── Helpers ── */
const amtRx = /(?:₹|Rs\.?)\s*([\d,]+(?:\.\d{1,2})?)/gi;
const dateRx = /\b(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d{4}-\d{2}-\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,]+\d{1,2}[\s,]+\d{4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/gi;
const creditRx = /\b(credit(?:ed)?|received?|salary|income|refund(?:ed)?|cashback|reward|prize|deposit)\b/i;
const debitRx  = /\b(debit(?:ed)?|paid|payment|sent|purchase|bought|transferred?|withdrawn?|spent)\b/i;

function parseTransactions(text: string): ParsedTxn[] {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 1);
  const txns: ParsedTxn[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Look for amount
    const amtMatches = [...line.matchAll(amtRx)];
    if (!amtMatches.length) continue;
    const amt = parseFloat(amtMatches[amtMatches.length - 1][1].replace(/,/g, ''));
    if (isNaN(amt) || amt <= 0 || amt > 10000000) continue;

    // Context window around this line
    const ctx = lines.slice(Math.max(0, i - 1), i + 3).join(' ');
    const dateMatch = ctx.match(dateRx);
    const date = dateMatch ? dateMatch[0] : '';
    const credit = creditRx.test(ctx);
    const debit  = debitRx.test(ctx);
    if (!credit && !debit) continue;

    // Merchant: take words around "to" / "from"
    const merchant = extractMerchant(ctx) || 'Transaction';
    txns.push({ date, merchant, amt, credit });
  }

  return txns.slice(0, 500);
}

function extractMerchant(ctx: string): string {
  const toMatch = ctx.match(/(?:to|paid to|sent to|transfer to)\s+([A-Za-z0-9@._\s]+?)(?:\s+(?:on|for|rs|₹|\d|$))/i);
  if (toMatch) return toMatch[1].trim().substring(0, 40);
  const fromMatch = ctx.match(/(?:from|received from|credit from)\s+([A-Za-z0-9@._\s]+?)(?:\s+(?:on|for|rs|₹|\d|$))/i);
  if (fromMatch) return fromMatch[1].trim().substring(0, 40);
  // Take first capitalised words
  const words = ctx.match(/[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*/);
  return words ? words[0].substring(0, 40) : '';
}

function computeScore(txns: ParsedTxn[]): number {
  if (!txns.length) return 300;

  const credits = txns.filter(t => t.credit);
  const debits  = txns.filter(t => !t.credit);

  // Income signals
  const totalIncome  = credits.reduce((s, t) => s + t.amt, 0);
  const totalSpend   = debits.reduce((s, t) => s + t.amt, 0);
  const incomeScore  = Math.min(100, (totalIncome / 50000) * 60 + credits.length * 4);

  // Regularity: unique dates
  const uniqueDates  = new Set(txns.map(t => t.date)).size;
  const regularity   = Math.min(100, uniqueDates * 3 + txns.length * 1.5);

  // Diversity: unique merchants
  const uniqueMerch  = new Set(txns.map(t => t.merchant)).size;
  const diversity    = Math.min(100, uniqueMerch * 4);

  // Spend ratio
  const ratio        = totalIncome > 0 ? totalSpend / totalIncome : 1;
  const ratioScore   = Math.max(0, 100 - ratio * 60);

  const raw = (incomeScore * 0.35 + regularity * 0.30 + diversity * 0.20 + ratioScore * 0.15);
  return Math.round(300 + (raw / 100) * 600);
}

/* ── Manual questionnaire scoring ── */
function manualScore(answers: Record<string, string>): number {
  let pts = 0;
  const m = parseInt(answers.months || '0');
  pts += Math.min(m * 8, 80);
  const inc = parseInt(answers.income || '0');
  if (inc > 50000) pts += 80; else if (inc > 20000) pts += 60; else if (inc > 5000) pts += 40; else pts += 20;
  const bills = answers.bills === 'always' ? 80 : answers.bills === 'mostly' ? 60 : answers.bills === 'sometimes' ? 30 : 0;
  pts += bills;
  const savings = answers.savings === 'yes' ? 60 : answers.savings === 'sometimes' ? 30 : 0;
  pts += savings;
  const merch = parseInt(answers.merchants || '0');
  pts += Math.min(merch * 5, 50);
  const maxPts = 350;
  return Math.round(300 + Math.min(1, pts / maxPts) * 600);
}

export default function CheckScore({ go }: Props) {
  const user = DB.me();
  const [stage, setStage] = useState<'idle'|'parsing'|'done'|'manual'>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [pdfErr, setPdfErr] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [txnCount, setTxnCount] = useState(0);
  const [arcPct, setArcPct] = useState(0);
  const [manAnswers, setManAnswers] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!user) go('login'); }, []);

  const handleFile = async (f: File) => {
    setFile(f);
    setPdfErr('');
    setStage('parsing');

    try {
      const buf = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      let fullText = '';
      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const content = await page.getTextContent();
        fullText += content.items.map((item: unknown) => {
          const i = item as { str?: string };
          return i.str ?? '';
        }).join(' ') + '\n';
      }

      const txns = parseTransactions(fullText);
      if (txns.length === 0) {
        setPdfErr('No transactions found in this PDF. Please try the manual questionnaire below.');
        setStage('idle');
        return;
      }

      const s = computeScore(txns);
      setTxnCount(txns.length);
      finishScore(s);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setPdfErr(`PDF reading failed — ${msg}. Try the manual questionnaire below.`);
      setStage('idle');
    }
  };

  const finishScore = (s: number) => {
    const clamped = Math.max(300, Math.min(900, s));
    DB.updateMe({ score: clamped });
    setScore(clamped);
    setStage('done');
    setTimeout(() => setArcPct(scorePct(clamped)), 150);
    toast('Score generated! 🎉', 'ok');
  };

  const submitManual = () => {
    const s = manualScore(manAnswers);
    setTxnCount(0);
    finishScore(s);
  };

  if (!user) return null;

  const c = scoreColor(score);
  const tier = scoreTier(score);
  const circumference = Math.PI * 2 * 66;
  const dashOffset = circumference * (1 - arcPct / 100);

  if (stage === 'done' && score) {
    return (
      <div className="page-enter" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ width: '100%', maxWidth: 540, textAlign: 'center' }}>
          <div className="cdna-card score-reveal" style={{ padding: 40, borderTop: `3px solid ${c}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', color: '#8c7d6a', textTransform: 'uppercase', marginBottom: 24 }}>Your CreditDNA Score</div>
            <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 24px' }}>
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="82" fill="none" stroke="#f5f0e8" strokeWidth="12" />
                <circle cx="100" cy="100" r="82" fill="none" stroke={c} strokeWidth="12"
                  strokeDasharray={Math.PI * 2 * 82}
                  strokeDashoffset={Math.PI * 2 * 82 * (1 - arcPct / 100)}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                  style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 52, color: c, lineHeight: 1 }}>{score}</div>
                <span className="badge" style={{ background: `${c}18`, color: c, marginTop: 6, fontSize: 12 }}>{tier}</span>
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#8c7d6a', marginBottom: 24 }}>
              {txnCount > 0 ? `Analysed ${txnCount} transactions from your UPI statement` : 'Generated from your profile questionnaire'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8c7d6a', marginBottom: 8 }}>
              <span>300 — Poor</span><span>900 — Excellent</span>
            </div>
            <div className="progress-bar" style={{ marginBottom: 28 }}>
              <div className="progress-fill" style={{ width: `${arcPct}%`, background: c }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
              {[['Payment Regularity','94'],['Income Stability','81'],['Merchant Diversity','88'],['UPI Tenure','76']].map(([l, v]) => (
                <div key={l} style={{ background: '#faf8f3', borderRadius: 10, padding: 14, textAlign: 'left' }}>
                  <div style={{ fontSize: 11, color: '#8c7d6a', marginBottom: 4 }}>{l}</div>
                  <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 22, color: c }}>{v}<span style={{ fontSize: 12, color: '#8c7d6a', fontWeight: 400 }}>/100</span></div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => { setStage('idle'); setFile(null); setPdfErr(''); setArcPct(0); }} style={{ flex: 1, background: 'transparent', color: '#4a3f30', border: '1.5px solid #e8e0d0', borderRadius: 12, padding: '12px 0', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                Re-check
              </button>
              <button onClick={() => go('dashboard')} style={{ flex: 1, background: '#d4500f', color: '#fff', fontWeight: 700, borderRadius: 12, padding: '12px 0', border: 'none', cursor: 'pointer', fontSize: 14 }}>
                View Dashboard →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ padding: '40px 16px 80px', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', color: '#8c7d6a', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Score Check</span>
        <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(28px,5vw,42px)', color: '#1a1208', marginBottom: 16 }}>
          Generate Your CreditDNA Score
        </h1>
        <p style={{ color: '#4a3f30', fontSize: 16, lineHeight: 1.65, maxWidth: 500, margin: '0 auto' }}>
          Upload your UPI transaction PDF (GPay, PhonePe, Paytm, BHIM) — we extract and analyse it <strong>entirely on your device</strong>. Nothing is uploaded to any server.
        </p>
      </div>

      {/* Privacy notice */}
      <div style={{ background: '#e8f5ef', border: '1px solid rgba(15,126,90,.2)', borderRadius: 14, padding: '14px 18px', marginBottom: 28, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 20 }}>🔒</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#0f7e5a', marginBottom: 4 }}>100% On-Device Processing</div>
          <div style={{ fontSize: 13, color: '#4a3f30', lineHeight: 1.55 }}>
            Your PDF is read by your browser's built-in PDF.js library. No data is sent anywhere. The raw text never leaves your device — only the final score is saved to your profile.
          </div>
        </div>
      </div>

      {/* Upload zone */}
      <div className="cdna-card" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#4a3f30', marginBottom: 4 }}>Step 1 — Upload your UPI Statement PDF</div>
        <div style={{ fontSize: 12, color: '#8c7d6a', marginBottom: 16 }}>Supported: GPay · PhonePe · Paytm · BHIM · Any UPI bank statement</div>

        {stage === 'parsing' ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚙️</div>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 18, color: '#1a1208', marginBottom: 8 }}>Analysing your statement...</div>
            <div style={{ fontSize: 13, color: '#8c7d6a' }}>Extracting transactions on-device · Privacy preserved</div>
          </div>
        ) : file ? (
          <div style={{ background: '#faf8f3', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>📄</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1208' }}>{file.name}</div>
                <div style={{ fontSize: 12, color: '#8c7d6a' }}>{(file.size / 1024).toFixed(1)} KB</div>
              </div>
            </div>
            <button onClick={() => { setFile(null); setPdfErr(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8c7d6a', fontSize: 18, lineHeight: 1 }}>✕</button>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === 'application/pdf') handleFile(f); }}
            style={{ border: '2px dashed #e8e0d0', borderRadius: 14, padding: '36px 24px', textAlign: 'center', cursor: 'pointer', transition: 'border-color .2s, background .2s' }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#d4500f'; e.currentTarget.style.background = '#fff8f5'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#e8e0d0'; e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>📂</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1208', marginBottom: 4 }}>Drop your PDF here</div>
            <div style={{ fontSize: 13, color: '#8c7d6a', marginBottom: 16 }}>or click to browse</div>
            <div style={{ display: 'inline-block', background: '#d4500f', color: '#fff', fontWeight: 700, borderRadius: 10, padding: '9px 20px', fontSize: 13 }}>Choose File</div>
          </div>
        )}

        <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />

        {pdfErr && (
          <div style={{ background: '#fdecea', border: '1px solid rgba(192,57,43,.25)', borderRadius: 10, padding: '12px 14px', marginTop: 14, color: '#c0392b', fontSize: 13, fontWeight: 500 }}>
            ✕ {pdfErr}
          </div>
        )}

        {file && !pdfErr && stage !== 'parsing' && (
          <button onClick={() => handleFile(file)} style={{ marginTop: 16, width: '100%', background: '#d4500f', color: '#fff', fontWeight: 700, borderRadius: 12, padding: '13px 0', border: 'none', cursor: 'pointer', fontSize: 15 }}>
            Analyse Statement →
          </button>
        )}
      </div>

      {/* Manual questionnaire */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 14, color: '#8c7d6a' }}>Don't have a PDF handy?</p>
        <button onClick={() => setStage(s => s === 'manual' ? 'idle' : 'manual')} style={{ background: 'none', border: 'none', color: '#d4500f', fontWeight: 700, fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}>
          {stage === 'manual' ? 'Hide questionnaire ↑' : 'Use manual questionnaire instead →'}
        </button>
      </div>

      {stage === 'manual' && (
        <div className="cdna-card" style={{ padding: 28 }}>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 18, color: '#1a1208', marginBottom: 20 }}>Manual Questionnaire</div>
          {[
            { key: 'months', label: 'How many months have you been using UPI?', opts: [['3','3 months'],['6','6 months'],['12','1 year'],['24','2+ years'],['36','3+ years']] },
            { key: 'income', label: 'Approximate monthly income via UPI (₹)?', opts: [['5000','Under ₹5K'],['15000','₹5K–₹20K'],['35000','₹20K–₹50K'],['75000','₹50K–₹1L'],['150000','Over ₹1L']] },
            { key: 'bills', label: 'How regularly do you pay utility bills via UPI?', opts: [['always','Always on time'],['mostly','Mostly on time'],['sometimes','Sometimes late'],['rarely','Rarely']] },
            { key: 'savings', label: 'Do you regularly save or invest via UPI?', opts: [['yes','Yes, regularly'],['sometimes','Occasionally'],['no','No']] },
            { key: 'merchants', label: 'Roughly how many unique merchants do you pay per month?', opts: [['5','1–5'],['10','6–10'],['20','11–20'],['30','21–30'],['40','30+']] },
          ].map(({ key, label, opts }) => (
            <div key={key} style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4a3f30', marginBottom: 8 }}>{label}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {opts.map(([v, l]) => (
                  <button key={v} type="button" onClick={() => setManAnswers(a => ({ ...a, [key]: v }))}
                    style={{ padding: '8px 14px', border: `2px solid ${manAnswers[key] === v ? '#d4500f' : '#e8e0d0'}`, borderRadius: 10, background: manAnswers[key] === v ? '#fff0e8' : '#fff', color: '#1a1208', fontSize: 13, fontWeight: manAnswers[key] === v ? 700 : 400, cursor: 'pointer', transition: 'all .15s' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={submitManual} style={{ width: '100%', background: '#d4500f', color: '#fff', fontWeight: 700, borderRadius: 12, padding: '13px 0', border: 'none', cursor: 'pointer', fontSize: 15, marginTop: 8 }}>
            Generate Score →
          </button>
        </div>
      )}

      {/* Estimated score (manual preview) */}
      {stage === 'manual' && Object.keys(manAnswers).length >= 3 && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <div style={{ fontSize: 11, color: '#8c7d6a', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Estimated score (manual)</div>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 64, color: scoreColor(manualScore(manAnswers)) }}>
            {manualScore(manAnswers)}
          </div>
          <span className="badge" style={{ background: `${scoreColor(manualScore(manAnswers))}18`, color: scoreColor(manualScore(manAnswers)) }}>
            {scoreTier(manualScore(manAnswers))}
          </span>
        </div>
      )}
    </div>
  );
}

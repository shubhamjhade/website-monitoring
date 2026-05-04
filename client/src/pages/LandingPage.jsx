import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Hero3D from '../components/Hero3D';
import axios from 'axios';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  const handleQuickCheck = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    setChecking(true);
    setResult(null);
    try {
      const res = await axios.post('/api/quick-check', { url: finalUrl });
      setResult(res.data);
    } catch (err) {
      setResult({
        status: 'ERROR',
        errorDetails: err.message,
        url: finalUrl,
        aiSolution: 'Unable to analyze. Please check the URL and try again.'
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="page-enter">
      {/* Hero Section with 3D */}
      <section className="relative">
        <Hero3D />

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 pointer-events-none">
          <div className="pointer-events-auto max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                 style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-medium text-gray-400">AI-Powered Monitoring</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-4">
              Monitor your sites
              <br />
              <span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                with intelligence
              </span>
            </h1>

            <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Real-time website monitoring with Gemini AI diagnostics. 
              Get instant insights when things go wrong.
            </p>

            {/* Quick Check Form */}
            <form onSubmit={handleQuickCheck} className="flex gap-3 max-w-xl mx-auto mb-6">
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Enter website URL to analyze..."
                className="form-input flex-1"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}
              />
              <button
                type="submit"
                disabled={checking}
                className="btn-primary flex-shrink-0 !px-6"
              >
                {checking ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Analyze'
                )}
              </button>
            </form>

            {/* CTA Links */}
            <div className="flex items-center justify-center gap-4">
              {isAuthenticated ? (
                <button onClick={() => navigate('/dashboard')} className="btn-primary">
                  Go to Dashboard →
                </button>
              ) : (
                <>
                  <Link to="/register" className="btn-primary no-underline">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="btn-ghost no-underline">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Check Results */}
      {result && (
        <section className="max-w-4xl mx-auto px-6 -mt-8 mb-16 relative z-20">
          <div className="glass-card p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{
                  background: result.status === 'UP' ? '#10b981' : '#ef4444',
                  boxShadow: `0 0 12px ${result.status === 'UP' ? '#10b98160' : '#ef444460'}`
                }}
              ></div>
              <h3 className="font-bold text-lg">
                {result.status === 'UP' ? '✅ Website is Online' : '❌ Website is Down'}
              </h3>
              <span className="ml-auto text-sm font-mono text-gray-500">{result.url}</span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <DetailBox label="Status Code" value={result.statusCode || 'N/A'} color={result.status === 'UP' ? '#10b981' : '#ef4444'} />
              <DetailBox label="Response Time" value={result.responseTime ? `${result.responseTime}ms` : 'N/A'} color="#06b6d4" />
              <DetailBox label="Protocol" value={result.serverInfo?.protocol || 'N/A'} color="#7c3aed" />
              <DetailBox label="Server" value={result.headers?.server || 'Unknown'} color="#f59e0b" />
            </div>

            {/* More Details */}
            {result.headers && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {result.headers.contentType && (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-xs text-gray-600">Content-Type</p>
                    <p className="text-sm text-gray-300 font-mono mt-1 truncate">{result.headers.contentType}</p>
                  </div>
                )}
                {result.headers.poweredBy && (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-xs text-gray-600">Powered By</p>
                    <p className="text-sm text-gray-300 font-mono mt-1">{result.headers.poweredBy}</p>
                  </div>
                )}
                {result.serverInfo?.redirected && (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-xs text-gray-600">Redirected To</p>
                    <p className="text-sm text-gray-300 font-mono mt-1 truncate">{result.serverInfo.finalUrl}</p>
                  </div>
                )}
                {result.headers.contentEncoding && (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-xs text-gray-600">Encoding</p>
                    <p className="text-sm text-gray-300 font-mono mt-1">{result.headers.contentEncoding}</p>
                  </div>
                )}
              </div>
            )}

            {/* SSL Info */}
            {result.serverInfo?.isSecure && (
              <div className="flex items-center gap-2 p-3 rounded-xl mb-4" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)' }}>
                <span>🔒</span>
                <span className="text-sm text-emerald-400">SSL/TLS Secured Connection</span>
              </div>
            )}

            {/* AI Solution (if problem detected) */}
            {result.aiSolution && (
              <div className="mt-4 p-5 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(6,182,212,0.04))', border: '1px solid rgba(124,58,237,0.12)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">✨</span>
                  <h4 className="font-bold" style={{ color: '#a78bfa' }}>AI Diagnostic Report</h4>
                </div>
                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {result.aiSolution}
                </div>
              </div>
            )}

            {/* Error Details */}
            {result.errorDetails && result.status !== 'UP' && (
              <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
                <p className="text-xs text-gray-600 mb-1">Error Details</p>
                <p className="text-sm text-red-300/70 font-mono break-all">{result.errorDetails}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Everything you need to{' '}
            <span style={{ color: '#7c3aed' }}>stay online</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Powerful monitoring tools backed by AI intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon="⚡"
            title="Real-time Monitoring"
            desc="Automated checks every minute. Know the instant your site goes down."
            gradient="rgba(124,58,237,0.08)"
          />
          <FeatureCard
            icon="✨"
            title="AI Diagnostics"
            desc="Gemini AI analyzes incidents and provides root cause analysis with action plans."
            gradient="rgba(6,182,212,0.08)"
          />
          <FeatureCard
            icon="📊"
            title="Analytics Dashboard"
            desc="Uptime percentages, response times, and latency history at a glance."
            gradient="rgba(16,185,129,0.08)"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 text-center">
        <p className="text-sm text-gray-600">
          Built with ❤️ by Shubham Jhade · Powered by Gemini AI
        </p>
      </footer>
    </div>
  );
}

function DetailBox({ label, value, color }) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p className="text-lg font-bold font-mono" style={{ color }}>{value}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc, gradient }) {
  return (
    <div className="glass-card tilt-card p-8 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5"
           style={{ background: gradient }}>
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

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
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-64px)] flex flex-col justify-center pt-28 sm:pt-32 pb-24 sm:pb-32 overflow-hidden">
        {/* Background 3D Canvas */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Hero3D />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-4 sm:px-6 w-full max-w-3xl mx-auto flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full mb-4 sm:mb-6"
                 style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-[10px] sm:text-xs font-medium text-gray-400">AI-Powered Monitoring</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight mb-3 sm:mb-4">
              Monitor your sites
              <br />
              <span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                with intelligence
              </span>
            </h1>

            <p className="text-gray-500 text-sm sm:text-base md:text-lg mb-5 sm:mb-8 max-w-lg mx-auto leading-relaxed px-2">
              Real-time website monitoring with Gemini AI diagnostics. 
              Get instant insights when things go wrong.
            </p>

            {/* Quick Check Form */}
            <form onSubmit={handleQuickCheck} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mx-auto mb-6">
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Enter website URL to analyze..."
                className="form-input flex-1 text-base h-12"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
              <button
                type="submit"
                disabled={checking}
                className="btn-primary flex-shrink-0 h-12 px-8"
              >
                {checking ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Analyze'
                )}
              </button>
            </form>

            {/* CTA Links */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
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
      </section>

      {/* Quick Check Results */}
      {result && (
        <section className="max-w-4xl mx-auto px-3 sm:px-6 -mt-4 sm:-mt-8 mb-10 sm:mb-16 relative z-20">
          <div className="glass-card p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                  style={{
                    background: result.status === 'UP' ? '#10b981' : '#ef4444',
                    boxShadow: `0 0 12px ${result.status === 'UP' ? '#10b98160' : '#ef444460'}`
                  }}
                ></div>
                <h3 className="font-bold text-base sm:text-lg">
                  {result.status === 'UP' ? '✅ Website is Online' : '❌ Website is Down'}
                </h3>
              </div>
              <span className="text-xs sm:text-sm font-mono text-gray-500 break-all sm:ml-auto">{result.url}</span>
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
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24 relative z-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to{' '}
            <span style={{ color: '#7c3aed' }}>stay online</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg text-center mx-auto max-w-2xl">
            Powerful monitoring tools backed by AI intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
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
      <footer className="border-t border-white/[0.04] py-6 sm:py-8 text-center px-4">
        <p className="text-xs sm:text-sm text-gray-600">
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
    <div className="glass-card tilt-card p-6 sm:p-8 text-center h-full flex flex-col items-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 flex-shrink-0"
           style={{ background: gradient }}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-base text-gray-400 leading-relaxed flex-1">{desc}</p>
    </div>
  );
}

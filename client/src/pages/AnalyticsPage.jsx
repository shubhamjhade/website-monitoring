import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AnalyticsPage() {
  const [monitors, setMonitors] = useState([]);
  const [uptimes, setUptimes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/monitors');
        setMonitors(res.data);
        const uptimeMap = {};
        await Promise.all(res.data.map(async (m) => {
          try {
            const u = await api.get(`/analytics/uptime/${m._id}`);
            uptimeMap[m._id] = u.data.uptime;
          } catch { uptimeMap[m._id] = '—'; }
        }));
        setUptimes(uptimeMap);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const upCount = monitors.filter(m => m.currentStatus === 'UP').length;
  const downCount = monitors.filter(m => m.currentStatus === 'DOWN').length;
  const overallUptime = monitors.length > 0 ? ((upCount / monitors.length) * 100).toFixed(1) : '100.0';

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="skeleton h-24 sm:h-32 rounded-2xl mb-4 sm:mb-6"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {[1,2,3,4].map(i => <div key={i} className="skeleton h-20 sm:h-24 rounded-2xl"></div>)}
      </div>
    </div>
  );

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Analytics</h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">System-wide monitoring overview</p>
      </div>

      {/* Overall Health */}
      <div className="glass-card p-5 sm:p-8 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-500 mb-2">Overall System Health</p>
            <div className="flex items-end gap-2 sm:gap-3 justify-center sm:justify-start">
              <span className="text-4xl sm:text-5xl font-black font-mono" style={{
                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>{overallUptime}%</span>
              <span className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">uptime</span>
            </div>
          </div>
          <div className="flex gap-6 sm:gap-6">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#10b981' }}>{upCount}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Online</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#ef4444' }}>{downCount}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Down</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#7c3aed' }}>{monitors.length}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monitor Table */}
      {monitors.length > 0 ? (
        <div className="glass-card overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-white/[0.04]">
            <h3 className="font-bold text-sm sm:text-base">All Monitors</h3>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {monitors.map(m => (
              <Link key={m._id} to={`/status/${m._id}`} className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-white/[0.02] transition-colors no-underline">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" style={{
                  background: m.currentStatus === 'UP' ? '#10b981' : m.currentStatus === 'DOWN' ? '#ef4444' : '#6b7280',
                  boxShadow: `0 0 8px ${m.currentStatus === 'UP' ? '#10b98150' : '#ef444450'}`
                }}></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm sm:text-base truncate">{m.name}</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 font-mono truncate">{m.url}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs sm:text-sm font-mono" style={{ color: '#06b6d4' }}>
                    {uptimes[m._id] ? `${uptimes[m._id]}%` : '—'}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-600 hidden sm:block">24h uptime</p>
                </div>
                <span className="text-gray-600 text-xs sm:text-sm">→</span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-card p-8 sm:p-12 text-center">
          <p className="text-gray-500 text-sm">No monitors to analyze. Add monitors from the Dashboard.</p>
          <Link to="/dashboard" className="btn-primary mt-4 inline-block no-underline">Go to Dashboard</Link>
        </div>
      )}
    </div>
  );
}

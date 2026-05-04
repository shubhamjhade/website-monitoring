import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function StatusPage() {
  const { monitorId } = useParams();
  const [data, setData] = useState(null);
  const [latency, setLatency] = useState([]);
  const [uptime, setUptime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [monRes, latRes, upRes] = await Promise.all([
          api.get(`/monitors/${monitorId}`),
          api.get(`/analytics/latency/${monitorId}`),
          api.get(`/analytics/uptime/${monitorId}`)
        ]);
        setData(monRes.data);
        setLatency(latRes.data);
        setUptime(upRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAll();
    const iv = setInterval(fetchAll, 10000);
    return () => clearInterval(iv);
  }, [monitorId]);

  if (loading) return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="skeleton h-60 rounded-2xl mb-6"></div>
      <div className="skeleton h-40 rounded-2xl"></div>
    </div>
  );

  if (!data?.monitor) return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-center">
      <p className="text-gray-500">Monitor not found</p>
      <Link to="/dashboard" className="text-violet-400 no-underline mt-4 inline-block">← Back to Dashboard</Link>
    </div>
  );

  const { monitor, logs } = data;
  const isUp = monitor.currentStatus === 'UP';
  const maxLatency = Math.max(...latency.map(l => l.latency || 0), 1);

  return (
    <div className="page-enter max-w-5xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <Link to="/dashboard" className="text-sm text-gray-500 hover:text-violet-400 no-underline mb-6 inline-block">← Dashboard</Link>

      {/* Monitor Header */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">{monitor.name}</h1>
            <p className="text-sm text-gray-600 font-mono mt-1">{monitor.url}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 rounded-xl text-sm font-bold" style={{
              background: isUp ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              color: isUp ? '#10b981' : '#ef4444'
            }}>{monitor.currentStatus}</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-5 text-center">
          <p className="text-xs text-gray-500 mb-1">Uptime (24h)</p>
          <p className="text-2xl font-bold font-mono" style={{ color: '#10b981' }}>{uptime?.uptime || '100.00'}%</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-xs text-gray-500 mb-1">Total Checks</p>
          <p className="text-2xl font-bold font-mono" style={{ color: '#7c3aed' }}>{logs.length}</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-xs text-gray-500 mb-1">Last Checked</p>
          <p className="text-lg font-bold font-mono text-gray-300">
            {monitor.lastChecked ? new Date(monitor.lastChecked).toLocaleTimeString() : '—'}
          </p>
        </div>
      </div>

      {/* Latency Chart */}
      <div className="glass-card p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Response Time</h3>
        {latency.length > 0 ? (
          <div className="flex items-end gap-1 h-32">
            {latency.map((l, i) => {
              const h = Math.max(((l.latency || 0) / maxLatency) * 100, 4);
              const color = l.status === 'UP' ? '#10b981' : '#ef4444';
              return (
                <div key={i} className="flex-1 group relative" title={`${l.latency}ms - ${l.time}`}>
                  <div className="w-full rounded-t-sm transition-all duration-300" style={{
                    height: `${h}%`, background: color, opacity: 0.7, minHeight: '4px'
                  }}></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block text-xs bg-gray-900 border border-white/10 px-2 py-1 rounded whitespace-nowrap z-10">
                    {l.latency}ms
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No latency data yet. Waiting for first check...</p>
        )}
      </div>

      {/* Recent Logs */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {logs.slice(0, 30).map((log, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{
                background: log.status === 'UP' ? '#10b981' : '#ef4444',
                boxShadow: `0 0 6px ${log.status === 'UP' ? '#10b98160' : '#ef444460'}`
              }}></div>
              <span className="text-sm font-mono text-gray-400 flex-shrink-0 w-16">{log.statusCode || '—'}</span>
              <span className="text-sm font-mono text-gray-500 flex-shrink-0 w-16">{log.responseTime}ms</span>
              <span className="text-xs text-gray-600 ml-auto">{new Date(log.createdAt).toLocaleString()}</span>
              {log.aiSummary && <span className="text-xs text-violet-400">✨ AI</span>}
            </div>
          ))}
          {logs.length === 0 && <p className="text-gray-600 text-sm text-center py-4">No activity yet</p>}
        </div>
      </div>
    </div>
  );
}

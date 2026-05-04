import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import MonitorCard from '../components/MonitorCard';
import AddMonitorModal from '../components/AddMonitorModal';
import AIReportModal from '../components/AIReportModal';

export default function DashboardPage() {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiReport, setAiReport] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchMonitors = useCallback(async () => {
    try {
      const res = await api.get('/monitors');
      setMonitors(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchMonitors();
    const interval = setInterval(fetchMonitors, 5000);
    return () => clearInterval(interval);
  }, [fetchMonitors]);

  const handleAdd = async (data) => {
    await api.post('/monitors', data);
    fetchMonitors();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this monitor?')) return;
    await api.delete(`/monitors/${id}`);
    fetchMonitors();
  };

  const handleViewReport = async (id) => {
    setShowAIModal(true);
    setAiLoading(true);
    setAiReport(null);
    try {
      const res = await api.get(`/monitors/${id}/incidents`);
      setAiReport(res.data);
    } catch (err) {
      console.error('AI report error:', err);
    } finally { setAiLoading(false); }
  };

  const upCount = monitors.filter(m => m.currentStatus === 'UP').length;
  const downCount = monitors.filter(m => m.currentStatus === 'DOWN').length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="skeleton h-40 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time infrastructure overview</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          + Add Monitor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={monitors.length} color="#7c3aed" />
        <StatCard label="Online" value={upCount} color="#10b981" />
        <StatCard label="Down" value={downCount} color="#ef4444" />
        <StatCard label="Uptime" value={monitors.length > 0 ? `${((upCount/monitors.length)*100).toFixed(0)}%` : '—'} color="#06b6d4" />
      </div>

      {/* Monitor Grid */}
      {monitors.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <p className="text-5xl mb-4">📡</p>
          <h3 className="text-xl font-bold mb-2">No monitors yet</h3>
          <p className="text-gray-500 mb-6">Add your first website to start monitoring</p>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">+ Add Your First Monitor</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {monitors.map(m => (
            <MonitorCard key={m._id} monitor={m} onDelete={handleDelete} onViewReport={handleViewReport} />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddMonitorModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAdd} />
      <AIReportModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} report={aiReport} loading={aiLoading} />
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="glass-card p-5 text-center">
      <p className="text-xs text-gray-500 mb-1 font-medium">{label}</p>
      <p className="text-2xl font-bold font-mono" style={{ color }}>{value}</p>
    </div>
  );
}

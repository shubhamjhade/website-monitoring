import { Link } from 'react-router-dom';

export default function MonitorCard({ monitor, onDelete, onViewReport }) {
  const isUp = monitor.currentStatus === 'UP';
  const isDown = monitor.currentStatus === 'DOWN';
  const isPending = monitor.currentStatus === 'PENDING';

  const statusColor = isUp ? '#10b981' : isDown ? '#ef4444' : '#6b7280';
  const statusBg = isUp ? 'rgba(16,185,129,0.08)' : isDown ? 'rgba(239,68,68,0.08)' : 'rgba(107,114,128,0.08)';

  return (
    <div className="glass-card tilt-card p-6 flex flex-col justify-between gap-4">
      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{monitor.name}</h3>
            <p className="text-sm text-gray-600 truncate font-mono mt-1">{monitor.url}</p>
          </div>
          {/* Status Dot */}
          <div className="flex-shrink-0 ml-3">
            <div
              className={`pulse-dot ${isUp ? 'up' : isDown ? 'down' : ''}`}
              style={{
                width: 12, height: 12,
                borderRadius: '50%',
                background: statusColor,
                boxShadow: `0 0 8px ${statusColor}60`
              }}
            />
          </div>
        </div>

        {/* Last Checked */}
        {monitor.lastChecked && (
          <p className="text-xs text-gray-600 mt-3">
            Last check: {new Date(monitor.lastChecked).toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/[0.04]">
        {/* Status Badge */}
        <span
          className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide"
          style={{ background: statusBg, color: statusColor }}
        >
          {monitor.currentStatus}
        </span>

        <div className="flex items-center gap-2">
          {/* AI Report Button - Only shows when DOWN */}
          {isDown && (
            <button
              onClick={() => onViewReport(monitor._id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))',
                color: '#a78bfa',
                border: '1px solid rgba(124,58,237,0.2)'
              }}
            >
              ✨ AI Report
            </button>
          )}

          {/* View Details */}
          <Link
            to={`/status/${monitor._id}`}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] transition-all no-underline"
          >
            Details →
          </Link>

          {/* Delete */}
          <button
            onClick={() => onDelete(monitor._id)}
            className="px-2 py-1.5 rounded-lg text-xs text-gray-600 hover:text-red-400 hover:bg-red-500/[0.06] transition-all"
            title="Delete monitor"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}

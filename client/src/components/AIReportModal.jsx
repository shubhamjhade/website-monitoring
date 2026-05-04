export default function AIReportModal({ isOpen, onClose, report, loading }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 border-b border-white/[0.06] flex justify-between items-center"
             style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05))' }}>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <span>
              <span style={{ color: '#7c3aed' }}>Gemini AI</span> Incident Analysis
            </span>
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl">&times;</button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <div className="relative">
                <div className="w-16 h-16 border-2 border-violet-500/30 rounded-full"></div>
                <div className="w-16 h-16 border-2 border-violet-500 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
              </div>
              <div className="text-center">
                <p className="text-violet-400 font-medium">Analyzing Incident...</p>
                <p className="text-gray-600 text-sm mt-1">Gemini AI is synthesizing logs</p>
              </div>
            </div>
          ) : report?.aiSummary ? (
            <div className="space-y-4">
              {/* Format the AI report nicely */}
              <div className="p-4 rounded-xl" style={{ background: 'rgba(124, 58, 237, 0.06)', border: '1px solid rgba(124, 58, 237, 0.1)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <span className="text-xs font-mono text-gray-500">
                    Status: {report.statusCode} · {new Date(report.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                  {report.aiSummary}
                </div>
              </div>

              {report.errorDetails && (
                <div className="p-4 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                  <p className="text-xs font-mono text-gray-500 mb-2">Raw Error</p>
                  <p className="text-red-300/80 text-sm font-mono break-all">{report.errorDetails}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-gray-500">No AI insights available for this incident yet.</p>
              <p className="text-gray-600 text-sm mt-2">AI analysis is generated when downtime is detected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

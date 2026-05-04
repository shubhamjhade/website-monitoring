import { useState } from 'react';

export default function AddMonitorModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      setError('Both fields are required');
      return;
    }

    // Add protocol if missing
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    setLoading(true);
    setError('');
    try {
      await onAdd({ name: name.trim(), url: finalUrl });
      setName('');
      setUrl('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add monitor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 border-b border-white/[0.06] flex justify-between items-center">
          <h3 className="text-lg font-bold">
            <span style={{ color: '#7c3aed' }}>+</span> Add New Monitor
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl">&times;</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2 font-medium">Website Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. My Portfolio"
              className="form-input"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 font-medium">Website URL</label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="e.g. https://example.com"
              className="form-input"
              style={{ fontFamily: 'var(--font-mono)' }}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/[0.08] px-4 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </>
            ) : (
              'Start Monitoring'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

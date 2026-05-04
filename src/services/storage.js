// In-memory storage service — replaces MongoDB for zero-dependency deployment
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// Initialize data store
let store = {
    users: [],
    monitors: [],
    logs: []
};

// Load from disk if exists
function loadFromDisk() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const raw = fs.readFileSync(DATA_FILE, 'utf-8');
            store = JSON.parse(raw);
            console.log('📂 Loaded data from disk');
        }
    } catch (err) {
        console.error('Failed to load data from disk:', err.message);
    }
}

// Save to disk
function saveToDisk() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
    } catch (err) {
        console.error('Failed to save data to disk:', err.message);
    }
}

// Auto-save every 30 seconds
setInterval(saveToDisk, 30000);

// Load on startup
loadFromDisk();

// --- User Operations ---
const Users = {
    findByEmail(email) {
        return store.users.find(u => u.email === email) || null;
    },
    findById(id) {
        return store.users.find(u => u._id === id) || null;
    },
    create(data) {
        const user = {
            _id: uuidv4(),
            name: data.name,
            email: data.email,
            password: data.password,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=7c3aed&color=fff&bold=true`,
            createdAt: new Date().toISOString()
        };
        store.users.push(user);
        saveToDisk();
        return user;
    }
};

// --- Monitor Operations ---
const Monitors = {
    findAll(userId) {
        return store.monitors.filter(m => m.userId === userId);
    },
    findById(id) {
        return store.monitors.find(m => m._id === id) || null;
    },
    findAllActive() {
        return store.monitors.filter(m => m.isActive);
    },
    create(data) {
        const monitor = {
            _id: uuidv4(),
            userId: data.userId,
            name: data.name,
            url: data.url,
            interval: data.interval || 1,
            isActive: true,
            currentStatus: 'PENDING',
            lastChecked: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        store.monitors.push(monitor);
        saveToDisk();
        return monitor;
    },
    update(id, data) {
        const idx = store.monitors.findIndex(m => m._id === id);
        if (idx === -1) return null;
        store.monitors[idx] = { ...store.monitors[idx], ...data, updatedAt: new Date().toISOString() };
        saveToDisk();
        return store.monitors[idx];
    },
    delete(id) {
        const idx = store.monitors.findIndex(m => m._id === id);
        if (idx === -1) return false;
        store.monitors.splice(idx, 1);
        // Also delete related logs
        store.logs = store.logs.filter(l => l.monitorId !== id);
        saveToDisk();
        return true;
    }
};

// --- Log Operations ---
const Logs = {
    findByMonitor(monitorId, limit = 50) {
        return store.logs
            .filter(l => l.monitorId === monitorId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);
    },
    findLatestDown(monitorId) {
        return store.logs
            .filter(l => l.monitorId === monitorId && l.status === 'DOWN' && l.aiSummary)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;
    },
    countByMonitor(monitorId, since) {
        return store.logs.filter(l => {
            if (l.monitorId !== monitorId) return false;
            if (since && new Date(l.createdAt) < since) return false;
            return true;
        }).length;
    },
    countUpByMonitor(monitorId, since) {
        return store.logs.filter(l => {
            if (l.monitorId !== monitorId) return false;
            if (l.status !== 'UP') return false;
            if (since && new Date(l.createdAt) < since) return false;
            return true;
        }).length;
    },
    create(data) {
        const log = {
            _id: uuidv4(),
            monitorId: data.monitorId,
            status: data.status,
            statusCode: data.statusCode,
            responseTime: data.responseTime,
            errorDetails: data.errorDetails || null,
            aiSummary: data.aiSummary || null,
            createdAt: new Date().toISOString()
        };
        store.logs.push(log);

        // Keep only last 500 logs per monitor to prevent memory bloat
        const monitorLogs = store.logs.filter(l => l.monitorId === data.monitorId);
        if (monitorLogs.length > 500) {
            const oldest = monitorLogs
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .slice(0, monitorLogs.length - 500);
            const oldIds = new Set(oldest.map(l => l._id));
            store.logs = store.logs.filter(l => !oldIds.has(l._id));
        }

        saveToDisk();
        return log;
    }
};

module.exports = { Users, Monitors, Logs };
